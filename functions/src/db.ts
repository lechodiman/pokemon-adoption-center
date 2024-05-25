import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

if (process.env.FUNCTIONS_EMULATOR) {
  admin.firestore().settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

export const db = admin.firestore();
