import express, { Request, Response, NextFunction } from 'express';
import { getAllUserProjects } from '../controllers/project.controllers';

const projectsRouter = express.Router();

projectsRouter.get('/', getAllUserProjects);

export default projectsRouter;
