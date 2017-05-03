namespace UI {
    export function init() {
        removeCarrousel();
        removeArticlesImages();
    }

    function removeCarrousel() {
        let carrousel = document.getElementById("block-homepagecarrousel");
        let summaryCarrousel = document.getElementById("block-numerocarrousel");

        if(carrousel != null) {
            carrousel.parentNode.removeChild(carrousel);
        }
        if(summaryCarrousel != null) {
            summaryCarrousel.parentNode.removeChild(summaryCarrousel);
        }
    }

    function removeArticlesImages() {
        let images = document.querySelectorAll(".node--promoted a img");

        for(var i = 0; i < images.length; i++) {
            let image = images[i];

            image.parentNode.removeChild(image);
        }
    }
}