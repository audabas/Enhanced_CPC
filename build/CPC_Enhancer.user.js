// ==UserScript==
// @name        Enhanced CPC
// @namespace   beta.canardpc.com/*
// @include     https://beta.canardpc.com/*
// @include     http://beta.canardpc.com/*
// @version     0.1
// @grant       none
// ==/UserScript== 
var UI;
(function (UI) {
    function init() {
        removeCarrousel();
        removeArticlesImages();
    }
    UI.init = init;
    function removeCarrousel() {
        var carrousel = document.getElementById("block-homepagecarrousel");
        var summaryCarrousel = document.getElementById("block-numerocarrousel");
        if (carrousel != null) {
            carrousel.parentNode.removeChild(carrousel);
        }
        if (summaryCarrousel != null) {
            summaryCarrousel.parentNode.removeChild(summaryCarrousel);
        }
    }
    function removeArticlesImages() {
        var images = document.querySelectorAll(".node--promoted a img");
        for (var i = 0; i < images.length; i++) {
            var image = images[i];
            image.parentNode.removeChild(image);
        }
    }
})(UI || (UI = {}));
/// <reference path="custom_ui.ts" />
function init() {
    UI.init();
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
