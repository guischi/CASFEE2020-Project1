import express from 'express';

const router = express.Router();
import {notesController} from '../controllers/notes-controller';

router.get("/", notesController.getNotes.bind(notesController));
router.post("/", notesController.addNote.bind(notesController));

export const rtNotes = router;