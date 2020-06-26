import {localStorageController} from '../helpers/local-storage.js';

class ThemeSwitcher {
    constructor() {
        this.themeSwitch = document.querySelector('#theme-switch');
    }

    init() {
        if(localStorageController.getItem('darkTheme') === 'true') {
            this.themeSwitch.checked = true;
            this.setDarkTheme(true);
        }
        this.themeSwitch.addEventListener('change', (e) => {
            this.setDarkTheme(e.currentTarget.checked);
        });
    }

    setDarkTheme(on) {
        if(on) {
            document.querySelector("body").classList.add("dark");
            document.querySelector("addnote").classList.add("dark");
        } else {
            document.querySelector("body").classList.remove("dark");
            document.querySelector("addnote").classList.remove("dark");
        }
        localStorageController.setItem('darkTheme', on);
    }    
}

export const themeSwitcher = new ThemeSwitcher();