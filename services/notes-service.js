class Note{
    constructor(id, title, dueDate, importance, description){
        this.id = id;
        this.title = title;
        this.dueDate = dueDate;
        this.importance = importance;
        this.description = description;
        this.noteDate = new Date();
        this.finishDate = new Date();
        this.state = "OK";
    }
}


class NotesService {
    constructor() {
        this.notes = [];
    }

    add(title, dueDate, importance, description) {
        let note = new Note(this.notes.length, title, dueDate, importance, description);
        this.notes.push(note);
        console.log(this.notes);
        return note;
    }

    delete(id) {
        let note = this.get(id);
        if(note)
        {
            note.state = "DELETED";
        }
        return note;
    }

    get(id) {
        return this.notes[id];
    }

    all() {
        return this.notes;
    }
}

export const notesService = new NotesService();