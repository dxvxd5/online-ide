import fs from 'fs';
import passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PUB_KEY_PATH } from '../utils/jwt';

import User from '../models/user.model';

const PUB_KEY = fs.readFileSync(PUB_KEY_PATH, 'utf-8');

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const jwtStrategy = new Strategy(options, (payload, done) => {
  User.getFromId(payload.sub)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

passport.use(jwtStrategy);

export default passport;
