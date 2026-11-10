import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

/**
 * Konfigurasi Firebase untuk ChemVerse
 * Nilai konfigurasi diambil secara aman dari file environment (.env.local)
 * menggunakan prefix standar Vite: import.meta.env.VITE_*
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Memeriksa apakah konfigurasi Firebase sudah diisi di .env.local
 */
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.apiKey !== 'your_api_key_here'
);

let appInstance = null;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
    console.log('✅ Firebase berhasil diinisialisasi untuk ChemVerse:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('⚠️ Gagal menginisialisasi Firebase, beralih ke penyimpanan lokal:', error);
  }
} else {
  console.info('ℹ️ Firebase belum dikonfigurasi di .env.local. Sistem berjalan dalam Mode Penyimpanan Lokal (Offline-First).');
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;
