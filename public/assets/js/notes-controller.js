import {localStorageController} from './helpers/local-storage.js';

class NotesController {
    constructor() {
        this._editMode = false;
        this._showFinished = false;
        if(localStorageController.getItem('showFinished') === 'true') {
            this._showFinished = true;
        }
    }

    getAllNotes(sortBy, sortDirection, fnCallback) {
        let finishedFilter = "&unfinished=";
        finishedFilter += !this.showFinished ? 'true' : 'false';
        $.get("/notes?sort="+sortBy+"&direction="+sortDirection+finishedFilter, (data) => {
            fnCallback(data); 
        });
    }

    getOneNote(id, fnCallback) {
        $.get("/notes/"+id, (data) => {
            this.editMode = true;  
            fnCallback(data);                      
        });
     }

    saveNote(note, fnCallback) { 
        let id = '';   
        if(this.editMode) id = note._id; 
        $.post("/notes/"+id, note, (data) => {
            fnCallback(data);
        });
    }

    setFinished(id, fnCallback) {
        this.getOneNote(id, (note) => {        
            note.finished = note.finished == 'false' ? 'true' : 'false';   
            note.finishDate = new Date().toISOString();          
            this.saveNote(note, (data) => {
                fnCallback(data);
            });
        });
    }

    get editMode() {
        return this._editMode;
    }

    set editMode(mode) {
        this._editMode = mode; 
    }

    get showFinished() {
        return this._showFinished;
    }

    set showFinished(mode) {
        this._showFinished = mode; 
        localStorageController.setItem('showFinished', mode);
    }
}

export const notesController = new NotesController();