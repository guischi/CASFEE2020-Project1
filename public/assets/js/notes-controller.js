class NotesController {
    constructor(editMode) {
        this._editMode = editMode;
    }

    getAllNotes(sortBy, sortDirection, fnCallback) {
        $.get("/notes?sort="+sortBy+"&direction="+sortDirection, (data) => {
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
}

export const notesController = new NotesController(false);