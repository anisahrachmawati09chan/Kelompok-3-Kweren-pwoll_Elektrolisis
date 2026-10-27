/**
 * Safe localStorage wrapper for ElectroLab
 * Implements schema versioning and failsafe fallbacks
 */

export interface CourseProgress {
  version: number;
  activeChapterId: number;
  completedChapterIds: number[];
  completedSubtopicIds: string[];
  totalScore: number;
  xp: number;
  badges: string[];
  lastVisited: string;
}

export const DEFAULT_PROGRESS: CourseProgress = {
  version: 1,
  activeChapterId: 1,
  completedChapterIds: [],
  completedSubtopicIds: [],
  totalScore: 0,
  xp: 0,
  badges: [],
  lastVisited: new Date().toISOString(),
};

const STORAGE_KEYS = {
  PROGRESS: 'electrolab_progress_v1',
  QUIZ: 'electrolab_quiz_history_v1',
  GAMIFICATION: 'electrolab_gamification_v1',
  SETTINGS: 'electrolab_user_settings_v1',
};

export const safeStorage = {
  getProgress(): CourseProgress {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return DEFAULT_PROGRESS;
      }
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (!raw) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_PROGRESS, ...parsed };
      }
      return DEFAULT_PROGRESS;
    } catch (err) {
      console.warn('Gagal membaca storage progres, menggunakan default:', err);
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(progress: CourseProgress): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
      return true;
    } catch (err) {
      console.warn('Gagal menyimpan progress ke localStorage:', err);
      return false;
    }
  },

  resetProgress(): CourseProgress {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEYS.PROGRESS);
      }
    } catch (err) {
      console.warn('Gagal mereset localStorage:', err);
    }
    return DEFAULT_PROGRESS;
  },
};
