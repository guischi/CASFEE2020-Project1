import Datastore from 'nedb';
const db = new Datastore({ filename: './data/notes.db', autoload: true });

class Note{
    constructor(title, dueDate, importance, description){
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

    add(title, dueDate, importance, description, fnCallback) {
        let due = '';
        if(dueDate != '') {
            due = new Date(dueDate);
        }
        let note = new Note(title, due, importance, description);

        db.insert(note, function(err, newDoc){
            console.log("Insert new note into db: " + title, due, importance, description);
            if(fnCallback){
                fnCallback(err, newDoc);
            }
        });
    }

    delete(id) {
        let note = this.get(id);
        if(note)
        {
            note.state = "DELETED";
        }
        return note;
    }

    /*get(id) {
        return this.notes[id];
    }*/

    all(fnCallback) {
        db.find({}, function (err, docs) {
            fnCallback(err, docs);
        });       
    }
}

export const notesService = new NotesService();