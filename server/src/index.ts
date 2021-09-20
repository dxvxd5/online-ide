import { FirestoreStore } from '@google-cloud/connect-firestore';
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import session from 'express-session';
import passport from 'passport';

import { PORT, SESSION_PRIVATE_KEY } from './config/env.variables';

import usersRouter from './routes/user.routes';
import { firestore } from './config/firebase';
import localStrategy from './config/passport';

import User from './models/user.model';

const app = express();

function persistParams(req: Request, res: Response, next: NextFunction): void {
  // Persist the parameters so that they can be accessed by further routers
  const { userID, projectID, fileID } = req.params;
  req.userID = userID;
  req.projectID = projectID;
  req.fileID = fileID;
  next();
}

const fireSessionStore = new FirestoreStore({
  dataset: firestore,
  kind: 'express-sessions',
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========
passport.use(localStrategy);

passport.serializeUser(function (user, done) {
  const u = user as User;
  done(null, u.id);
});

passport.deserializeUser(function (id, done) {
  const i = id as string;
  User.getFromId(i).then((user) => {
    done(null, user);
  });
});

app.use(
  session({
    store: fireSessionStore,
    resave: false,
    saveUninitialized: true,
    secret: SESSION_PRIVATE_KEY,
    // 1 day
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/users/:userID/*', persistParams);
app.use('/users/:userID/projects/:projectID/*', persistParams);
app.use('/users/:userID/projects/:projectID/files/:fileID/*', persistParams);

app.use(function (req: Request, res: Response, next: NextFunction) {
  // console.log({ session: req.session });
  next();
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

const form =
  // eslint-disable-next-line no-multi-str
  '<h1>Register Page</h1><form method="post" action="login">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter name:<br><input type="text" name="name">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';

app.get('/login', (req, res) => {
  res.send(form);
});

// Routes
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`The server is at http://localhost:${PORT}`);
});
