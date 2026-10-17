const CACHE_NAME = 'sunflower-pwa-v5';

// Daftar lengkap aset inti yang langsung di-cache otomatis saat aplikasi dibuka
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/Pengembang.jpeg',
  './assets/models/bunga_matahari.glb',
  './src/styles/main.css',
  './lib/three.min.js',
  './lib/OrbitControls.js',
  './lib/GLTFLoader.js',
  './lib/lucide.js',
  './src/main.js',
  './src/utils/PenyimpananData.js',
  './src/utils/SistemSuara.js',
  './src/utils/NarasiSuara.js',
  './src/utils/EfekSelebrasi.js',
  './src/utils/EksporExcel.js',
  './src/data/DataMateri.js',
  './src/data/DataKuis.js',
  './src/data/DataSimulasi.js',
  './src/components/ModalPetunjuk.js',
  './src/components/ThreeD/PengelolaScene3D.js',
  './src/components/ThreeD/PengelolaLab3D.js',
  './src/components/ThreeD/PartikelFotosintesis.js',
  './src/components/ThreeD/ModelDaun3D.js',
  './src/pages/LayarLoading.js',
  './src/pages/Beranda.js',
  './src/pages/MateriEksplorasi.js',
  './src/pages/LabSimulasi.js',
  './src/pages/KuisEvaluasi.js',
  './src/pages/ProfilSiswa.js',
  './src/pages/MonitoringGuru.js',
  './src/pages/PetaKonsep.js',
  './src/pages/ProfilPengembang.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('Pre-cache asset warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Hanya proses request GET
  if (event.request.method !== 'GET') return;

  // Strategi Cache-First dengan Network Fallback & Update di latar belakang
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      // Jika ada di cache, sajikan instan (100% offline ready). Jika belum, ambil dari network
      return cachedResponse || fetchPromise;
    })
  );
});
