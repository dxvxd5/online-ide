import { FirestoreStore } from '@google-cloud/connect-firestore';
import session from 'express-session';

import { SESSION_PRIVATE_KEY } from '../config/env.variables';
import { firestore } from '../config/firebase';

const fireSessionStore = new FirestoreStore({
  dataset: firestore,
  kind: 'express-sessions',
});

export default session({
  store: fireSessionStore,
  resave: false,
  saveUninitialized: true,
  secret: SESSION_PRIVATE_KEY,
  // 1 day
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
});
