// ==UserScript==
// @name        Enhanced CPC
// @namespace   https://github.com/bastien09
// @homepageURL https://github.com/bastien09/Enhanced_CPC
// @include     https://www.canardpc.com/*
// @version     1.1.2
// @grant       none
// ==/UserScript==
// 
var Preferences;
(function (Preferences) {
    /* Utils */
    var PrefKey;
    (function (PrefKey) {
        PrefKey[PrefKey["HideCarousel"] = 0] = "HideCarousel";
        PrefKey[PrefKey["HideSummaryImages"] = 1] = "HideSummaryImages";
        PrefKey[PrefKey["FixArticleNavPosition"] = 2] = "FixArticleNavPosition";
        PrefKey[PrefKey["SansSerifFont"] = 3] = "SansSerifFont";
        PrefKey[PrefKey["SummaryOrder"] = 4] = "SummaryOrder";
        PrefKey[PrefKey["ShowGameMore"] = 5] = "ShowGameMore";
        PrefKey[PrefKey["ShowBuyLink"] = 6] = "ShowBuyLink";
    })(PrefKey = Preferences.PrefKey || (Preferences.PrefKey = {}));
    function setPreference(key, enabled) {
        var keyName = PrefKey[key];
        if (enabled) {
            localStorage.setItem(keyName, "enabled");
        }
        else {
            localStorage.setItem(keyName, "disabled");
        }
    }
    Preferences.setPreference = setPreference;
    function getPreference(key) {
        var keyName = PrefKey[key];
        return localStorage.getItem(keyName) == "enabled";
    }
    Preferences.getPreference = getPreference;
    /* Classes */
    var PreferenceEntry = /** @class */ (function () {
        function PreferenceEntry(key, label) {
            this.key = key;
            this.label = label;
        }
        PreferenceEntry.prototype.getCheckbox = function () {
            var _this = this;
            var isEnabled = getPreference(this.key);
            var container = document.createElement("div");
            container.classList.add("checkbox");
            container.style.padding = "5px";
            var labelElement = document.createElement("label");
            var labelText = document.createTextNode(" " + this.label);
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isEnabled;
            checkbox.style.webkitAppearance = "checkbox";
            checkbox.style.setProperty("-moz-appearance", "checkbox");
            checkbox.style.height = "16px";
            labelElement.appendChild(checkbox);
            labelElement.appendChild(labelText);
            container.appendChild(labelElement);
            checkbox.addEventListener("change", function (e) {
                var c = e.target;
                setPreference(_this.key, c.checked);
            });
            return container;
        };
        return PreferenceEntry;
    }());
    /* Properties */
    var popupOverlay;
    var preferences = [
        new PreferenceEntry(PrefKey.HideCarousel, "Masquer \"À la Une\""),
        new PreferenceEntry(PrefKey.HideSummaryImages, "Masquer les images dans le sommaire"),
        new PreferenceEntry(PrefKey.FixArticleNavPosition, "Fixer la position du navigateur d'articles"),
        new PreferenceEntry(PrefKey.SummaryOrder, "Naviguer dans l'ordre du sommaire"),
        new PreferenceEntry(PrefKey.ShowGameMore, "Toujours afficher la fiche complète du jeu"),
        new PreferenceEntry(PrefKey.ShowBuyLink, "Afficher un lien vers IsThereAnyDeal"),
        new PreferenceEntry(PrefKey.SansSerifFont, "Utiliser une police sans serif")
    ];
    /* Init */
    function init() {
        addPreferencesPanelMenuEntry();
    }
    Preferences.init = init;
    /* Functions */
    function addPreferencesPanelMenuEntry() {
        var menuList = document.querySelector(".user-toggle ul.dropdown-menu");
        if (!menuList) {
            return;
        }
        var preferencesMenuEntry = document.createElement("li");
        var preferencesMenuLink = document.createElement("a");
        var preferencesMenuLinkText = document.createTextNode("Enhanced CPC");
        preferencesMenuLink.setAttribute("href", "#");
        preferencesMenuLink.appendChild(preferencesMenuLinkText);
        preferencesMenuLink.addEventListener("click", openPreferencesPopup);
        preferencesMenuEntry.appendChild(preferencesMenuLink);
        var lastMenuEntry = menuList.children[menuList.children.length - 1];
        var insertedElement = menuList.insertBefore(preferencesMenuEntry, lastMenuEntry);
    }
    function openPreferencesPopup() {
        var menuList = document.querySelector(".user-toggle ul.dropdown-menu");
        if (menuList) {
            menuList.style.display = "none";
        }
        popupOverlay = document.createElement("div");
        var popupContainer = document.createElement("div");
        var closePopupButton = document.createElement("a");
        var closePopupButtonText = document.createTextNode("Fermer");
        closePopupButton.appendChild(closePopupButtonText);
        closePopupButton.addEventListener("click", closePopup);
        closePopupButton.style.marginTop = "15px";
        closePopupButton.setAttribute("href", "#");
        closePopupButton.classList.add("btn");
        popupOverlay.style.position = "fixed";
        popupOverlay.style.top = "0";
        popupOverlay.style.left = "0";
        popupOverlay.style.width = "100%";
        popupOverlay.style.height = "100vh";
        popupOverlay.style.background = "rgba(100,100,100, 0.75)";
        popupOverlay.style.zIndex = "102";
        popupContainer.style.position = "fixed";
        popupContainer.style.top = "50%";
        popupContainer.style.left = "50%";
        popupContainer.style.width = "500px";
        popupContainer.style.background = "white";
        popupContainer.style.transform = "translate(-50%, -50%)";
        popupContainer.style.textAlign = "center";
        popupContainer.style.padding = "15px";
        preferences.forEach(function (pref) {
            var checkbox = pref.getCheckbox();
            popupContainer.appendChild(checkbox);
        });
        popupContainer.appendChild(closePopupButton);
        popupOverlay.appendChild(popupContainer);
        document.body.appendChild(popupOverlay);
        document.body.style.overflow = "hidden";
    }
    function closePopup() {
        if (!popupOverlay) {
            return;
        }
        document.body.removeChild(popupOverlay);
        document.body.style.overflow = "auto";
        location.reload();
    }
})(Preferences || (Preferences = {}));
var UI;
(function (UI) {
    /* Init */
    function init() {
        if (Preferences.getPreference(Preferences.PrefKey.HideCarousel)) {
            removeCarousel();
        }
        if (Preferences.getPreference(Preferences.PrefKey.HideSummaryImages)) {
            removeArticlesImages();
        }
        if (Preferences.getPreference(Preferences.PrefKey.FixArticleNavPosition)) {
            articleNavFixedPosition();
        }
        if (Preferences.getPreference(Preferences.PrefKey.SansSerifFont)) {
            changeFontSansSerif();
        }
        if (Preferences.getPreference(Preferences.PrefKey.ShowGameMore)) {
            showGameMore();
        }
        if (Preferences.getPreference(Preferences.PrefKey.ShowBuyLink)) {
            addBuyLink();
        }
    }
    UI.init = init;
    /* Functions */
    function removeCarousel() {
        var carousel = document.getElementById("block-homepagecarrousel");
        var summaryCarousel = document.getElementById("block-numerocarrousel");
        if (carousel !== null) {
            carousel.parentNode.removeChild(carousel);
        }
        if (summaryCarousel !== null) {
            summaryCarousel.parentNode.removeChild(summaryCarousel);
        }
    }
    function removeArticlesImages() {
        var images = document.querySelectorAll(".node--promoted a img");
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            image.parentNode.removeChild(image);
        }
    }
    function articleNavFixedPosition() {
        var articleNav = document.getElementsByClassName("article-nav")[0];
        if (!articleNav) {
            return;
        }
        var topOffset = articleNav.getBoundingClientRect().top;
        articleNav.style.position = "fixed";
        articleNav.style.top = topOffset + "px";
        articleNav.style.zIndex = "9";
    }
    function changeFontSansSerif() {
        document.body.style.fontFamily = "Arial, Helvetica, sans-serif";
    }
    function showGameMore() {
        var gameMore = document.getElementsByClassName("game-more")[0];
        var gameMoreButton = document.getElementsByClassName("game-more-btn")[0];
        if (!gameMore || !gameMoreButton) {
            return;
        }
        gameMore.style.display = "block";
        gameMoreButton.parentNode.removeChild(gameMoreButton);
    }
    function addBuyLink() {
        var gameTitle = document.getElementsByClassName("game-title")[0];
        if (!gameTitle) {
            return "";
        }
        var title = gameTitle.textContent;
        var buyLinkEntry = document.createElement("div");
        buyLinkEntry.style.fontSize = "12px";
        buyLinkEntry.style.marginBottom = "8px";
        var buyLink = document.createElement("a");
        var buyText = document.createTextNode("Comparer les prix");
        buyLink.setAttribute("href", "https://isthereanydeal.com/search/?q=" + title);
        buyLink.setAttribute("target", "_blank");
        buyLink.appendChild(buyText);
        buyLinkEntry.appendChild(buyLink);
        gameTitle.parentElement.insertBefore(buyLinkEntry, gameTitle.nextSibling);
    }
})(UI || (UI = {}));
var Summary;
(function (Summary) {
    /* Utils */
    /* Classes */
    var Sommaire = /** @class */ (function () {
        function Sommaire() {
            this.number = -1;
            this.articles = [];
            if (this.getCurrentNumber() > -1) {
                this.getSummary();
            }
        }
        Sommaire.prototype.getCurrentNumber = function () {
            var _this = this;
            var url = location.pathname;
            var regExps = [
                /\/news\/(\d+)/,
                /\/news-online\/(\d+)/,
                /\/news-hardware\/(\d+)/,
                /\/(\d+)\/.+/
            ];
            regExps.forEach(function (RegExp) {
                var match = url.match(RegExp);
                if (match) {
                    _this.number = parseInt(match[1]);
                }
            });
            return this.number;
        };
        Sommaire.prototype.getSummary = function () {
            var _this = this;
            var storedSummary = localStorage.getItem("summary-" + this.number);
            if (storedSummary !== null) {
                this.articles = JSON.parse(storedSummary);
                overrideArticleNav(this);
            }
            else {
                fetch("/numero/" + this.number).then(function (data) { return data.text(); }).then(function (data) {
                    var parser = new DOMParser();
                    var summaryPage = parser.parseFromString(data, "text/html");
                    var summaryLinks = summaryPage.querySelectorAll(".views-field-title > a");
                    if (summaryLinks.length === 0) {
                        return;
                    }
                    for (var i = 0; i < summaryLinks.length; i++) {
                        var url = summaryLinks[i].getAttribute("href");
                        _this.articles.push(url);
                    }
                    var jsonArticles = JSON.stringify(_this.articles);
                    localStorage.setItem("summary-" + _this.number, jsonArticles);
                    overrideArticleNav(_this);
                });
            }
        };
        Sommaire.prototype.getCurrentIndex = function () {
            var url = location.pathname;
            return this.articles.indexOf(url);
        };
        Sommaire.prototype.getPreviousArticle = function () {
            var idx = this.getCurrentIndex();
            if (idx > 0) {
                return this.articles[idx - 1];
            }
            else {
                return "";
            }
        };
        Sommaire.prototype.getNextArticle = function () {
            var idx = this.getCurrentIndex();
            if (idx + 1 < this.articles.length) {
                return this.articles[idx + 1];
            }
            else {
                return "";
            }
        };
        return Sommaire;
    }());
    /* Init */
    function init() {
        if (Preferences.getPreference(Preferences.PrefKey.SummaryOrder)) {
            var summary = new Sommaire();
        }
    }
    Summary.init = init;
    /* Functions */
    function overrideArticleNav(summary) {
        var previousUrl = summary.getPreviousArticle();
        var nextUrl = summary.getNextArticle();
        var articleNav = document.getElementsByClassName("article-nav")[0] || createArticleNav(summary.number);
        var articleNavLeft = articleNav.getElementsByClassName("article-nav-left")[0];
        var articleNavRight = articleNav.getElementsByClassName("article-nav-right")[0];
        if (previousUrl == "") {
            articleNavLeft.parentElement.removeChild(articleNavLeft);
        }
        else {
            articleNavLeft.setAttribute("href", previousUrl);
        }
        if (nextUrl == "") {
            articleNavRight.parentElement.removeChild(articleNavRight);
        }
        else {
            articleNavRight.setAttribute("href", nextUrl);
        }
    }
    function createArticleNav(numero) {
        var articleTop = document.getElementById("block-hautdepage");
        var articleNav = document.createElement("div");
        articleNav.className = "article-nav";
        var articleNavWrapper = document.createElement("div");
        articleNavWrapper.className = "article-nav-wrapper";
        var articleNavLeft = document.createElement("a");
        articleNavLeft.className = "article-nav-left";
        var articleNavRight = document.createElement("a");
        articleNavRight.className = "article-nav-right";
        var articleNavNumero = document.createElement("div");
        articleNavNumero.className = "article-numero";
        var articleNavNumeroLink = document.createElement("a");
        var articleNavNumeroSpan = document.createElement("span");
        var articleNavNumeroText = document.createTextNode(numero.toString());
        articleNavNumeroLink.setAttribute("href", "/numero/" + numero + "#sommaire");
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
})(Summary || (Summary = {}));
/// <reference path="preferences.ts" />
/// <reference path="custom_ui.ts" />
/// <reference path="summary.ts" />
function init() {
    Summary.init();
    UI.init();
    Preferences.init();
}
function run() {
    if (document.readyState == "complete" || document.readyState != "loading") {
        init();
    }
    else {
        document.addEventListener("DOMContentLoaded", init);
    }
}
run();
