import _ from 'lodash';
import { Request, Response } from 'express';
import Project from '../models/project.model';
import User from '../models/user.model';
import HttpError from '../utils/httperror';
import { numberRegex } from '../utils/regex';

function getUserIdFromReq(req: Request, res: Response): string | null {
  const userID = req.params.userID || req.userID;
  if (!userID) {
    res
      .status(400)
      .json({ error: new HttpError('Please specify a user ID', 400) });
    return null;
  }
  return userID;
}

function getProjectIdFromReq(req: Request, res: Response): string | null {
  const projectID = req.params.projectID || req.projectID;
  if (!projectID) {
    res
      .status(400)
      .json({ error: new HttpError('Please specify a project ID', 400) });
    return null;
  }
  return projectID;
}

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

// export async function editProject(req: Request, res: Response): Promise<void> {
//   try {
//     const userID = getUserIdFromReq(req, res);
//     if (!userID) return;

//     const projectID = getProjectIdFromReq(req, res);
//     if (!projectID) return;

//     const { name, collaborators, shared, lastUpdated } = req.body;

//     let toEdit = [name, collaborators, shared, lastUpdated];
//     toEdit = _.filter(toEdit, function (p) {
//       return _.isNil(p);
//     });

//     if (_.isEmpty(toEdit)) {
//       res.status(400).json({
//         error: new HttpError('Specify at least one valid field to update', 400),
//       });
//       return;
//     }
//     const toEditObj =
//   } catch (error) {}
// }
