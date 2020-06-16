import express from 'express';

const router = express.Router();
import {notesController} from '../controllers/notesController';

router.post("/", notesController.getNotes.bind(notesController));

export const rtNotes = router;