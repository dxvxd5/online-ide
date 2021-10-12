import flash from 'connect-flash';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header';
import { PORT } from './config/env.variables';

import persistParams from './middlewares/persist-param';
// import { passport, passportAuthenticator } from './middlewares/passport';
import passport from './middlewares/passport-jwt';
import session from './middlewares/session';

import usersRouter from './routes/user.routes';

import socketFunction from './socket/socket';
import { logIn, signUpUser } from './controllers/user.controllers';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.text());
app.use(cors({ origin: true }));

app.use('/users/:userID', persistParams);
app.use('/users/:userID/projects/:projectID', persistParams);
app.use('/users/:userID/projects/:projectID/files/:fileID', persistParams);

app.use(passport.initialize());

// Routes
app.post('/signup', signUpUser);
app.post('/login', logIn);
app.use(
  '/users',
  passport.authenticate('jwt', { session: false }),
  usersRouter
);

const server = createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });
socketFunction(io);
server.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
