import passport from 'passport';
import { Strategy } from 'passport-local';

import User from '../models/user.model';

const localStrategy = new Strategy(function (
  username: string,
  password: string,
  done
) {
  try {
    User.getFromCredentials(username, password)
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'username or password incorrect',
          });
        }
        return done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  } catch (error) {
    done(error);
  }
});

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

export default passport;
