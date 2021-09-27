import { Request, Response } from 'express';
import _ from 'lodash';
import File from '../models/file.model';
import User from '../models/user.model';
import HttpError from '../utils/httperror';
import { numberRegex } from '../utils/regex';
import {
  getUserIdFromReq,
  getProjectIdFromReq,
  getFileIdFromReq,
} from '../utils/request';

export async function getFile(req: Request, res: Response): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const fileID = getFileIdFromReq(req, res);
    if (!fileID) return;

    const file = await File.getFromId(projectID, userID, fileID);
    if (!file) {
      res.status(404).json({
        error: new HttpError(
          'The requested file does not exist in the specified project.',
          404
        ),
      });
      return;
    }

    res.status(200).json(file);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getFilesFromUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userID = req.params.userID || req.userID;

    if (!userID)
      res.status(400).json({
        error: new HttpError('Please specify a user ID and a project ID', 400),
      });
    else {
      const isUserExist = await User.isUserExist(userID);
      if (!isUserExist)
        res.status(404).json({
          error: new HttpError(`User with ID ${userID} does not exist.`, 404),
        });
      else {
        const files = await File.getFromUser(userID);
        res.status(200).json({ files });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function createFile(req: Request, res: Response): Promise<void> {
  try {
    const { name, creationDate } = req.body;
    if (!(name && creationDate)) {
      res.status(400).json({
        error: new HttpError(
          'Specify both a file name and a creation date',
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

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const user = req.user as User;
    const userName = user.name;
    const creationDateNum = Number(creationDate);
    const newFile = await File.createFile(
      userID,
      projectID,
      userName,
      name,
      creationDateNum
    );
    res.status(200).json(newFile);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function editFile(req: Request, res: Response): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const fileID = getFileIdFromReq(req, res);
    if (!fileID) return;

    const { name, lastUpdated } = req.body;

    // Remove the nullish values from the object
    const toEdit = _.pickBy(
      { name, lastUpdated: Number(lastUpdated) },
      (v) => !!v
    );

    if (lastUpdated && !numberRegex.test(lastUpdated)) {
      res.status(400).json({
        error: new HttpError('The last updated date must be a number', 400),
      });
      return;
    }

    if (_.isEmpty(toEdit)) {
      res.status(400).json({
        error: new HttpError(
          'Specify at least one valid field to update: name or lastUpdated',
          400
        ),
      });
      return;
    }

    const isEdited = await File.editFile(projectID, userID, fileID, toEdit);
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

export async function getFileContent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const fileID = getFileIdFromReq(req, res);
    if (!fileID) return;

    const content = await File.getContent(projectID, userID, fileID);

    if (!content) {
      res.status(404).json({
        error: new HttpError(
          'The file does not exist in the specified project.',
          404
        ),
      });
      return;
    }

    res.status(200).send(content);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function updateFileContent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userID = getUserIdFromReq(req, res);
    if (!userID) return;

    const projectID = getProjectIdFromReq(req, res);
    if (!projectID) return;

    const fileID = getFileIdFromReq(req, res);
    if (!fileID) return;

    const content = req.body as Buffer;
    if (!content) {
      res.status(400).json({
        error: new HttpError('No file content was provided', 400),
      });
      return;
    }

    const isUpdated = File.updateContent(projectID, userID, fileID, content);
    if (!isUpdated) {
      res.status(404).json({
        error: new HttpError(
          'The file does not exist in the specified project.',
          404
        ),
      });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
}
