import crypto from 'crypto';
import JWT from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import User from '../models/user.model';

const KEYS_FOLDER = path.join(path.resolve(), 'keys');

export const PUB_KEY_PATH = path.join(KEYS_FOLDER, 'id_rsa_pub.pem');

const PRIVATE_KEY_PATH = path.join(KEYS_FOLDER, 'id_rsa_private.pem');

export function genKeyPair(): void {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(PUB_KEY_PATH, keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(PRIVATE_KEY_PATH, keyPair.privateKey);
}

export function issueJWT(user: User): {
  token: string;
  expiresIn: number;
} {
  const { id } = user;
  const PRIV_KEY = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

  const payload = { sub: id, iat: Date.now() };

  const algorithm = 'RS256';
  const expiresIn = 24 * 60 * 60 * 1000;
  const token = JWT.sign(payload, PRIV_KEY, {
    algorithm,
    expiresIn: `${expiresIn}ms`,
  });

  return {
    token,
    expiresIn,
  };
}
