/**
 * Authentication Store for ChemVerse
 * Menyimpan data akun terdaftar (Siswa dan Guru) ke localStorage.
 * Mendukung Registrasi (Buat Akun Baru) dan Masuk (Login).
 */

export interface RegisteredAccount {
  id: string;
  role: 'student' | 'teacher';
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  password: string;
  className?: string; // untuk siswa
  title?: string; // untuk guru
  registeredAt: string;
}

const STORAGE_KEY_AUTH = 'chemverse_auth_accounts_v1';

const INITIAL_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-std-1',
    role: 'student',
    name: 'Elsa Rasengraffe',
    username: 'elsa',
    email: 'elsa@chemverse.edu',
    password: '123',
    className: 'Kelas 12 IPA 1',
    registeredAt: '2026-11-01 08:00',
  },
  {
    id: 'user-std-2',
    role: 'student',
    name: 'Budi Santoso',
    username: 'budi',
    email: 'budi@chemverse.edu',
    password: '123',
    className: 'Fase F - Kimia 1',
    registeredAt: '2026-11-02 09:15',
  },
  {
    id: 'user-tch-1',
    role: 'teacher',
    name: 'Ibu Rahmawati, M.Pd.',
    username: 'rahmawati',
    email: 'rahmawati@guru.sma.belajar.id',
    password: '123',
    title: 'Guru Kimia SMA Kelas 12',
    registeredAt: '2026-11-01 07:30',
  },
];

export const authStore = {
  getAccounts(): RegisteredAccount[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY_AUTH);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Gagal memuat akun terdaftar:', err);
    }
    return INITIAL_ACCOUNTS;
  },

  saveAccounts(accounts: RegisteredAccount[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(accounts));
      }
    } catch (err) {
      console.warn('Gagal menyimpan akun terdaftar:', err);
    }
  },

  register(data: {
    role: 'student' | 'teacher';
    name: string;
    username: string;
    email?: string;
    avatar?: string;
    password: string;
    className?: string;
    title?: string;
  }): { success: boolean; message: string; account?: RegisteredAccount } {
    const accounts = this.getAccounts();
    const cleanUsername = data.username.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanEmail = data.email?.trim().toLowerCase();

    // Periksa apakah username atau email sudah terpakai pada peran yang sama
    const duplicate = accounts.find(
      (acc) =>
        acc.role === data.role &&
          (acc.username.toLowerCase() === cleanUsername ||
            acc.name.toLowerCase() === cleanName.toLowerCase() ||
            (cleanEmail && acc.email && acc.email.toLowerCase() === cleanEmail))
    );

    if (duplicate) {
      return {
        success: false,
        message: `Username, Nama, atau Email "${data.name}" sudah terdaftar. Silakan gunakan akun lain atau masuk.`,
      };
    }

    const now = new Date();
    const registeredAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}`;

    const newAccount: RegisteredAccount = {
      id: `user-${Date.now()}`,
      role: data.role,
      name: cleanName,
      username: cleanUsername || cleanName.toLowerCase().replace(/\s+/g, ''),
      email: cleanEmail,
      avatar: data.avatar,
      password: data.password,
      className: data.className?.trim(),
      title: data.title?.trim(),
      registeredAt,
    };

    accounts.push(newAccount);
    this.saveAccounts(accounts);

    return {
      success: true,
      message: 'Pendaftaran akun berhasil! Silakan masuk ke ChemVerse.',
      account: newAccount,
    };
  },

  login(
    identifier: string,
    password: string,
    role: 'student' | 'teacher'
  ): { success: boolean; message: string; account?: RegisteredAccount } {
    const accounts = this.getAccounts();
    const cleanId = identifier.trim().toLowerCase();

    // Cari berdasarkan username ATAU nama lengkap ATAU email
    const found = accounts.find(
      (acc) =>
        acc.role === role &&
          (acc.username.toLowerCase() === cleanId ||
            acc.name.toLowerCase() === cleanId ||
            (acc.email && acc.email.toLowerCase() === cleanId))
    );

    if (!found) {
      return {
        success: false,
        }. Silakan klik tab 'Daftar' untuk membuat akun baru.`,
      };
  }

    if(found.password !== password) {
    return {
      success: false,
      message: 'Kata sandi tidak sesuai. Silakan periksa kembali kata sandi Anda.',
    };
    }

return {
  success: true,
  message: 'Berhasil masuk!',
  account: found,
};
  },

/**
 * Menyimpan / sinkronisasi akun Google ke penyimpanan lokal
 */
saveGoogleAccount(data: {
  role: 'student' | 'teacher';
  name: string;
  email: string;
  avatar?: string;
  className?: string;
  title?: string;
}): RegisteredAccount {
  const accounts = this.getAccounts();
  const cleanEmail = data.email.trim().toLowerCase();
  const existingIndex = accounts.findIndex(
    (acc) => acc.role === data.role && acc.email && acc.email.toLowerCase() === cleanEmail
  );

  if (existingIndex !== -1) {
    // Update avatar or class if available
    accounts[existingIndex].name = data.name;
    if (data.avatar) accounts[existingIndex].avatar = data.avatar;
    if (data.className) accounts[existingIndex].className = data.className;
    if (data.title) accounts[existingIndex].title = data.title;
    this.saveAccounts(accounts);
    return accounts[existingIndex];
  }

  const now = new Date();
  const registeredAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0'
  )}`;

  const newGoogleAccount: RegisteredAccount = {
    id: `google-${Date.now()}`,
    role: data.role,
    name: data.name,
    username: data.email.split('@')[0].toLowerCase(),
    email: cleanEmail,
    avatar: data.avatar,
    password: '', // Akun Google tidak menggunakan password lokal
    className: data.className || 'Kelas 12 IPA 1',
    title: data.title || 'Guru Kimia SMA Kelas 12',
    registeredAt,
  };

  accounts.push(newGoogleAccount);
  this.saveAccounts(accounts);
  return newGoogleAccount;
},
};

