# Agent Guidelines & Project Instructions (AGENT.md)

**Proyek:** *ElectroLab — Kursus dan Laboratorium Virtual Sel Elektrolisis Kelas XII SMA*  
**Dokumen acuan utama:** `prd-2.md`  
**Status:** Panduan operasional agen untuk implementasi, pengujian, dan pemeliharaan aplikasi.

---

## 1. Peran, Identitas, dan Misi Agen

### Peran
Bertindak sebagai **Senior Frontend Engineer, UI/UX Designer, dan Kurator Konten Pendidikan Kimia SMA**.

### Misi
Mengembangkan ElectroLab, aplikasi pembelajaran kimia berbasis web untuk siswa kelas XII/Fase F, yang memadukan kursus terstruktur, simulasi sel elektrolisis, visualisasi ion dan elektron, prediksi produk elektrolisis, kalkulator Hukum Faraday, latihan adaptif, serta pelacakan progres.

### Prinsip utama
1. **Akurasi kimia:** Definisi, arah ion, polaritas elektroda, persamaan reaksi, produk elektrolisis, dan perhitungan Faraday harus konsisten dengan kondisi yang dinyatakan.
2. **Belajar melalui interaksi:** Utamakan diagram, simulasi yang dapat dikendalikan, pemilihan skenario, dan umpan balik bermakna daripada halaman teks panjang.
3. **Penjelasan bertahap:** Hubungkan pengamatan makroskopis, model partikel, dan persamaan simbolik.
4. **Desain yang tenang dan fungsional:** Hindari tampilan generik, dekorasi berlebihan, gradien tanpa fungsi, dan animasi yang mengganggu pembelajaran.
5. **Aksesibilitas dan responsivitas:** Informasi tetap tersedia tanpa animasi, warna selalu disertai label, dan kontrol dapat digunakan dengan keyboard serta layar kecil.
6. **Implementasi yang dapat diuji:** Pisahkan logika kimia dari UI dan uji setiap perhitungan dengan contoh yang hasilnya diketahui.
7. **Jujur terhadap spesifikasi:** Jika PRD tidak menetapkan suatu detail, jangan menganggapnya sebagai persyaratan pasti. Pilih solusi sederhana dan dokumentasikan asumsi.

---

## 2. Sumber Kebenaran dan Prioritas Instruksi

- `prd-2.md` adalah sumber utama kebutuhan produk, alur pembelajaran, fitur, dan kriteria penerimaan.
- `AGENT.md` ini mengatur cara agen bekerja dan standar implementasi.
- Jika instruksi bertentangan, ikuti PRD untuk kebutuhan produk dan dokumen ini untuk proses kerja, kecuali pengguna memberi instruksi terbaru secara eksplisit.
- Jangan membawa konten atau struktur proyek StoiLab/stoikiometri ke ElectroLab, kecuali ada permintaan eksplisit.
- Jangan mengklaim fitur sudah selesai, diuji, atau akurat sebelum implementasi dan pengujian benar-benar dilakukan.
- Jika kondisi kimia belum cukup spesifik untuk menentukan produk elektrolisis, tampilkan peringatan/asumsi atau minta konteks tambahan; jangan menyajikan hasil sebagai aturan universal.

---

## 3. Identitas Produk dan Pengguna

**Nama produk:** ElectroLab  
**Jenis:** Kursus kimia dan laboratorium virtual berbasis web  
**Materi:** Sel elektrolisis dan penerapannya  
**Sasaran utama:** Siswa SMA kelas XII/Fase F Kurikulum Merdeka  
**Pengguna pendukung:** Guru kimia dan pengembang bahan ajar

### Tujuan pembelajaran
Aplikasi membantu siswa:
- membedakan sel volta dan sel elektrolisis;
- mengidentifikasi katode, anode, sumber arus, kation, dan anion;
- menjelaskan arah aliran elektron pada rangkaian luar dan pergerakan ion di elektrolit;
- memprediksi produk elektrolisis berdasarkan jenis elektrolit, keadaan zat, bahan elektroda, konsentrasi, dan kondisi relevan;
- menyusun persamaan setengah reaksi dan reaksi total yang setara;
- menerapkan Hukum Faraday untuk menghitung massa zat atau jumlah zat/volume gas bila asumsi yang diperlukan tersedia;
- menganalisis data percobaan dan mengevaluasi pemahamannya melalui latihan.

---

## 4. Teknologi dan Standar Implementasi

### Stack
- **Framework:** React 19 dengan functional components dan Hooks.
- **Build tool/dev server:** Vite.
- **Bahasa:** JavaScript modern dengan ESM; gunakan JSX untuk komponen React.
- **Styling:** CSS modern dengan CSS Variables, Flexbox, Grid, dan animasi ringan.
- **Visualisasi:** SVG, CSS, atau Canvas sesuai kebutuhan; pilih pendekatan yang paling sederhana dan mudah diakses.
- **Penyimpanan:** `localStorage` untuk progres, riwayat latihan, dan preferensi jika tersedia.
- **Pengujian:** Gunakan tooling yang tersedia di repositori. Jangan menambahkan dependensi besar tanpa alasan yang jelas.

### Ketentuan kode
- Nama file, komponen, fungsi, variabel, dan komentar teknis menggunakan bahasa Inggris.
- Teks yang terlihat oleh pengguna menggunakan bahasa Indonesia.
- Gunakan komponen kecil yang memiliki tanggung jawab jelas.
- Pisahkan fungsi perhitungan kimia dari komponen presentasi.
- Hindari duplikasi rumus dan aturan kimia pada beberapa komponen.
- Validasi input pengguna dan tampilkan pesan kesalahan yang dapat dipahami.
- Jangan mengabaikan error linter, warning React, atau kegagalan build.
- Jangan menggunakan Tailwind CSS atau framework utility CSS lain kecuali diminta secara eksplisit.
- Jangan menambahkan backend, akun, analitik, atau pengumpulan data pribadi tanpa persetujuan pengguna dan perubahan kebutuhan yang jelas.

---

## 5. Arsitektur yang Disarankan

Sesuaikan struktur dengan repositori yang sudah ada. Jangan merombak proyek secara besar-besaran jika struktur yang ada masih layak.

```text
src/
├── components/
│   ├── common/          # Button, Card, Modal, Tooltip, ProgressBar
│   ├── chemistry/       # FormulaRenderer, ReactionEquation, IonDiagram
│   └── layout/          # Header, CourseNavigation, ProgressOverview, Footer
├── features/
│   ├── chapter1-basics/ # Redoks, sel volta vs elektrolisis, komponen
│   ├── chapter2-circuit/# Rangkaian dan simulator pergerakan ion
│   ├── chapter3-products/# Pemilihan elektrolit/elektroda dan produk
│   ├── chapter4-faraday/# Kalkulator Hukum Faraday
│   └── chapter5-evaluation/ # Evaluasi akhir dan hasil belajar
├── context/             # Course progress dan preferensi bila diperlukan
├── hooks/               # useLocalStorage, useCourseProgress
├── data/                # Chapter data, quiz bank, badges, constants
├── utils/
│   ├── electrolysis.js  # Aturan skenario dan logika produk yang eksplisit
│   ├── faraday.js       # Fungsi perhitungan Hukum Faraday
│   └── storage.js       # Wrapper penyimpanan yang aman
├── styles/
│   ├── variables.css
│   ├── typography.css
│   ├── components.css
│   └── animations.css
├── App.jsx
├── index.css
└── main.jsx
```

### Batas tanggung jawab modul
- `data/`: konten dan skenario terverifikasi, bukan logika UI.
- `utils/`: fungsi murni yang dapat diuji secara terpisah.
- `features/`: alur dan interaksi khusus setiap bab.
- `components/`: komponen reusable tanpa pengetahuan berlebihan tentang alur kursus.
- `context/` atau hooks: hanya state yang benar-benar dibutuhkan lintas komponen.

---

## 6. Alur Kursus Wajib

Jaga urutan perjalanan belajar sesuai PRD:

1. **Bab 1 — Dasar Elektrokimia**
   - Reaksi oksidasi dan reduksi.
   - Perbandingan sel volta dan sel elektrolisis.
   - Komponen sel elektrolisis.
   - Kuis cek pemahaman.

2. **Bab 2 — Cara Kerja Sel Elektrolisis**
   - Sumber arus searah dan rangkaian.
   - Katode, anode, kation, dan anion.
   - Arah aliran elektron dan pergerakan ion.
   - Simulator rangkaian dan kuis.

3. **Bab 3 — Prediksi Reaksi dan Produk Elektrolisis**
   - Elektrolisis lelehan.
   - Elektrolisis larutan berair dengan elektroda inert.
   - Elektrolisis dengan elektroda aktif.
   - Pengaruh jenis ion dan kondisi larutan.
   - Simulator pemilihan elektrolit dan elektroda.

4. **Bab 4 — Hukum Faraday**
   - Muatan listrik, arus, dan waktu.
   - Hubungan muatan dengan mol elektron.
   - Massa endapan dan volume gas sesuai reaksi.
   - Kalkulator dengan langkah perhitungan.

5. **Bab 5 — Penerapan dan Evaluasi Akhir**
   - Penyepuhan logam.
   - Pemurnian logam dan produksi zat.
   - Analisis data percobaan.
   - Evaluasi komprehensif, pembahasan, rekomendasi belajar, dan lencana.

Setiap modul setidaknya menyediakan tujuan pembelajaran, prasyarat bila relevan, penjelasan konsep, contoh/visualisasi, aktivitas atau latihan, dan rangkuman.

---

## 7. Standar Akurasi Kimia

### 7.1 Aturan dasar
- Oksidasi adalah pelepasan elektron; reduksi adalah penerimaan elektron.
- **Anode = tempat oksidasi.**
- **Katode = tempat reduksi.**
- Dalam sel elektrolisis, katode terhubung ke kutub negatif sumber arus dan anode ke kutub positif.
- Kation bergerak menuju katode; anion bergerak menuju anode.
- Elektron digambarkan mengalir pada rangkaian luar, bukan bergerak bebas melalui larutan elektrolit. Penghantaran muatan di larutan dijelaskan melalui pergerakan ion.
- Label, arah panah, persamaan, dan penjelasan harus saling konsisten.

### 7.2 Prediksi produk elektrolisis
- Jangan menentukan produk hanya dari nama elektrolit.
- Pertimbangkan keadaan elektrolit (lelehan atau larutan berair), spesies ion, bahan elektroda (inert atau aktif), konsentrasi, pH, dan kondisi relevan yang ditetapkan dalam skenario.
- Setiap skenario harus menyatakan kondisi/asumsi yang cukup untuk mendukung prediksi.
- Bedakan contoh pembelajaran dari aturan yang berlaku universal.
- Untuk larutan CuSO₄ dengan elektroda inert, contoh reaksi anode berupa oksidasi air dapat digunakan jika kondisi pembelajaran dinyatakan.
- Untuk CuSO₄ dengan elektroda tembaga, tampilkan pengendapan Cu di katode dan pelarutan Cu di anode sesuai skenario.
- Untuk NaCl berair, jangan menganggap produk selalu sama untuk semua konsentrasi dan kondisi.
- Untuk NaCl leleh, tampilkan reaksi yang sesuai dengan skenario lelehan, bukan larutan berair.

### 7.3 Persamaan reaksi
- Setiap persamaan setengah reaksi harus setara dalam jumlah atom dan muatan.
- Elektron harus muncul pada sisi yang tepat: sebagai pereaksi untuk reduksi dan sebagai produk untuk oksidasi.
- Reaksi total hanya ditampilkan setelah elektron dapat saling dihilangkan dan persamaan telah diperiksa.
- Gunakan notasi fase bila relevan, misalnya `(s)`, `(l)`, `(g)`, dan `(aq)`.
- Tampilkan rumus dengan subskrip/superskrip yang terbaca, termasuk muatan ion dan elektron.
- Jangan membuat klaim bahwa persamaan telah diverifikasi otomatis jika belum ada pemeriksaan atau pengujian yang sesuai.

### 7.4 Hukum Faraday
Gunakan konstanta Faraday `F = 96.485 C mol⁻¹` sesuai PRD, dan tampilkan nilai yang digunakan pada antarmuka.

- Muatan listrik: `Q = I × t`
- Mol elektron: `n(e⁻) = Q / F`
- Massa zat yang terbentuk/terendapkan untuk reaksi yang sesuai: `m = (M × I × t) / (z × F)`

Keterangan:
- `I`: kuat arus dalam ampere.
- `t`: waktu dalam sekon.
- `M`: massa molar dalam g/mol.
- `z`: jumlah elektron dalam persamaan setengah reaksi per satu satuan zat yang terbentuk.
- `F`: konstanta Faraday dalam C/mol.

Ketentuan:
- Jangan mencampuradukkan simbol `n` untuk mol elektron dengan koefisien/jumlah elektron reaksi; gunakan nama variabel yang jelas di kode.
- Validasi nilai arus, waktu, massa molar, dan jumlah elektron agar bernilai positif dan masuk akal.
- Tampilkan rumus, substitusi angka, satuan, hasil antara, dan hasil akhir.
- Gunakan pembulatan yang konsisten dan jelaskan bila hasil merupakan nilai pendekatan.
- Perhitungan volume gas hanya dilakukan bila reaksi, stoikiometri, dan kondisi volume gas dinyatakan dengan jelas.
- Jika efisiensi arus disediakan, jadikan pilihan terpisah dan jelaskan dampaknya terhadap hasil.
- Uji kalkulator dengan perhitungan manual independen.

---

## 8. Spesifikasi Interaksi dan Simulasi

### Simulator rangkaian
Wajib menyediakan:
- wadah elektrolit, katode, anode, sumber arus DC, kabel, kation, dan anion;
- tombol **Mulai**, **Jeda**, **Ulangi**, dan **Lihat Penjelasan**;
- panel fungsi komponen saat komponen dipilih;
- panah dan label arah yang tetap terbaca saat animasi berhenti;
- representasi pergerakan ion di larutan dan aliran elektron di rangkaian luar yang tidak bertentangan dengan konsep.

### Laboratorium virtual produk elektrolisis
- Pengguna memilih skenario yang tersedia.
- Pengguna menjalankan dan mengatur ulang simulasi.
- Tampilkan proses katode dan anode, persamaan setengah reaksi, reaksi total bila sesuai, serta pengamatan makroskopis.
- Sediakan **Mengapa Produk Ini Terbentuk?** untuk menjelaskan alasan pemilihan reaksi.
- Cantumkan asumsi/kondisi skenario di area yang mudah terlihat.
- Jika suatu kombinasi belum didukung atau kondisinya tidak cukup, beri pesan yang jelas daripada mengarang produk.

### Kalkulator dan latihan
- Input mempunyai label, satuan, batas nilai, dan pesan validasi.
- Setiap jawaban kuis memperoleh umpan balik yang spesifik dan penjelasan konsep.
- Soal hitungan menampilkan langkah penyelesaian, bukan hanya jawaban akhir.
- Petunjuk bertahap dapat digunakan sebelum pembahasan lengkap.
- Sediakan tingkat soal sesuai PRD: Level 1 konsep/komponen, Level 2 prediksi dan setengah reaksi, Level 3 analisis produk, Level 4 Hukum Faraday dan interpretasi data.

---

## 9. UI/UX dan Bahasa

### Visual
- Tema **Clean Academic Light Mode**.
- Latar utama: `#F8FAFC` dan `#FFFFFF`.
- Aksen sains: biru `#0284C7` atau `#2563EB`; cyan `#06B6D4`.
- Oranye/merah untuk anode/oksidasi dan biru/hijau untuk katode/reduksi, selalu disertai teks atau simbol.
- Amber untuk petunjuk dan peringatan.
- Gunakan tipografi sans-serif yang jelas; Inter atau Plus Jakarta Sans dapat digunakan bila tersedia.
- Jaga ruang kosong, hierarki informasi, kontras, dan konsistensi antarmodul.
- Responsif mulai dari layar ponsel sekitar 360 px hingga desktop.
- Hormati preferensi reduced motion bila animasi digunakan.

### Bahasa konten
- Bahasa Indonesia baku yang komunikatif dan sesuai siswa SMA.
- Gunakan istilah secara konsisten: oksidasi, reduksi, anode, katode, elektrolit, kation, anion, persamaan setengah reaksi, dan Hukum Faraday.
- Hindari paragraf panjang yang tidak membantu tindakan belajar.
- Gunakan analogi hanya jika membantu dan jangan sampai menggantikan penjelasan kimia yang tepat.
- Hindari pembuka klise, jargon berlebihan, dan klaim seperti “revolusioner” tanpa dasar.
- Pastikan setiap instruksi aktivitas menjelaskan apa yang perlu dilakukan dan apa yang perlu diamati.

---

## 10. State, Progres, dan Privasi

Gunakan `localStorage` untuk menyimpan progres di browser yang sama jika fitur penyimpanan tersedia. Struktur key dapat mengikuti pola berikut, dengan versi skema:

- `electrolab_progress_v1`: bab selesai, bab aktif, dan milestone.
- `electrolab_quiz_history_v1`: skor, jawaban, dan waktu pengerjaan.
- `electrolab_gamification_v1`: XP dan lencana.
- `electrolab_lab_state_v1`: input/keadaan simulator yang relevan.
- `electrolab_user_settings_v1`: preferensi seperti suara dan petunjuk.

Aturan:
- Gunakan wrapper terpusat untuk membaca/menulis penyimpanan.
- Lindungi parsing JSON dengan `try...catch`.
- Sediakan nilai default jika data hilang, rusak, atau penyimpanan tidak tersedia.
- Jangan membuat aplikasi gagal hanya karena `localStorage` diblokir.
- Sinkronkan state React setelah perubahan sehingga progres, navigasi, dan lencana langsung diperbarui.
- Jangan menyimpan data pribadi yang tidak diperlukan.
- Jelaskan bahwa progres lokal tidak otomatis tersinkron lintas perangkat.
- Jangan mengklaim penyimpanan berhasil jika operasi gagal.

---

## 11. Alur Kerja Agen untuk Setiap Tugas

1. **Baca konteks proyek:** Periksa struktur repositori, `package.json`, dan kode yang sudah ada sebelum mengubahnya.
2. **Cocokkan dengan PRD:** Tentukan bab, fitur, persyaratan fungsional, dan kriteria penerimaan yang relevan.
3. **Tentukan lingkup:** Implementasikan satu irisan fitur yang dapat dijalankan dan diuji; hindari perubahan tak terkait.
4. **Rancang logika terlebih dahulu:** Untuk perhitungan kimia, buat fungsi murni di `utils/` dan uji dengan contoh yang diketahui.
5. **Bangun UI modular:** Hubungkan fungsi teruji ke komponen dengan state dan validasi yang jelas.
6. **Periksa aksesibilitas dan responsivitas:** Label kontrol, navigasi keyboard, kontras, ukuran layar, dan alternatif nonanimasi.
7. **Uji penyimpanan:** Periksa skenario data kosong, data rusak, dan penyimpanan tidak tersedia.
8. **Jalankan pemeriksaan proyek:** Gunakan skrip yang benar-benar tersedia, misalnya lint, test, dan build. Jangan mengarang hasil.
9. **Perbaiki regresi:** Pastikan fitur yang sudah ada tidak rusak.
10. **Laporkan hasil:** Sebutkan file yang dibuat/diubah, fitur yang selesai, pengujian yang dijalankan, hasilnya, dan pekerjaan yang belum selesai.

Jika belum dapat menjalankan aplikasi atau pengujian, nyatakan keterbatasan tersebut secara eksplisit.

---

## 12. Strategi Pengujian dan Kriteria Penerimaan

Gunakan daftar berikut sebelum menyatakan fitur selesai.

### Konten dan kimia
- [ ] Definisi oksidasi/reduksi konsisten.
- [ ] Anode selalu tempat oksidasi dan katode tempat reduksi.
- [ ] Polaritas elektroda pada sel elektrolisis benar.
- [ ] Kation menuju katode dan anion menuju anode.
- [ ] Elektron hanya ditampilkan pada rangkaian luar.
- [ ] Produk elektrolisis sesuai kondisi skenario yang dinyatakan.
- [ ] Persamaan setengah reaksi setara atom dan muatan.
- [ ] Reaksi total setara dan elektron dapat dihilangkan.
- [ ] Kalkulator Faraday cocok dengan perhitungan manual dan satuannya benar.

### Fungsi dan pengalaman pengguna
- [ ] Pengguna dapat membuka modul dan memahami progres.
- [ ] Setiap modul memiliki tujuan, materi, contoh/visual, latihan, dan rangkuman.
- [ ] Tombol mulai, jeda, ulangi, reset, petunjuk, dan pembahasan bekerja sesuai fitur yang tersedia.
- [ ] Jawaban latihan menghasilkan umpan balik dan pembahasan.
- [ ] Progres tetap ada setelah halaman dimuat ulang pada browser yang sama jika storage tersedia.
- [ ] Tampilan berfungsi pada ponsel, tablet, dan desktop.
- [ ] Informasi penting tidak bergantung pada warna atau animasi saja.
- [ ] Pesan error dan validasi input mudah dipahami.
- [ ] Lint, test, dan build yang tersedia telah dijalankan atau keterbatasannya dilaporkan.

---

## 13. Roadmap Implementasi

Kerjakan sesuai urutan milestone PRD:

1. Sistem desain, header, navigasi, beranda, dan indikator progres.
2. Bab 1: dasar redoks, perbandingan sel volta/elektrolisis, komponen, dan kuis.
3. Bab 2: simulator rangkaian serta pergerakan ion dan penjelasan komponen.
4. Bab 3: laboratorium virtual untuk lelehan dan larutan dengan variasi elektroda.
5. Bab 4: kalkulator Hukum Faraday beserta langkah dan validasi input.
6. Bab 5: latihan tiap bab, evaluasi akhir, umpan balik, XP, dan lencana.
7. Pengujian menyeluruh: akurasi kimia, perhitungan, responsivitas, aksesibilitas, penyimpanan, dan performa.

Jangan melewati milestone dengan membuat tombol atau menu yang tampak aktif tetapi belum memiliki perilaku. Jika fitur belum diimplementasikan, tampilkan status yang jujur atau jangan tampilkan kontrol tersebut.

---

## 14. Format Laporan Penyelesaian Tugas

Setelah mengerjakan tugas, laporkan dengan format ringkas:

- **Tujuan:** kebutuhan PRD yang ditangani.
- **Perubahan:** file dan komponen yang dibuat/diubah.
- **Perilaku:** cara fitur bekerja dari sisi pengguna.
- **Pengujian:** perintah yang dijalankan dan hasil aktual.
- **Catatan:** asumsi, batasan, dan pekerjaan lanjutan.

Jangan menyatakan “selesai sepenuhnya” jika masih ada kriteria penerimaan yang belum dipenuhi.

---

**Akhir AGENT.md — ElectroLab**
