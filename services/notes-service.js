import datastore from 'nedb-promise';
const db = new datastore({ filename: './data/notes.db', autoload: true });

class Note{
    constructor(title, dueDate, importance, description){
        this.title = title;        
        this.importance = importance;
        this.description = description;
        this.finished = 'false';
        this.dueDate = dueDate;
        this.finishDate = new Date('2999-12-31').toISOString();     
    }

    setCreateDate(date) {
        this.createDate = date;
    }
}

class NotesService {
    async add(payload) {
        payload.dueDate = this.setDueDate(payload.dueDate);

        let note = new Note(payload.title, payload.dueDate, payload.importance, payload.description);
        note.setCreateDate(new Date());

        return await db.insert(note);        
    }

    async edit(id, payload) {
        payload.dueDate = this.setDueDate(payload.dueDate);
        return await db.update({ _id: id }, { $set: payload }, {});
    }

    async all(sort, dir, unfinished) {
        if(unfinished == 'true') return await this.unfinished(sort, dir);
        return await db.cfind({}).sort({ [sort]: dir }).exec();       
    }

    async unfinished(sort, dir) {
        return await db.cfind({ finished: 'false' }).sort({ [sort]: dir }).exec();       
    }

    async one(id) {
        return await db.findOne({ _id: id });       
    }

    setDueDate(date) {
        date = new Date(date);
        if(date == "Invalid Date") date = new Date("2999-12-31");
        return date;
    }
}

export const notesService = new NotesService();