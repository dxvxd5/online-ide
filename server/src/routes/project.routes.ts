import express from 'express';
import * as RouteControllers from '../controllers/project.controllers';
import filesRouter from './file.routes';

const projectsRouter = express.Router();

// Subsequent routing
projectsRouter.use('/:projectID/files', filesRouter);

// Project routing
projectsRouter.get('/', RouteControllers.getAllUserProjects);
projectsRouter.post('/create', RouteControllers.createProject);
projectsRouter.get('/:projectID', RouteControllers.getProject);
projectsRouter.patch('/:projectID', RouteControllers.editProject);
projectsRouter.get('/collab/:collabID', RouteControllers.getCollabProject);
projectsRouter.post('/:projectID/collab', RouteControllers.createCollab);
projectsRouter.delete('/:projectID', RouteControllers.deleteProject);

export default projectsRouter;
