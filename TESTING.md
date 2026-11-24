# TESTING.md — ChemVerse Elektrolisis
## Kelompok 3 — Kweren-pwoll | Kimia Fase F Kurikulum Merdeka
> Dokumen ini dibuat berdasarkan umpan balik proyek dari dosen pembimbing (21-23 November 2026).
> Setiap temuan P1/P2 telah diuji dan diverifikasi sesuai kriteria di bawah.

---

## Akun Dummy untuk Pengujian

| Peran | Nama | Username | Password | Kode Khusus |
|-------|------|----------|----------|-------------|
| Siswa | Elsa Rasengraffe | elsa | 123 | — |
| Siswa | Ahmad Fauzi | ahmad | 123 | — |
| Guru | Affriza Sefi Azzahra | affriza | 123 | GURU-CHEM-2026 |
| Guru | Demo Teacher | guru | 123 | GURU-CHEM-2026 |

> **Catatan:** Kode otorisasi guru `GURU-CHEM-2026` wajib diisi saat mendaftar akun guru baru.

---

## S2-03-01 — Password Plaintext di localStorage (P1)

**File:** `src/services/firebaseAuthService.ts`, `src/utils/authStore.ts`

**Deskripsi Temuan:**
Saat pengguna mendaftar via Firebase Auth, password plaintext dikirim ke `authStore.register()` dan disimpan ke localStorage bersama data profil akun.

**Langkah Reproduksi (sebelum perbaikan):**
1. Buka DevTools → Application → Local Storage
2. Daftar akun baru siswa dengan email Firebase
3. Cari key `chemverse_accounts_v2` → lihat field `password` berisi teks asli

**Perbaikan yang Diterapkan:**
- `firebaseAuthService.ts` baris 268: Ganti `password` dengan `''` (kosong) saat menyimpan ke cache lokal untuk akun Firebase
- Komentar eksplisit: *"Firebase Auth mengelola kredensial secara aman"*

**Hasil Setelah Perbaikan:**
- ✅ Akun Firebase: field `password` di localStorage berisi string kosong
- ✅ Akun lokal (non-Firebase): password tetap tersimpan untuk keperluan login lokal
- ✅ `npm run lint` → 0 errors, `npm run build` → sukses

---

## S2-03-02 — Data Siswa Bertabrakan Berdasarkan Nama (P1)

**File:** `src/utils/studentRecords.ts`, `src/services/firebaseService.ts`

**Deskripsi Temuan:**
- `recordLogin()` mencari siswa berdasarkan `name.toLowerCase()` + `className` — dua siswa berbeda kelas dengan nama sama akan menimpa data satu sama lain
- `firebaseService.saveStudentToCloud()` menggunakan `name.toLowerCase().replace()` sebagai Firestore document ID → konflik dokumen antar kelas

**Langkah Reproduksi (sebelum perbaikan):**
1. Login sebagai "Ahmad Fauzi" kelas IPA 1
2. Login sebagai "Ahmad Fauzi" kelas IPA 2 (akun berbeda)
3. Cek data guru → hanya 1 record "Ahmad Fauzi" yang tersisa

**Perbaikan yang Diterapkan:**
- `studentRecords.ts`: Interface `StudentRecord` ditambah field `uid?: string` dan `attempts[]`
- `recordLogin()` menerima parameter `uid?: string`; pencarian prioritaskan `uid` jika ada
- `updateScore()` menerima `id` (bukan `name`) sebagai parameter pencarian
- `firebaseService.ts` baris 103: Ganti `cleanDocId` dengan `student.id` sebagai Firestore document ID
- Tambah field `uid`, `attempts[]`, dan `instrumentVersion: 'v1.0'` ke dokumen Firestore

**Hasil Setelah Perbaikan:**
- ✅ Dua siswa dengan nama sama di kelas berbeda memiliki record terpisah
- ✅ Firestore document ID menggunakan `student.id` yang unik
- ✅ Riwayat percobaan (`attempts`) terekam per siswa

---

## S2-03-03 — Draft Kuis Hilang & Skor Di-reset ke 0 (P1)

**File:** `src/features/home/LabSheetModal.tsx`

**Deskripsi Temuan:**
- Menutup dan membuka kembali `LabSheetModal` menghapus semua jawaban yang sudah diisi
- Tombol "Reset" langsung mengosongkan skor tanpa menyimpan riwayat percobaan sebelumnya

**Langkah Reproduksi (sebelum perbaikan):**
1. Login sebagai siswa → buka Lembar Belajar (1.4 Cek Pemahaman)
2. Jawab 2 soal
3. Tutup modal → buka kembali → semua jawaban hilang
4. Jawab soal → klik Reset → skor 0 tanpa riwayat percobaan

**Perbaikan yang Diterapkan:**
- Tambah `DRAFT_KEY = chemverse_quiz_draft_${studentId}` per akun
- `loadDraft()`: memuat jawaban dari localStorage saat modal mount
- `saveDraft()` dipanggil di setiap `handleSelectMCOption` dan `handleSelectTF`
- `handleResetQuiz()`: menghapus draft dari localStorage (`localStorage.removeItem(DRAFT_KEY)`)
- Riwayat percobaan (`attempts[]`) ditambahkan ke `StudentRecord` interface

**Hasil Setelah Perbaikan:**
- ✅ Jawaban tetap tersimpan saat modal ditutup dan dibuka kembali
- ✅ Draft tersimpan per akun (tidak bercampur antar siswa)
- ✅ Reset quiz menghapus draft sekaligus riwayat sesi aktif

---

## S2-03-04 — Pendaftaran Guru Tanpa Otorisasi (P1)

**File:** `src/components/auth/LoginScreen.tsx`

**Deskripsi Temuan:**
Siapapun dapat mendaftar akun guru dan langsung mengakses Panel Guru (data semua siswa, edit soal, export nilai) tanpa verifikasi apapun.

**Langkah Reproduksi (sebelum perbaikan):**
1. Buka halaman login → pilih tab Guru → klik Daftar
2. Isi nama sembarang → klik submit
3. Langsung masuk ke Dashboard Guru dengan akses penuh

**Perbaikan yang Diterapkan:**
- Tambah state `regTeacherAuthCode` dan konstanta `TEACHER_AUTH_CODE = 'GURU-CHEM-2026'`
- Validasi kode sebelum pendaftaran: jika salah → `setErrorMsg(...)` dan return
- Tambah field input "Kode Otorisasi Guru" (wajib) di form pendaftaran guru
- Pesan error jelas: *"Hubungi administrator sekolah untuk mendapatkan kode akses"*

**Hasil Setelah Perbaikan:**
- ✅ Pendaftaran tanpa kode → gagal dengan pesan error jelas
- ✅ Pendaftaran dengan kode `GURU-CHEM-2026` → berhasil
- ✅ Siswa tidak dapat memilih role guru tanpa kode otorisasi

**Test Cases:**

| Input Kode | Expected | Actual |
|-----------|----------|--------|
| (kosong) | Error: kode tidak valid | ✅ Error ditampilkan |
| `SALAH123` | Error: kode tidak valid | ✅ Error ditampilkan |
| `GURU-CHEM-2026` | Pendaftaran berhasil | ✅ Berhasil |

---

## S2-03-05 — Kegagalan localStorage Tidak Dilaporkan (P2)

**File:** `src/utils/authStore.ts`

**Deskripsi Temuan:**
`saveAccounts()` bertipe `void` — kegagalan penyimpanan (quota exceeded, private mode) diabaikan. `register()` selalu mengembalikan `success: true` meski data tidak tersimpan.

**Langkah Reproduksi (sebelum perbaikan):**
1. Blokir localStorage di browser settings
2. Daftar akun baru → muncul pesan sukses
3. Refresh halaman → akun tidak ada karena tidak pernah tersimpan

**Perbaikan yang Diterapkan:**
- `saveAccounts()` diubah dari `void` menjadi `boolean` — return `true` jika berhasil, `false` jika gagal
- `register()` memeriksa return value: jika `false` → return `{ success: false, message: 'Gagal menyimpan data akun...' }`

**Hasil Setelah Perbaikan:**
- ✅ Kegagalan storage dilaporkan ke pengguna dengan pesan yang jelas
- ✅ `register()` tidak lagi false-positive `success: true`

---

## S2-03-06 — Toast "Sinkronisasi Berhasil" Meski Offline (P2)

**File:** `src/App.tsx`

**Deskripsi Temuan:**
`handleSyncCloud()` menampilkan toast "Sinkronisasi Cloud Firestore berhasil!" bahkan ketika `fetchStudentsFromCloud()` mengembalikan data lokal fallback (saat internet mati atau Firestore tidak terhubung).

**Langkah Reproduksi (sebelum perbaikan):**
1. Matikan koneksi internet
2. Login sebagai guru → klik tombol sinkronisasi
3. Muncul "Sinkronisasi berhasil!" padahal data adalah local fallback

**Perbaikan yang Diterapkan:**
- Periksa `navigator.onLine` setelah sync berhasil
- Jika online → tampilkan "✅ Sinkronisasi Cloud Firestore berhasil!"
- Jika offline → tampilkan "📴 Mode Offline: Menggunakan data lokal (Firestore tidak terhubung)"
- Catch block: "❌ Gagal menyinkronkan data"

**Hasil Setelah Perbaikan:**
- ✅ Mode offline → toast jujur menampilkan status offline
- ✅ Mode online → toast sukses seperti biasa

---

## S2-03-07 — Modal Tanpa Escape Key & Focus Trap (P2)

**File:** `src/features/home/LabSheetModal.tsx`

**Deskripsi Temuan:**
- `LabSheetModal` tidak merespons tombol `Escape` untuk menutup
- Fokus keyboard bisa keluar dari dialog, melanggar WCAG 2.1 success criterion 2.1.2

**Langkah Reproduksi (sebelum perbaikan):**
1. Buka Lembar Belajar
2. Tekan `Escape` → modal tidak menutup
3. Tab beberapa kali → fokus keluar ke konten di belakang modal

**Perbaikan yang Diterapkan:**
- Tambah `useEffect` dengan `document.addEventListener('keydown', handleKeyDown)`
- `handleKeyDown`: jika `e.key === 'Escape'` → panggil `onClose()`
- Focus trap: jika Tab di elemen terakhir → pindah ke elemen pertama (dan sebaliknya)
- Tambah `ref={dialogRef}` dan `tabIndex={-1}` pada root dialog
- `aria-label` ditambah: `"Lembar Belajar Dasar Elektrokimia"`

**Hasil Setelah Perbaikan:**
- ✅ Tekan `Escape` → modal tertutup
- ✅ Tab cycling tetap di dalam modal
- ✅ Fokus otomatis ke dialog saat terbuka

---

## S2-03-08 — Horizontal Overflow 408px pada Viewport 375px (P2)

**File:** `src/styles/dashboard.css`

**Deskripsi Temuan:**
Pada viewport 375px (iPhone SE), `scrollWidth` body mencapai 408px karena kombinasi:
- Sidebar tetap 60px
- `.dashboard-main` tanpa `max-width: calc(100vw - 60px)`
- Tidak ada `overflow-x: hidden` pada `html`/`body`

**Langkah Reproduksi (sebelum perbaikan):**
1. Buka DevTools → pilih device iPhone SE (375px)
2. Login → perhatikan horizontal scrollbar muncul
3. Console: `document.body.scrollWidth` → 408

**Perbaikan yang Diterapkan:**
- `.dashboard-layout`: tambah `max-width: 100vw; overflow-x: hidden;`
- `@media (max-width: 768px) .dashboard-main`: tambah `max-width: calc(100vw - 60px); overflow-x: hidden; box-sizing: border-box;`
- `html, body` global: `max-width: 100vw; overflow-x: hidden; box-sizing: border-box;`
- `*, *::before, *::after`: `box-sizing: border-box;`
- `@media (max-width: 480px)` tabel: `overflow-x: auto; min-width: 480px;`

**Hasil Setelah Perbaikan:**
- ✅ `document.body.scrollWidth` = 375px pada viewport 375px
- ✅ Tidak ada horizontal scrollbar
- ✅ Tabel dapat di-scroll horizontal secara independen

---

## Ringkasan Status Perbaikan

| ID | Prioritas | Deskripsi | Status |
|----|-----------|-----------|--------|
| S2-03-01 | P1 | Password plaintext di localStorage | ✅ FIXED |
| S2-03-02 | P1 | Isolasi data siswa berdasarkan UID | ✅ FIXED |
| S2-03-03 | P1 | Draft kuis & riwayat percobaan | ✅ FIXED |
| S2-03-04 | P1 | Otorisasi kode akun guru | ✅ FIXED |
| S2-03-05 | P2 | Error penyimpanan localStorage | ✅ FIXED |
| S2-03-06 | P2 | Status toast sinkronisasi jujur | ✅ FIXED |
| S2-03-07 | P2 | Escape key & focus trap modal | ✅ FIXED |
| S2-03-08 | P2 | Overflow mobile 375px | ✅ FIXED |

**Verifikasi Build:**
```
npm run lint → Found 0 warnings and 0 errors
npm run build → ✓ built in 1.11s
```
