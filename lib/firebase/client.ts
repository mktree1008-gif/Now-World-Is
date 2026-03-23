'use client';

import {getApp, getApps, initializeApp, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';

type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
};

let cachedConfig: FirebaseClientConfig | null | undefined;
let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

function readFirebaseClientConfig(): FirebaseClientConfig | null {
  if (cachedConfig !== undefined) {
    return cachedConfig;
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    cachedConfig = null;
    return cachedConfig;
  }

  cachedConfig = {
    apiKey,
    authDomain,
    projectId,
    appId,
    storageBucket,
    messagingSenderId
  };

  return cachedConfig;
}

export function isFirebaseConfigured() {
  return Boolean(readFirebaseClientConfig());
}

export function getFirebaseAppClient() {
  if (cachedApp) {
    return cachedApp;
  }

  const config = readFirebaseClientConfig();
  if (!config) {
    return null;
  }

  cachedApp = getApps().length ? getApp() : initializeApp(config);
  return cachedApp;
}

export function getFirebaseAuthClient() {
  if (cachedAuth) {
    return cachedAuth;
  }

  const app = getFirebaseAppClient();
  if (!app) {
    return null;
  }

  cachedAuth = getAuth(app);
  return cachedAuth;
}

export function getFirebaseFirestoreClient() {
  if (cachedDb) {
    return cachedDb;
  }

  const app = getFirebaseAppClient();
  if (!app) {
    return null;
  }

  cachedDb = getFirestore(app);
  return cachedDb;
}

