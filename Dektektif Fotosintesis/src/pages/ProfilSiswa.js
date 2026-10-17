import { store } from '../utils/PenyimpananData.js';
import { formatActionName } from '../utils/EksporExcel.js';
import { attachAudioToggle } from '../utils/SistemSuara.js';

export function renderProfile(router) {
    const container = document.createElement('div');
    container.className = 'view-container';
    container.style.backgroundColor = '#f8fafc';
    container.style.overflowY = 'auto';
    container.style.padding = '20px';

    const state = store.state;
    const isLogged = !!state.user;

    const renderLogin = () => `
        <div class="glass-panel" style="max-width: 400px; margin: 60px auto; padding: 40px; text-align: center;">
            <i data-lucide="user-circle" style="width: 80px; height: 80px; color: var(--primary); margin-bottom: 20px;"></i>
            <h2 style="margin-bottom: 10px; color: var(--text-main);">Halo, Siswa!</h2>
            <p style="color: var(--text-muted); margin-bottom: 30px;">Tuliskan namamu untuk menyimpan progres belajar.</p>
            
            <div style="text-align: left; margin-bottom: 15px;">
                <label for="input-name" style="display: block; font-size: 0.88rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">Nama Lengkap Siswa:</label>
                <input type="text" id="input-name" placeholder="Tulis namamu (contoh: Budi Pratama)" maxlength="35" style="width: 100%; padding: 14px; border-radius: 10px; border: 2px solid #cbd5e1; font-size: 1rem; font-family: inherit; transition: var(--transition);">
                <small style="color: var(--text-muted); font-size: 0.8rem; display: block; margin-top: 6px;">
                    ✨ Hanya menggunakan huruf abjad (A–Z) tanpa angka atau simbol.
                </small>
            </div>

            <div style="text-align: left; margin-bottom: 25px;">
                <label style="display: block; font-size: 0.88rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">Pilih Kelas (Kelas 4):</label>
                <div id="class-letters-group" style="display: flex; gap: 8px; justify-content: space-between;">
                    ${['A', 'B', 'C', 'D', 'E'].map((letter, idx) => `
                        <button type="button" class="btn-class-pill ${idx === 0 ? 'selected' : ''}" data-letter="${letter}" style="flex: 1; padding: 12px 0; border: 2px solid ${idx === 0 ? 'var(--primary-dark)' : '#cbd5e1'}; background: ${idx === 0 ? 'var(--primary)' : 'white'}; color: ${idx === 0 ? 'white' : 'var(--text-main)'}; font-weight: 800; font-size: 1.05rem; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;">
                            4${letter}
                        </button>
                    `).join('')}
                </div>
                <input type="hidden" id="input-class" value="4A">
            </div>
            
            <button id="btn-login" class="btn btn-primary" style="width: 100%; margin-bottom: 10px; font-size: 1.1rem; padding: 14px;">Mulai Belajar</button>
            <button id="btn-login-guest" class="btn" style="width: 100%; margin-bottom: 15px; font-size: 0.95rem; padding: 12px; background: #fffbeb; color: #b45309; border: 1.5px solid #fde68a; font-weight: 700; border-radius: 10px;">
                <i data-lucide="sparkles"></i> Masuk sebagai Tamu (Mode Coba - Otomatis Reset)
            </button>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 15px;">
                <button id="btn-goto-dev-login" class="btn" style="width: 100%; background: #f0fdf4; color: var(--primary-dark); border: 1px solid #bbf7d0; font-size: 0.95rem; margin-bottom: 10px;">
                    <i data-lucide="award"></i> Profil Pengembang & Media
                </button>
                <button id="btn-back-home-login" class="btn" style="width: 100%; background: white; color: var(--text-muted); font-size: 0.9rem; border: 1px solid #e2e8f0;">
                    <i data-lucide="arrow-left"></i> Kembali ke Menu Utama
                </button>
            </div>
        </div>
    `;

    const renderDashboard = () => `
        <div style="max-width: 800px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button id="btn-back" class="btn btn-secondary" style="background: white; color: var(--text-main); border: 1px solid #e2e8f0;">
                    <i data-lucide="arrow-left"></i> Kembali
                </button>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button id="btn-master-audio-prof" class="btn-master-audio" style="width: 38px; height: 38px; border-radius: 12px;" title="Suara Master (Musik & Efek Suara)">
                        <i data-lucide="volume-2" style="width: 18px; height: 18px;"></i>
                    </button>
                    <button id="btn-goto-dev-dash" class="btn" style="background: white; border: 1px solid #bbf7d0; color: var(--primary-dark); font-size: 0.9rem; padding: 10px 16px;">
                        <i data-lucide="award"></i> Profil Pengembang
                    </button>
                    <button id="btn-logout" class="btn btn-secondary" style="background: var(--error); color: white;">
                        <i data-lucide="log-out"></i> Keluar
                    </button>
                </div>
            </div>

            <div class="glass-panel" style="padding: 30px; display: flex; align-items: center; gap: 20px; margin-bottom: 25px; background: linear-gradient(to right, var(--primary), var(--primary-light)); color: white;">
                <div style="background: rgba(255,255,255,0.2); border-radius: 50%; padding: 15px;">
                    <i data-lucide="${state.user.isGuest ? 'sparkles' : 'user'}" style="width: 60px; height: 60px;"></i>
                </div>
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <h2 style="font-size: 2rem; color: white; margin: 0;">${state.user.name}</h2>
                        ${state.user.isGuest ? '<span style="background: #fef08a; color: #854d0e; font-size: 0.8rem; font-weight: 800; padding: 2px 10px; border-radius: 20px;">MODE TAMU</span>' : ''}
                    </div>
                    <p style="font-size: 1.1rem; opacity: 0.9; margin: 0;">Kelas: ${state.user.class}</p>
                </div>
            </div>

            ${state.user.isGuest ? `
                <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 14px; padding: 14px 18px; margin-bottom: 25px; display: flex; align-items: center; gap: 14px; color: #92400e; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);">
                    <i data-lucide="info" style="color: #d97706; width: 24px; height: 24px; flex-shrink: 0;"></i>
                    <div style="font-size: 0.92rem; line-height: 1.45;">
                        <strong>Perhatian Mode Tamu:</strong> Aktivitas dan progres belajarmu bersifat uji coba sementara. Begitu kamu menekan tombol <strong>Keluar</strong>, seluruh riwayat otomatis tereset bersih tanpa tersimpan.
                    </div>
                </div>
            ` : ''}

            <h3 style="margin-bottom: 15px;">Statistik Belajar</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
                <div class="glass-panel" style="padding: 20px; text-align: center;">
                    <h4 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">Total Poin XP</h4>
                    <h2 style="color: var(--secondary-dark); font-size: 2.2rem;">${state.progress.quizScore || 0}</h2>
                </div>
                <div class="glass-panel" style="padding: 20px; text-align: center;">
                    <h4 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">Misi Selesai</h4>
                    <h2 style="color: var(--primary-dark); font-size: 2.2rem;">${(state.progress.completedLevels || []).length} / 8</h2>
                </div>
                <div class="glass-panel" style="padding: 20px; text-align: center;">
                    <h4 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 10px;">Simulasi Lab</h4>
                    <h2 style="color: var(--accent-dark); font-size: 2.2rem;">${state.progress.simulasiUsed ? 'Aktif' : 'Belum'}</h2>
                </div>
            </div>

            <h3 style="margin-bottom: 15px;">Riwayat Aktivitas Terbaru</h3>
            <div class="glass-panel" style="padding: 20px; max-height: 300px; overflow-y: auto;">
                ${(() => {
                    const studentLogs = (state.history || []).filter(item => 
                        state.user && 
                        item.user && 
                        item.user.toLowerCase() === state.user.name.toLowerCase() && 
                        item.class === state.user.class
                    );
                    if (studentLogs.length === 0) {
                        return '<p style="text-align: center; color: var(--text-muted);">Belum ada aktivitas pada sesi ini.</p>';
                    }
                    return studentLogs.slice().reverse().map(item => `
                        <div style="padding: 10px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600; color: var(--primary-dark); font-size: 0.9rem;">${formatActionName(item.action)}</span>
                            <span style="color: var(--text-muted); font-size: 0.82rem;">${new Date(item.time).toLocaleTimeString('id-ID')}</span>
                        </div>
                    `).join('');
                })()}
            </div>
        </div>
    `;

    container.innerHTML = isLogged ? renderDashboard() : renderLogin();

    // Event Listeners (Deferred)
    setTimeout(() => {
        if (!isLogged) {
            const inputName = container.querySelector('#input-name');
            const inputClass = container.querySelector('#input-class');
            const classPills = container.querySelectorAll('.btn-class-pill');

            // Filter ketat: Hanya abjad dan spasi, blokir angka dan simbol
            if (inputName) {
                inputName.addEventListener('input', (e) => {
                    const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    if (e.target.value !== cleaned) {
                        e.target.value = cleaned;
                    }
                });
            }

            // Pilihan abjad kelas 4A s/d 4E
            classPills.forEach(pill => {
                pill.addEventListener('click', () => {
                    classPills.forEach(p => {
                        p.classList.remove('selected');
                        p.style.background = 'white';
                        p.style.color = 'var(--text-main)';
                        p.style.borderColor = '#cbd5e1';
                    });
                    pill.classList.add('selected');
                    pill.style.background = 'var(--primary)';
                    pill.style.color = 'white';
                    pill.style.borderColor = 'var(--primary-dark)';
                    
                    const letter = pill.dataset.letter;
                    inputClass.value = `4${letter}`;
                });
            });

            container.querySelector('#btn-login').addEventListener('click', () => {
                const name = inputName ? inputName.value.trim() : '';
                const cls = inputClass ? inputClass.value.trim() : '4A';

                // Validasi nama hanya abjad tanpa simbol & angka
                const alphabetRegex = /^[a-zA-Z\s]+$/;
                if (!name) {
                    alert("Harap tuliskan namamu terlebih dahulu!");
                    if (inputName) inputName.focus();
                    return;
                }
                if (!alphabetRegex.test(name)) {
                    alert("Nama hanya boleh menggunakan huruf abjad (A–Z) tanpa angka atau simbol!");
                    if (inputName) inputName.focus();
                    return;
                }
                if (name.length < 2) {
                    alert("Nama minimal 2 huruf abjad!");
                    if (inputName) inputName.focus();
                    return;
                }

                store.loginStudent(name, cls);
                router.navigate('/profil'); // Reload to dashboard
            });

            const btnLoginGuest = container.querySelector('#btn-login-guest');
            if (btnLoginGuest) {
                btnLoginGuest.addEventListener('click', () => {
                    store.loginGuest();
                    router.navigate('/profil');
                });
            }

            const btnDevLogin = container.querySelector('#btn-goto-dev-login');
            if (btnDevLogin) btnDevLogin.addEventListener('click', () => router.navigate('/pengembang'));
            
            const btnBackHome = container.querySelector('#btn-back-home-login');
            if (btnBackHome) btnBackHome.addEventListener('click', () => router.navigate('/'));

            // Secret Tap pada icon avatar login (5x klik cepat untuk guru jika PID dalam mode full-screen)
            let loginTapCount = 0;
            let loginTapTimer = null;
            const loginIcon = container.querySelector('[data-lucide="user-circle"]');
            if (loginIcon) {
                loginIcon.parentElement.addEventListener('click', () => {
                    loginTapCount++;
                    clearTimeout(loginTapTimer);
                    loginTapTimer = setTimeout(() => { loginTapCount = 0; }, 2500);
                    if (loginTapCount >= 5) {
                        loginTapCount = 0;
                        window.location.hash = 'admin';
                    }
                });
            }
        } else {
            container.querySelector('#btn-back').addEventListener('click', () => router.navigate('/'));
            const btnAudioProf = container.querySelector('#btn-master-audio-prof');
            if (btnAudioProf) attachAudioToggle(btnAudioProf);

            const btnDevDash = container.querySelector('#btn-goto-dev-dash');
            if (btnDevDash) btnDevDash.addEventListener('click', () => router.navigate('/pengembang'));
            
            container.querySelector('#btn-logout').addEventListener('click', () => {
                store.logout();
                router.navigate('/profil');
            });

            // Secret Tap pada kartu avatar siswa (5x klik cepat untuk guru jika PID dalam mode full-screen)
            let dashTapCount = 0;
            let dashTapTimer = null;
            const dashAvatar = container.querySelector('[data-lucide="user"]');
            if (dashAvatar) {
                dashAvatar.parentElement.addEventListener('click', () => {
                    dashTapCount++;
                    clearTimeout(dashTapTimer);
                    dashTapTimer = setTimeout(() => { dashTapCount = 0; }, 2500);
                    if (dashTapCount >= 5) {
                        dashTapCount = 0;
                        window.location.hash = 'admin';
                    }
                });
            }
        }
        if (window.lucide) window.lucide.createIcons();
    }, 50);

    return container;
}
