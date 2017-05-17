/// <reference path="preferences.ts" />
/// <reference path="custom_ui.ts" />
/// <reference path="summary.ts" />

function init() {
    Summary.init();
    UI.init();
    Preferences.init();
}

function run() {
    if( document.readyState == "complete" || document.readyState != "loading" ) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
}

run();