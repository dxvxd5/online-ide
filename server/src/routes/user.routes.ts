import express from 'express';
import { getUser, signUpUser } from '../controllers/user.controllers';
import filesRouter from './file.routes';
import projectsRouter from './project.routes';

const usersRouter = express.Router();

// Subsequent routing
usersRouter.use('/:userID/projects', projectsRouter);
usersRouter.use('/:userID/files', filesRouter);

// Users routing
usersRouter.get('/:userID', getUser);
usersRouter.post('/signup', signUpUser);

export default usersRouter;
