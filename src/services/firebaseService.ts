import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import type { StudentRecord } from '../utils/studentRecords';
import { studentRecordStore } from '../utils/studentRecords';
import type { QuizQuestion } from '../data/questionsData';
import { questionStore } from '../data/questionsData';

const COLLECTION_STUDENTS = 'chemverse_students';
const COLLECTION_QUESTIONS = 'chemverse_questions';

/**
 * Layanan Sinkronisasi Cloud Firebase Firestore untuk ChemVerse
 * Mendukung arsitektur Hybrid (Cloud Firestore + LocalStorage Fallback)
 * sehingga aplikasi tidak akan macet atau blank jika koneksi internet terputus.
 */
export const firebaseService = {
  /**
   * Menyimpan atau memperbarui data siswa ke Cloud Firestore
   */
  async saveStudentToCloud(student: StudentRecord): Promise<boolean> {
    if (!db || !isFirebaseConfigured) {
      // Fallback lokal
      return false;
    }

    try {
      // Buat ID dokumen yang konsisten berdasarkan nama siswa
      const cleanDocId = student.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const studentDocRef = doc(db, COLLECTION_STUDENTS, cleanDocId);

      await setDoc(
        studentDocRef,
        {
          id: student.id,
          name: student.name,
          className: student.className,
          loginTime: student.loginTime,
          score: student.score,
          maxScore: student.maxScore,
          status: student.status,
          completedQuestionsCount: student.completedQuestionsCount,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log(`☁️ Data siswa "${student.name}" berhasil disinkronkan ke Firestore.`);
      return true;
    } catch (err) {
      console.warn('⚠️ Gagal menyimpan data siswa ke Firestore:', err);
      return false;
    }
  },

  /**
   * Mengambil seluruh data siswa dari Cloud Firestore
   */
  async fetchStudentsFromCloud(): Promise<StudentRecord[]> {
    if (!db || !isFirebaseConfigured) {
      return studentRecordStore.getAll();
    }

    try {
      const q = query(collection(db, COLLECTION_STUDENTS), orderBy('loginTime', 'desc'));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Jika Firestore masih kosong, gunakan data lokal dan unggah ke cloud
        const localList = studentRecordStore.getAll();
        for (const item of localList) {
          await this.saveStudentToCloud(item);
        }
        return localList;
      }

      const list: StudentRecord[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: data.id || d.id,
          name: data.name,
          className: data.className,
          loginTime: data.loginTime || '',
          score: data.score || 0,
          maxScore: data.maxScore || 4,
          status: data.status || 'Sedang Belajar',
          completedQuestionsCount: data.completedQuestionsCount || 0,
        });
      });

      return list;
    } catch (err) {
      console.warn('⚠️ Gagal mengambil data siswa dari Firestore, menggunakan data lokal:', err);
      return studentRecordStore.getAll();
    }
  },

  /**
   * Menyimpan bank soal ke Cloud Firestore
   */
  async saveQuestionsToCloud(questions: QuizQuestion[]): Promise<boolean> {
    if (!db || !isFirebaseConfigured) {
      return false;
    }

    try {
      const bankDocRef = doc(db, COLLECTION_QUESTIONS, 'default_bank');
      await setDoc(bankDocRef, {
        items: questions,
        updatedAt: serverTimestamp(),
      });
      console.log('☁️ Bank soal berhasil disinkronkan ke Firestore.');
      return true;
    } catch (err) {
      console.warn('⚠️ Gagal menyimpan bank soal ke Firestore:', err);
      return false;
    }
  },

  /**
   * Mengambil bank soal dari Cloud Firestore
   */
  async fetchQuestionsFromCloud(): Promise<QuizQuestion[]> {
    if (!db || !isFirebaseConfigured) {
      return questionStore.getQuestions();
    }

    try {
      const bankDocRef = doc(db, COLLECTION_QUESTIONS, 'default_bank');
      const snap = await getDoc(bankDocRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          return data.items as QuizQuestion[];
        }
      }

      // Jika cloud masih kosong, inisialisasi dari default lokal
      const defaultQ = questionStore.getQuestions();
      await this.saveQuestionsToCloud(defaultQ);
      return defaultQ;
    } catch (err) {
      console.warn('⚠️ Gagal mengambil bank soal dari Firestore:', err);
      return questionStore.getQuestions();
    }
  },
};
