import express from 'express';

import * as FileControllers from '../controllers/file.controllers';

const filesRouter = express.Router();

filesRouter.get('/', FileControllers.getFilesFromUser);
filesRouter.post('/create', FileControllers.createFile);
filesRouter.get('/:fileID', FileControllers.getFile);
filesRouter.patch('/:fileID', FileControllers.editFile);
filesRouter.put('/:fileID/content', FileControllers.updateFileContent);
filesRouter.get('/:fileID/content', FileControllers.getFileContent);
filesRouter.delete('/:fileID', FileControllers.deleteFile);

export default filesRouter;
