import express from 'express';
import { getUser } from '../controllers/user.controllers';
import checkAuthentication from '../middlewares/authentication';
import checkAuthorization from '../middlewares/authorization';
import filesRouter from './file.routes';
import projectsRouter from './project.routes';

const usersRouter = express.Router();

// Middlewares
usersRouter.use(checkAuthentication);
usersRouter.use(checkAuthorization);

// Subsequent routing
usersRouter.use('/:userID/projects', projectsRouter);
usersRouter.use('/:userID/files', filesRouter);

// Users routing
usersRouter.get('/', getUser);
usersRouter.get('/:userID', getUser);

export default usersRouter;
