// Komponen Panduan & Petunjuk Penggunaan Media Interaktif 3D
export function showGuideModal(initialTab = '3d') {
    // Cek apakah sudah ada modal di DOM, jika ada hapus dulu
    const existing = document.getElementById('guide-modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'guide-modal-overlay';
    overlay.className = 'modal-backdrop-blur';
    overlay.style.zIndex = '10000';

    overlay.innerHTML = `
        <div class="modal-dialog-large" style="max-width: 720px; padding: clamp(20px, 3.5vw, 32px); text-align: left;">
            <button id="guide-btn-close" class="modal-close-btn" aria-label="Tutup Panduan">✕</button>

            <!-- Header Modal -->
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                <div style="width: 52px; height: 52px; border-radius: 16px; background: #ecfdf5; border: 2px solid #86efac; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">
                    📖
                </div>
                <div>
                    <h2 style="margin: 0; font-size: clamp(1.2rem, 3vw, 1.6rem); color: var(--primary-dark); font-weight: 800;">
                        Petunjuk Penggunaan Media
                    </h2>
                    <p style="margin: 2px 0 0 0; color: var(--text-muted); font-size: 0.88rem;">
                        Panduan lengkap petualangan belajar fotosintesis dan anatomi 3D untuk siswa & guru.
                    </p>
                </div>
            </div>

            <!-- Tab Navigasi Panduan -->
            <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 18px; border-bottom: 2px solid #f1f5f9;" id="guide-tabs-container">
                <button class="guide-tab-btn ${initialTab === '3d' ? 'active' : ''}" data-tab="3d" style="padding: 8px 14px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🌻 Eksplorasi 3D
                </button>
                <button class="guide-tab-btn ${initialTab === 'leaf' ? 'active' : ''}" data-tab="leaf" style="padding: 8px 14px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🍃 Belah Daun (Mesofil)
                </button>
                <button class="guide-tab-btn ${initialTab === 'misi' ? 'active' : ''}" data-tab="misi" style="padding: 8px 14px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🗺️ 8 Level & Kuis
                </button>
                <button class="guide-tab-btn ${initialTab === 'simulasi' ? 'active' : ''}" data-tab="simulasi" style="padding: 8px 14px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    🧪 Lab Simulasi
                </button>
                <button class="guide-tab-btn ${initialTab === 'profil' ? 'active' : ''}" data-tab="profil" style="padding: 8px 14px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.85rem; cursor: pointer; white-space: nowrap; transition: all 0.2s;">
                    👤 Profil Siswa
                </button>
            </div>

            <!-- Tab Contents -->
            <div id="guide-content-area" style="min-height: 280px; max-height: 55vh; overflow-y: auto; padding-right: 6px;">
                <!-- Konten dinamis diisi oleh fungsi di bawah -->
            </div>

            <!-- Footer Modal Action -->
            <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 10px;">
                <button id="guide-btn-action-close" class="modal-btn-action" style="padding: 10px 24px; font-size: 0.95rem;">
                    <i data-lucide="check"></i> SAYA MENGERTI
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Style tambahan khusus tab panduan
    const guideStyle = document.createElement('style');
    guideStyle.innerHTML = `
        .guide-tab-btn {
            background: #f1f5f9;
            color: var(--text-muted);
        }
        .guide-tab-btn.active {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);
        }
        .guide-step-card {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 14px;
            padding: 14px 18px;
            margin-bottom: 12px;
            display: flex;
            gap: 14px;
            align-items: flex-start;
        }
        .guide-step-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: white;
            border: 1.5px solid #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            flex-shrink: 0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
    `;
    overlay.appendChild(guideStyle);

    // Data Konten Tiap Tab
    const guideContents = {
        '3d': `
            <div>
                <h3 style="color: var(--primary-dark); font-size: 1.15rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>🌻</span> Navigasi Model 3D Bunga Matahari
                </h3>
                
                <div class="guide-step-card">
                    <div class="guide-step-icon">👆</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Memutar Model 360 Derajat</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            <strong>Di HP / Tablet:</strong> Geser layar dengan 1 jari ke kiri, kanan, atas, atau bawah.<br>
                            <strong>Di Laptop / Komputer:</strong> Klik tombol kiri mouse, tahan, lalu geser.
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">🔍</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Memperbesar & Memperkecil (Zoom)</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            <strong>Di HP / Tablet:</strong> Cubit layar dengan 2 jari (pinch to zoom).<br>
                            <strong>Di Laptop / Komputer:</strong> Putar roda gulir (*scroll wheel*) pada mouse.
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">⚪</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Pencet Titik Tombol Bulat Putih</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Di atas model 3D terdapat <strong>titik tombol bulat putih berdenyut</strong> pada organ Bunga, Daun, Batang, dan Akar. Sentuh titik bulat putih tersebut untuk membuka penjelasan rahasia sains dan mendengarkan suaranya!
                        </p>
                    </div>
                </div>
            </div>
        `,
        'leaf': `
            <div>
                <h3 style="color: var(--primary-dark); font-size: 1.15rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>🍃</span> Menjelajahi Dapur Daun (Sel Mesofil)
                </h3>

                <div class="guide-step-card">
                    <div class="guide-step-icon">✂️</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Cara Masuk ke Sel Mesofil</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Sentuh titik tombol <strong>Daun</strong> lalu tekan tombol hijau <strong>"BELAH DAUN & MASUK KE SEL MESOFIL"</strong>, atau kamu juga bisa <strong>klik 2x (double-click)</strong> langsung pada daun di model 3D!
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">🔬</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Melihat Komponen Dapur Fotosintesis</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Di dalam daun, kamu bisa melihat:
                            <br>• <strong>🟢 Kloroplas:</strong> Pabrik kecil berisi zat hijau klorofil penangkap cahaya.
                            <br>• <strong>👄 Pori Stomata:</strong> Pintu di bawah daun tempat masuknya gas CO₂ dan keluarnya O₂.
                            <br>• <strong>💧 Urat Daun (Xilem):</strong> Pipa pembuluh pengalir air dari akar tanah.
                        </p>
                    </div>
                </div>
            </div>
        `,
        'misi': `
            <div>
                <h3 style="color: var(--primary-dark); font-size: 1.15rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>🗺️</span> 8 Level Petualangan & Syarat Kuis
                </h3>

                <div class="guide-step-card">
                    <div class="guide-step-icon">🔒</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Syarat Membuka Level Berikutnya</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Level 2 sampai Level 8 berstatus <strong>terkunci (🔒)</strong>. Syarat untuk membuka level selanjutnya adalah kamu harus membaca materi dan <strong>menjawab soal kuis level tersebut dengan benar</strong>!
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">💡</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Jika Jawaban Belum Tepat</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Jangan takut salah! Akan muncul jendela <strong>"Belum Tepat!"</strong> lengkap dengan <strong>petunjuk edukatif</strong> yang membantumu mengingat kembali. Cukup tekan tombol hijau <strong>"COBA LAGI"</strong> untuk menjawab ulang!
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">⭐</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Hadiah Bintang XP & Centang Hijau</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Setiap kamu menjawab benar, kartu misimu akan mendapatkan centang hijau <strong>(✔)</strong> dan poin XP akan bertambah untuk menaikkan level penghargaanmu!
                        </p>
                    </div>
                </div>
            </div>
        `,
        'simulasi': `
            <div>
                <h3 style="color: var(--primary-dark); font-size: 1.15rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>🧪</span> Laboratorium Simulasi Fotosintesis
                </h3>

                <div class="guide-step-card">
                    <div class="guide-step-icon">☀️</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Eksperimen Siang & Malam</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Ubah suasana dari siang terang benderang menjadi malam gelap gulita. Amati bagaimana fotosintesis terhenti di malam hari karena tidak ada cahaya!
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">🌧️</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Pengaturan Hujan & Suhu</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Nyalakan hujan untuk mengisi air tanah. Naikkan suhu hingga di atas 35°C untuk melihat stomata menutup diri agar tidak kekeringan!
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">🌫️</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Eksperimen Kabut Asap</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Tarik *slider* kabut asap dari tipis hingga tebal untuk menyaksikan bagaimana partikel polusi menghalangi cahaya matahari dan menyumbat stomata daun.
                        </p>
                    </div>
                </div>
            </div>
        `,
        'profil': `
            <div>
                <h3 style="color: var(--primary-dark); font-size: 1.15rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <span>👤</span> Profil Siswa & Pilihan Kelas
                </h3>

                <div class="guide-step-card">
                    <div class="guide-step-icon">✏️</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Nama Menggunakan Huruf Abjad</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Tuliskan nama lengkapmu menggunakan huruf abjad (A–Z) tanpa angka atau simbol.
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">🏫</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Pilihan Kelas 4 (4A sampai 4E)</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Tingkat kelas ditetapkan pada angka 4 dengan tombol pilihan huruf abjad: <strong>4A, 4B, 4C, 4D, atau 4E</strong>.
                        </p>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="guide-step-icon">💾</div>
                    <div>
                        <h4 style="margin: 0 0 4px 0; color: var(--text-main); font-size: 0.95rem;">Penyimpanan Progres Otomatis</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.5;">
                            Semua poin XP, kuis yang kamu selesaikan, dan level yang terbuka tersimpan aman secara otomatis di browser perangkatmu.
                        </p>
                    </div>
                </div>
            </div>
        `
    };

    const contentArea = overlay.querySelector('#guide-content-area');
    const updateTabContent = (tabKey) => {
        contentArea.innerHTML = guideContents[tabKey] || guideContents['3d'];
        overlay.querySelectorAll('.guide-tab-btn').forEach(btn => {
            if (btn.dataset.tab === tabKey) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        if (window.lucide) window.lucide.createIcons();
    };

    updateTabContent(initialTab);

    // Event Listeners Tab
    overlay.querySelectorAll('.guide-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateTabContent(btn.dataset.tab);
        });
    });

    // Close Handlers
    const closeGuide = () => {
        overlay.remove();
    };

    overlay.querySelector('#guide-btn-close').addEventListener('click', closeGuide);
    overlay.querySelector('#guide-btn-action-close').addEventListener('click', closeGuide);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeGuide();
    });

    if (window.lucide) window.lucide.createIcons();
}
