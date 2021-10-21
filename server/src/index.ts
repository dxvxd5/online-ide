import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PORT } from './config/env.variables';
import persistParams from './middlewares/persist-param';
import passport from './middlewares/passport-jwt';
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
const io = new Server(server, {
  cors: { origin: true },
});
socketFunction(io);
server.listen(PORT);
