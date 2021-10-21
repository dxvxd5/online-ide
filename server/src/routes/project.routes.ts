import express from 'express';
import * as ProjectController from '../controllers/project.controllers';
import filesRouter from './file.routes';

const projectsRouter = express.Router();

// Subsequent routing
projectsRouter.use('/:projectID/files', filesRouter);

// Project routing
projectsRouter.get('/', ProjectController.getAllUserProjects);
projectsRouter.post('/create', ProjectController.createProject);
projectsRouter.get('/:projectID', ProjectController.getProject);
projectsRouter.patch('/:projectID', ProjectController.editProject);
projectsRouter.get('/collab/:collabID', ProjectController.getCollabProject);
projectsRouter.post('/:projectID/collab', ProjectController.createCollab);
projectsRouter.delete('/:projectID', ProjectController.deleteProject);

export default projectsRouter;
