import {notesService} from '../services/notes-service';

class NotesController {

    async getNotes(req, res) {
        res.json(await notesService.all(req.query.sort, req.query.direction));
    }

    async getOneNote(req, res) {
        res.json(await notesService.one(req.params.id));        
    }

    async addNote(req, res) {
        res.json(await notesService.add(req.body));        
    }

    async editNote(req, res) {
        res.json(await notesService.edit(req.params.id, req.body));  
    }
}

export const notesController = new NotesController();