//import {orderStore} from '../services/orderStore'
//import {SecurityUtil} from '../utils/security';

export class NotesController {

    async getNotes(req, res) {
        //res.json((await orderStore.all(SecurityUtil.currentUser(req)) || []))
    };

    async addNote(req, res) {
        //res.json(await orderStore.add(req.body.name, SecurityUtil.currentUser(req)));
    };

    async deleteNote(req, res) {
        //res.json(await orderStore.delete(req.params.id, SecurityUtil.currentUser(req)));
    };
}

export const notesController = new NotesController();