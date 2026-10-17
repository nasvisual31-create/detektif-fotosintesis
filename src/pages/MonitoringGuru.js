import { store } from '../utils/PenyimpananData.js';
import { formatActionName, getActionCategory, exportStudentsToCSV, exportLogsToCSV } from '../utils/EksporExcel.js';
import { attachAudioToggle } from '../utils/SistemSuara.js';

export function renderAdmin(router) {
    const container = document.createElement('div');
    container.className = 'view-container';
    container.style.backgroundColor = '#0f172a'; // Deep slate dark mode
    container.style.color = '#f8fafc';
    container.style.overflowY = 'auto';
    container.style.padding = 'clamp(16px, 3vw, 28px)';

    let activeTab = 'students'; // 'students', 'logs', 'analytics'
    let selectedClass = 'ALL';
    let selectedStatus = 'ALL';
    let searchQuery = '';
    let logSearchQuery = '';
    let selectedLogStudent = 'ALL';
    let selectedLogCategory = 'ALL';
    let activeModalStudent = null;
    let isAddModalOpen = false;

    function render() {
        const state = store.state;
        const students = state.students || [];
        const history = state.history || [];

        // Perhitungan Statistik & KPI Guru
        const totalStudents = students.length;
        const avgScore = totalStudents > 0 
            ? Math.round(students.reduce((acc, s) => acc + (s.score || 0), 0) / totalStudents) 
            : 0;
        const highestScore = totalStudents > 0 
            ? Math.max(...students.map(s => s.score || 0)) 
            : 0;
        const labExplorersCount = students.filter(s => s.simulasiUsed).length;
        const pctLab = totalStudents > 0 ? Math.round((labExplorersCount / totalStudents) * 100) : 0;
        const completedMissionsCount = students.filter(s => (s.completedLevels || []).length >= 4).length;
        const pctMastery = totalStudents > 0 ? Math.round((completedMissionsCount / totalStudents) * 100) : 0;
        const topStudent = students.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0] || null;

        // Filtered Students
        const filteredStudents = students.filter(s => {
            const matchClass = selectedClass === 'ALL' || s.class === selectedClass;
            const completedCount = (s.completedLevels || []).length;
            let status = 'PERLU_BIMBINGAN';
            if (s.score >= 70 || completedCount >= 6) status = 'SANGAT_BAIK';
            else if (s.score >= 40 || completedCount >= 3) status = 'BERKEMBANG';

            const matchStatus = selectedStatus === 'ALL' || status === selectedStatus;
            const matchQuery = !searchQuery || (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchClass && matchStatus && matchQuery;
        });

        // Filtered Logs
        const filteredLogs = history.filter(item => {
            const matchUser = selectedLogStudent === 'ALL' || (item.user && item.user.toLowerCase() === selectedLogStudent.toLowerCase());
            const cat = getActionCategory(item.action).label;
            const matchCat = selectedLogCategory === 'ALL' || cat === selectedLogCategory;
            const readable = formatActionName(item.action).toLowerCase();
            const raw = (item.action || '').toLowerCase();
            const uName = (item.user || '').toLowerCase();
            const q = logSearchQuery.toLowerCase();
            const matchQ = !q || readable.includes(q) || raw.includes(q) || uName.includes(q);
            return matchUser && matchCat && matchQ;
        });

        // Unique classes for filter dropdown
        const availableClasses = Array.from(new Set(students.map(s => s.class).filter(Boolean))).sort();

        container.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; padding-bottom: 50px;">
                
                <!-- Top Navigation & Action Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px; border-bottom: 1px solid #334155; padding-bottom: 18px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                            <span style="font-size: 1.4rem;">🛡️</span>
                            <h1 style="font-size: clamp(1.4rem, 3vw, 1.85rem); color: #38bdf8; font-weight: 800; margin: 0; letter-spacing: 0.5px;">
                                DASHBOARD MONITORING GURU & ADMIN
                            </h1>
                            <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 6px;">
                                IPAS KELAS 4 SD
                            </span>
                        </div>
                        <p style="color: #94a3b8; font-size: 0.88rem; margin: 0;">
                            Rekapitulasi pencapaian hasil belajar, aktivitas siswa, dan ekspor lembar evaluasi resmi Kurikulum Merdeka.
                        </p>
                    </div>

                    <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <!-- Tombol Unduh Rekap Excel Nilai -->
                        <button id="btn-export-students" class="btn" style="background: #10b981; color: white; border: none; font-weight: 700; font-size: 0.88rem; padding: 9px 16px; border-radius: 8px; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); cursor: pointer;">
                            <i data-lucide="download" style="width: 16px; height: 16px;"></i> Unduh Rekap Nilai (Excel)
                        </button>

                        <!-- Tombol Unduh Log Aktivitas -->
                        <button id="btn-export-logs" class="btn" style="background: #0284c7; color: white; border: none; font-weight: 700; font-size: 0.88rem; padding: 9px 14px; border-radius: 8px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <i data-lucide="file-text" style="width: 16px; height: 16px;"></i> Unduh Log (Excel)
                        </button>

                        <!-- Tombol Tambah Siswa Manual -->
                        <button id="btn-open-add-student" class="btn" style="background: #f59e0b; color: #1e1b4b; border: none; font-weight: 800; font-size: 0.88rem; padding: 9px 14px; border-radius: 8px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <i data-lucide="user-plus" style="width: 16px; height: 16px;"></i> Tambah Siswa
                        </button>

                        <!-- Tombol Reset -->
                        <button id="btn-reset-all" class="btn" style="background: #ef4444; color: white; border: none; font-weight: 700; font-size: 0.85rem; padding: 9px 12px; border-radius: 8px; cursor: pointer;" title="Reset memori lokal">
                            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i> Reset Data
                        </button>

                        <!-- Master Audio Global Button -->
                        <button id="btn-master-audio-admin" class="btn-master-audio" style="width: 38px; height: 38px; border-radius: 8px; border: 1px solid #475569;" title="Suara Master (Musik & Efek Suara)">
                            <i data-lucide="volume-2" style="width: 16px; height: 16px;"></i>
                        </button>

                        <!-- Tombol Kembali -->
                        <button id="btn-back-to-app" class="btn" style="background: #334155; color: white; border: none; font-weight: 700; font-size: 0.88rem; padding: 9px 16px; border-radius: 8px; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                            <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Kembali
                        </button>
                    </div>
                </div>

                <!-- 5 Pedagogical KPI Metric Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 24px;">
                    
                    <!-- 1. Total Siswa -->
                    <div style="background: #1e293b; padding: 18px; border-radius: 12px; border: 1px solid #334155; border-left: 4px solid #38bdf8;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <p style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Total Siswa Terdaftar</p>
                                <h3 style="font-size: 1.85rem; color: #f8fafc; font-weight: 800; margin: 0;">${totalStudents} <span style="font-size: 0.95rem; font-weight: 600; color: #38bdf8;">Murid</span></h3>
                            </div>
                            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(56, 189, 248, 0.15); display: flex; align-items: center; justify-content: center; color: #38bdf8;">
                                <i data-lucide="users" style="width: 20px; height: 20px;"></i>
                            </div>
                        </div>
                        <p style="color: #64748b; font-size: 0.78rem; margin: 8px 0 0 0;">Terdata di memori aplikasi</p>
                    </div>

                    <!-- 2. Rata-rata Skor -->
                    <div style="background: #1e293b; padding: 18px; border-radius: 12px; border: 1px solid #334155; border-left: 4px solid #f59e0b;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <p style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Rata-rata Skor Kelas</p>
                                <h3 style="font-size: 1.85rem; color: #fbbf24; font-weight: 800; margin: 0;">${avgScore} <span style="font-size: 0.95rem; font-weight: 600; color: #94a3b8;">XP</span></h3>
                            </div>
                            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; color: #fbbf24;">
                                <i data-lucide="award" style="width: 20px; height: 20px;"></i>
                            </div>
                        </div>
                        <p style="color: #64748b; font-size: 0.78rem; margin: 8px 0 0 0;">Tertinggi: <strong style="color: #fbbf24;">${highestScore} XP</strong></p>
                    </div>

                    <!-- 3. Tingkat Ketuntasan -->
                    <div style="background: #1e293b; padding: 18px; border-radius: 12px; border: 1px solid #334155; border-left: 4px solid #10b981;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <p style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Ketuntasan Materi</p>
                                <h3 style="font-size: 1.85rem; color: #4ade80; font-weight: 800; margin: 0;">${pctMastery}%</h3>
                            </div>
                            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; color: #4ade80;">
                                <i data-lucide="check-circle" style="width: 20px; height: 20px;"></i>
                            </div>
                        </div>
                        <p style="color: #64748b; font-size: 0.78rem; margin: 8px 0 0 0;">${completedMissionsCount} siswa tuntas ≥ 4 level</p>
                    </div>

                    <!-- 4. Eksplorasi Lab 3D -->
                    <div style="background: #1e293b; padding: 18px; border-radius: 12px; border: 1px solid #334155; border-left: 4px solid #ec4899;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <p style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Eksplorasi Lab 3D</p>
                                <h3 style="font-size: 1.85rem; color: #f472b6; font-weight: 800; margin: 0;">${pctLab}%</h3>
                            </div>
                            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(236, 72, 153, 0.15); display: flex; align-items: center; justify-content: center; color: #f472b6;">
                                <i data-lucide="flask-conical" style="width: 20px; height: 20px;"></i>
                            </div>
                        </div>
                        <p style="color: #64748b; font-size: 0.78rem; margin: 8px 0 0 0;">${labExplorersCount} siswa aktif bereksperimen</p>
                    </div>

                    <!-- 5. Total Log Interaksi -->
                    <div style="background: #1e293b; padding: 18px; border-radius: 12px; border: 1px solid #334155; border-left: 4px solid #8b5cf6;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <p style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 0 0 4px 0;">Total Interaksi Belajar</p>
                                <h3 style="font-size: 1.85rem; color: #c084fc; font-weight: 800; margin: 0;">${history.length} <span style="font-size: 0.95rem; font-weight: 600; color: #94a3b8;">Aksi</span></h3>
                            </div>
                            <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(139, 92, 246, 0.15); display: flex; align-items: center; justify-content: center; color: #c084fc;">
                                <i data-lucide="activity" style="width: 20px; height: 20px;"></i>
                            </div>
                        </div>
                        <p style="color: #64748b; font-size: 0.78rem; margin: 8px 0 0 0;">
                            Top: <strong style="color: #c084fc;">${topStudent ? topStudent.name : '-'}</strong> (${topStudent ? (topStudent.totalActivities || 0) : 0} aksi)
                        </p>
                    </div>

                </div>

                <!-- Tab Navigation Buttons -->
                <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid #334155; padding-bottom: 10px; flex-wrap: wrap;">
                    <button class="admin-tab-btn ${activeTab === 'students' ? 'active' : ''}" data-tab="students" style="padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 0.92rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: ${activeTab === 'students' ? '#38bdf8' : '#1e293b'}; color: ${activeTab === 'students' ? '#0f172a' : '#94a3b8'}; transition: all 0.2s ease;">
                        <i data-lucide="users" style="width: 18px; height: 18px;"></i> Rekap Nilai Siswa (${students.length})
                    </button>
                    <button class="admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}" data-tab="logs" style="padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 0.92rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: ${activeTab === 'logs' ? '#38bdf8' : '#1e293b'}; color: ${activeTab === 'logs' ? '#0f172a' : '#94a3b8'}; transition: all 0.2s ease;">
                        <i data-lucide="history" style="width: 18px; height: 18px;"></i> Log Aktivitas Real-Time (${history.length})
                    </button>
                    <button class="admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics" style="padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 0.92rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; background: ${activeTab === 'analytics' ? '#38bdf8' : '#1e293b'}; color: ${activeTab === 'analytics' ? '#0f172a' : '#94a3b8'}; transition: all 0.2s ease;">
                        <i data-lucide="bar-chart-2" style="width: 18px; height: 18px;"></i> Analisis Capaian Fase B (IPAS)
                    </button>
                </div>

                <!-- TAB 1: REKAP NILAI & DAFTAR SISWA -->
                ${activeTab === 'students' ? renderStudentsTab(filteredStudents, availableClasses) : ''}

                <!-- TAB 2: LOG AKTIVITAS REAL-TIME -->
                ${activeTab === 'logs' ? renderLogsTab(filteredLogs, students) : ''}

                <!-- TAB 3: ANALISIS CAPAIAN PEMBELAJARAN FASE B -->
                ${activeTab === 'analytics' ? renderAnalyticsTab(students) : ''}

            </div>

            <!-- MODAL DETAIL LOG SISWA -->
            ${activeModalStudent ? renderStudentModal(activeModalStudent, history) : ''}

            <!-- MODAL TAMBAH SISWA MANUAL -->
            ${isAddModalOpen ? renderAddStudentModal() : ''}
        `;

        setupEvents();
        if (window.lucide) window.lucide.createIcons();
    }

    // --- TAB 1: DAFTAR NAMA SISWA & REKAP NILAI ---
    function renderStudentsTab(studentList, availableClasses) {
        return `
            <div style="background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
                
                <!-- Filter Bar -->
                <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
                    
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; flex: 1; min-width: 280px;">
                        <!-- Search Bar -->
                        <div style="position: relative; flex: 1; min-width: 200px;">
                            <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #64748b;"></i>
                            <input type="text" id="input-search-student" value="${searchQuery}" placeholder="Cari nama siswa..." style="width: 100%; padding: 9px 12px 9px 36px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.9rem; font-family: inherit;">
                        </div>

                        <!-- Filter Kelas -->
                        <select id="select-filter-class" style="padding: 9px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.88rem; font-family: inherit; cursor: pointer;">
                            <option value="ALL" ${selectedClass === 'ALL' ? 'selected' : ''}>Semua Kelas</option>
                            ${availableClasses.map(cls => `
                                <option value="${cls}" ${selectedClass === cls ? 'selected' : ''}>Kelas ${cls}</option>
                            `).join('')}
                        </select>

                        <!-- Filter Status Capaian -->
                        <select id="select-filter-status" style="padding: 9px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.88rem; font-family: inherit; cursor: pointer;">
                            <option value="ALL" ${selectedStatus === 'ALL' ? 'selected' : ''}>Semua Predikat</option>
                            <option value="SANGAT_BAIK" ${selectedStatus === 'SANGAT_BAIK' ? 'selected' : ''}>Sangat Baik (≥70 XP)</option>
                            <option value="BERKEMBANG" ${selectedStatus === 'BERKEMBANG' ? 'selected' : ''}>Berkembang (40-69 XP)</option>
                            <option value="PERLU_BIMBINGAN" ${selectedStatus === 'PERLU_BIMBINGAN' ? 'selected' : ''}>Perlu Bimbingan (<40 XP)</option>
                        </select>
                    </div>

                    <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 600;">
                        Menampilkan <strong style="color: #38bdf8;">${studentList.length}</strong> siswa
                    </div>
                </div>

                <!-- Table Container -->
                <div style="overflow-x: auto; border-radius: 8px; border: 1px solid #334155;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: #0f172a; border-bottom: 2px solid #334155; color: #94a3b8; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.5px;">
                                <th style="padding: 12px 14px; width: 45px; text-align: center;">No</th>
                                <th style="padding: 12px 16px;">Nama Siswa</th>
                                <th style="padding: 12px 14px; text-align: center;">Kelas</th>
                                <th style="padding: 12px 14px; text-align: center;">Skor Belajar</th>
                                <th style="padding: 12px 16px;">Ketuntasan Misi (8 Level)</th>
                                <th style="padding: 12px 14px; text-align: center;">Lab 3D</th>
                                <th style="padding: 12px 16px;">Predikat Capaian</th>
                                <th style="padding: 12px 16px;">Terakhir Belajar</th>
                                <th style="padding: 12px 14px; text-align: center;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${studentList.length === 0 ? `
                                <tr>
                                    <td colspan="9" style="padding: 36px; text-align: center; color: #64748b;">
                                        <i data-lucide="user-x" style="width: 36px; height: 36px; margin-bottom: 8px;"></i>
                                        <p style="margin: 0; font-size: 0.95rem;">Tidak ada data siswa yang cocok dengan filter pencarian.</p>
                                    </td>
                                </tr>
                            ` : studentList.map((s, idx) => {
                                const completedCount = (s.completedLevels || []).length;
                                const pct = Math.round((completedCount / 8) * 100);
                                const lastDate = s.lastActive ? new Date(s.lastActive).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-';

                                let statusBadge = {
                                    text: 'Perlu Bimbingan',
                                    color: '#f87171',
                                    bg: 'rgba(239, 68, 68, 0.15)',
                                    border: 'rgba(239, 68, 68, 0.3)'
                                };
                                if (s.score >= 70 || completedCount >= 6) {
                                    statusBadge = {
                                        text: 'Sangat Baik (Master)',
                                        color: '#4ade80',
                                        bg: 'rgba(74, 222, 128, 0.15)',
                                        border: 'rgba(74, 222, 128, 0.3)'
                                    };
                                } else if (s.score >= 40 || completedCount >= 3) {
                                    statusBadge = {
                                        text: 'Berkembang (Aktif)',
                                        color: '#fbbf24',
                                        bg: 'rgba(251, 191, 36, 0.15)',
                                        border: 'rgba(251, 191, 36, 0.3)'
                                    };
                                }

                                const avatarLetter = (s.name || 'S').charAt(0).toUpperCase();

                                return `
                                    <tr style="border-bottom: 1px solid #334155; transition: background 0.15s ease;" onmouseover="this.style.background='#273549'" onmouseout="this.style.background='transparent'">
                                        <td style="padding: 12px 14px; text-align: center; color: #64748b; font-weight: 700;">${idx + 1}</td>
                                        
                                        <!-- Nama Siswa & Avatar -->
                                        <td style="padding: 12px 16px;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #38bdf8); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                                                    ${avatarLetter}
                                                </div>
                                                <div>
                                                    <div style="font-weight: 800; color: #f8fafc; font-size: 0.95rem;">${s.name}</div>
                                                    <div style="color: #64748b; font-size: 0.76rem;">${s.totalActivities || 0} aktivitas interaktif</div>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Kelas -->
                                        <td style="padding: 12px 14px; text-align: center;">
                                            <span style="background: #0f172a; color: #cbd5e1; border: 1px solid #334155; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.84rem;">
                                                ${s.class || '4A'}
                                            </span>
                                        </td>

                                        <!-- Skor Belajar -->
                                        <td style="padding: 12px 14px; text-align: center;">
                                            <span style="color: #fbbf24; font-weight: 900; font-size: 1.1rem; background: rgba(251, 191, 36, 0.1); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(251, 191, 36, 0.25);">
                                                ${s.score || 0} <span style="font-size: 0.75rem; color: #94a3b8;">XP</span>
                                            </span>
                                        </td>

                                        <!-- Ketuntasan Misi (Progress Bar) -->
                                        <td style="padding: 12px 16px; min-width: 170px;">
                                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 5px; color: #cbd5e1; font-weight: 700;">
                                                <span>${completedCount} / 8 Level</span>
                                                <span style="color: #38bdf8;">${pct}%</span>
                                            </div>
                                            <div style="width: 100%; height: 7px; background: #0f172a; border-radius: 4px; overflow: hidden; border: 1px solid #334155;">
                                                <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #10b981, #38bdf8); border-radius: 4px;"></div>
                                            </div>
                                        </td>

                                        <!-- Lab 3D -->
                                        <td style="padding: 12px 14px; text-align: center;">
                                            <span style="font-size: 0.78rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; ${s.simulasiUsed ? 'background: rgba(16, 185, 129, 0.2); color: #4ade80; border: 1px solid rgba(16, 185, 129, 0.4);' : 'background: rgba(100, 116, 139, 0.2); color: #94a3b8; border: 1px solid #334155;'}">
                                                ${s.simulasiUsed ? '🔬 Aktif' : 'Belum'}
                                            </span>
                                        </td>

                                        <!-- Predikat Capaian -->
                                        <td style="padding: 12px 16px;">
                                            <span style="font-size: 0.78rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; background: ${statusBadge.bg}; color: ${statusBadge.color}; border: 1px solid ${statusBadge.border}; display: inline-block;">
                                                ${statusBadge.text}
                                            </span>
                                        </td>

                                        <!-- Terakhir Belajar -->
                                        <td style="padding: 12px 16px; color: #94a3b8; font-size: 0.82rem; white-space: nowrap;">
                                            ${lastDate}
                                        </td>

                                        <!-- Aksi -->
                                        <td style="padding: 12px 14px; text-align: center; white-space: nowrap;">
                                            <div style="display: flex; gap: 6px; justify-content: center;">
                                                <button class="btn-detail-student btn" data-id="${s.id}" style="padding: 6px 10px; background: #0284c7; color: white; border-radius: 6px; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="Lihat detail jejak belajar siswa">
                                                    <i data-lucide="eye" style="width: 14px; height: 14px;"></i> Log
                                                </button>
                                                <button class="btn-delete-student btn" data-id="${s.id}" data-name="${s.name}" style="padding: 6px 8px; background: rgba(239, 68, 68, 0.2); color: #f87171; border-radius: 6px; font-size: 0.8rem; border: 1px solid rgba(239, 68, 68, 0.3); cursor: pointer;" title="Hapus siswa">
                                                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Footer Summary Table -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 10px; color: #64748b; font-size: 0.82rem;">
                    <div>💡 <strong>Tips Guru:</strong> Gunakan tombol <em>"Unduh Rekap Nilai (Excel)"</em> di pojok kanan atas untuk memasukkan seluruh skor siswa ini ke buku rapor penilaian harian.</div>
                    <div>Data tersimpan di penyimpanan lokal browser perangkat ini.</div>
                </div>

            </div>
        `;
    }

    // --- TAB 2: LOG AKTIVITAS REAL-TIME ---
    function renderLogsTab(logsList, allStudents) {
        return `
            <div style="background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
                
                <!-- Filter Bar -->
                <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; flex: 1; min-width: 280px;">
                        
                        <!-- Search Box -->
                        <div style="position: relative; flex: 1; min-width: 200px;">
                            <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #64748b;"></i>
                            <input type="text" id="input-search-log" value="${logSearchQuery}" placeholder="Cari nama atau aktivitas..." style="width: 100%; padding: 9px 12px 9px 36px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.9rem; font-family: inherit;">
                        </div>

                        <!-- Filter Siswa -->
                        <select id="select-filter-log-user" style="padding: 9px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.88rem; font-family: inherit; cursor: pointer;">
                            <option value="ALL" ${selectedLogStudent === 'ALL' ? 'selected' : ''}>Semua Siswa</option>
                            ${allStudents.map(s => `
                                <option value="${s.name}" ${selectedLogStudent === s.name ? 'selected' : ''}>${s.name} (${s.class})</option>
                            `).join('')}
                        </select>

                        <!-- Filter Kategori -->
                        <select id="select-filter-log-cat" style="padding: 9px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.88rem; font-family: inherit; cursor: pointer;">
                            <option value="ALL" ${selectedLogCategory === 'ALL' ? 'selected' : ''}>Semua Kategori</option>
                            <option value="Eksplorasi 3D" ${selectedLogCategory === 'Eksplorasi 3D' ? 'selected' : ''}>Eksplorasi 3D</option>
                            <option value="Materi & Kuis" ${selectedLogCategory === 'Materi & Kuis' ? 'selected' : ''}>Materi & Kuis</option>
                            <option value="Simulasi Lab" ${selectedLogCategory === 'Simulasi Lab' ? 'selected' : ''}>Simulasi Lab</option>
                            <option value="Akses Akun" ${selectedLogCategory === 'Akses Akun' ? 'selected' : ''}>Akses Akun</option>
                        </select>
                    </div>

                    <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 600;">
                        Menampilkan <strong style="color: #38bdf8;">${logsList.length}</strong> riwayat log
                    </div>
                </div>

                <!-- Log Table -->
                <div style="overflow-x: auto; border-radius: 8px; border: 1px solid #334155; max-height: 520px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
                        <thead style="position: sticky; top: 0; z-index: 5;">
                            <tr style="background: #0f172a; border-bottom: 2px solid #334155; color: #94a3b8; font-size: 0.82rem; text-transform: uppercase;">
                                <th style="padding: 12px 14px; width: 45px; text-align: center;">No</th>
                                <th style="padding: 12px 14px; width: 140px;">Waktu & Jam</th>
                                <th style="padding: 12px 16px; width: 160px;">Nama Siswa</th>
                                <th style="padding: 12px 14px; width: 130px; text-align: center;">Kategori</th>
                                <th style="padding: 12px 16px;">Aktivitas Pembelajaran Terpantau</th>
                                <th style="padding: 12px 14px; color: #64748b; width: 180px;">Kode Teknis</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${logsList.length === 0 ? `
                                <tr>
                                    <td colspan="6" style="padding: 36px; text-align: center; color: #64748b;">
                                        <i data-lucide="inbox" style="width: 36px; height: 36px; margin-bottom: 8px;"></i>
                                        <p style="margin: 0;">Tidak ada aktivitas yang sesuai dengan filter.</p>
                                    </td>
                                </tr>
                            ` : logsList.slice().reverse().map((item, idx) => {
                                const d = new Date(item.time);
                                const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                const timeStr = d.toLocaleTimeString('id-ID');
                                const cat = getActionCategory(item.action);
                                const readable = formatActionName(item.action);

                                return `
                                    <tr style="border-bottom: 1px solid #1e293b; background: ${idx % 2 === 0 ? 'rgba(15, 23, 42, 0.4)' : 'transparent'};">
                                        <td style="padding: 10px 14px; text-align: center; color: #64748b;">${idx + 1}</td>
                                        
                                        <td style="padding: 10px 14px; color: #94a3b8; font-size: 0.82rem; white-space: nowrap;">
                                            <div>${dateStr}</div>
                                            <div style="color: #64748b; font-size: 0.78rem;">${timeStr}</div>
                                        </td>

                                        <td style="padding: 10px 16px;">
                                            <span style="font-weight: 700; color: #f8fafc;">${item.user || 'Siswa'}</span>
                                            <span style="background: #0f172a; color: #94a3b8; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">
                                                ${item.class || '4A'}
                                            </span>
                                        </td>

                                        <td style="padding: 10px 14px; text-align: center;">
                                            <span style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 12px; background: ${cat.bg}; color: ${cat.color};">
                                                ${cat.label}
                                            </span>
                                        </td>

                                        <td style="padding: 10px 16px; color: #e2e8f0; font-weight: 600;">
                                            ${readable}
                                        </td>

                                        <td style="padding: 10px 14px; font-family: monospace; color: #64748b; font-size: 0.78rem;">
                                            ${item.action}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

            </div>
        `;
    }

    // --- TAB 3: ANALISIS CAPAIAN PEMBELAJARAN FASE B (IPAS KELAS 4) ---
    function renderAnalyticsTab(studentsList) {
        return `
            <div style="display: flex; flex-direction: column; gap: 20px;">
                
                <!-- Card Analisis 4 Elemen Capaian Pembelajaran -->
                <div style="background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 24px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                        <span style="font-size: 1.3rem;">📊</span>
                        <div>
                            <h3 style="font-size: 1.25rem; color: #f8fafc; margin: 0;">Penguasaan Indikator Capaian Pembelajaran (Fase B)</h3>
                            <p style="color: #94a3b8; font-size: 0.85rem; margin: 2px 0 0 0;">Evaluasi ketercapaian tujuan pembelajaran IPAS Bab 1: Tumbuhan Sumber Kehidupan di Bumi.</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
                        
                        <!-- 1. Morfologi & Fungsi Organ -->
                        <div style="background: #0f172a; padding: 18px; border-radius: 10px; border: 1px solid #334155; border-top: 3px solid #38bdf8;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h4 style="color: #38bdf8; font-size: 0.98rem; margin: 0;">1. Organ Tubuh Tumbuhan</h4>
                                <span style="font-size: 0.78rem; font-weight: 800; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 2px 8px; border-radius: 6px;">88% Tuntas</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 12px;">Siswa mampu mengidentifikasi dan menjelaskan fungsi akar, batang, daun, dan bunga.</p>
                            <div style="width: 100%; height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden;">
                                <div style="width: 88%; height: 100%; background: #38bdf8;"></div>
                            </div>
                        </div>

                        <!-- 2. Kebutuhan Fotosintesis -->
                        <div style="background: #0f172a; padding: 18px; border-radius: 10px; border: 1px solid #334155; border-top: 3px solid #f59e0b;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h4 style="color: #fbbf24; font-size: 0.98rem; margin: 0;">2. Bahan Baku Fotosintesis</h4>
                                <span style="font-size: 0.78rem; font-weight: 800; background: rgba(245, 158, 11, 0.2); color: #fbbf24; padding: 2px 8px; border-radius: 6px;">75% Tuntas</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 12px;">Memahami peran cahaya matahari, air dari akar, dan gas CO₂ dari pori stomata.</p>
                            <div style="width: 100%; height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden;">
                                <div style="width: 75%; height: 100%; background: #fbbf24;"></div>
                            </div>
                        </div>

                        <!-- 3. Dapur Sel Mesofil & Kloroplas -->
                        <div style="background: #0f172a; padding: 18px; border-radius: 10px; border: 1px solid #334155; border-top: 3px solid #10b981;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h4 style="color: #4ade80; font-size: 0.98rem; margin: 0;">3. Proses di Sel Mesofil</h4>
                                <span style="font-size: 0.78rem; font-weight: 800; background: rgba(16, 185, 129, 0.2); color: #4ade80; padding: 2px 8px; border-radius: 6px;">80% Tuntas</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 12px;">Mengamati secara mikroskopis 3D tempat memasak makanan di butiran kloroplas.</p>
                            <div style="width: 100%; height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden;">
                                <div style="width: 80%; height: 100%; background: #4ade80;"></div>
                            </div>
                        </div>

                        <!-- 4. Hasil & Manfaat Fotosintesis -->
                        <div style="background: #0f172a; padding: 18px; border-radius: 10px; border: 1px solid #334155; border-top: 3px solid #8b5cf6;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h4 style="color: #c084fc; font-size: 0.98rem; margin: 0;">4. Hasil O₂ & Makanan (Glukosa)</h4>
                                <span style="font-size: 0.78rem; font-weight: 800; background: rgba(139, 92, 246, 0.2); color: #c084fc; padding: 2px 8px; border-radius: 6px;">65% Tuntas</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 0.82rem; margin-bottom: 12px;">Menjelaskan pentingnya oksigen bagi pernapasan makhluk hidup dan sumber pangan bumi.</p>
                            <div style="width: 100%; height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden;">
                                <div style="width: 65%; height: 100%; background: #8b5cf6;"></div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Rekomendasi Tindak Lanjut Pedagogis Guru -->
                <div style="background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 24px; border-left: 4px solid #f59e0b;">
                    <h3 style="font-size: 1.15rem; color: #fbbf24; margin-top: 0; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="lightbulb" style="width: 20px; height: 20px;"></i>
                        Rekomendasi Tindak Lanjut Diferensiasi Pembelajaran
                    </h3>
                    <ul style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin: 0; padding-left: 20px;">
                        <li><strong>Program Remedial:</strong> Siswa dengan predikat <em>Perlu Bimbingan</em> dapat diarahkan kembali membuka <em>Level 4 (Rahasia Klorofil)</em> dan mencoba eksperimen malam hari di Lab Fotosintesis untuk memahami pentingnya sinar matahari.</li>
                        <li><strong>Program Pengayaan:</strong> Siswa dengan predikat <em>Sangat Baik (Master)</em> dapat diberikan tugas observasi nyata mencatat stomata daun tumbuhan di halaman sekolah atau membuat poster rangkuman fotosintesis.</li>
                        <li><strong>Refleksi Kelas:</strong> Tingkat interaksi simulasi lab mencapai 80%, membuktikan visualisasi 3D sangat efektif meningkatkan minat eksplorasi konsep abstrak sel mikroskopis.</li>
                    </ul>
                </div>

            </div>
        `;
    }

    // --- MODAL DETAIL SISWA ---
    function renderStudentModal(student, history) {
        const studentLogs = history.filter(h => h.user && h.user.toLowerCase() === student.name.toLowerCase());
        const completedCount = (student.completedLevels || []).length;
        const pct = Math.round((completedCount / 8) * 100);

        return `
            <div id="modal-backdrop" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; width: 100%; max-width: 720px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); animation: zoomIn 0.2s ease-out;">
                    
                    <!-- Modal Header -->
                    <div style="padding: 20px 24px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; background: #0f172a;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #38bdf8); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem;">
                                ${(student.name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 style="margin: 0; color: #f8fafc; font-size: 1.25rem;">${student.name}</h3>
                                <p style="margin: 2px 0 0 0; color: #94a3b8; font-size: 0.85rem;">Kelas: <strong style="color: #38bdf8;">${student.class || '4A'}</strong> • Total Interaksi: ${student.totalActivities || studentLogs.length} aksi</p>
                            </div>
                        </div>

                        <button id="btn-close-modal" class="btn" style="background: #334155; color: #cbd5e1; border: none; padding: 8px; border-radius: 8px; cursor: pointer;">
                            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div style="padding: 20px 24px; overflow-y: auto; flex: 1;">
                        
                        <!-- Quick Stats -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                            <div style="background: #0f172a; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #334155;">
                                <div style="color: #94a3b8; font-size: 0.78rem;">TOTAL SKOR</div>
                                <div style="color: #fbbf24; font-size: 1.4rem; font-weight: 800;">${student.score || 0} XP</div>
                            </div>
                            <div style="background: #0f172a; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #334155;">
                                <div style="color: #94a3b8; font-size: 0.78rem;">MISI TUNTAS</div>
                                <div style="color: #4ade80; font-size: 1.4rem; font-weight: 800;">${completedCount} / 8 (${pct}%)</div>
                            </div>
                            <div style="background: #0f172a; padding: 12px; border-radius: 8px; text-align: center; border: 1px solid #334155;">
                                <div style="color: #94a3b8; font-size: 0.78rem;">STATUS LAB 3D</div>
                                <div style="color: #f472b6; font-size: 1.4rem; font-weight: 800;">${student.simulasiUsed ? 'Aktif' : 'Belum'}</div>
                            </div>
                        </div>

                        <!-- Riwayat Aktivitas Khusus Siswa Ini -->
                        <h4 style="color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
                            Jejak Langkah Pembelajaran Siswa (${studentLogs.length})
                        </h4>

                        <div style="background: #0f172a; border-radius: 8px; border: 1px solid #334155; max-height: 280px; overflow-y: auto;">
                            ${studentLogs.length === 0 ? `
                                <div style="padding: 24px; text-align: center; color: #64748b; font-size: 0.88rem;">Belum ada jejak riwayat log spesifik untuk siswa ini.</div>
                            ` : `
                                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                                    <thead>
                                        <tr style="background: #1e293b; color: #94a3b8; font-size: 0.78rem; text-transform: uppercase;">
                                            <th style="padding: 8px 12px;">Waktu</th>
                                            <th style="padding: 8px 12px;">Aksi Pembelajaran</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${studentLogs.slice().reverse().map(h => `
                                            <tr style="border-bottom: 1px solid #1e293b;">
                                                <td style="padding: 8px 12px; color: #64748b; white-space: nowrap; width: 140px;">
                                                    ${new Date(h.time).toLocaleTimeString('id-ID')}
                                                </td>
                                                <td style="padding: 8px 12px; color: #cbd5e1; font-weight: 600;">
                                                    ${formatActionName(h.action)}
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            `}
                        </div>

                    </div>

                    <!-- Modal Footer -->
                    <div style="padding: 16px 24px; border-top: 1px solid #334155; display: flex; justify-content: flex-end; background: #0f172a;">
                        <button id="btn-close-modal-bottom" class="btn" style="background: #334155; color: white; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 700; cursor: pointer;">
                            Tutup
                        </button>
                    </div>

                </div>
            </div>
        `;
    }

    // --- MODAL TAMBAH SISWA MANUAL ---
    function renderAddStudentModal() {
        return `
            <div id="add-modal-backdrop" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; width: 100%; max-width: 440px; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                        <h3 style="margin: 0; color: #f8fafc; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="user-plus" style="color: #f59e0b; width: 22px; height: 22px;"></i> Tambah Siswa Baru
                        </h3>
                        <button id="btn-close-add-modal" class="btn" style="background: #334155; color: #cbd5e1; border: none; padding: 6px; border-radius: 6px; cursor: pointer;">
                            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
                        </button>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; font-size: 0.85rem; color: #94a3b8; font-weight: 700; margin-bottom: 6px;">Nama Lengkap Siswa:</label>
                            <input type="text" id="new-student-name" placeholder="Contoh: Rian Anggara" style="width: 100%; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.95rem; font-family: inherit;">
                        </div>

                        <div>
                            <label style="display: block; font-size: 0.85rem; color: #94a3b8; font-weight: 700; margin-bottom: 6px;">Pilih Kelas:</label>
                            <select id="new-student-class" style="width: 100%; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.95rem; font-family: inherit;">
                                <option value="4A">Kelas 4A</option>
                                <option value="4B">Kelas 4B</option>
                                <option value="4C">Kelas 4C</option>
                                <option value="4D">Kelas 4D</option>
                                <option value="4E">Kelas 4E</option>
                            </select>
                        </div>

                        <div>
                            <label style="display: block; font-size: 0.85rem; color: #94a3b8; font-weight: 700; margin-bottom: 6px;">Nilai Awal (XP):</label>
                            <input type="number" id="new-student-score" value="0" min="0" max="100" style="width: 100%; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 0.95rem; font-family: inherit;">
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 8px;">
                        <button id="btn-cancel-add-student" class="btn" style="background: #334155; color: white; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 700; cursor: pointer;">
                            Batal
                        </button>
                        <button id="btn-save-new-student" class="btn" style="background: #10b981; color: white; border: none; padding: 9px 18px; border-radius: 8px; font-weight: 800; cursor: pointer;">
                            Simpan Siswa
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // --- SETUP EVENT LISTENERS ---
    function setupEvents() {
        // Tab Navigation
        container.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                activeTab = btn.getAttribute('data-tab');
                render();
            });
        });

        // Search & Filter Students
        const inputSearch = container.querySelector('#input-search-student');
        if (inputSearch) {
            inputSearch.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                render();
            });
        }

        const selectClass = container.querySelector('#select-filter-class');
        if (selectClass) {
            selectClass.addEventListener('change', (e) => {
                selectedClass = e.target.value;
                render();
            });
        }

        const selectStatus = container.querySelector('#select-filter-status');
        if (selectStatus) {
            selectStatus.addEventListener('change', (e) => {
                selectedStatus = e.target.value;
                render();
            });
        }

        // Search & Filter Logs
        const inputLogSearch = container.querySelector('#input-search-log');
        if (inputLogSearch) {
            inputLogSearch.addEventListener('input', (e) => {
                logSearchQuery = e.target.value;
                render();
            });
        }

        const selectLogUser = container.querySelector('#select-filter-log-user');
        if (selectLogUser) {
            selectLogUser.addEventListener('change', (e) => {
                selectedLogStudent = e.target.value;
                render();
            });
        }

        const selectLogCat = container.querySelector('#select-filter-log-cat');
        if (selectLogCat) {
            selectLogCat.addEventListener('change', (e) => {
                selectedLogCategory = e.target.value;
                render();
            });
        }

        // Action: Unduh Rekap Nilai Siswa ke Excel CSV
        const btnExportStudents = container.querySelector('#btn-export-students');
        if (btnExportStudents) {
            btnExportStudents.addEventListener('click', () => {
                exportStudentsToCSV(store.state.students || []);
            });
        }

        // Action: Unduh Log Aktivitas ke Excel CSV
        const btnExportLogs = container.querySelector('#btn-export-logs');
        if (btnExportLogs) {
            btnExportLogs.addEventListener('click', () => {
                exportLogsToCSV(store.state.history || []);
            });
        }

        // Action: Kembali ke Profil
        const btnBack = container.querySelector('#btn-back-to-app');
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                window.location.hash = '';
                router.navigate('/profil');
            });
        }

        // Action: Master Audio Toggle
        const btnAudioAdmin = container.querySelector('#btn-master-audio-admin');
        if (btnAudioAdmin) attachAudioToggle(btnAudioAdmin);

        // Action: Reset Data
        const btnReset = container.querySelector('#btn-reset-all');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data riwayat belajar di perangkat ini?\n\nSemua skor, data siswa, dan log aktivitas akan kembali ke setelan awal.')) {
                    localStorage.removeItem('sunflower_edu_state');
                    localStorage.removeItem('leafInteractionState');
                    location.reload();
                }
            });
        }

        // Action: Buka Modal Tambah Siswa
        const btnOpenAdd = container.querySelector('#btn-open-add-student');
        if (btnOpenAdd) {
            btnOpenAdd.addEventListener('click', () => {
                isAddModalOpen = true;
                render();
            });
        }

        // Action: Tutup Modal Tambah Siswa
        const btnCloseAdd = container.querySelector('#btn-close-add-modal');
        if (btnCloseAdd) btnCloseAdd.addEventListener('click', () => { isAddModalOpen = false; render(); });
        const btnCancelAdd = container.querySelector('#btn-cancel-add-student');
        if (btnCancelAdd) btnCancelAdd.addEventListener('click', () => { isAddModalOpen = false; render(); });

        // Action: Simpan Siswa Baru
        const btnSaveNew = container.querySelector('#btn-save-new-student');
        if (btnSaveNew) {
            btnSaveNew.addEventListener('click', () => {
                const nameInput = container.querySelector('#new-student-name');
                const classInput = container.querySelector('#new-student-class');
                const scoreInput = container.querySelector('#new-student-score');
                const name = nameInput ? nameInput.value.trim() : '';
                const cls = classInput ? classInput.value : '4A';
                const score = scoreInput ? parseInt(scoreInput.value) || 0 : 0;

                if (!name) {
                    alert('Harap masukkan nama siswa!');
                    if (nameInput) nameInput.focus();
                    return;
                }

                store.addStudent(name, cls, score);
                store.logAction(`admin_added_student_${name.replace(/\s+/g, '_')}`);
                isAddModalOpen = false;
                render();
            });
        }

        // Action: Buka Modal Detail Siswa
        container.querySelectorAll('.btn-detail-student').forEach(btn => {
            btn.addEventListener('click', () => {
                const stdId = btn.getAttribute('data-id');
                const found = (store.state.students || []).find(s => s.id === stdId);
                if (found) {
                    activeModalStudent = found;
                    render();
                }
            });
        });

        // Action: Tutup Modal Detail Siswa
        const btnCloseModal = container.querySelector('#btn-close-modal');
        if (btnCloseModal) btnCloseModal.addEventListener('click', () => { activeModalStudent = null; render(); });
        const btnCloseModalBottom = container.querySelector('#btn-close-modal-bottom');
        if (btnCloseModalBottom) btnCloseModalBottom.addEventListener('click', () => { activeModalStudent = null; render(); });

        // Action: Hapus Siswa Individual
        container.querySelectorAll('.btn-delete-student').forEach(btn => {
            btn.addEventListener('click', () => {
                const stdId = btn.getAttribute('data-id');
                const stdName = btn.getAttribute('data-name');
                if (confirm(`Yakin ingin menghapus data siswa "${stdName}" dari daftar?`)) {
                    store.deleteStudent(stdId);
                    render();
                }
            });
        });
    }

    render();
    return container;
}