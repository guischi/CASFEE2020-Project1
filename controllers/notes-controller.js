import {notesService} from '../services/notes-service';
//import {SecurityUtil} from '../utils/security';

class NotesController {

    async getNotes(req, res) {
        res.json((await notesService.all()));
    }

    async addNote(req, res) {
        res.json(await notesService.add(req.body.title, req.body.duedate, req.body.importance, req.body.description));
    }

    async deleteNote(req, res) {
        //res.json(await notesStore.delete(req.params.id, SecurityUtil.currentUser(req)));
    }
}

export const notesController = new NotesController();