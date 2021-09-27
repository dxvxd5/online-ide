import flash from 'connect-flash';
import express from 'express';
import cors from 'cors';

import { PORT } from './config/env.variables';

import persistParams from './middlewares/persist-param';
import { passport, passportAuthenticator } from './middlewares/passport';
import session from './middlewares/session';

import usersRouter from './routes/user.routes';
import { signUpUser } from './controllers/user.controllers';
import HttpError from './utils/httperror';

const app = express();

// Middlewares
app.use(flash());
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use('/users/:userID', persistParams);
app.use('/users/:userID/projects/:projectID', persistParams);
app.use('/users/:userID/projects/:projectID/files/:fileID', persistParams);

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post('/signup', signUpUser);
// TODO: Maybe use the HTTP basic or digest authentication
app.post('/login', passportAuthenticator('/login/success', '/login/error'));

app.get('/login/error', (req, res) => {
  res.status(401).json({
    error: new HttpError('Either username or password is incorrect', 401),
  });
});

app.get('/login/success', (req, res) => {
  res.status(200).json(req.user);
});

app.use('/users', usersRouter);

// Start listening
app.listen(PORT, () => {
  console.log(`The server is at http://localhost:${PORT}`);
});
