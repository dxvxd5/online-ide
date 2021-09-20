import express from 'express';
import { getFilesFromUser } from '../controllers/file.controllers';

const filesRouter = express.Router();

filesRouter.get('/', getFilesFromUser);

export default filesRouter;
