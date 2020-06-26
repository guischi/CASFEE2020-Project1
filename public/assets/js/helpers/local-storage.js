class LocalStorageController {
    getItem(item) {
        return localStorage.getItem(item);
    }

    setItem(item, value) {
        localStorage.setItem(item, value);
        return this.getItem(item);
    }
}

export const localStorageController = new LocalStorageController();