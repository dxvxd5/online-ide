import express from 'express';
import * as UserController from '../controllers/user.controllers';
import checkAuthentication from '../middlewares/authentication';
import filesRouter from './file.routes';
import projectsRouter from './project.routes';

const usersRouter = express.Router();

// Middlewares
usersRouter.use(checkAuthentication);

// Subsequent routing
usersRouter.use('/:userID/projects', projectsRouter);
usersRouter.use('/:userID/files', filesRouter);

// Users routing
usersRouter.get('/:userID', UserController.getUser);

export default usersRouter;
