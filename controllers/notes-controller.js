import {notesService} from '../services/notes-service';
//import {SecurityUtil} from '../utils/security';

class NotesController {

    async getNotes(req, res) {
        const notes = await notesService.all((err, notes) => {
            notes.sort((a, b) => a[req.query.sort] - b[req.query.sort]);
            if(req.query.direction == "dn") notes.reverse();
            res.json(notes);
        });        
    }

    async addNote(req, res) {
        const note = await notesService.add(req.body.title, req.body.duedate, req.body.importance, req.body.description, function(err, note) {
            res.json(note);
        });        
    }

    async deleteNote(req, res) {
        //res.json(await notesStore.delete(req.params.id, SecurityUtil.currentUser(req)));
    }
}

export const notesController = new NotesController();