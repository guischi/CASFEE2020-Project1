import express from 'express';
import {notesController} from '../controllers/notes-controller';

const router = express.Router();


router.get("/", notesController.getNotes.bind(notesController));
router.get("/:id", notesController.getOneNote.bind(notesController));
router.post("/", notesController.addNote.bind(notesController));
router.post("/:id", notesController.editNote.bind(notesController));

export const rtNotes = router;