import { store } from './utils/PenyimpananData.js';
import { renderLoading } from './pages/LayarLoading.js';
import { renderHome } from './pages/Beranda.js';
import { renderMateri } from './pages/MateriEksplorasi.js';
import { renderSimulasi } from './pages/LabSimulasi.js';
import { renderQuiz } from './pages/KuisEvaluasi.js';
import { renderProfile } from './pages/ProfilSiswa.js';
import { renderAdmin } from './pages/MonitoringGuru.js';
import { renderConceptMap } from './pages/PetaKonsep.js';
import { renderDeveloper } from './pages/ProfilPengembang.js';

// Router Sederhana dengan Dukungan Akses URL Hash #admin
class Router {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.routes = {
            '/': renderHome,
            '/loading': renderLoading,
            '/materi': renderMateri,
            '/simulasi': renderSimulasi,
            '/kuis': renderMateri, // Dialihkan langsung ke Petualangan Materi Berlevel
            '/profil': renderProfile,
            '/pengembang': renderDeveloper,
            '/admin': renderAdmin,
            '/peta': renderMateri // Dialihkan langsung ke Petualangan Materi Berlevel
        };

        // Listen perubahan hash URL (misal guru mengetik #admin atau #/admin di address bar)
        window.addEventListener('hashchange', () => {
            this.handleHashRoute();
        });
        
        // Cek URL saat aplikasi pertama kali dimuat
        const initialHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
        if (initialHash === 'admin') {
            this.navigate('/admin');
        } else {
            // Selalu jalankan loading screen pembuka saat pertama dibuka
            this.navigate('/loading');
        }
    }

    handleHashRoute() {
        const rawHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
        if (rawHash === 'admin') {
            this.navigate('/admin');
        } else if (rawHash === 'materi') {
            this.navigate('/materi');
        } else if (rawHash === 'simulasi') {
            this.navigate('/simulasi');
        } else if (rawHash === 'profil') {
            this.navigate('/profil');
        } else if (rawHash === 'pengembang') {
            this.navigate('/pengembang');
        } else if (rawHash === '' || rawHash === 'home') {
            this.navigate('/');
        }
    }

    navigate(path) {
        if (!this.routes[path]) {
            console.error('Route tidak ditemukan:', path);
            this.navigate('/');
            return;
        }

        // Sinkronisasi hash jika menuju admin
        if (path === '/admin') {
            const currentHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
            if (currentHash !== 'admin') {
                window.location.hash = 'admin';
            }
        }

        // Bersihkan container
        this.container.innerHTML = '';
        
        // Panggil fungsi render untuk halaman yang dituju
        const pageElement = this.routes[path](this);
        this.container.appendChild(pageElement);
        
        // Jika Lucide ter-load, proses icon
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    window.appRouter = new Router('app-container');
});
