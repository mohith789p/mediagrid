import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(
          serviceAccount as import("firebase-admin/app").ServiceAccount
        ),
      })
    : getApps()[0];

export const adminDb = getFirestore(app);
