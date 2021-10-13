import express from 'express';
import checkAuthentication from '../middlewares/authentication';
import projectsRouter from './project.routes';

const usersRouter = express.Router();

// Middlewares
usersRouter.use(checkAuthentication);

// Subsequent routing
usersRouter.use('/:userID/projects', projectsRouter);

export default usersRouter;
