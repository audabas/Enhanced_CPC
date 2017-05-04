namespace UI {
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
    }

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

    /*function zenModeScrollDisable() {

    }*/
}