import datastore from 'nedb-promise';
const db = new datastore({ filename: './data/notes.db', autoload: true });

class Note{
    constructor(title, dueDate, importance, description){
        this.title = title;        
        this.importance = importance;
        this.description = description;
        this.finished = false;
        this.dueDate = dueDate;
        this.finishDate = new Date('2999-12-31');        
        this.state = "OK";
    }

    setCreateDate(date) {
        this.createDate = date;
    }
}

class NotesService {
    async add(title, dueDate, importance, description) {
        let due = '';
        if(dueDate != '') {
            due = new Date(dueDate);
        }
        let note = new Note(title, due, importance, description);
        note.setCreateDate(new Date());

        return await db.insert(note);        
    }

    async edit(id, payload) {
        payload.dueDate = new Date(payload.dueDate);
        if(payload.dueDate == "Invalid Date") payload.dueDate = new Date("2999-12-31");
        return await db.update({ _id: id }, { $set: payload }, {});
    }

    async all(sort, dir) {
        return await db.cfind({}).sort({ [sort]: dir }).exec();       
    }

    async one(id) {
        return await db.findOne({ _id: id });       
    }
}

export const notesService = new NotesService();