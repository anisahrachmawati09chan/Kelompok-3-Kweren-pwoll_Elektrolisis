# Product Requirements Document (PRD)
## Web Pembelajaran Kimia: Sel Elektrolisis Interaktif Kelas 12 SMA

**Proyek:** *ElectroLab — Kursus dan Laboratorium Virtual Sel Elektrolisis*  
**Versi Dokumen:** 1.0  
**Status:** Rancangan Siap Dikembangkan

---

### 1. Ringkasan Eksekutif & Tujuan Produk

*ElectroLab* adalah platform pembelajaran kimia digital berbasis web untuk siswa SMA Kelas 12 (Fase F Kurikulum Merdeka). Produk ini menyajikan materi sel elektrolisis melalui kursus berurutan, animasi perpindahan ion dan elektron, simulasi elektrolisis, serta latihan dengan umpan balik dan pembahasan langkah demi langkah.

Sel elektrolisis dapat terasa abstrak karena melibatkan proses yang tidak terlihat secara langsung, seperti pergerakan ion dalam larutan, aliran elektron melalui rangkaian luar, dan reaksi redoks pada elektroda. ElectroLab membantu siswa menghubungkan pengamatan makroskopis—misalnya terbentuknya gas atau endapan—dengan representasi partikel dan persamaan reaksi.

#### Tujuan utama
1. Membantu siswa membedakan sel elektrolisis dan sel volta berdasarkan sumber energi, arah reaksi, dan perubahan energi.
2. Membantu siswa mengidentifikasi katode, anode, arah aliran elektron, serta pergerakan kation dan anion.
3. Membimbing siswa memprediksi reaksi di katode dan anode berdasarkan jenis elektrolit, elektroda, serta kondisi larutan.
4. Memvisualisasikan produk elektrolisis lelehan dan larutan berair melalui simulasi yang dapat diubah parameternya.
5. Mengembangkan kemampuan menulis persamaan setengah reaksi, persamaan reaksi total, dan menerapkan Hukum Faraday pada perhitungan elektrolisis.
6. Menyediakan evaluasi formatif, umpan balik instan, dan pembahasan yang dapat diakses secara mandiri.

---

### 2. Sasaran Pengguna & Kebutuhan (User Persona)

- **Siswa Kelas 12 SMA:** Membutuhkan penjelasan bertahap, ilustrasi yang jelas, simulasi interaktif, contoh soal, dan latihan dengan pembahasan.
- **Guru Kimia SMA:** Membutuhkan media demonstrasi digital untuk menjelaskan proses elektrolisis, membandingkan kondisi eksperimen, dan memeriksa pemahaman siswa.
- **Pengguna pendukung:** Sekolah atau pengembang bahan ajar yang membutuhkan materi terstruktur dan dapat digunakan melalui browser tanpa instalasi aplikasi khusus.

---

### 3. Konsep Desain & Identitas Visual (UI/UX)

Platform menggunakan tema **Clean Academic Light Mode** yang mengutamakan keterbacaan, kontras, dan fokus pada proses elektrokimia.

- **Palet warna:**
  - Latar utama putih dan abu-abu kebiruan lembut (`#F8FAFC`, `#FFFFFF`).
  - Aksen utama biru sains (`#0284C7` / `#2563EB`).
  - Cyan untuk larutan dan ion bergerak (`#06B6D4`).
  - Warna oranye atau merah untuk anode dan penanda oksidasi.
  - Warna biru atau hijau untuk katode dan penanda reduksi; warna selalu disertai label agar informasi tidak hanya bergantung pada warna.
  - Amber untuk peringatan, petunjuk, atau kondisi yang perlu diperhatikan.
- **Tipografi:** Sans-serif modern, misalnya Inter atau Plus Jakarta Sans, dengan hierarki judul dan isi yang jelas.
- **Notasi kimia:** Mendukung subskrip dan superskrip, misalnya `Cu²⁺`, `Cl⁻`, `2H₂O`, `O₂`, dan notasi elektron `e⁻`.
- **Komponen visual:** Kartu materi, diagram rangkaian listrik, label elektroda, animasi partikel, panel persamaan reaksi, serta grafik atau indikator perubahan hasil simulasi.
- **Responsivitas:** Tata letak menyesuaikan layar ponsel, tablet, dan desktop. Kontrol simulasi harus tetap dapat digunakan pada layar kecil.
- **Aksesibilitas:** Teks cukup kontras, tombol memiliki label, animasi tidak menjadi satu-satunya sumber informasi, dan pengguna dapat membaca penjelasan statis jika animasi tidak berjalan.

---

### 4. Struktur Arsitektur & Alur Navigasi (Sequential Course Journey)

Aplikasi menggunakan alur kursus berurutan. Siswa dapat mengikuti setiap bagian dari konsep dasar sampai evaluasi akhir. Progres pembelajaran dan hasil latihan disimpan secara lokal pada browser bila fitur penyimpanan tersedia.

```text
[ Beranda / Peta Belajar ElectroLab ]
          |
          v
[ Bab 1: Dasar Elektrokimia ]
  |-- 1.1 Reaksi Oksidasi dan Reduksi
  |-- 1.2 Sel Volta dan Sel Elektrolisis
  |-- 1.3 Komponen Sel Elektrolisis
  |-- Kuis Cek Pemahaman Bab 1
          |
          v
[ Bab 2: Cara Kerja Sel Elektrolisis ]
  |-- 2.1 Sumber Arus Searah dan Rangkaian
  |-- 2.2 Katode, Anode, Kation, dan Anion
  |-- 2.3 Arah Aliran Elektron dan Pergerakan Ion
  |-- Simulator Rangkaian Sel Elektrolisis
  |-- Kuis Cek Pemahaman Bab 2
          |
          v
[ Bab 3: Prediksi Reaksi dan Produk Elektrolisis ]
  |-- 3.1 Elektrolisis Lelehan
  |-- 3.2 Elektrolisis Larutan Berair dengan Elektroda Inert
  |-- 3.3 Elektrolisis Larutan dengan Elektroda Aktif
  |-- 3.4 Pengaruh Jenis Ion dan Kondisi Larutan
  |-- Simulator Pemilihan Elektrolit dan Elektroda
  |-- Kuis Cek Pemahaman Bab 3
          |
          v
[ Bab 4: Hukum Faraday ]
  |-- 4.1 Muatan Listrik, Arus, dan Waktu
  |-- 4.2 Hubungan Muatan dengan Mol Elektron
  |-- 4.3 Menghitung Massa Endapan dan Volume Gas
  |-- Kalkulator Hukum Faraday
  |-- Kuis Cek Pemahaman Bab 4
          |
          v
[ Bab 5: Penerapan dan Evaluasi Akhir ]
  |-- 5.1 Penyepuhan Logam (Electroplating)
  |-- 5.2 Pemurnian Logam dan Produksi Zat
  |-- 5.3 Analisis Data Percobaan
  |-- Ujian Komprehensif
  |-- Hasil, Pembahasan, dan Lencana Prestasi
```

---

### 5. Detail Spesifikasi Fitur Utama

#### 5.1. Modul Konsep Dasar Elektrokimia (Bab 1)

- Menjelaskan oksidasi sebagai pelepasan elektron dan reduksi sebagai penerimaan elektron.
- Menampilkan perbandingan sel volta dan sel elektrolisis, mencakup spontanitas reaksi, sumber energi, dan konversi energi.
- Menegaskan aturan penting sel elektrolisis:
  - Katode merupakan tempat reduksi dan terhubung ke kutub negatif sumber arus.
  - Anode merupakan tempat oksidasi dan terhubung ke kutub positif sumber arus.
- Menyediakan diagram komponen utama: sumber arus searah, dua elektroda, elektrolit, wadah, dan kabel penghubung.
- Menyediakan pertanyaan cek cepat untuk menguji pemahaman istilah sebelum siswa masuk ke simulasi.

#### 5.2. Simulator Rangkaian Sel Elektrolisis Interaktif (Bab 2)

- Menampilkan wadah elektrolit, katode, anode, sumber arus DC, kabel, kation, dan anion.
- Memvisualisasikan arah pergerakan ion:
  - Kation bergerak menuju katode.
  - Anion bergerak menuju anode.
- Memvisualisasikan aliran elektron pada rangkaian luar secara konsisten dengan sumber arus dan reaksi elektroda.
- Pengguna dapat menekan tombol **Mulai**, **Jeda**, **Ulangi**, dan **Lihat Penjelasan**.
- Saat siswa memilih suatu komponen, panel informasi menjelaskan fungsi komponen tersebut.
- Label dan panah arah tetap tersedia agar simulasi dapat dipahami tanpa mengandalkan animasi.
- Simulator tidak boleh menggambarkan elektron bergerak bebas melalui larutan elektrolit; penghantaran muatan di larutan digambarkan melalui pergerakan ion.

#### 5.3. Laboratorium Virtual Produk Elektrolisis (Bab 3)

Pengguna memilih jenis elektrolit, keadaan zat, dan jenis elektroda. Sistem menampilkan ion yang relevan, prediksi reaksi di masing-masing elektroda, produk yang terbentuk, dan alasan pemilihan reaksinya.

**Skenario simulasi awal yang disarankan:**

1. **Lelehan NaCl dengan elektroda inert**
   - Katode: `Na⁺ + e⁻ → Na`
   - Anode: `2Cl⁻ → Cl₂ + 2e⁻`
   - Reaksi total: `2NaCl(l) → 2Na(l) + Cl₂(g)`

2. **Larutan CuSO₄ dengan elektroda inert**
   - Contoh reaksi katode: `Cu²⁺ + 2e⁻ → Cu(s)`
   - Pada anode, oksidasi air dapat menghasilkan oksigen dalam kondisi yang sesuai: `2H₂O(l) → O₂(g) + 4H⁺(aq) + 4e⁻`
   - Sistem harus menyertakan catatan bahwa produk elektrolisis larutan dipengaruhi oleh jenis ion, konsentrasi, bahan elektroda, pH, dan kondisi eksperimen; contoh ditujukan untuk kondisi pembelajaran yang dinyatakan secara eksplisit.

3. **Larutan CuSO₄ dengan elektroda tembaga**
   - Katode: `Cu²⁺ + 2e⁻ → Cu(s)`
   - Anode: `Cu(s) → Cu²⁺ + 2e⁻`
   - Visualisasi menunjukkan tembaga mengendap di katode dan elektroda tembaga di anode larut secara bertahap.

4. **Larutan NaCl berair**
   - Skenario menjelaskan bahwa produk katode dan anode bergantung pada kondisi larutan dan elektroda.
   - Untuk larutan NaCl pekat dengan elektroda inert dalam kondisi yang sesuai, contoh reaksi dapat melibatkan pembentukan hidrogen di katode dan klorin di anode.
   - Antarmuka harus memberi label kondisi simulasi dan tidak menyajikan satu hasil sebagai aturan universal untuk semua konsentrasi atau kondisi.

**Perilaku fitur:**
- Pengguna memilih skenario dari daftar, lalu menekan **Jalankan Elektrolisis**.
- Sistem menampilkan proses di katode dan anode secara bertahap.
- Persamaan setengah reaksi, persamaan total jika sesuai, dan pengamatan makroskopis ditampilkan bersamaan.
- Tombol **Mengapa Produk Ini Terbentuk?** membuka penjelasan tentang spesies yang bersaing untuk mengalami reduksi atau oksidasi.
- Tombol **Reset Percobaan** mengembalikan simulasi ke keadaan awal.

#### 5.4. Kalkulator Hukum Faraday (Bab 4)

- Pengguna memasukkan besaran yang diketahui, misalnya kuat arus `I` dalam ampere, waktu `t` dalam sekon, jumlah elektron dalam reaksi, dan massa molar zat.
- Sistem menghitung muatan listrik dengan persamaan `Q = I × t`.
- Sistem menghitung mol elektron dengan `n(e⁻) = Q/F`, menggunakan konstanta Faraday sekitar `96.485 C mol⁻¹`.
- Untuk reaksi elektroda yang sesuai, sistem menghitung jumlah zat berdasarkan stoikiometri elektron.
- Untuk massa endapan, sistem menggunakan hubungan `m = (M × I × t)/(n × F)`, dengan:
  - `m` = massa zat yang terbentuk atau terendapkan,
  - `M` = massa molar zat,
  - `I` = kuat arus,
  - `t` = waktu,
  - `n` = jumlah elektron yang terlibat per satu satuan zat menurut persamaan setengah reaksi,
  - `F` = konstanta Faraday.
- Kalkulator menunjukkan substitusi angka, satuan, hasil antara, dan hasil akhir.
- Validasi input mencegah nilai arus, waktu, massa molar, atau koefisien elektron yang tidak masuk akal.
- Jika efisiensi arus diperhitungkan, sistem menyediakan pilihan terpisah dan menjelaskan asumsi yang digunakan.

#### 5.5. Arena Latihan, Evaluasi, dan Gamifikasi (Bab 5 dan Tiap Modul)

- **Tingkat soal:**
  - Level 1 — pemahaman konsep dan identifikasi komponen.
  - Level 2 — memprediksi reaksi elektroda dan menuliskan persamaan setengah reaksi.
  - Level 3 — analisis perbedaan produk elektrolisis berdasarkan elektrolit dan bahan elektroda.
  - Level 4 — perhitungan Hukum Faraday dan interpretasi data percobaan.
- **Jenis soal:** pilihan ganda, pilihan ganda kompleks, benar-salah, memasangkan konsep, isian persamaan reaksi, dan soal hitungan.
- **Umpan balik:** Setiap jawaban memperoleh status benar atau perlu ditinjau, penjelasan konsep, dan langkah penyelesaian untuk soal hitungan.
- **Petunjuk bertahap:** Siswa dapat meminta petunjuk konsep, petunjuk pemilihan reaksi, atau petunjuk rumus sebelum melihat pembahasan lengkap.
- **Gamifikasi:** Poin pengalaman dan lencana, misalnya *Penjelajah Redoks*, *Ahli Elektroda*, *Analis Produk Elektrolisis*, dan *Master Hukum Faraday*.
- **Pelacakan belajar:** Progres modul, nilai latihan, percobaan yang telah dijalankan, dan hasil evaluasi disimpan di browser jika penyimpanan lokal tersedia.
- **Evaluasi akhir:** Menyajikan skor total, capaian per kompetensi, materi yang perlu diulang, serta rekomendasi modul belajar kembali.

---

### 6. Persyaratan Konten Pembelajaran

- Bahasa utama: Bahasa Indonesia yang jelas dan sesuai tingkat SMA.
- Setiap modul memuat tujuan pembelajaran, prasyarat, penjelasan konsep, visualisasi atau contoh, aktivitas interaktif, latihan, dan rangkuman.
- Persamaan reaksi harus setara dalam jumlah atom dan muatan.
- Istilah **anode = tempat oksidasi** dan **katode = tempat reduksi** digunakan secara konsisten.
- Penentuan produk elektrolisis harus mempertimbangkan keadaan elektrolit (lelehan atau larutan), jenis ion, bahan elektroda, konsentrasi, dan kondisi yang relevan.
- Materi membedakan pengamatan eksperimen dari model partikel yang digunakan untuk menjelaskan pengamatan.
- Setiap skenario simulasi mencantumkan asumsi atau kondisi yang diperlukan agar hasil tidak disalahartikan sebagai aturan mutlak.
- Soal hitungan mencantumkan satuan dan konstanta yang digunakan serta memberi toleransi pembulatan yang wajar.

---

### 7. Spesifikasi Teknis & Stack Implementasi

- **Framework:** React 19 + Vite atau stack web setara yang mendukung komponen modular.
- **Styling:** CSS modern dengan CSS Variables, Flexbox/Grid, transisi ringan, dan desain responsif.
- **Penyimpanan progres:** `localStorage` untuk progres modul, hasil latihan, dan preferensi pada perangkat yang sama.
- **Rendering rumus:** Mendukung subskrip, superskrip, muatan ion, panah reaksi, dan satuan secara konsisten.
- **Simulasi:** Animasi berbasis CSS/SVG atau komponen web ringan; fungsi inti tetap dapat dipahami tanpa animasi.
- **Performa:** Materi inti dapat dimuat pada koneksi sekolah yang terbatas; aset visual dioptimalkan.
- **Privasi:** Tidak meminta data pribadi yang tidak diperlukan. Jika tidak ada backend, data progres hanya disimpan di browser pengguna.
- **Kompatibilitas:** Versi terbaru browser modern pada desktop dan perangkat seluler.
- **Keandalan perhitungan:** Fungsi kalkulator dipisahkan dari UI dan diuji menggunakan contoh dengan hasil yang diketahui.

---

### 8. Persyaratan Fungsional & Kriteria Penerimaan

| ID | Persyaratan | Kriteria penerimaan |
|---|---|---|
| FR-01 | Navigasi kursus | Pengguna dapat membuka modul dan mengetahui progres pembelajaran. |
| FR-02 | Materi konsep | Setiap modul menampilkan tujuan, materi, contoh, dan rangkuman. |
| FR-03 | Simulator rangkaian | Katode, anode, sumber arus, ion, dan arah pergerakannya diberi label dengan benar. |
| FR-04 | Simulasi produk | Pengguna dapat memilih skenario dan melihat reaksi pada kedua elektroda beserta asumsi kondisi. |
| FR-05 | Persamaan reaksi | Persamaan setengah reaksi yang ditampilkan setara atom dan muatannya. |
| FR-06 | Kalkulator Faraday | Hasil perhitungan disertai rumus, substitusi, satuan, dan langkah perhitungan. |
| FR-07 | Latihan | Sistem memberikan umpan balik dan pembahasan setelah jawaban dikirim. |
| FR-08 | Penyimpanan progres | Progres tetap tersedia setelah halaman dimuat ulang pada browser yang sama. |
| FR-09 | Desain responsif | Navigasi dan fitur utama dapat digunakan pada ponsel dan desktop. |
| FR-10 | Aksesibilitas | Informasi penting tidak disampaikan hanya melalui warna atau animasi. |

---

### 9. Roadmap Pelaksanaan (Implementation Milestones)

1. **Milestone 1:** Membangun sistem desain, header, navigasi kursus, halaman beranda, dan indikator progres.
2. **Milestone 2:** Mengembangkan Bab 1 tentang redoks, perbandingan sel volta dan sel elektrolisis, serta komponen sel.
3. **Milestone 3:** Mengembangkan simulator rangkaian sel elektrolisis dengan pergerakan ion dan penjelasan komponen.
4. **Milestone 4:** Mengembangkan laboratorium virtual untuk elektrolisis lelehan dan larutan, termasuk variasi elektroda.
5. **Milestone 5:** Mengembangkan kalkulator Hukum Faraday beserta langkah penyelesaian dan validasi input.
6. **Milestone 6:** Mengembangkan latihan per bab, evaluasi akhir, umpan balik, poin, dan lencana.
7. **Milestone 7:** Melakukan pengujian akurasi kimia, validasi persamaan reaksi, pengujian perhitungan, responsivitas, aksesibilitas, dan performa.

---

### 10. Rencana Pengujian

- **Uji konsep kimia:** Memeriksa konsistensi definisi oksidasi, reduksi, anode, katode, arah ion, dan polaritas elektroda.
- **Uji persamaan:** Memastikan setiap persamaan setengah reaksi dan reaksi total setara atom serta muatan.
- **Uji skenario:** Memastikan produk yang ditampilkan sesuai kondisi elektrolit dan bahan elektroda yang dinyatakan.
- **Uji kalkulator:** Membandingkan hasil terhadap perhitungan manual untuk beberapa nilai arus, waktu, massa molar, dan jumlah elektron.
- **Uji interaksi:** Menguji tombol mulai, jeda, ulangi, reset, petunjuk, dan pembahasan.
- **Uji penyimpanan:** Memastikan progres disimpan dan dapat dipulihkan setelah pemuatan ulang.
- **Uji perangkat:** Menguji tampilan dan interaksi pada ukuran layar ponsel, tablet, dan desktop.
- **Uji aksesibilitas:** Memastikan label, kontras, dan informasi nonanimasi dapat dipahami.

---

### 11. Indikator Keberhasilan Produk

- Siswa dapat mengidentifikasi katode dan anode serta menghubungkan masing-masing dengan reduksi dan oksidasi.
- Siswa dapat menjelaskan perbedaan elektrolisis lelehan dan larutan berair.
- Siswa dapat memprediksi produk elektrolisis pada skenario yang kondisi eksperimennya dinyatakan dengan jelas.
- Siswa dapat menyusun persamaan setengah reaksi yang setara.
- Siswa dapat menyelesaikan soal dasar Hukum Faraday dengan satuan yang benar.
- Guru dapat menggunakan simulasi untuk menjelaskan proses yang sulit diamati secara langsung.
- Aplikasi dapat digunakan pada perangkat seluler dan desktop tanpa alur navigasi yang membingungkan.

---

### 12. Batasan dan Asumsi

- Produk ini merupakan media pembelajaran dan simulasi, bukan pengganti eksperimen laboratorium nyata.
- Simulasi menggambarkan model konseptual dan tidak dimaksudkan untuk memprediksi seluruh detail kuantitatif eksperimen elektrokimia.
- Produk elektrolisis dapat berubah akibat konsentrasi, pH, bahan elektroda, tegangan, potensial elektroda, dan kondisi lain. Karena itu, setiap skenario perlu menyebutkan asumsi yang relevan.
- Versi awal tidak memerlukan akun pengguna atau backend; penyimpanan progres dilakukan secara lokal.
- Fitur analisis guru, kelas daring, sinkronisasi lintas perangkat, dan penyimpanan berbasis server dapat dipertimbangkan untuk versi berikutnya.

---

**Akhir Dokumen PRD — ElectroLab**




