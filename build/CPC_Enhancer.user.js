// ==UserScript==
// @name        Enhanced CPC
// @namespace   https://github.com/bastien09
// @homepageURL https://github.com/bastien09/Enhanced_CPC
// @include     https://www.canardpc.com/*
// @version     0.1
// @grant       none
// ==/UserScript== 
var Preferences;
(function (Preferences) {
    /* Utils */
    var PrefKey;
    (function (PrefKey) {
        PrefKey[PrefKey["HideCarousel"] = 0] = "HideCarousel";
        PrefKey[PrefKey["HideSummaryImages"] = 1] = "HideSummaryImages";
        PrefKey[PrefKey["FixArticleNavPosition"] = 2] = "FixArticleNavPosition";
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
    var PreferenceEntry = (function () {
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
            checkbox.addEventListener("change", function (e) {
                var c = e.srcElement;
                setPreference(_this.key, c.checked);
            });
            labelElement.appendChild(checkbox);
            labelElement.appendChild(labelText);
            container.appendChild(labelElement);
            return container;
        };
        return PreferenceEntry;
    }());
    /* Properties */
    var popupOverlay;
    var preferences = [
        new PreferenceEntry(PrefKey.HideCarousel, "Masquer \"À la Une\""),
        new PreferenceEntry(PrefKey.HideSummaryImages, "Masquer les images dans le sommaire"),
        new PreferenceEntry(PrefKey.FixArticleNavPosition, "Fixer la position du navigateur d'articles")
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
    }
    UI.init = init;
    function removeCarousel() {
        var carousel = document.getElementById("block-homepagecarrousel");
        var summaryCarousel = document.getElementById("block-numerocarrousel");
        if (carousel != null) {
            carousel.parentNode.removeChild(carousel);
        }
        if (summaryCarousel != null) {
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
    /*function zenModeScrollDisable() {

    }*/
})(UI || (UI = {}));
/// <reference path="preferences.ts" />
/// <reference path="custom_ui.ts" />
function init() {
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
