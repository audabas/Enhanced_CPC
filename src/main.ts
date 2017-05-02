/// <reference path="custom_ui.ts" />

function init() {
    UI.init();
}

function run() {
    if( document.readyState == "complete" || document.readyState != "loading" ) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
}

run();