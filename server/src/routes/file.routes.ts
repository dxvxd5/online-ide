import express from 'express';

import * as FileController from '../controllers/file.controllers';

const filesRouter = express.Router();

// filesRouter.get('/', FileController.getFilesFromUser);
filesRouter.post('/create', FileController.createFile);
filesRouter.get('/:fileID', FileController.getFile);
filesRouter.patch('/:fileID', FileController.editFile);
filesRouter.put('/:fileID/content', FileController.updateFileContent);
filesRouter.get('/:fileID/content', FileController.getFileContent);
filesRouter.delete('/:fileID', FileController.deleteFile);

export default filesRouter;
