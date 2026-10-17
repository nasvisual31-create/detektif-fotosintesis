import { store } from '../utils/PenyimpananData.js';
import { attachAudioToggle } from '../utils/SistemSuara.js';

export function renderDeveloper(router) {
    const container = document.createElement('div');
    container.className = 'view-container';
    container.style.backgroundColor = '#f0fdf4';
    container.style.overflowY = 'auto';
    container.style.padding = 'clamp(16px, 3vw, 32px)';

    let dev = { ...store.state.developerProfile };
    // Automatically migrate to Muhammad Nasrullah and custom photo
    if (!dev.photo || dev.photo.includes('developer_badge_ref') || dev.photo === './assets/developer_photo.png' || dev.photo === './assets/developer_photo_card.png') {
        dev.photo = './assets/Pengembang.jpeg';
        store.update('developerProfile', dev);
    }
    if (!dev.name || dev.name === 'Nama Pengembang') {
        dev.name = 'Muhammad Nasrullah';
        store.update('developerProfile', dev);
    }
    if (!dev.institution || dev.institution === 'Universitas / Instansi Pendidikan') {
        dev.institution = 'Universitas Lambung Mangkurat';
        store.update('developerProfile', dev);
    }
    if (!dev.programStudy || dev.programStudy.includes('Pendidikan Guru Sekolah Dasar') || dev.programStudy === 'Pendidikan Guru Sekolah Dasar (PGSD)') {
        dev.programStudy = 'S-1 Teknologi Pendidikan';
        store.update('developerProfile', dev);
    }
    if (!dev.email || dev.email === 'pengembang@email.com' || dev.email === 'pengembang@upi.edu') {
        dev.email = 'nasvisual31@gmail.com';
        store.update('developerProfile', dev);
    }
    if (!dev.supervisor || dev.supervisor === 'Dosen Pembimbing / Ahli Media' || dev.supervisor.toLowerCase().includes('dosen pembimbing')) {
        dev.supervisor = 'Brezto Asagi Dewantara, S.Pd., M.Pd.';
        store.update('developerProfile', dev);
    }
    let isEditing = false;

    // Default SVG avatar jika belum ada foto
    const defaultAvatarSvg = `
        <svg viewBox="0 0 120 120" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="58" fill="#ecfdf5" stroke="#22c55e" stroke-width="4"/>
            <circle cx="60" cy="48" r="22" fill="#86efac"/>
            <path d="M26 102C26 84 41 74 60 74C79 74 94 84 94 102" fill="#22c55e"/>
            <circle cx="60" cy="48" r="16" fill="#fef08a"/>
            <!-- Sunflower Petals Mini Accent -->
            <circle cx="60" cy="24" r="4" fill="#fbbf24"/>
            <circle cx="60" cy="72" r="4" fill="#fbbf24"/>
            <circle cx="36" cy="48" r="4" fill="#fbbf24"/>
            <circle cx="84" cy="48" r="4" fill="#fbbf24"/>
        </svg>
    `;

    function renderContent() {
        const hasPhoto = Boolean(dev.photo);

        container.innerHTML = `
            <div style="max-width: 960px; margin: 0 auto; padding-bottom: 50px;">
                <!-- Top Navigation & Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <button id="btn-back-dev" class="btn" style="background: white; color: var(--text-main); border: 1px solid #cbd5e1; box-shadow: var(--shadow-sm); font-size: 0.95rem; padding: 10px 18px;">
                        <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i> Kembali ke Menu Utama
                    </button>
                    <!-- Master Audio Global Button -->
                    <button id="btn-master-audio-dev" class="btn-master-audio" style="width: 38px; height: 38px; border-radius: 12px;" title="Suara Master (Musik & Efek Suara)">
                        <i data-lucide="volume-2" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>

                <!-- Page Title Badge -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-flex; align-items: center; gap: 8px; background: white; padding: 6px 18px; border-radius: var(--radius-full); box-shadow: var(--shadow-sm); border: 1px solid #e2e8f0; margin-bottom: 12px;">
                        <span style="font-size: 1.2rem;">🌻</span>
                        <span style="font-weight: 700; color: var(--primary-dark); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Informasi Media & Pengembang</span>
                    </div>
                    <h1 style="font-size: clamp(1.8rem, 4vw, 2.4rem); color: var(--text-main); margin-bottom: 8px;">Profil Pengembang</h1>
                    <p style="color: var(--text-muted); font-size: clamp(0.95rem, 2vw, 1.05rem); max-width: 620px; margin: 0 auto;">
                        Identitas pengembang media pembelajaran interaktif serta rincian software, asset, dan tata suara yang digunakan dalam project.
                    </p>
                </div>

                <!-- Developer Profile Card -->
                <div class="glass-panel" style="padding: clamp(20px, 4vw, 36px); margin-bottom: 36px; border: 2px solid rgba(74, 222, 128, 0.3); background: rgba(255, 255, 255, 0.95); position: relative; overflow: hidden;">
                    <!-- Ambient Header Glow -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));"></div>

                    ${isEditing ? renderEditForm() : renderViewCard(hasPhoto)}
                </div>

                <!-- Section: Project Overview & Specs -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h2 style="font-size: 1.5rem; color: var(--text-main); display: flex; align-items: center; gap: 10px;">
                            <i data-lucide="layers" style="color: var(--primary-dark); width: 26px; height: 26px;"></i>
                            Spesifikasi & Komponen Project
                        </h2>
                        <p style="color: var(--text-muted); font-size: 0.92rem;">Rincian teknologi, software, aset grafis 3D, dan sound design yang membangun aplikasi ini.</p>
                    </div>
                </div>

                <!-- 3 Feature Pillars: Software, Asset, Sound -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 36px;">
                    
                    <!-- 1. SOFTWARE & TEKNOLOGI -->
                    <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; background: white; border-top: 4px solid var(--accent); height: 100%;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #e0f2fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="code" style="color: var(--accent-dark); width: 24px; height: 24px;"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 2px;">Software & Teknologi</h3>
                                <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-dark); background: #f0f9ff; padding: 2px 8px; border-radius: var(--radius-full);">Core Engine & Stack</span>
                            </div>
                        </div>

                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 0.92rem; color: var(--text-main);">
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="box" style="color: var(--accent-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Three.js (r128) & WebGL:</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Mesin rendering 3D real-time di peramban web untuk pencahayaan, material, bayangan, kamera OrbitControls, dan simulasi jaringan mesofil.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="layout" style="color: var(--accent-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>HTML5, CSS3 & JavaScript (ES6+ Modules):</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Arsitektur Single Page Application (SPA) mandiri yang cepat, responsif, dan ringan tanpa dependensi framework besar.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="cpu" style="color: var(--accent-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Blender 3D:</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Software pemodelan, texturing, rigging, dan optimasi kompresi poligon anatomi bunga matahari menjadi format GLTF/GLB.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="wifi-off" style="color: var(--accent-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Progressive Web App (PWA):</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Dilengkapi Service Worker & Cache API sehingga media dapat dijalankan secara 100% luring (offline) di sekolah.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- 2. ASSET 3D & GRAFIS -->
                    <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; background: white; border-top: 4px solid var(--primary-dark); height: 100%;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #dcfce7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="palette" style="color: var(--primary-dark); width: 24px; height: 24px;"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 2px;">Asset 3D & Grafis</h3>
                                <span style="font-size: 0.78rem; font-weight: 700; color: var(--primary-dark); background: #f0fdf4; padding: 2px 8px; border-radius: var(--radius-full);">3D Models & UI Design</span>
                            </div>
                        </div>

                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 0.92rem; color: var(--text-main);">
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="sun" style="color: var(--primary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Model 3D Bunga Matahari (<code>bunga_matahari.glb</code>):</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Model anatomi lengkap tumbuhan meliputi mahkota bunga, tangkai, helai daun, dan sistem perakaran tanaman.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="microscope" style="color: var(--primary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Model Prosedural 3D Jaringan Daun:</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Visualisasi 3D sel mesofil palisade, sel bunga karang (spons), kloroplas hijau berputar, tilakoid, serta pori stomata.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="sparkles" style="color: var(--primary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Sistem Partikel & Badge Molekul:</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Animasi partikel interaktif: foton cahaya matahari, tetesan air (H₂O), gas CO₂, glukosa energi, dan oksigen (O₂).</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="type" style="color: var(--primary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Tipografi & Iconography:</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Google Fonts "Nunito" yang ramah untuk usia anak-anak SD, dikombinasikan dengan icon set Lucide SVG beresolusi tinggi.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- 3. SOUND & AUDIO -->
                    <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; background: white; border-top: 4px solid var(--secondary-dark); height: 100%;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: #fef3c7; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i data-lucide="volume-2" style="color: var(--secondary-dark); width: 24px; height: 24px;"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 2px;">Sound & Tata Suara</h3>
                                <span style="font-size: 0.78rem; font-weight: 700; color: var(--secondary-dark); background: #fffbeb; padding: 2px 8px; border-radius: var(--radius-full);">Synthesized Audio & TTS</span>
                            </div>
                        </div>

                        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; font-size: 0.92rem; color: var(--text-main);">
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="wind" style="color: var(--secondary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Ambient Wind Synthesizer (BGM):</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Efek suara angin sepoi-sepoi taman yang disintesis parametrik via Web Audio API (White Noise + Bandpass Filter + LFO Oscillator) tanpa buffering file MP3 besar.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="bell" style="color: var(--secondary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Sound Effects Interaktif (SFX):</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Nada klik responsif, audio rintik hujan, chord ceria saat eksperimen berhasil, serta audio kabut asap atmosferik.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="mic" style="color: var(--secondary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Narasi Suara Siswa (Text-to-Speech):</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Dukungan Web Speech Synthesis API Bahasa Indonesia berintonasi ramah untuk membaca penjelasan materi bagi siswa SD.</p>
                                </div>
                            </li>
                            <li style="display: flex; gap: 10px; align-items: flex-start;">
                                <i data-lucide="award" style="color: var(--secondary-dark); width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
                                <div>
                                    <strong>Audio Reward Kuis & Selebrasi:</strong>
                                    <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">Feedback instan saat siswa menjawab benar/salah pada kuis, disertai letupan visual konfeti.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                <!-- Footer Summary Card -->
                <div class="glass-panel" style="padding: 24px; text-align: center; background: white; border: 1px solid #e2e8f0;">
                    <p style="font-weight: 700; color: var(--text-main); font-size: 1rem; margin-bottom: 6px;">
                        "Media Pembelajaran Interaktif 3D: Detektif Fotosintesis"
                    </p>
                    <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 700px; margin: 0 auto;">
                        Dirancang sesuai Capaian Pembelajaran IPAS Kelas 4 Sekolah Dasar (Fase B - Kurikulum Merdeka) untuk mempermudah pemahaman konsep fotosintesis dan anatomi tumbuhan secara visual, interaktif, dan aplikatif.
                    </p>
                </div>
            </div>
        `;

        setupEventListeners();
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // View Mode Card (Creative Sunflower Eco-Tech VIP Lanyard Pass)
    function renderViewCard(hasPhoto) {
        const photoSrc = (dev.photo && !dev.photo.includes('developer_badge_ref') && dev.photo !== './assets/developer_photo.png' && dev.photo !== './assets/developer_photo_card.png') 
            ? dev.photo 
            : './assets/Pengembang.jpeg';
        const devName = dev.name && dev.name !== 'Nama Pengembang' ? dev.name : 'Muhammad Nasrullah';
        const devRole = dev.role || 'Pengembang Media Pembelajaran Interaktif 3D';

        return `
            <div style="display: flex; gap: clamp(24px, 4vw, 44px); align-items: flex-start; flex-wrap: wrap;">
                
                <!-- Interactive Hanging Lanyard ID Badge (Left Column) -->
                <div style="flex: 0 0 auto; margin: 0 auto; display: flex; flex-direction: column; align-items: center; user-select: none;">
                    
                    <!-- Lanyard Hanging Stage with Physics Engine -->
                    <div id="lanyard-stage" style="width: 276px; height: 465px; position: relative; perspective: 1200px; touch-action: none; overflow: visible;">
                        
                        <!-- Ceiling Anchor Bracket (Titanium & Gold Mount) -->
                        <div id="lanyard-mount" style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 76px; height: 13px; background: linear-gradient(180deg, #022c22 0%, #064e3b 70%, #047857 100%); border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.5); border-bottom: 2px solid #fbbf24; z-index: 20;"></div>

                        <!-- Dynamic SVG Strap Layer: Eco-Tech Cyber Emerald with Neon Mint & Gold Stitches -->
                        <svg id="lanyard-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; z-index: 5;">
                            <defs>
                                <linearGradient id="lanyardStrapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="#022c22" />
                                    <stop offset="15%" stop-color="#065f46" />
                                    <stop offset="50%" stop-color="#047857" />
                                    <stop offset="85%" stop-color="#065f46" />
                                    <stop offset="100%" stop-color="#022c22" />
                                </linearGradient>
                                <filter id="lanyardShadow" x="-30%" y="-10%" width="160%" height="130%">
                                    <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="rgba(6, 78, 59, 0.35)" />
                                </filter>
                            </defs>
                            <!-- Continuous dynamic strap body -->
                            <path id="lanyard-strap-path" fill="url(#lanyardStrapGrad)" filter="url(#lanyardShadow)" d="" />
                            <!-- Gold accent border stitches (left) -->
                            <path id="lanyard-stitch-l" fill="none" stroke="#fbbf24" stroke-width="1.3" stroke-dasharray="4,2.5" d="" />
                            <!-- Mint neon accent border stitches (right) -->
                            <path id="lanyard-stitch-r" fill="none" stroke="#34d399" stroke-width="1.3" stroke-dasharray="4,2.5" d="" />
                            <!-- Hidden path along center of strap for text alignment -->
                            <path id="lanyard-text-path" fill="none" stroke="transparent" d="" />
                            <!-- Dynamic Woven Branding text along strap -->
                            <text font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="8.2" font-weight="900" letter-spacing="3.8" fill="#fef08a" text-transform="uppercase">
                                <textPath id="lanyard-text-ref" href="#lanyard-text-path" startOffset="48%" text-anchor="middle">
                                    🌻 SUNFLOWER EDUTECH • 3D CREATOR •
                                </textPath>
                            </text>
                        </svg>

                        <!-- Hanging Physics-Draggable ID Card (VIP Creator Pass) -->
                        <div id="lanyard-card" style="position: absolute; top: 110px; left: 50%; margin-left: -124px; width: 248px; background: #ffffff; border-radius: 24px; padding: 12px 12px 16px 12px; box-shadow: 0 24px 50px -10px rgba(6, 78, 59, 0.28), 0 8px 20px rgba(0, 0, 0, 0.08); border: 2px solid #10b981; cursor: grab; z-index: 10; transform-origin: 124px -35px; will-change: transform;">
                            
                            <!-- Clasp & Mascot Assembly hooked directly into the punch-hole -->
                            <div id="lanyard-clip-assembly" style="position: absolute; top: -56px; left: 50%; transform: translateX(-50%); width: 44px; display: flex; flex-direction: column; align-items: center; z-index: 12; pointer-events: none;">
                                
                                <!-- Custom 3D Sunflower Mascot Enamel Pin -->
                                <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); margin-bottom: -7px; z-index: 3;">
                                    <svg width="42" height="42" viewBox="0 0 42 42" style="overflow: visible;">
                                        <defs>
                                            <radialGradient id="sunGold" cx="35%" cy="35%" r="65%">
                                                <stop offset="0%" stop-color="#fffbeb" />
                                                <stop offset="35%" stop-color="#fbbf24" />
                                                <stop offset="75%" stop-color="#d97706" />
                                                <stop offset="100%" stop-color="#78350f" />
                                            </radialGradient>
                                            <radialGradient id="sunCenter" cx="35%" cy="35%" r="65%">
                                                <stop offset="0%" stop-color="#78350f" />
                                                <stop offset="70%" stop-color="#451a03" />
                                                <stop offset="100%" stop-color="#1c1917" />
                                            </radialGradient>
                                        </defs>
                                        <g transform="translate(21, 21)">
                                            <circle cx="0" cy="0" r="18" fill="rgba(251, 191, 36, 0.2)" />
                                            <!-- 12 Petals with golden rim -->
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(0)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(30)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(60)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(90)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(120)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(150)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(180)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(210)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(240)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(270)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(300)" />
                                            <path d="M 0 -8 C -4 -13 0 -19 0 -19 C 0 -19 4 -13 0 -8 Z" fill="url(#sunGold)" stroke="#b45309" stroke-width="0.7" transform="rotate(330)" />
                                            <!-- Center Golden Rim -->
                                            <circle cx="0" cy="0" r="10" fill="url(#sunGold)" stroke="#78350f" stroke-width="0.8" />
                                            <!-- Seed Center Face -->
                                            <circle cx="0" cy="0" r="8.5" fill="url(#sunCenter)" />
                                            <!-- Cute Eyes & Smile -->
                                            <circle cx="-3" cy="-1.5" r="1.4" fill="#ffffff" />
                                            <circle cx="3" cy="-1.5" r="1.4" fill="#ffffff" />
                                            <circle cx="-2.7" cy="-1.7" r="0.7" fill="#0f172a" />
                                            <circle cx="3.3" cy="-1.7" r="0.7" fill="#0f172a" />
                                            <!-- Rosy Cheeks -->
                                            <circle cx="-5" cy="1.2" r="1.1" fill="#f43f5e" opacity="0.9" />
                                            <circle cx="5" cy="1.2" r="1.1" fill="#f43f5e" opacity="0.9" />
                                            <path d="M -2.8 1.8 Q 0 4.2 2.8 1.8" fill="none" stroke="#fef08a" stroke-width="1" stroke-linecap="round" />
                                            <!-- Shimmer Sparkle -->
                                            <circle cx="5.5" cy="-5" r="1.2" fill="#fff" opacity="0.9" />
                                        </g>
                                    </svg>
                                </div>

                                <!-- Heavy-Duty Gold & Titanium Carabiner Clasp -->
                                <svg width="34" height="42" viewBox="0 0 34 42" style="overflow: visible; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
                                    <defs>
                                        <linearGradient id="goldCarabiner" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stop-color="#fffbeb" />
                                            <stop offset="25%" stop-color="#fde047" />
                                            <stop offset="55%" stop-color="#f59e0b" />
                                            <stop offset="85%" stop-color="#d97706" />
                                            <stop offset="100%" stop-color="#92400e" />
                                        </linearGradient>
                                        <linearGradient id="titaniumCoupler" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stop-color="#0f172a" />
                                            <stop offset="35%" stop-color="#334155" />
                                            <stop offset="70%" stop-color="#475569" />
                                            <stop offset="100%" stop-color="#0f172a" />
                                        </linearGradient>
                                    </defs>
                                    <!-- Swivel Ring where strap loop locks -->
                                    <ellipse cx="17" cy="7" rx="9.5" ry="5.8" fill="none" stroke="url(#goldCarabiner)" stroke-width="3" />
                                    <ellipse cx="17" cy="7" rx="6.5" ry="3.5" fill="#064e3b" opacity="0.45" />
                                    <!-- Knurled Titanium Collar -->
                                    <rect x="12" y="11" width="10" height="7" rx="2" fill="url(#titaniumCoupler)" stroke="#fbbf24" stroke-width="0.7" />
                                    <line x1="14.5" y1="12" x2="14.5" y2="17" stroke="#64748b" stroke-width="0.8" />
                                    <line x1="17" y1="12" x2="17" y2="17" stroke="#fbbf24" stroke-width="0.8" />
                                    <line x1="19.5" y1="12" x2="19.5" y2="17" stroke="#64748b" stroke-width="0.8" />
                                    <!-- Carabiner Clasp Hook through the card hole -->
                                    <path d="M 13 18 L 13 32 C 13 36 21 36 21 32 L 21 24 C 21 21 19 18 17 18 Z" fill="none" stroke="url(#goldCarabiner)" stroke-width="2.6" stroke-linejoin="round" />
                                    <!-- Spring Gate Latch Bar -->
                                    <line x1="13.5" y1="21" x2="18.5" y2="29" stroke="#fffbeb" stroke-width="1.8" stroke-linecap="round" />
                                </svg>

                                <!-- Strap connection anchor point (center of the swivel ring) -->
                                <div id="lanyard-clasp-anchor" style="position: absolute; top: 38px; left: 50%; width: 2px; height: 2px;"></div>
                            </div>

                            <!-- Top Oblong Punch-Hole Slot with Brass Trim -->
                            <div style="width: 48px; height: 11px; background: #064e3b; border: 1.5px solid #fbbf24; border-radius: 6px; margin: 4px auto 10px auto; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6); position: relative;"></div>

                            <!-- Framed Developer Portrait Photo (Pure Photo Only) -->
                            <div style="width: 100%; height: 305px; border-radius: 18px; overflow: hidden; background: #0f172a; position: relative; box-shadow: 0 4px 14px rgba(6,78,59,0.18);">
                                <img id="preview-photo" src="${photoSrc}" alt="${devName}" style="width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; pointer-events: none; user-select: none;">
                                <!-- Holographic sheen overlay -->
                                <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(52, 211, 153, 0.08) 100%); pointer-events: none;"></div>
                            </div>

                        </div>



                    </div>
                </div>

                <!-- Identity & Details Column (Right Column) -->
                <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 20px;">
                    <!-- Header Info -->
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
                            <span style="background: #dcfce7; color: #15803d; font-weight: 800; font-size: 0.8rem; padding: 4px 12px; border-radius: var(--radius-full); text-transform: uppercase; border: 1px solid #86efac;">
                                Pengembang Utama
                            </span>
                        </div>
                        
                        <h2 style="font-size: clamp(1.5rem, 3.5vw, 2.2rem); color: var(--text-main); margin-bottom: 4px; font-weight: 900;">
                            ${devName}
                        </h2>
                        
                        <p style="font-weight: 800; color: #059669; font-size: 1.1rem; margin-bottom: 10px;">
                            ${devRole}
                        </p>

                        <div style="display: flex; flex-direction: column; gap: 6px; color: var(--text-muted); font-size: 0.95rem;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="graduation-cap" style="width: 18px; height: 18px; color: #059669;"></i>
                                <span>${dev.programStudy || 'S-1 Teknologi Pendidikan'}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="building-2" style="width: 18px; height: 18px; color: #059669;"></i>
                                <span>${dev.institution || 'Universitas Lambung Mangkurat'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Detail Cards (Dosen Pembimbing & Email) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
                        <div style="background: #f8fafc; padding: 14px 16px; border-radius: var(--radius-md); border-left: 4px solid #10b981; border: 1px solid #e2e8f0; border-left-width: 4px;">
                            <span style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Dosen Pembimbing / Validator</span>
                            <h4 style="font-size: 1rem; color: var(--text-main); margin-top: 4px; font-weight: 800;">${dev.supervisor || 'Brezto Asagi Dewantara, S.Pd., M.Pd.'}</h4>
                        </div>

                        <div style="background: #f8fafc; padding: 14px 16px; border-radius: var(--radius-md); border-left: 4px solid #0284c7; border: 1px solid #e2e8f0; border-left-width: 4px;">
                            <span style="font-size: 0.78rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Email / Kontak Pengembang</span>
                            <h4 style="font-size: 1rem; color: var(--text-main); margin-top: 4px; font-weight: 800;">${dev.email || 'nasvisual31@gmail.com'}</h4>
                        </div>
                    </div>

                    <!-- Kata Pengantar / Bio -->
                    <div style="background: #ecfdf5; padding: 18px 20px; border-radius: var(--radius-md); border: 1.5px dashed #86efac;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; color: #065f46; font-weight: 800; font-size: 0.95rem;">
                            <i data-lucide="quote" style="width: 18px; height: 18px;"></i>
                            <span>Kata Pengantar & Tujuan Media</span>
                        </div>
                        <p style="color: #1e3a2f; font-size: 0.95rem; line-height: 1.6; font-style: italic; margin: 0;">
                            "${dev.bio || 'Media pembelajaran interaktif ini dikembangkan untuk memudahkan pemahaman sains bagi anak-anak sekolah dasar melalui eksplorasi visual 3D yang menyenangkan.'}"
                        </p>
                    </div>
                </div>

            </div>
        `;
    }

    // Edit Form Mode
    function renderEditForm() {
        return `
            <div style="display: flex; flex-direction: column; gap: 24px;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-size: 1.3rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="user-check" style="color: var(--primary-dark);"></i>
                            Edit Identitas & Foto Pengembang
                        </h3>
                        <p style="color: var(--text-muted); font-size: 0.88rem;">Ubah identitas pengembang dan unggah foto profil Anda di bawah ini.</p>
                    </div>
                    <button id="btn-save-dev" class="btn btn-primary" style="padding: 10px 24px; font-size: 0.95rem;">
                        <i data-lucide="save" style="width: 18px; height: 18px;"></i> Simpan Identitas
                    </button>
                </div>

                <!-- Photo Management Block -->
                <div style="background: #f8fafc; padding: 20px; border-radius: var(--radius-md); border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                    <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; box-shadow: var(--shadow-md); border: 3px solid white; background: #ecfdf5; flex-shrink: 0;">
                        ${dev.photo 
                            ? `<img id="edit-preview-img" src="${dev.photo}" alt="Preview Foto" style="width: 100%; height: 100%; object-fit: cover;">` 
                            : defaultAvatarSvg
                        }
                    </div>

                    <div style="flex: 1; min-width: 220px;">
                        <h4 style="font-size: 1rem; color: var(--text-main); margin-bottom: 4px;">Foto Profil Pengembang</h4>
                        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px;">Format yang didukung: JPG, PNG, WebP (Maks 3MB). Foto akan tersimpan otomatis di perangkat.</p>
                        
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <input type="file" id="input-dev-photo" accept="image/*" style="display: none;">
                            <button id="btn-upload-photo" type="button" class="btn btn-secondary" style="font-size: 0.88rem; padding: 8px 16px; background: white; border: 1px solid #cbd5e1;">
                                <i data-lucide="upload" style="width: 16px; height: 16px;"></i> Pilih Foto
                            </button>
                            ${dev.photo ? `
                                <button id="btn-remove-photo" type="button" class="btn" style="font-size: 0.88rem; padding: 8px 16px; background: #fee2e2; color: #b91c1c;">
                                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i> Hapus Foto
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Input Fields Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                    <div>
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
                            Nama Lengkap Pengembang *
                        </label>
                        <input type="text" id="dev-name" value="${dev.name || ''}" placeholder="Contoh: Rian Anggara, S.Pd." style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem;">
                    </div>

                    <div>
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
                            Peran / Status Pengembang
                        </label>
                        <input type="text" id="dev-role" value="${dev.role || ''}" placeholder="Contoh: Mahasiswa / Peneliti Media" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem;">
                    </div>

                    <div>
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
                            Program Studi & Fakultas
                        </label>
                        <input type="text" id="dev-study" value="${dev.programStudy || ''}" placeholder="Contoh: S-1 Teknologi Pendidikan" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem;">
                    </div>

                    <div>
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
                            Universitas / Instansi
                        </label>
                        <input type="text" id="dev-inst" value="${dev.institution || ''}" placeholder="Contoh: Universitas Lambung Mangkurat" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem;">
                    </div>

                    <div>
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
                            Dosen Pembimbing / Ahli
                        </label>
                        <input type="text" id="dev-supervisor" value="${dev.supervisor || ''}" placeholder="Contoh: Brezto Asagi Dewantara, S.Pd., M.Pd." style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem;">
                    </div>

                    <div style="grid-column: 1 / -1;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
                            Email / Kontak
                        </label>
                        <input type="email" id="dev-email" value="${dev.email || ''}" placeholder="Contoh: nasvisual31@gmail.com" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem;">
                    </div>

                    <div style="grid-column: 1 / -1;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">
                            Kata Pengantar / Deskripsi Media
                        </label>
                        <textarea id="dev-bio" rows="4" placeholder="Tuliskan tujuan media pembelajaran atau pesan untuk siswa dan guru..." style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: var(--radius-md); font-family: inherit; font-size: 0.95rem; resize: vertical;">${dev.bio || ''}</textarea>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
                    <button id="btn-cancel-edit" type="button" class="btn" style="background: white; border: 1px solid #cbd5e1; color: var(--text-main); font-size: 0.95rem; padding: 10px 20px;">
                        Batal
                    </button>
                    <button id="btn-save-dev-bottom" type="button" class="btn btn-primary" style="font-size: 0.95rem; padding: 10px 24px;">
                        <i data-lucide="check" style="width: 18px; height: 18px;"></i> Simpan Perubahan
                    </button>
                </div>
            </div>
        `;
    }

    let lanyardCleanup = null;

    // Interactive Pendulum Spring Physics for Lanyard ID Card
    function initInteractiveLanyard(rootEl) {
        if (lanyardCleanup) {
            lanyardCleanup();
            lanyardCleanup = null;
        }

        const stage = rootEl.querySelector('#lanyard-stage');
        const card = rootEl.querySelector('#lanyard-card');
        const claspAnchor = rootEl.querySelector('#lanyard-clasp-anchor');
        const strapPath = rootEl.querySelector('#lanyard-strap-path');
        const stitchL = rootEl.querySelector('#lanyard-stitch-l');
        const stitchR = rootEl.querySelector('#lanyard-stitch-r');
        const textPath = rootEl.querySelector('#lanyard-text-path');
        const hintPill = rootEl.querySelector('#lanyard-hint');

        if (!card || !stage || !claspAnchor || !strapPath) return;

        let posX = 0, posY = 0;
        let targetX = 0, targetY = 0;
        let velX = 0, velY = 0;
        let angle = 0, velAngle = 0;
        let isDragging = false;
        let startPointerX = 0, startPointerY = 0;
        let animId = null;

        const stiffness = 0.085;
        const damping = 0.86;
        const maxDrag = 150;

        function updateDynamicStrap() {
            const stageRect = stage.getBoundingClientRect();
            const anchorRect = claspAnchor.getBoundingClientRect();
            
            // Fixed top center anchor of ceiling bracket
            const x0 = stageRect.width / 2;
            const y0 = 6;

            // Clasp ring center anchor in stage coordinates
            const x1 = anchorRect.left + anchorRect.width / 2 - stageRect.left;
            const y1 = anchorRect.top + anchorRect.height / 2 - stageRect.top;

            const dx = x1 - x0;
            const dy = y1 - y0;
            const dist = Math.hypot(dx, dy) || 1;

            const halfW = 13;
            // Normal unit vector perpendicular to the strap
            const nx = -dy / dist;
            const ny = dx / dist;

            // Natural curve control point
            const cx = x0 + dx * 0.42;
            const cy = y0 + dy * 0.5;

            // Strap boundary coordinates
            const pTopLeft = `${(x0 - halfW).toFixed(1)} ${y0.toFixed(1)}`;
            const pTopRight = `${(x0 + halfW).toFixed(1)} ${y0.toFixed(1)}`;
            const pBotLeft = `${(x1 + nx * halfW).toFixed(1)} ${(y1 + ny * halfW).toFixed(1)}`;
            const pBotRight = `${(x1 - nx * halfW).toFixed(1)} ${(y1 - ny * halfW).toFixed(1)}`;

            const cLeft = `${(cx + nx * (halfW * 0.6)).toFixed(1)} ${cy.toFixed(1)}`;
            const cRight = `${(cx - nx * (halfW * 0.6)).toFixed(1)} ${cy.toFixed(1)}`;

            // Build SVG ribbon path
            strapPath.setAttribute('d', `M ${pTopLeft} Q ${cLeft} ${pBotLeft} L ${pBotRight} Q ${cRight} ${pTopRight} Z`);

            // Stitched borders
            if (stitchL) {
                const sTopL = `${(x0 - halfW + 3).toFixed(1)} ${y0.toFixed(1)}`;
                const sBotL = `${(x1 + nx * (halfW - 3)).toFixed(1)} ${(y1 + ny * (halfW - 3)).toFixed(1)}`;
                stitchL.setAttribute('d', `M ${sTopL} Q ${cLeft} ${sBotL}`);
            }
            if (stitchR) {
                const sTopR = `${(x0 + halfW - 3).toFixed(1)} ${y0.toFixed(1)}`;
                const sBotR = `${(x1 - nx * (halfW - 3)).toFixed(1)} ${(y1 - ny * (halfW - 3)).toFixed(1)}`;
                stitchR.setAttribute('d', `M ${sTopR} Q ${cRight} ${sBotR}`);
            }

            // Center spine guide path for the "DEVELOPER" woven text
            if (textPath) {
                textPath.setAttribute('d', `M ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`);
            }
        }

        function onPointerDown(e) {
            isDragging = true;
            startPointerX = e.clientX - posX;
            startPointerY = e.clientY - posY;
            try { card.setPointerCapture(e.pointerId); } catch(err){}
            card.style.cursor = 'grabbing';
            card.style.boxShadow = '0 32px 65px rgba(6,78,59,0.38), 0 12px 24px rgba(0,0,0,0.14)';
            if (hintPill) {
                hintPill.textContent = '🎯 Lepaskan untuk Mengayunkan!';
                hintPill.style.background = '#d1fae5';
                hintPill.style.color = '#065f46';
                hintPill.style.borderColor = '#6ee7b7';
            }
        }

        function onPointerMove(e) {
            if (!isDragging) {
                // Subtle 3D tilt tracking cursor on hover
                const rect = card.getBoundingClientRect();
                const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                if (Math.abs(relX) <= 1.2 && Math.abs(relY) <= 1.2) {
                    card.style.transform = `translate3d(${posX.toFixed(2)}px, ${posY.toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg) perspective(800px) rotateY(${(relX * 12).toFixed(1)}deg) rotateX(${(-relY * 12).toFixed(1)}deg)`;
                    updateDynamicStrap();
                }
                return;
            }

            const rawX = e.clientX - startPointerX;
            const rawY = e.clientY - startPointerY;

            // Restrict max distance with spring tension curve
            const dist = Math.hypot(rawX, rawY);
            const scale = dist > maxDrag ? (maxDrag + Math.log(dist - maxDrag + 1) * 10) / dist : 1;

            targetX = rawX * scale;
            targetY = Math.max(-20, rawY * scale); // don't push above anchor
        }

        function onPointerUp(e) {
            if (!isDragging) return;
            isDragging = false;
            try { card.releasePointerCapture(e.pointerId); } catch(err){}
            card.style.cursor = 'grab';
            card.style.boxShadow = '0 24px 50px -10px rgba(6, 78, 59, 0.28), 0 8px 20px rgba(0, 0, 0, 0.08)';
            if (hintPill) {
                hintPill.textContent = '🌿 Tarik & Ayunkan Creator Pass!';
                hintPill.style.background = '#ffffff';
                hintPill.style.color = '#065f46';
                hintPill.style.borderColor = '#a7f3d0';
            }
            targetX = 0;
            targetY = 0;
        }

        function loop() {
            if (isDragging) {
                posX += (targetX - posX) * 0.35;
                posY += (targetY - posY) * 0.35;
                const targetAngle = posX * 0.18;
                angle += (targetAngle - angle) * 0.3;
            } else {
                // Spring force
                const forceX = -stiffness * posX;
                const forceY = -stiffness * posY;
                velX = (velX + forceX) * damping;
                velY = (velY + forceY) * damping;
                posX += velX;
                posY += velY;

                // Pendulum angular momentum & dampening
                const forceAngle = -0.06 * angle - (posX * 0.045);
                velAngle = (velAngle + forceAngle) * 0.88;
                angle += velAngle;
            }

            card.style.transform = `translate3d(${posX.toFixed(2)}px, ${posY.toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg)`;
            updateDynamicStrap();

            animId = requestAnimationFrame(loop);
        }

        card.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);

        // Initial render frame
        updateDynamicStrap();
        animId = requestAnimationFrame(loop);

        lanyardCleanup = () => {
            if (animId) cancelAnimationFrame(animId);
            card.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
        };
    }

    function setupEventListeners() {
        if (!isEditing) {
            initInteractiveLanyard(container);
        }

        // Back Button
        const btnBack = container.querySelector('#btn-back-dev');
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                router.navigate('/');
            });
        }

        // Master Audio Toggle
        const btnAudioDev = container.querySelector('#btn-master-audio-dev');
        if (btnAudioDev) {
            attachAudioToggle(btnAudioDev);
        }

        // Edit Form listeners
        if (isEditing) {
            const btnCancel = container.querySelector('#btn-cancel-edit');
            if (btnCancel) {
                btnCancel.addEventListener('click', () => {
                    isEditing = false;
                    dev = { ...store.state.developerProfile };
                    renderContent();
                });
            }

            // Photo Upload
            const fileInput = container.querySelector('#input-dev-photo');
            const btnUpload = container.querySelector('#btn-upload-photo');
            if (btnUpload && fileInput) {
                btnUpload.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                        if (file.size > 3 * 1024 * 1024) {
                            alert('Ukuran file foto maksimal 3MB');
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            dev.photo = event.target.result;
                            renderContent();
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Remove Photo
            const btnRemovePhoto = container.querySelector('#btn-remove-photo');
            if (btnRemovePhoto) {
                btnRemovePhoto.addEventListener('click', () => {
                    dev.photo = '';
                    renderContent();
                });
            }

            // Save actions
            const handleSave = () => {
                const nameInput = container.querySelector('#dev-name');
                const roleInput = container.querySelector('#dev-role');
                const studyInput = container.querySelector('#dev-study');
                const instInput = container.querySelector('#dev-inst');
                const supInput = container.querySelector('#dev-supervisor');
                const emailInput = container.querySelector('#dev-email');
                const bioInput = container.querySelector('#dev-bio');

                dev.name = nameInput ? nameInput.value.trim() : dev.name;
                delete dev.nim;
                dev.role = roleInput ? roleInput.value.trim() : dev.role;
                dev.programStudy = studyInput ? studyInput.value.trim() : dev.programStudy;
                dev.institution = instInput ? instInput.value.trim() : dev.institution;
                dev.supervisor = supInput ? supInput.value.trim() : dev.supervisor;
                dev.email = emailInput ? emailInput.value.trim() : dev.email;
                dev.bio = bioInput ? bioInput.value.trim() : dev.bio;

                // Update store & localStorage
                store.update('developerProfile', dev);
                store.logAction('developer_profile_updated');

                showToast('Profil pengembang berhasil disimpan!');
                isEditing = false;
                renderContent();
            };

            const btnSaveTop = container.querySelector('#btn-save-dev');
            if (btnSaveTop) btnSaveTop.addEventListener('click', handleSave);

            const btnSaveBottom = container.querySelector('#btn-save-dev-bottom');
            if (btnSaveBottom) btnSaveBottom.addEventListener('click', handleSave);
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'glass-panel';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#15803d';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = 'var(--radius-full)';
        toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        toast.style.zIndex = '9999';
        toast.style.fontWeight = '700';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '8px';
        toast.innerHTML = `<i data-lucide="check-circle" style="width: 18px; height: 18px;"></i> <span>${message}</span>`;
        document.body.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 2500);
    }

    renderContent();
    return container;
}
