import store from 'connect-session-firebase';
import session from 'express-session';

import { SESSION_PRIVATE_KEY } from '../config/env.variables';
import { realtimeDB } from '../config/firebase';

const StoreConstructor = store(session);
const FirebaseStore = new StoreConstructor({
  database: realtimeDB,
  reapInterval: 24 * 60 * 60 * 1000,
});

export default session({
  store: FirebaseStore,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_PRIVATE_KEY,
  // 1 day
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
});
