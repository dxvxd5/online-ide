import express from 'express';
import {
  getAllUserProjects,
  createProject,
  getProject,
} from '../controllers/project.controllers';

const projectsRouter = express.Router();

projectsRouter.get('/', getAllUserProjects);
projectsRouter.post('/create', createProject);
projectsRouter.get('/:projectID', getProject);
// projectsRouter.patch('/:projectID/edit', )

export default projectsRouter;
