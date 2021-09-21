import flash from 'connect-flash';
import express from 'express';
import cors from 'cors';

import { PORT } from './config/env.variables';

import persistParams from './middlewares/persist-param';
import passport from './middlewares/passport';
import session from './middlewares/session';

import usersRouter from './routes/user.routes';

const app = express();

// Middlewares
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

app.use('/users/:userID/*', persistParams);
app.use('/users/:userID/projects/:projectID/*', persistParams);
app.use('/users/:userID/projects/:projectID/files/:fileID/*', persistParams);

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/',
    failureFlash: true,
  })
);

app.use('/users', usersRouter);

// Start listening
app.listen(PORT, () => {
  console.log(`The server is at http://localhost:${PORT}`);
});
