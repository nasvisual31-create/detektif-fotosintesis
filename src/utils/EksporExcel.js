// AdminExport.js - Utilitas Ekspor Laporan Excel & Formatter Guru
// 100% Offline, Mendukung Karakter UTF-8 BOM & Kompatibel Penuh Microsoft Excel

/**
 * Format nama kode aksi sistem menjadi teks deskripsi pembelajaran yang ramah guru.
 */
export function formatActionName(action) {
    if (!action) return '-';
    if (action === 'user_login') return 'Masuk ke Aplikasi (Login Siswa)';
    if (action === 'user_logout') return 'Keluar dari Akun (Logout)';
    
    // Eksplorasi 3D Organ & Anatomi
    if (action.startsWith('explored_part_')) {
        const part = action.replace('explored_part_', '');
        const partMap = {
            'ROOT': 'Mengeksplorasi Organ: Akar Tumbuhan',
            'STEM_MAIN': 'Mengeksplorasi Organ: Batang Utama (Xilem & Floem)',
            'STEM': 'Mengeksplorasi Organ: Batang Tanaman',
            'LEAF': 'Mengeksplorasi Organ: Daun (Dapur Fotosintesis)',
            'DAUN': 'Mengeksplorasi Organ: Daun (Dapur Fotosintesis)',
            'FLOWER': 'Mengeksplorasi Organ: Bunga Matahari',
            'PETAL': 'Mengeksplorasi Organ: Mahkota Bunga Kuning',
            'SEED': 'Mengeksplorasi Bagian: Biji Kuaci Bunga Matahari',
            'SEL_MESOFIL': 'Menjelajahi Penampang 3D: Jaringan Sel Mesofil Daun',
            'KLOROPLAS': 'Mempelajari Organel: Butiran Kloroplas Hijau',
            'EPIDERMIS_ATAS': 'Mempelajari Lapisan: Epidermis Atas (Pelindung)',
            'EPIDERMIS_BAWAH': 'Mempelajari Lapisan: Epidermis Bawah',
            'BERKAS_PEMBULUH': 'Mempelajari Jalur: Tulang Daun & Berkas Pembuluh',
            'STOMATA': 'Mempelajari Struktur: Pori-Pori Stomata Daun'
        };
        return partMap[part] || `Mengeksplorasi Bagian: ${part.replace(/_/g, ' ')}`;
    }

    // Progres Materi & Bab
    if (action.startsWith('completed_level_')) {
        const lvl = action.replace('completed_level_', '');
        const levelNames = {
            '1': 'Level 1: Mengenal Anatomi Tumbuhan',
            '2': 'Level 2: Fungsi Akar Menyerap Air',
            '3': 'Level 3: Fungsi Batang Mengalirkan Nutrisi',
            '4': 'Level 4: Rahasia Zat Hijau Daun (Klorofil)',
            '5': 'Level 5: Kebutuhan Bahan Fotosintesis',
            '6': 'Level 6: Dapur Memasak di Sel Mesofil',
            '7': 'Level 7: Hasil Oksigen & Glukosa',
            '8': 'Level 8: Manfaat Fotosintesis Bagi Bumi'
        };
        return `Menyelesaikan ${levelNames[lvl] || `Materi Level ${lvl}`}`;
    }

    // Kuis & Evaluasi
    if (action.startsWith('completed_quiz_score_')) {
        const scr = action.replace('completed_quiz_score_', '');
        return `Menyelesaikan Kuis Evaluasi IPAS (Nilai: ${scr} XP)`;
    }
    if (action === 'printed_certificate') return 'Mencetak / Mengunduh Sertifikat Siswa Juara';

    // Eksperimen Lab Simulasi Cuaca & Lingkungan
    if (action === 'sim_view_plant') return 'Lab 3D: Melihat Model Bunga Utuh';
    if (action === 'sim_view_process') return 'Lab 3D: Mengamati Permukaan Daun';
    if (action === 'sim_view_mesofil') return 'Lab 3D: Memasuki Simulasi Dapur Sel Mesofil';
    if (action === 'sim_set_day') return 'Uji Variabel: Mengatur Waktu Siang (Cahaya Penuh)';
    if (action === 'sim_set_night') return 'Uji Variabel: Mengatur Waktu Malam (Gelap)';
    if (action === 'sim_set_rain_on') return 'Uji Variabel: Mengaktifkan Cuaca Hujan (Air Melimpah)';
    if (action === 'sim_set_rain_off') return 'Uji Variabel: Mematikan Hujan (Cuaca Cerah)';
    if (action === 'sim_set_temp_cold') return 'Uji Variabel: Mengatur Suhu Dingin';
    if (action === 'sim_set_temp_normal') return 'Uji Variabel: Mengatur Suhu Sedang/Normal';
    if (action === 'sim_set_temp_hot') return 'Uji Variabel: Mengatur Suhu Sangat Terik (Panas)';
    if (action === 'sim_set_haze_clean') return 'Uji Variabel: Mengatur Udara Bersih';
    if (action === 'sim_set_haze_thin') return 'Uji Variabel: Menguji Polusi Asap Tipis';
    if (action === 'sim_set_haze_thick') return 'Uji Variabel: Menguji Polusi Asap Tebal';
    if (action === 'sim_reset_all') return 'Mereset Semua Parameter Variabel Lab';

    if (action === 'developer_profile_updated') return 'Admin: Memperbarui Identitas Pengembang';

    return action.replace(/_/g, ' ');
}

/**
 * Kelompokkan aksi menjadi kategori untuk visualisasi badge berwarna di tabel.
 */
export function getActionCategory(action) {
    if (!action) return { label: 'Sistem', color: '#64748b', bg: '#f1f5f9' };
    if (action.startsWith('explored_part_')) {
        return { label: 'Eksplorasi 3D', color: '#0284c7', bg: '#e0f2fe' };
    }
    if (action.startsWith('completed_level_') || action.startsWith('completed_quiz_')) {
        return { label: 'Materi & Kuis', color: '#16a34a', bg: '#dcfce7' };
    }
    if (action.startsWith('sim_')) {
        return { label: 'Simulasi Lab', color: '#d97706', bg: '#fef3c7' };
    }
    if (action.includes('login') || action.includes('logout')) {
        return { label: 'Akses Akun', color: '#9333ea', bg: '#f3e8ff' };
    }
    return { label: 'Aktivitas', color: '#475569', bg: '#f1f5f9' };
}

/**
 * Ekspor Tabel Rekap Nilai Siswa ke Format Excel CSV (UTF-8 BOM agar rapi di Microsoft Excel)
 */
export function exportStudentsToCSV(students = []) {
    if (!students || students.length === 0) {
        alert("Belum ada data siswa untuk diunduh!");
        return;
    }

    const headers = [
        "No",
        "Nama Lengkap Siswa",
        "Kelas",
        "Total Skor XP",
        "Misi Tuntas (Level)",
        "Persentase Ketuntasan",
        "Eksplorasi Lab 3D",
        "Predikat Capaian Pembelajaran",
        "Tanggal Pertama Bergabung",
        "Terakhir Aktif",
        "Total Interaksi Belajar"
    ];

    const rows = students.map((s, idx) => {
        const completedCount = (s.completedLevels || []).length;
        const percentage = Math.round((completedCount / 8) * 100);
        
        let status = 'Perlu Bimbingan';
        if (s.score >= 70 || completedCount >= 6) {
            status = 'Sangat Baik (Tuntas Penuh)';
        } else if (s.score >= 40 || completedCount >= 3) {
            status = 'Berkembang (Aktif)';
        }

        const firstDate = s.firstLogin ? new Date(s.firstLogin).toLocaleDateString('id-ID') : '-';
        const lastDate = s.lastActive ? new Date(s.lastActive).toLocaleString('id-ID') : '-';

        return [
            idx + 1,
            `"${(s.name || '').replace(/"/g, '""')}"`,
            `"${s.class || '4A'}"`,
            s.score || 0,
            `"${completedCount} dari 8 Level"`,
            `"${percentage}%"`,
            s.simulasiUsed ? '"Sudah Eksplorasi (Aktif)"' : '"Belum Membuka Lab"',
            `"${status}"`,
            `"${firstDate}"`,
            `"${lastDate}"`,
            s.totalActivities || 0
        ];
    });

    // Tambahkan UTF-8 BOM (\uFEFF) di awal string agar Microsoft Excel Windows mengenali encoding karakter
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    downloadBlob(csvContent, `Rekap_Nilai_Siswa_IPAS_Kelas4_${getFormattedDate()}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Ekspor Riwayat Log Lengkap Aktivitas Siswa ke Format Excel CSV
 */
export function exportLogsToCSV(history = []) {
    if (!history || history.length === 0) {
        alert("Belum ada data riwayat aktivitas untuk diunduh!");
        return;
    }

    const headers = [
        "No",
        "Tanggal",
        "Waktu/Jam",
        "Nama Siswa",
        "Kelas",
        "Kategori Aktivitas",
        "Rincian Aktivitas Pembelajaran",
        "Kode Sistem"
    ];

    const rows = history.map((item, idx) => {
        const d = new Date(item.time);
        const dateStr = d.toLocaleDateString('id-ID');
        const timeStr = d.toLocaleTimeString('id-ID');
        const readableAction = formatActionName(item.action);
        const cat = getActionCategory(item.action).label;

        return [
            idx + 1,
            `"${dateStr}"`,
            `"${timeStr}"`,
            `"${(item.user || 'Siswa').replace(/"/g, '""')}"`,
            `"${item.class || '4A'}"`,
            `"${cat}"`,
            `"${readableAction.replace(/"/g, '""')}"`,
            `"${item.action}"`
        ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    downloadBlob(csvContent, `Log_Aktivitas_Belajar_Siswa_IPAS_${getFormattedDate()}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Helper untuk men-download file blob ke perangkat guru
 */
function downloadBlob(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

function getFormattedDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}
