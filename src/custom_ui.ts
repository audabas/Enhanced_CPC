namespace UI {

    /* Init */
    export function init() {
        if(Preferences.getPreference(Preferences.PrefKey.HideCarousel)) {
            removeCarousel();
        }
        if(Preferences.getPreference(Preferences.PrefKey.HideSummaryImages)) {
            removeArticlesImages();
        }
        if(Preferences.getPreference(Preferences.PrefKey.FixArticleNavPosition)) {
            articleNavFixedPosition();
        }
        if(Preferences.getPreference(Preferences.PrefKey.SansSerifFont)) {
            changeFontSansSerif();
        }
        if(Preferences.getPreference(Preferences.PrefKey.ShowGameMore)) {
            showGameMore();
        }
        if(Preferences.getPreference(Preferences.PrefKey.ShowBuyLink)) {
            addBuyLink();
        }
    }

    /* Functions */
    function removeCarousel() {
        let carousel = document.getElementById("block-homepagecarrousel");
        let summaryCarousel = document.getElementById("block-numerocarrousel");

        if(carousel != null) {
            carousel.parentNode.removeChild(carousel);
        }
        if(summaryCarousel != null) {
            summaryCarousel.parentNode.removeChild(summaryCarousel);
        }
    }

    function removeArticlesImages() {
        let images = document.querySelectorAll(".node--promoted a img");

        for(var i = 0; i < images.length; i++) {
            let image = images[i];

            image.parentNode.removeChild(image);
        }
    }

    function articleNavFixedPosition() {
        let articleNav = <HTMLElement> document.getElementsByClassName("article-nav")[0];

        if(!articleNav) {
            return;
        }

        let topOffset = articleNav.getBoundingClientRect().top;

        articleNav.style.position = "fixed";
        articleNav.style.top = topOffset + "px";
        articleNav.style.zIndex = "9";
    }

    function changeFontSansSerif () {
        document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
    }

    function showGameMore () {
        let gameMore = <HTMLElement> document.getElementsByClassName("game-more")[0];
        let gameMoreButton = <HTMLElement> document.getElementsByClassName("game-more-btn")[0];

        if(!gameMore || !gameMoreButton) {
            return;
        }

        gameMore.style.display = "block";

        gameMoreButton.parentNode.removeChild(gameMoreButton);
    }

    function addBuyLink () {
        let gameTitle = <HTMLElement> document.getElementsByClassName("game-title")[0];

        if(!gameTitle) {
            return "";
        }

        let title = gameTitle.textContent;

        let buyLinkEntry = document.createElement("div");

        buyLinkEntry.style.fontSize = "12px";
        buyLinkEntry.style.marginBottom = "8px";

        let buyLink = document.createElement("a");
        let buyText = document.createTextNode("Comparer les prix");

        buyLink.setAttribute("href", "https://isthereanydeal.com/search/?q=" + title);
        buyLink.setAttribute("target", "_blank");
        buyLink.appendChild(buyText);

        buyLinkEntry.appendChild(buyLink);

        gameTitle.parentElement.insertBefore(buyLinkEntry, gameTitle.nextSibling);
    }
}