# 🔍🌻 Detektif Fotosintesis Interaktif 3D
**Media Pembelajaran Interaktif 3D untuk Siswa SD Kelas 4**

Proyek ini adalah sebuah purwarupa (prototype) Media Pembelajaran berbasis gamifikasi dan simulasi 3D. Aplikasi ini dirancang khusus untuk mempermudah guru dan siswa dalam memahami struktur daun dan proses fotosintesis.

## 🌟 Fitur Utama
1. **Eksplorasi 3D (Materi)**: Siswa dapat memutar, memperbesar, dan mengklik bagian-bagian tumbuhan (seperti sel mesofil, pembuluh kayu, dll) untuk melihat info detailnya.
2. **Laboratorium Simulasi**: Ruang eksperimen virtual di mana siswa bisa mengubah Waktu (Siang/Malam), Cuaca (Hujan/Cerah), dan Suhu (Dingin/Panas) untuk melihat dampaknya pada fotosintesis secara *real-time* (animasi partikel).
3. **Sistem Prediksi**: Menerapkan metode pedagogi ilmiah, di mana siswa diminta menebak apa yang akan terjadi sebelum simulasi dijalankan.
4. **Gamifikasi Kuis**: Pertanyaan evaluasi dengan *feedback* visual, efek suara otomatis, hujan *confetti*, dan lencana peringkat.
5. **Mode Guru (Papan Interaktif)**: Dapat dibuat layar penuh (Fullscreen) untuk presentasi di depan kelas.
6. **Aksesibilitas (Text-to-Speech)**: Fitur robot narator bahasa Indonesia yang otomatis membacakan teks materi.
7. **Offline PWA**: Aplikasi dapat di-install secara lokal di PC atau Tablet dan berjalan 100% tanpa internet.
8. **Dasbor Admin**: Merekam segala aktivitas siswa untuk kebutuhan penilaian, serta dilengkapi fitur *Export* ke format `.csv`.

## 🚀 Cara Menjalankan
Karena dibangun secara modular tanpa Node.js (Vanilla ES Modules), aplikasi ini sangat mudah dijalankan:
1. Pastikan Anda memiliki *extension* **Live Server** di VSCode Anda.
2. Klik kanan pada file `index.html` dan pilih **"Open with Live Server"**.
3. Aplikasi akan terbuka di *browser* pada alamat `http://127.0.0.1:5500/`.

## 💻 Panduan Instalasi Papan Interaktif (Offline App)
Untuk menjadikan aplikasi ini sebagai *software* mandiri di layar/komputer sekolah:
1. Buka aplikasi ini di **Google Chrome** atau **Microsoft Edge**.
2. Pada ujung kanan baris alamat (*Address Bar*), cari ikon **Install App** (biasanya bergambar layar komputer dengan tanda plus atau panah bawah).
3. Klik "Install".
4. *Shortcut* Bunga Matahari akan muncul di Desktop atau Start Menu komputer Anda.
5. Anda kini bisa membukanya tanpa perlu koneksi internet sama sekali!

## 📂 Struktur Direktori
* `/assets`: Menyimpan aset model 3D (`.glb`).
* `/lib`: Pustaka utama yang diunduh secara lokal (`three.min.js`, `lucide.js`, dll).
* `/src/components`: Komponen pengelola 3D (`SceneManager.js`, `LabManager.js`).
* `/src/data`: Berisi basis data soal kuis dan deskripsi materi tumbuhan.
* `/src/pages`: Halaman antarmuka (Home, Materi, Simulasi, Kuis, dll).
* `/src/utils`: Utilitas tambahan seperti `Store.js` (State Manager), `Speech.js` (Suara), dan `Confetti.js` (Visual).

## 🎓 Target Pengguna
Siswa dan Guru Sekolah Dasar (SD) Kelas 4, dirancang untuk mendukung Kurikulum Merdeka atau kurikulum relevan lainnya.

---
*Dikembangkan dengan cermat untuk menghadirkan pengalaman belajar sains yang tak terlupakan!*
