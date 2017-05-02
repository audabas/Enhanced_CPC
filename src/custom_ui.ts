namespace UI {
    export function init() {
        removeCarrousel();
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
}