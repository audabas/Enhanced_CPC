namespace Preferences {

    /* Utils */
    export enum PrefKey {
        HideCarousel,
        HideSummaryImages,
        FixArticleNavPosition,
        SansSerifFont,
        SummaryOrder,
        ShowGameMore,
        ShowBuyLink
    }

    export function setPreference( key : PrefKey, enabled : boolean ) {
        let keyName : string = PrefKey[key];
        if(enabled) {
            localStorage.setItem(keyName, "enabled");
        } else {
            localStorage.setItem(keyName, "disabled");
        }
    }

    export function getPreference(key : PrefKey) : boolean {
        let keyName = PrefKey[key];
        return localStorage.getItem(keyName) == "enabled";
    }

    /* Classes */
    class PreferenceEntry {
        key : PrefKey;
        label : string;

        constructor(key : PrefKey, label : string) {
            this.key = key;
            this.label = label;
        }

        getCheckbox() : HTMLElement {
            let isEnabled = getPreference(this.key);

            let container = document.createElement("div");
            container.classList.add("checkbox");
            container.style.padding = "5px";

            let labelElement = document.createElement("label");
            let labelText = document.createTextNode(" " + this.label);

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isEnabled;
            checkbox.style.webkitAppearance = "checkbox";
            
            labelElement.appendChild(checkbox);
            labelElement.appendChild(labelText);

            container.appendChild(labelElement);

            checkbox.addEventListener("change", (e) => {
                let c = <HTMLInputElement> e.srcElement;
                setPreference(this.key, c.checked);
            });

            return container;
        }
    }

    /* Properties */
    let popupOverlay : HTMLElement;

    let preferences : Array<PreferenceEntry> = [
        new PreferenceEntry(PrefKey.HideCarousel, "Masquer \"À la Une\""),
        new PreferenceEntry(PrefKey.HideSummaryImages, "Masquer les images dans le sommaire"),
        new PreferenceEntry(PrefKey.FixArticleNavPosition, "Fixer la position du navigateur d'articles"),
        new PreferenceEntry(PrefKey.SummaryOrder, "Naviguer dans l'ordre du sommaire"),
        new PreferenceEntry(PrefKey.ShowGameMore, "Toujours afficher la fiche complète du jeu"),
        new PreferenceEntry(PrefKey.ShowBuyLink, "Afficher un lien vers IsThereAnyDeal"),
        new PreferenceEntry(PrefKey.SansSerifFont, "Utiliser une police sans serif")
    ]

    /* Init */
    export function init() {
        addPreferencesPanelMenuEntry();
    }

    /* Functions */
    function addPreferencesPanelMenuEntry() {
        let menuList = document.querySelector(".user-toggle ul.dropdown-menu");

        if(!menuList) {
            return;
        }

        let preferencesMenuEntry = document.createElement("li");
        let preferencesMenuLink = document.createElement("a");
        let preferencesMenuLinkText = document.createTextNode("Enhanced CPC");
        preferencesMenuLink.setAttribute("href", "#");
        preferencesMenuLink.appendChild(preferencesMenuLinkText);
        preferencesMenuLink.addEventListener("click", openPreferencesPopup);

        preferencesMenuEntry.appendChild(preferencesMenuLink);

        let lastMenuEntry = menuList.children[menuList.children.length - 1];

        let insertedElement = menuList.insertBefore(preferencesMenuEntry, lastMenuEntry);
    }

    function openPreferencesPopup() {
        let menuList = <HTMLElement>document.querySelector(".user-toggle ul.dropdown-menu");

        if(menuList) {
            menuList.style.display = "none";        
        }


        popupOverlay = document.createElement("div");
        let popupContainer = document.createElement("div");

        let closePopupButton = document.createElement("a");
        let closePopupButtonText = document.createTextNode("Fermer");
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

        preferences.forEach( (pref) => {
            let checkbox = pref.getCheckbox();
            popupContainer.appendChild(checkbox);
        });

        popupContainer.appendChild(closePopupButton);

        popupOverlay.appendChild(popupContainer);

        document.body.appendChild(popupOverlay);
        document.body.style.overflow = "hidden";
    }

    function closePopup() {
        if(!popupOverlay) {
            return;
        }

        document.body.removeChild(popupOverlay);
        document.body.style.overflow = "auto";

        location.reload();
    }
}