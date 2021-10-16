import _ from 'lodash';
import { Request, Response } from 'express';
import Project from '../models/project.model';
import User from '../models/user.model';
import HttpError from '../utils/httperror';
import { numberRegex } from '../utils/regex';
import { getUserIdFromReq, getProjectIdFromReq } from '../utils/request';

export async function getAllUserProjects(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const isUserExist = await User.isUserExist(userID);
    if (!isUserExist) {
      res.status(404).json({
        error: new HttpError(`User with id ${userID} does not exist.`, 404),
      });
      return;
    }
    const projects = await Project.getFromUser(userID);
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function createProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, creationDate } = req.body;
    if (!(name && creationDate)) {
      res.status(400).json({
        error: new HttpError(
          'Specify both a project name and a creation date',
          400
        ),
      });
      return;
    }
    if (!numberRegex.test(creationDate)) {
      res.status(400).json({
        error: new HttpError('The creation date must be a number', 400),
      });
      return;
    }

    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const user = req.user as User;
    const userName = user.name;
    const creationDateNum = Number(creationDate);
    const newProject = await Project.createProject(
      userID,
      userName,
      name,
      creationDateNum
    );
    res.status(200).json(newProject);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getProject(req: Request, res: Response): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const project = await Project.getFromId(projectID, userID);
    if (!project) {
      res
        .status(404)
        .json({ error: new HttpError('This project does not exist', 404) });
      return;
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function editProject(req: Request, res: Response): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const { name, collaborators, shared, lastUpdated } = req.body;

    if (lastUpdated && !numberRegex.test(lastUpdated)) {
      res.status(400).json({
        error: new HttpError('The last updated date must be a number', 400),
      });
      return;
    }

    // Remove the nullish values from the object
    const toEdit = _.pickBy(
      { name, collaborators, shared, lastUpdated: Number(lastUpdated) },
      (v) => !_.isNil(v)
    );

    if (_.isEmpty(toEdit)) {
      res.status(400).json({
        error: new HttpError(
          'Specify at least one valid field to update: name, collaborators, shared or lastUpdated',
          400
        ),
      });
      return;
    }

    const isEdited = await Project.editProject(projectID, userID, toEdit);
    if (!isEdited) {
      res
        .status(500)
        .json({ error: new HttpError('Something went wrong', 500) });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function deleteProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const isDeleted = await Project.deleteProject(projectID, userID);
    if (!isDeleted) {
      res.status(404).json({
        error: new HttpError('The specified project does not exist.', 404),
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function createCollab(req: Request, res: Response): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const roomID = await Project.createCollaboration(userID, projectID);

    if (!roomID) {
      res.status(404).json({
        error: new HttpError('The specified project does not exist', 404),
      });
      return;
    }

    res.status(200).json({ roomID });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getCollabProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const { collabID } = req.params;
    if (!collabID)
      res.status(400).json({
        error: new HttpError('No collab ID provided', 400),
      });

    const project = await Project.getCollabProject(collabID);
    if (!project) {
      res.status(404).json({
        error: new HttpError('The specified collab ID does not exist', 404),
      });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).send(error);
  }
}
