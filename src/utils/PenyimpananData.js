// State Management Sederhana dengan Dukungan Multi-Siswa untuk Guru & Admin
class Store {
    constructor() {
        this.prefix = 'sunflower_edu_';
        this.state = this.loadState();
        this.listeners = [];
    }

    loadState() {
        const defaultStudents = [
            {
                id: 'std_anas_4a',
                name: 'Anas',
                class: '4A',
                score: 0,
                completedLevels: [],
                simulasiUsed: false,
                firstLogin: '2026-10-17T04:20:00.000Z',
                lastActive: '2026-10-17T04:27:21.000Z',
                totalActivities: 1
            },
            {
                id: 'std_siti_4a',
                name: 'Siti Rahma',
                class: '4A',
                score: 90,
                completedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
                simulasiUsed: true,
                firstLogin: '2026-10-17T03:15:00.000Z',
                lastActive: '2026-10-17T04:10:00.000Z',
                totalActivities: 142
            },
            {
                id: 'std_budi_4a',
                name: 'Budi Santoso',
                class: '4A',
                score: 60,
                completedLevels: [1, 2, 3, 4],
                simulasiUsed: true,
                firstLogin: '2026-10-17T03:30:00.000Z',
                lastActive: '2026-10-17T04:05:00.000Z',
                totalActivities: 86
            },
            {
                id: 'std_dewi_4b',
                name: 'Dewi Lestari',
                class: '4B',
                score: 75,
                completedLevels: [1, 2, 3, 4, 5],
                simulasiUsed: false,
                firstLogin: '2026-10-17T03:45:00.000Z',
                lastActive: '2026-10-17T04:15:00.000Z',
                totalActivities: 68
            },
            {
                id: 'std_ahmad_4b',
                name: 'Ahmad Zaki',
                class: '4B',
                score: 30,
                completedLevels: [1],
                simulasiUsed: false,
                firstLogin: '2026-10-17T04:00:00.000Z',
                lastActive: '2026-10-17T04:22:00.000Z',
                totalActivities: 35
            }
        ];

        const defaultState = {
            masterAudioEnabled: true,
            user: { name: 'Tamu', class: 'Umum', isGuest: true },
            students: defaultStudents,
            developerProfile: {
                photo: './assets/Pengembang.jpeg',
                name: 'Muhammad Nasrullah',
                role: 'Pengembang Media Pembelajaran Interaktif 3D',
                institution: 'Universitas Lambung Mangkurat',
                programStudy: 'S-1 Teknologi Pendidikan',
                email: 'nasvisual31@gmail.com',
                bio: 'Media pembelajaran interaktif 3D "Detektif Fotosintesis" ini dikembangkan untuk memfasilitasi siswa kelas 4 SD dalam memahami bagian-bagian tumbuhan dan proses fotosintesis secara visual, konkret, dan menyenangkan.',
                supervisor: 'Brezto Asagi Dewantara, S.Pd., M.Pd.'
            },
            progress: {
                homeVisited: false,
                materiCompleted: false,
                simulasiUsed: false,
                quizScore: 0,
                badges: [],
                unlockedLevel: 1,
                completedLevels: [],
                xp: 0
            },
            history: []
        };

        try {
            const saved = localStorage.getItem(this.prefix + 'state');
            if (saved) {
                const parsed = JSON.parse(saved);
                let loadedStudents = parsed.students || [];
                
                // Jika students masih kosong, gunakan defaultStudents
                if (!Array.isArray(loadedStudents) || loadedStudents.length === 0) {
                    loadedStudents = [...defaultStudents];
                }

                // Jika user yang tersimpan adalah tamu atau belum ada siswa login aktif, setel ke awal 0 XP & Misi 1
                const isGuestUser = !parsed.user || parsed.user.isGuest || !parsed.user.name || parsed.user.name.toLowerCase() === 'tamu';
                if (isGuestUser) {
                    parsed.user = { name: 'Tamu', class: 'Umum', isGuest: true };
                    parsed.progress = {
                        homeVisited: Boolean(parsed.progress && parsed.progress.homeVisited),
                        materiCompleted: false,
                        simulasiUsed: false,
                        quizScore: 0,
                        badges: [],
                        unlockedLevel: 1,
                        completedLevels: [],
                        xp: 0
                    };
                    parsed.history = [];
                } else {
                    // Siswa terdaftar: sinkronisasikan nilai dari record siswa
                    const existingStudent = loadedStudents.find(s => s.name && s.name.toLowerCase() === parsed.user.name.toLowerCase() && s.class === parsed.user.class);
                    if (existingStudent) {
                        const studentScore = typeof existingStudent.score === 'number' ? existingStudent.score : 0;
                        const studentLevels = Array.isArray(existingStudent.completedLevels) ? existingStudent.completedLevels : [];
                        const maxLvl = studentLevels.length > 0 ? Math.max(...studentLevels) : 0;
                        parsed.progress = {
                            homeVisited: true,
                            materiCompleted: studentLevels.length >= 8,
                            simulasiUsed: Boolean(existingStudent.simulasiUsed),
                            quizScore: studentScore,
                            badges: [],
                            unlockedLevel: Math.max(maxLvl + 1, 1),
                            completedLevels: studentLevels,
                            xp: studentScore
                        };
                    }
                }

                // Normalisasi history agar setiap item memiliki nama siswa dan kelas
                const normalizedHistory = (parsed.history || []).map(item => ({
                    ...item,
                    user: item.user || (parsed.user ? parsed.user.name : 'Tamu'),
                    class: item.class || (parsed.user ? parsed.user.class : 'Umum')
                }));

                return {
                    ...defaultState,
                    ...parsed,
                    masterAudioEnabled: parsed.masterAudioEnabled !== undefined ? parsed.masterAudioEnabled : true,
                    students: loadedStudents,
                    history: normalizedHistory,
                    progress: {
                        ...defaultState.progress,
                        ...(parsed.progress || {})
                    },
                    developerProfile: (() => {
                        const dev = {
                            ...defaultState.developerProfile,
                            ...(parsed.developerProfile || {})
                        };
                        if (!dev.email || dev.email === 'pengembang@email.com') {
                            dev.email = 'nasvisual31@gmail.com';
                        }
                        if (!dev.supervisor || dev.supervisor === 'Dosen Pembimbing / Ahli Media' || dev.supervisor.toLowerCase().includes('dosen pembimbing')) {
                            dev.supervisor = 'Brezto Asagi Dewantara, S.Pd., M.Pd.';
                        }
                        if (!dev.programStudy || dev.programStudy.includes('Pendidikan Guru Sekolah Dasar') || dev.programStudy === 'Pendidikan Guru Sekolah Dasar (PGSD)') {
                            dev.programStudy = 'S-1 Teknologi Pendidikan';
                        }
                        return dev;
                    })()
                };
            }
            return defaultState;
        } catch (e) {
            console.error("Gagal membaca localStorage", e);
            return defaultState;
        }
    }

    saveState() {
        try {
            localStorage.setItem(this.prefix + 'state', JSON.stringify(this.state));
        } catch (e) {
            console.error("Gagal menyimpan ke localStorage", e);
        }
    }

    update(key, value) {
        if (key.includes('.')) {
            const parts = key.split('.');
            let current = this.state;
            for (let i = 0; i < parts.length - 1; i++) {
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
        } else {
            this.state[key] = value;
        }

        // Jika user login diperbarui, daftarkan siswa jika bukan mode tamu
        if (key === 'user' && value && value.name && !value.isGuest && value.name.toLowerCase() !== 'tamu') {
            this.registerStudent(value.name, value.class || '4A');
        }
        
        this.saveState();
        this.notify();
    }

    createFreshProgress() {
        return {
            homeVisited: true,
            materiCompleted: false,
            simulasiUsed: false,
            quizScore: 0,
            badges: [],
            unlockedLevel: 1,
            completedLevels: [],
            xp: 0
        };
    }

    loginGuest() {
        // Mode Tamu: Bersih total tanpa riwayat / progres tersimpan dari pengguna lain
        this.state.user = {
            name: 'Tamu',
            class: 'Umum',
            isGuest: true
        };
        this.state.progress = this.createFreshProgress();
        // Bersihkan hanya jejak Tamu, biarkan riwayat siswa tersimpan untuk admin
        this.state.history = (this.state.history || []).filter(h => h.user !== 'Tamu');
        this.saveState();
        this.notify();
    }

    loginStudent(name, cls = '4A') {
        const cleanName = (name || '').trim();
        const cleanClass = (cls || '4A').trim();
        if (!cleanName) return;

        if (!this.state.students) this.state.students = [];

        // Periksa apakah siswa sudah terdaftar sebelumnya
        const existing = this.state.students.find(
            s => s.name && s.name.toLowerCase() === cleanName.toLowerCase() && s.class === cleanClass
        );

        if (existing) {
            // Siswa terdaftar: Pulihkan seluruh progres, skor, misi, dan status simulasinya!
            existing.lastActive = new Date().toISOString();
            const completed = Array.isArray(existing.completedLevels) ? [...existing.completedLevels] : [];
            const maxCompleted = completed.length > 0 ? Math.max(...completed) : 0;
            const score = typeof existing.score === 'number' ? existing.score : 0;

            this.state.user = {
                name: existing.name,
                class: existing.class,
                isGuest: false
            };
            this.state.progress = {
                homeVisited: true,
                materiCompleted: completed.length >= 8,
                simulasiUsed: Boolean(existing.simulasiUsed),
                quizScore: score,
                badges: [],
                unlockedLevel: Math.max(maxCompleted + 1, 1),
                completedLevels: completed,
                xp: score
            };
        } else {
            // Siswa baru: Daftarkan akun baru dengan nilai awal bersih (0 XP)
            const newStudent = {
                id: 'std_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                name: cleanName,
                class: cleanClass,
                score: 0,
                completedLevels: [],
                simulasiUsed: false,
                firstLogin: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                totalActivities: 1
            };
            this.state.students.unshift(newStudent);

            this.state.user = {
                name: cleanName,
                class: cleanClass,
                isGuest: false
            };
            this.state.progress = this.createFreshProgress();
        }

        this.logAction('user_login');
        this.saveState();
        this.notify();
    }

    logout() {
        // Jika sedang login sebagai siswa terdaftar, simpan progres terakhir
        if (this.state.user && !this.state.user.isGuest) {
            this.syncStudentProgress();
            this.logAction('user_logout');
        }

        // Hapus hanya log aktivitas Tamu; riwayat siswa tetap tersimpan untuk dashboard guru
        this.state.history = (this.state.history || []).filter(h => h.user !== 'Tamu');
        this.state.user = null;
        this.state.progress = this.createFreshProgress();
        this.saveState();
        this.notify();
    }

    syncStudentProgress() {
        if (!this.state.user || this.state.user.isGuest) return;
        if (!this.state.students) return;

        const currentName = this.state.user.name;
        const currentClass = this.state.user.class;
        const student = this.state.students.find(
            s => s.name && s.name.toLowerCase() === currentName.toLowerCase() && s.class === currentClass
        );

        if (student) {
            student.score = this.state.progress.quizScore || this.state.progress.xp || 0;
            student.completedLevels = [...(this.state.progress.completedLevels || [])];
            student.simulasiUsed = Boolean(this.state.progress.simulasiUsed);
            student.lastActive = new Date().toISOString();
        }
    }

    registerStudent(name, cls = '4A') {
        if (!name || name.toLowerCase() === 'tamu') return;
        if (!this.state.students) this.state.students = [];
        const existing = this.state.students.find(s => s.name && s.name.toLowerCase() === name.toLowerCase() && s.class === cls);
        if (!existing) {
            const newStudent = {
                id: 'std_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                name: name,
                class: cls,
                score: this.state.progress.quizScore || 0,
                completedLevels: this.state.progress.completedLevels || [],
                simulasiUsed: Boolean(this.state.progress.simulasiUsed),
                firstLogin: new Date().toISOString(),
                lastActive: new Date().toISOString(),
                totalActivities: 1
            };
            this.state.students.unshift(newStudent);
        } else {
            existing.lastActive = new Date().toISOString();
        }
    }

    completeLevel(levelId, xpReward = 30) {
        if (!this.state.progress.completedLevels) {
            this.state.progress.completedLevels = [];
        }
        if (!this.state.progress.completedLevels.includes(levelId)) {
            this.state.progress.completedLevels.push(levelId);
            this.state.progress.xp = (this.state.progress.xp || 0) + xpReward;
            this.state.progress.quizScore = (this.state.progress.quizScore || 0) + xpReward;
        }
        const nextLevel = levelId + 1;
        if (nextLevel > (this.state.progress.unlockedLevel || 1)) {
            this.state.progress.unlockedLevel = nextLevel;
        }
        this.state.progress.materiCompleted = (this.state.progress.completedLevels.length >= 8);
        this.logAction(`completed_level_${levelId}`);

        if (this.state.user && !this.state.user.isGuest) {
            this.syncStudentProgress();
        }

        this.saveState();
        this.notify();
    }

    logAction(actionName) {
        const isGuest = Boolean(this.state.user && this.state.user.isGuest);
        const currentName = this.state.user ? this.state.user.name : 'Tamu';
        const currentClass = this.state.user ? this.state.user.class : 'Umum';

        const entry = {
            id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            action: actionName,
            user: currentName,
            class: currentClass,
            time: new Date().toISOString()
        };

        this.state.history.push(entry);

        // Hanya sinkronkan ke database rekapitulasi siswa jika BUKAN tamu
        if (!isGuest && this.state.students && currentName.toLowerCase() !== 'tamu') {
            let student = this.state.students.find(s => s.name && s.name.toLowerCase() === currentName.toLowerCase() && s.class === currentClass);
            if (!student) {
                student = {
                    id: 'std_' + Date.now(),
                    name: currentName,
                    class: currentClass,
                    score: this.state.progress.quizScore || 0,
                    completedLevels: this.state.progress.completedLevels || [],
                    simulasiUsed: Boolean(this.state.progress.simulasiUsed),
                    firstLogin: entry.time,
                    lastActive: entry.time,
                    totalActivities: 0
                };
                this.state.students.unshift(student);
            }
            student.totalActivities = (student.totalActivities || 0) + 1;
            student.lastActive = entry.time;
            student.score = this.state.progress.quizScore || student.score || 0;
            student.completedLevels = this.state.progress.completedLevels || student.completedLevels || [];
            student.simulasiUsed = Boolean(this.state.progress.simulasiUsed) || student.simulasiUsed;
        }

        this.saveState();
    }

    addStudent(name, cls = '4A', initialScore = 0) {
        if (!name) return;
        this.registerStudent(name, cls);
        const student = this.state.students.find(s => s.name && s.name.toLowerCase() === name.toLowerCase() && s.class === cls);
        if (student && initialScore > 0) {
            student.score = initialScore;
        }
        this.saveState();
        this.notify();
    }

    deleteStudent(studentId) {
        if (!this.state.students) return;
        this.state.students = this.state.students.filter(s => s.id !== studentId);
        this.saveState();
        this.notify();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notify() {
        this.listeners.forEach(cb => cb(this.state));
    }
}

export const store = new Store();

