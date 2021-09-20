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

export default localStrategy;
