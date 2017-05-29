namespace Summary {

    /* Utils */

    /* Classes */
    class Sommaire {
        number : number = -1;
        articles : Array<string> = [];

        constructor () {
            if(this.getCurrentNumber() > -1) {
                this.getSummary();
            }
        }

        getCurrentNumber() : number {
            let url = location.pathname;

            let regExps = [
                /\/news\/(\d+)/,
                /\/news-online\/(\d+)/,
                /\/news-hardware\/(\d+)/,
                /\/(\d+)\/.+/
            ]

            regExps.forEach((RegExp) => {
                let match = url.match(RegExp)
                if(match) {
                    this.number = parseInt(match[1]);
                }
            });

            return this.number;
        }

        getSummary() {
            let storedSummary = localStorage.getItem("summary-" + this.number);

            if(storedSummary != null) {
                this.articles = JSON.parse(storedSummary);
                overrideArticleNav(this);
            } else {
                fetch("/numero/" + this.number).then( data => data.text()).then( data => {
                    let parser = new DOMParser();
                    let summaryPage = parser.parseFromString(data, "text/html");

                    let summaryLinks = summaryPage.querySelectorAll(".views-field-title > a");

                    if(summaryLinks.length == 0) { // Numéro pas encore sorti
                        return;
                    }

                    for(var i = 0; i < summaryLinks.length; i++) {
                        let url = summaryLinks[i].getAttribute("href");

                        this.articles.push(url);
                    }

                    let jsonArticles = JSON.stringify(this.articles);
                    localStorage.setItem("summary-" + this.number, jsonArticles);

                    overrideArticleNav(this);
                });
            }
        }

        getCurrentIndex() : number {
            let url = location.pathname;

            return this.articles.indexOf(url);
        }

        getPreviousArticle() : string {
            let idx = this.getCurrentIndex();

            if(idx > 0) {
                return this.articles[idx - 1];
            } else {
                return "";
            }
        }

        getNextArticle() : string {
            let idx = this.getCurrentIndex();

            if(idx + 1 < this.articles.length) {
                return this.articles[idx + 1];
            } else {
                return "";
            }
        }
    }

    /* Init */
    export function init() {
        if(Preferences.getPreference(Preferences.PrefKey.SummaryOrder)) {
            let summary = new Sommaire();
        }
    }

    /* Functions */
    function overrideArticleNav(summary : Sommaire) {
        let previousUrl = summary.getPreviousArticle();
        let nextUrl = summary.getNextArticle();

        let articleNav = <HTMLElement> document.getElementsByClassName("article-nav")[0] || createArticleNav(summary.number);

        let articleNavLeft = articleNav.getElementsByClassName("article-nav-left")[0];
        let articleNavRight = articleNav.getElementsByClassName("article-nav-right")[0];

        if(previousUrl == "") {
            articleNavLeft.parentElement.removeChild(articleNavLeft);
        } else {
            articleNavLeft.setAttribute("href", previousUrl);
        }

        if(nextUrl == "") {
            articleNavRight.parentElement.removeChild(articleNavRight);
        } else {
            articleNavRight.setAttribute("href", nextUrl);
        }
    }

    function createArticleNav(numero : number) : HTMLElement {
        let articleTop = <HTMLElement> document.getElementById("block-hautdepage");

        let articleNav = document.createElement("div");
        articleNav.className = "article-nav";
        
        let articleNavWrapper = document.createElement("div");
        articleNavWrapper.className = "article-nav-wrapper";

        let articleNavLeft = document.createElement("a");
        articleNavLeft.className = "article-nav-left";

        let articleNavRight = document.createElement("a");
        articleNavRight.className = "article-nav-right";

        let articleNavNumero = document.createElement("div");
        articleNavNumero.className = "article-numero";

        let articleNavNumeroLink = document.createElement("a");
        let articleNavNumeroSpan = document.createElement("span");
        let articleNavNumeroText = document.createTextNode(numero.toString());

        articleNavNumeroLink.setAttribute("href", "/numero/" + numero + "#sommaire")

        articleNavNumeroSpan.appendChild(articleNavNumeroText);
        articleNavNumeroLink.appendChild(articleNavNumeroSpan);

        articleNavNumero.appendChild(articleNavNumeroLink);

        articleNavWrapper.appendChild(articleNavNumero);
        articleNavWrapper.appendChild(articleNavLeft);
        articleNavWrapper.appendChild(articleNavRight);

        articleNav.appendChild(articleNavWrapper);

        articleTop.appendChild(articleNav);

        return articleNav;
    }
}