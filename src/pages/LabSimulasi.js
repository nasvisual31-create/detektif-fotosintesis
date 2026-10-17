import { store } from '../utils/PenyimpananData.js';
import { LabManager } from '../components/ThreeD/PengelolaLab3D.js';
import { simulationData } from '../data/DataSimulasi.js';
import { speakText, stopSpeaking } from '../utils/NarasiSuara.js';
import { showGuideModal } from '../components/ModalPetunjuk.js';
import { getInfoByObjectName } from '../data/DataMateri.js';
import { attachAudioToggle, playRainSound, playHazeSound, playSound } from '../utils/SistemSuara.js';

export function renderSimulasi(router) {
    const container = document.createElement('div');
    container.className = 'view-container-split';

    container.innerHTML = `
        <div id="sim-sidebar" class="sidebar-panel sim-sidebar-responsive">
            <div class="sidebar-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button id="btn-back" class="btn btn-secondary" style="padding: 8px 12px; border-radius: 8px;">
                        <i data-lucide="arrow-left"></i> Kembali
                    </button>
                    <h3 style="margin: 0; font-size: 1.1rem;">Lab Fotosintesis</h3>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button id="btn-master-audio-sim" class="btn-master-audio" style="width: 34px; height: 34px; border-radius: 10px;" title="Suara Master (Musik & Efek Suara)">
                        <i data-lucide="volume-2" style="width: 16px; height: 16px;"></i>
                    </button>
                    <button id="btn-guide-simulasi" class="btn" style="background: #fef08a; color: #854d0e; padding: 6px 12px; border-radius: 12px; font-weight: 800; font-size: 0.82rem; border: 1.5px solid #facc15; display: flex; align-items: center; gap: 4px;">
                        📖 Petunjuk
                    </button>
                </div>
            </div>
            
            <div class="sidebar-content">
                <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px;">
                    Uji coba variabel cuaca & amati bagaimana molekul berinteraksi di dalam sel mesofil.
                </p>

                <!-- Kontrol Sudut Pandang Lab (Tumbuhan Utuh vs Proses di Daun vs Sel Mesofil) -->
                <div class="glass-panel" style="padding: 14px; margin-bottom: 16px; background: var(--background);">
                    <h4 style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="eye" style="color: var(--primary-dark);"></i> Sudut Pandang Pengamatan
                        </span>
                        <span style="font-size: 0.72rem; color: var(--primary-dark); font-weight: 700; background: #dcfce7; padding: 2px 7px; border-radius: 6px;">Klik 2x: Masuk Sel</span>
                    </h4>
                    <div style="display: flex; gap: 6px;">
                        <button id="btn-view-plant" class="btn btn-secondary" style="flex: 1; padding: 9px 4px; font-size: 0.82rem; opacity: 1;">
                            🌻 Bunga Utuh
                        </button>
                        <button id="btn-view-process" class="btn btn-secondary" style="flex: 1; padding: 9px 4px; font-size: 0.82rem; opacity: 0.5;" title="Klik 2x untuk berpindah ke Sel Mesofil">
                            🍃 Proses Daun
                        </button>
                        <button id="btn-view-mesofil" class="btn btn-secondary" style="flex: 1; padding: 9px 4px; font-size: 0.82rem; opacity: 0.5;" title="Model 3D Penampang Sel Mesofil">
                            🔬 Sel Mesofil
                        </button>
                    </div>
                </div>

                <!-- Filter Tahapan Molekul Fotosintesis (Muncul saat user mengklik Sel Mesofil / Proses Daun) -->
                <div id="filter-molecules-panel" class="glass-panel" style="display: none; padding: 14px; margin-bottom: 16px; background: #f0fdf4; border: 1.5px solid var(--primary-light); animation: fadeIn 0.3s ease-out;">
                    <h4 style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                        <span style="display: flex; align-items: center; gap: 6px; font-size: 0.88rem;">
                            <i data-lucide="sparkles" style="color: var(--primary-dark); width: 16px; height: 16px;"></i> Molekul Sel Mesofil
                        </span>
                        <span id="molecule-filter-badge" style="font-size: 0.7rem; background: var(--primary); color: white; padding: 2px 7px; border-radius: 8px; font-weight: 800;">Interaktif</span>
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;" id="flow-filter-group">
                        <button class="step-pill active" data-flow="ALL" style="justify-content: center; padding: 6px 2px; font-size: 0.78rem;">🌟 Semua</button>
                        <button class="step-pill" data-flow="LIGHT" style="justify-content: center; padding: 6px 2px; font-size: 0.78rem;">☀️ Cahaya</button>
                        <button class="step-pill" data-flow="WATER" style="justify-content: center; padding: 6px 2px; font-size: 0.78rem;">💧 Air H₂O</button>
                        <button class="step-pill" data-flow="CO2" style="justify-content: center; padding: 6px 2px; font-size: 0.78rem;">💨 Gas CO₂</button>
                        <button class="step-pill" data-flow="SYNTH" style="justify-content: center; padding: 6px 2px; font-size: 0.78rem;">🍃 Kloroplas</button>
                        <button class="step-pill" data-flow="PRODUCTS" style="justify-content: center; padding: 6px 2px; font-size: 0.78rem;">🌬️ O₂ & Gula</button>
                    </div>
                </div>

                <!-- Kontrol Siang / Malam -->
                <div class="glass-panel" style="padding: 14px; margin-bottom: 16px; background: var(--background);">
                    <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="clock" style="color: var(--secondary-dark);"></i> Waktu Lingkungan
                    </h4>
                    <div style="display: flex; gap: 8px;">
                        <button id="btn-day" class="btn btn-secondary" style="flex: 1; opacity: 1; padding: 9px;">☀️ Siang</button>
                        <button id="btn-night" class="btn btn-secondary" style="flex: 1; background: #1e293b; opacity: 0.5; padding: 9px;">🌙 Malam</button>
                    </div>
                </div>

                <!-- Kontrol Hujan -->
                <div class="glass-panel" style="padding: 14px; margin-bottom: 16px; background: var(--background);">
                    <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="cloud-rain" style="color: var(--accent-dark);"></i> Cuaca Hujan
                    </h4>
                    <div style="display: flex; gap: 8px;">
                        <button id="btn-rain-off" class="btn btn-primary" style="flex: 1; background: var(--accent-dark); opacity: 1; padding: 9px;">🌤️ Cerah</button>
                        <button id="btn-rain-on" class="btn btn-primary" style="flex: 1; background: var(--accent); opacity: 0.5; padding: 9px;">🌧️ Hujan</button>
                    </div>
                </div>

                <!-- Kontrol Suhu -->
                <div class="glass-panel" style="padding: 14px; margin-bottom: 16px; background: var(--background);">
                    <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="thermometer" style="color: var(--error);"></i> Suhu Udara
                    </h4>
                    <div style="display: flex; gap: 5px;">
                        <button id="btn-temp-cold" class="btn btn-secondary" style="flex: 1; background: #38bdf8; opacity: 0.5; padding: 9px; font-size: 0.85rem;">❄️ Dingin</button>
                        <button id="btn-temp-normal" class="btn btn-secondary" style="flex: 1; background: var(--success); opacity: 1; padding: 9px; font-size: 0.85rem;">☀️ Sedang</button>
                        <button id="btn-temp-hot" class="btn btn-secondary" style="flex: 1; background: var(--error); opacity: 0.5; padding: 9px; font-size: 0.85rem;">🔥 Panas</button>
                    </div>
                </div>

                <!-- Kontrol Kabut Asap -->
                <div class="glass-panel" style="padding: 14px; margin-bottom: 16px; background: var(--background);">
                    <h4 style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="cloud-fog" style="color: #64748b;"></i> Polusi Kabut Asap
                    </h4>
                    <div style="display: flex; gap: 5px;">
                        <button id="btn-haze-clean" class="btn btn-secondary" style="flex: 1; background: var(--success); opacity: 1; padding: 9px; font-size: 0.85rem;">🍃 Bersih</button>
                        <button id="btn-haze-thin" class="btn btn-secondary" style="flex: 1; background: #94a3b8; opacity: 0.5; padding: 9px; font-size: 0.85rem;">🌫️ Tipis</button>
                        <button id="btn-haze-thick" class="btn btn-secondary" style="flex: 1; background: #64748b; opacity: 0.5; padding: 9px; font-size: 0.85rem;">😷 Tebal</button>
                    </div>
                </div>

                <!-- Tombol Reset Eksperimen -->
                <button id="btn-reset-exp" class="btn" style="width: 100%; background: #cbd5e1; color: var(--text-main); margin-bottom: 20px; padding: 10px;">
                    <i data-lucide="rotate-ccw"></i> Reset Eksperimen
                </button>
            </div>
        </div>

        <div id="canvas-wrapper" style="flex: 1; position: relative; overflow: hidden;">
            <div id="three-container" style="width: 100%; height: 100%;"></div>
            
            <!-- Panel Penjelasan "Catatan Profesor" di Pojok Kiri Atas Canvas -->
            <div id="explanation-panel" class="glass-panel" style="display: none; position: absolute; top: 16px; left: 16px; max-width: 420px; z-index: 25; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 18px; padding: 16px 18px; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); border: 2px solid rgba(255, 255, 255, 0.85); border-left: 6px solid var(--secondary); animation: fadeIn 0.3s ease-out;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.5rem;">👩‍🔬</span>
                        <div>
                            <h4 style="color: var(--text-main); font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Catatan Profesor</h4>
                            <span id="exp-badge" style="font-size: 0.72rem; background: var(--primary-light); color: var(--text-main); padding: 2px 8px; border-radius: 10px; font-weight: 700;">Lab Aktif</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <button id="btn-speak-sim" title="Dengarkan Suara" class="btn" style="padding: 5px 8px; background: rgba(245, 158, 11, 0.15); color: var(--secondary-dark); border-radius: 8px; font-size: 0.8rem; font-weight: 700;">
                            <i data-lucide="volume-2" style="width: 15px; height: 15px;"></i> Suara
                        </button>
                        <button id="btn-close-exp" title="Tutup Penjelasan" class="btn" style="padding: 5px; background: transparent; color: #94a3b8; border-radius: 8px; cursor: pointer;">
                            <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </div>
                <h3 id="exp-title" style="color: var(--secondary-dark); font-size: 1.1rem; margin-bottom: 6px; font-weight: 800;">Judul</h3>
                <div id="exp-desc" style="font-size: 0.9rem; color: var(--text-main); line-height: 1.55; max-height: 220px; overflow-y: auto;">Penjelasan</div>
            </div>

            <!-- Interactive Prediction Modal Overlay -->
            <div id="prediction-overlay" style="display: none; position: absolute; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 50; align-items: center; justify-content: center; padding: 16px;">
                
                <!-- 1. Question Card (Tantangan Prediksi Sains) -->
                <div id="pred-question-card" class="glass-panel" style="background: white; border-radius: 24px; max-width: 500px; width: 100%; padding: clamp(20px, 4vw, 30px); text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); border: 2.5px solid #22c55e; animation: modalPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                    
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <div id="pred-q-icon" style="width: 60px; height: 60px; border-radius: 50%; background: #ecfdf5; border: 2.5px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 6px 16px rgba(16, 185, 129, 0.2);">
                            🕵️‍♂️
                        </div>
                        <span id="pred-q-badge" style="font-size: 0.78rem; font-weight: 800; color: #047857; background: #d1fae5; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase;">
                            🔍 Tantangan Detektif Sains
                        </span>
                    </div>

                    <h2 id="pred-q-title" style="margin: 0 0 10px 0; font-size: clamp(1.15rem, 2.5vw, 1.35rem); color: #0f172a; font-weight: 800; line-height: 1.3;">
                        Menurutmu apa yang akan terjadi?
                    </h2>
                    
                    <p id="prediction-context" style="color: #334155; margin: 0 0 18px 0; font-size: 0.95rem; line-height: 1.5; background: #f8fafc; padding: 12px 16px; border-radius: 14px; border: 1.5px dashed #cbd5e1; font-weight: 600; text-align: left;">
                    </p>
                    
                    <!-- Pilihan Jawaban Interaktif A & B -->
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button id="btn-pred-1" class="btn-pred-choice" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; background: white; border: 2px solid #e2e8f0; border-radius: 16px; font-size: 0.92rem; font-weight: 700; color: #1e293b; text-align: left; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 5px rgba(0,0,0,0.04);">
                            <span style="min-width: 32px; height: 32px; border-radius: 10px; background: #f1f5f9; color: #047857; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 1.5px solid #cbd5e1; font-size: 0.95rem;">A</span>
                            <span id="label-pred-1" style="flex: 1; line-height: 1.45;"></span>
                        </button>

                        <button id="btn-pred-2" class="btn-pred-choice" style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 16px; background: white; border: 2px solid #e2e8f0; border-radius: 16px; font-size: 0.92rem; font-weight: 700; color: #1e293b; text-align: left; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 5px rgba(0,0,0,0.04);">
                            <span style="min-width: 32px; height: 32px; border-radius: 10px; background: #f1f5f9; color: #047857; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 1.5px solid #cbd5e1; font-size: 0.95rem;">B</span>
                            <span id="label-pred-2" style="flex: 1; line-height: 1.45;"></span>
                        </button>
                    </div>

                    <div style="margin-top: 14px;">
                        <button id="btn-pred-cancel" class="btn" style="background: transparent; border: none; color: #94a3b8; font-size: 0.85rem; font-weight: 700; cursor: pointer; padding: 6px 12px; border-radius: 8px;">
                            Batal & Tetap di Kondisi Saat Ini
                        </button>
                    </div>
                </div>

                <!-- 2. Result Card Interaktif (Pengganti Alert Kaku Browser) -->
                <div id="pred-result-card" class="glass-panel" style="display: none; background: white; border-radius: 24px; max-width: 500px; width: 100%; padding: clamp(20px, 4vw, 30px); text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); animation: modalPopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
                    
                    <div id="pred-res-avatar" style="width: 72px; height: 72px; margin: 0 auto 12px auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.6rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                        🎉
                    </div>

                    <div style="margin-bottom: 8px;">
                        <span id="pred-res-badge" style="font-size: 0.8rem; font-weight: 800; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.5px; display: inline-block;">
                            PREDIKSIMU TEPAT!
                        </span>
                    </div>

                    <h2 id="pred-res-title" style="margin: 0 0 12px 0; font-size: clamp(1.2rem, 2.5vw, 1.4rem); font-weight: 800; line-height: 1.3;">
                        Luar Biasa, Detektif Hebat!
                    </h2>

                    <!-- Box Penjelasan Sains & Suara TTS -->
                    <div id="pred-res-box" style="background: #f8fafc; border-radius: 16px; padding: 14px 16px; margin-bottom: 20px; text-align: left; border: 1.5px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <div id="pred-res-box-header" style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.88rem; color: #047857;">
                                <i data-lucide="sparkles" style="width: 16px; height: 16px;"></i>
                                <span>Penjelasan Ilmiah:</span>
                            </div>
                            <button id="btn-speak-pred-res" title="Dengarkan Suara Penjelasan" class="btn" style="padding: 4px 8px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; color: #0284c7; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 700;">
                                <i data-lucide="volume-2" style="width: 14px; height: 14px;"></i>
                                <span>Dengar</span>
                            </button>
                        </div>
                        <p id="pred-res-message" style="margin: 0; font-size: 0.92rem; color: #334155; line-height: 1.55; max-height: 180px; overflow-y: auto;">
                        </p>
                    </div>

                    <!-- Tombol Lanjut ke Simulasi Molekul 3D -->
                    <button id="btn-pred-continue" class="btn" style="width: 100%; padding: 14px 20px; border-radius: 16px; font-size: 1rem; font-weight: 800; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                        <span id="btn-pred-continue-text">🔬 LIHAT SIMULASI 3D SEKARANG</span>
                        <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // State Pengamatan
    let currentViewMode = 'PLANT'; // 'PLANT', 'PROCESS', 'MESOPHYLL'
    let labManager = null;

    // Controls Selection
    const btnViewPlant = container.querySelector('#btn-view-plant');
    const btnViewProcess = container.querySelector('#btn-view-process');
    const btnViewMesofil = container.querySelector('#btn-view-mesofil');
    const filterMoleculesPanel = container.querySelector('#filter-molecules-panel');
    const flowFilterGroup = container.querySelector('#flow-filter-group');
    const btnDay = container.querySelector('#btn-day');
    const btnNight = container.querySelector('#btn-night');
    const btnRainOn = container.querySelector('#btn-rain-on');
    const btnRainOff = container.querySelector('#btn-rain-off');
    const btnTempCold = container.querySelector('#btn-temp-cold');
    const btnTempNormal = container.querySelector('#btn-temp-normal');
    const btnTempHot = container.querySelector('#btn-temp-hot');
    const btnHazeClean = container.querySelector('#btn-haze-clean');
    const btnHazeThin = container.querySelector('#btn-haze-thin');
    const btnHazeThick = container.querySelector('#btn-haze-thick');
    const btnReset = container.querySelector('#btn-reset-exp');

    const updateOpacity = (activeBtn, inactiveBtns) => {
        activeBtn.style.opacity = '1';
        inactiveBtns.forEach(btn => btn.style.opacity = '0.5');
    };

    // Initialize Lab 3D
    setTimeout(() => {
        labManager = new LabManager(container.querySelector('#three-container'), (event, val) => {
            if (event === 'VIEW_MODE') {
                currentViewMode = val;
                if (val === 'MESOPHYLL') {
                    if (filterMoleculesPanel) {
                        filterMoleculesPanel.style.display = 'block';
                        const badge = filterMoleculesPanel.querySelector('#molecule-filter-badge');
                        if (badge) badge.innerText = 'Dalam Sel';
                    }
                    updateOpacity(btnViewMesofil, [btnViewPlant, btnViewProcess]);
                    showExplanation(
                        {
                            title: "🔬 Dapur Fotosintesis (Di Dalam Sel Mesofil)",
                            description: "Sekarang kamu berada di dalam penampang sel daun! Di sini molekul air dan CO₂ masuk ke dalam organel bulat <strong>Kloroplas</strong> untuk dimasak menggunakan energi foton cahaya menjadi glukosa manis serta menghasilkan oksigen di tingkat mikroskopis."
                        },
                        "Skala Dalam Sel 3D"
                    );
                } else if (val === 'PROCESS') {
                    if (filterMoleculesPanel) {
                        filterMoleculesPanel.style.display = 'block';
                        const badge = filterMoleculesPanel.querySelector('#molecule-filter-badge');
                        if (badge) badge.innerText = 'Luar Daun';
                    }
                    updateOpacity(btnViewProcess, [btnViewPlant, btnViewMesofil]);
                    showExplanation(
                        {
                            title: "🍃 Proses di Luar Daun (Skala Organ Tumbuhan)",
                            description: "Lihatlah arah alirannya di luar daun! ☀️ Sinar surya turun dari langit, 💨 gas CO₂ diserap dari udara sekitar, dan 💧 air mengalir dari batang menyusuri urat-urat daun. Daun kemudian melepaskan 🌬️ oksigen (O₂) segar ke udara bebas! Klik tombol <strong>🔬 Sel Mesofil</strong> untuk masuk dan melihat proses di dalam sel."
                        },
                        "Skala Luar Daun 3D"
                    );
                } else {
                    if (filterMoleculesPanel) filterMoleculesPanel.style.display = 'none';
                    updateOpacity(btnViewPlant, [btnViewProcess, btnViewMesofil]);
                }
            } else if (event === 'OBJECT_CLICK') {
                if (val && val.partName) {
                    const info = getInfoByObjectName(val.partName);
                    if (info) {
                        showExplanation({
                            title: `${info.title}`,
                            description: `${info.description}<br><br><strong>💡 Rahasia Sains:</strong> ${info.learningPoint}`
                        }, "Penjelasan Organ & Sel");
                    }
                }
            }
        });
    }, 100);

    // Navigation
    const handleExit = () => {
        stopSpeaking();
        if (labManager) labManager.destroy();
        router.navigate('/');
    };
    container.querySelector('#btn-back').addEventListener('click', handleExit);
    
    const btnGuideSim = container.querySelector('#btn-guide-simulasi');
    if (btnGuideSim) {
        btnGuideSim.addEventListener('click', () => {
            showGuideModal('simulasi');
        });
    }

    // Interactive Prediction Elements & Logic
    const predOverlay = container.querySelector('#prediction-overlay');
    const predQuestionCard = container.querySelector('#pred-question-card');
    const predResultCard = container.querySelector('#pred-result-card');
    const predQIcon = container.querySelector('#pred-q-icon');
    const predQBadge = container.querySelector('#pred-q-badge');
    const predQTitle = container.querySelector('#pred-q-title');
    const predContext = container.querySelector('#prediction-context');
    const btnPred1 = container.querySelector('#btn-pred-1');
    const btnPred2 = container.querySelector('#btn-pred-2');
    const labelPred1 = container.querySelector('#label-pred-1');
    const labelPred2 = container.querySelector('#label-pred-2');
    const btnPredCancel = container.querySelector('#btn-pred-cancel');

    const predResAvatar = container.querySelector('#pred-res-avatar');
    const predResBadge = container.querySelector('#pred-res-badge');
    const predResTitle = container.querySelector('#pred-res-title');
    const predResBox = container.querySelector('#pred-res-box');
    const predResBoxHeader = container.querySelector('#pred-res-box-header');
    const predResMessage = container.querySelector('#pred-res-message');
    const btnSpeakPredRes = container.querySelector('#btn-speak-pred-res');
    const btnPredContinue = container.querySelector('#btn-pred-continue');
    const btnPredContinueText = container.querySelector('#btn-pred-continue-text');

    let predExplanationSpeech = "";

    // Hover effect untuk tombol pilihan prediksi
    [btnPred1, btnPred2].forEach(btn => {
        if (!btn) return;
        btn.onmouseenter = () => {
            btn.style.borderColor = '#10b981';
            btn.style.background = '#f0fdf4';
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.15)';
        };
        btn.onmouseleave = () => {
            btn.style.borderColor = '#e2e8f0';
            btn.style.background = 'white';
            btn.style.transform = 'none';
            btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.04)';
        };
    });

    if (btnSpeakPredRes) {
        btnSpeakPredRes.onclick = () => {
            if (predExplanationSpeech) {
                speakText(predExplanationSpeech);
            }
        };
    }

    const askPrediction = (param1, param2, param3, param4, param5) => {
        let config = {};
        if (typeof param1 === 'object' && param1 !== null) {
            config = param1;
        } else {
            config = {
                context: param1,
                option1: param2,
                option2: param3,
                correctIndex: param4,
                callback: param5,
                feedbackCorrect: "Prediksimu sangat hebat! Mari kita lihat langsung bagaimana molekul 3D bergerak di simulasi.",
                feedbackWrong: "Kurang tepat, tapi tidak apa-apa! Mari kita perhatikan bersama apa yang sebenarnya terjadi di simulasi 3D."
            };
        }

        const icon = config.icon || "🕵️‍♂️";
        const badge = config.badge || "🔍 TANTANGAN DETEKTIF SAINS";
        const title = config.title || "Menurutmu apa yang akan terjadi?";
        const contextText = config.context || "";
        const opt1 = config.option1 || "";
        const opt2 = config.option2 || "";
        const correctIndex = config.correctIndex || 1;
        const callback = config.onContinue || config.callback || (() => {});
        const feedbackCorrect = config.feedbackCorrect || "Prediksimu sangat hebat! Mari kita amati langsung bagaimana simulasi molekul 3D berjalan.";
        const feedbackWrong = config.feedbackWrong || "Kurang tepat, tapi tidak apa-apa! Mari kita amati bersama apa yang sebenarnya terjadi di simulasi 3D.";

        predQIcon.innerText = icon;
        predQBadge.innerText = badge;
        predQTitle.innerText = title;
        predContext.innerText = contextText;
        labelPred1.innerText = opt1;
        labelPred2.innerText = opt2;

        // Tampilkan kartu pertanyaan dan sembunyikan kartu hasil
        predQuestionCard.style.display = 'block';
        predResultCard.style.display = 'none';
        predOverlay.style.display = 'flex';

        if (btnPredCancel) {
            btnPredCancel.onclick = () => {
                stopSpeaking();
                predOverlay.style.display = 'none';
            };
        }

        const handleAnswer = (selectedIndex) => {
            const isCorrect = (selectedIndex === correctIndex);

            // Sembunyikan question card, tampilkan result card interaktif
            predQuestionCard.style.display = 'none';
            predResultCard.style.display = 'block';

            if (isCorrect) {
                // Mainkan SFX Benar (Ting!) persis seperti di kuis
                playSound('correct');

                predResultCard.style.border = '2.5px solid #10b981';
                predResAvatar.innerText = '🎉';
                predResAvatar.style.background = '#dcfce7';
                predResAvatar.style.border = '3px solid #10b981';

                predResBadge.innerText = '🎉 PREDIKSIMU TEPAT SEKALI!';
                predResBadge.style.background = '#dcfce7';
                predResBadge.style.color = '#047857';
                predResBadge.style.border = '1.5px solid #86efac';

                predResTitle.innerText = 'Luar Biasa, Analisismu Benar!';
                predResTitle.style.color = '#065f46';

                predResBox.style.background = '#f0fdf4';
                predResBox.style.borderColor = '#bbf7d0';
                predResBoxHeader.innerHTML = '<i data-lucide="check-circle" style="color: #10b981; width: 16px; height: 16px;"></i> <span style="color: #047857; font-weight: 800;">Penjelasan Ilmiah:</span>';
                predResMessage.innerHTML = feedbackCorrect;

                btnPredContinue.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
                btnPredContinue.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.35)';
                btnPredContinueText.innerText = '🔬 BUKTIKAN DI SIMULASI 3D';

                predExplanationSpeech = `Luar Biasa, Analisismu Benar! ${feedbackCorrect.replace(/<[^>]*>?/gm, '')}`;
            } else {
                // Mainkan SFX Coba Lagi (Chime Suportif) persis seperti di kuis
                playSound('wrong');

                predResultCard.style.border = '2.5px solid #f59e0b';
                predResAvatar.innerText = '💡';
                predResAvatar.style.background = '#fef3c7';
                predResAvatar.style.border = '3px solid #f59e0b';

                predResBadge.innerText = '💡 EKSPLORASI SAINS BARU';
                predResBadge.style.background = '#fef3c7';
                predResBadge.style.color = '#b45309';
                predResBadge.style.border = '1.5px solid #fcd34d';

                predResTitle.innerText = 'Belum Tepat, Yuk Coba Amati!';
                predResTitle.style.color = '#92400e';

                predResBox.style.background = '#fffbeb';
                predResBox.style.borderColor = '#fde68a';
                predResBoxHeader.innerHTML = '<i data-lucide="help-circle" style="color: #f59e0b; width: 16px; height: 16px;"></i> <span style="color: #b45309; font-weight: 800;">Fakta Sebenarnya:</span>';
                predResMessage.innerHTML = feedbackWrong;

                btnPredContinue.style.background = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';
                btnPredContinue.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.35)';
                btnPredContinueText.innerText = '🔬 AMATI DI SIMULASI 3D SEKARANG';

                predExplanationSpeech = `Belum Tepat, Yuk Coba Amati! ${feedbackWrong.replace(/<[^>]*>?/gm, '')}`;
            }

            if (window.lucide) window.lucide.createIcons();

            btnPredContinue.onclick = () => {
                stopSpeaking();
                predOverlay.style.display = 'none';
                btnPredContinue.onclick = null;
                btnPred1.onclick = null;
                btnPred2.onclick = null;
                callback();
            };
        };

        btnPred1.onclick = () => handleAnswer(1);
        btnPred2.onclick = () => handleAnswer(2);

        if (window.lucide) window.lucide.createIcons();
    };

    // Helper to show explanation in top-left panel
    const expPanel = container.querySelector('#explanation-panel');
    const expTitle = container.querySelector('#exp-title');
    const expBadge = container.querySelector('#exp-badge');
    const expDesc = container.querySelector('#exp-desc');
    const btnSpeakSim = container.querySelector('#btn-speak-sim');
    const btnCloseExp = container.querySelector('#btn-close-exp');
    
    let currentSpeechText = "";
    let typeWriterInterval = null;

    const showExplanation = (data, customBadge = null) => {
        expTitle.innerText = data.title;
        expBadge.innerText = customBadge || (currentViewMode === 'PROCESS' ? "Di Dalam Daun" : "Lab Aktif");
        
        let fullText = data.description;
        
        // Penjelasan spesifik sesuai sudut pandang pengamatan yang aktif
        if (currentViewMode === 'MESOPHYLL') {
            // Skala Mikroskopis: Di Dalam Sel Mesofil
            if (data === simulationData.time.DAY) {
                fullText = "☀️ <strong>Di dalam sel mesofil saat siang hari:</strong> Foton cahaya matahari memancar menembus epidermis atas dan diserap pigmen klorofil di kloroplas. Molekul air (H₂O) dipecah, dan molekul CO₂ ditangkap untuk dirangkai menjadi glukosa manis! Butiran oksigen (O₂) segar dilepas keluar melalui lubang stomata.";
            } else if (data === simulationData.time.NIGHT) {
                fullText = "🌙 <strong>Di dalam sel mesofil saat malam hari:</strong> Tanpa foton sinar matahari, pabrik kloroplas berhenti memasak glukosa. Pori stomata menyempit untuk menghemat energi. Sel mesofil beralih melakukan respirasi (bernapas) menggunakan sedikit oksigen untuk menjaga sel tetap hidup.";
            } else if (data === simulationData.haze.CLEAN) {
                fullText = "🍃 <strong>Di dalam sel mesofil saat udara bersih:</strong> Lubang stomata terbuka lebar dan bebas dari kotoran! Gas CO₂ mengalir leluasa ke rongga udara mesofil, dan cahaya matahari diserap klorofil 100% sempurna tanpa halangan kabut.";
            } else if (data === simulationData.haze.THIN) {
                fullText = "🌫️ <strong>Di dalam sel mesofil saat kabut asap tipis:</strong> Partikel debu dan asap di udara membiaskan sebagian sinar matahari. Kloroplas menerima foton cahaya lebih sedikit, sehingga laju pembentukan glukosa melambat separuhnya (50%). Aliran molekul gas menjadi lebih pelan.";
            } else if (data === simulationData.haze.THICK) {
                fullText = "😷 <strong>Di dalam sel mesofil saat kabut asap tebal & pekat:</strong> Butiran abu jelaga hitam menempel di permukaan daun dan MENYUMBAT lubang pori stomata! Gas CO₂ terhalang dan tidak bisa masuk sama sekali. Cahaya matahari pun redup temaram tertutup asap. Alhasil, proses fotosintesis terhenti total! Tumbuhan mengalami stres berat kekurangan udara bersih.";
            } else if (data === simulationData.weather.RAIN_ON) {
                fullText = "🌧️ <strong>Di dalam sel mesofil saat hujan:</strong> Air hujan yang diserap akar membanjiri pembuluh xilem dan dialirkan deras ke dinding sel mesofil. Tekanan turgor sel meningkat kencang, membuat daun tegak segar dan pasokan bahan baku air melimpah!";
            } else if (data === simulationData.weather.RAIN_OFF) {
                fullText = "🌤️ <strong>Di dalam sel mesofil saat cuaca cerah tanpa hujan:</strong> Tumbuhan memanfaatkan cadangan air yang sebelumnya tersimpan di dalam jaringan batang dan tanah untuk menjaga kelangsungan fotosintesis.";
            } else if (data === simulationData.temperature.HOT) {
                fullText = "🔥 <strong>Di dalam sel mesofil saat suhu sangat panas:</strong> Daun kehilangan banyak air akibat penguapan ekstrim. Demi bertahan hidup, sel penjaga stomata menutup celah udaranya rapat-rapat! Akibatnya, pasokan CO₂ terhenti dan kloroplas terpaksa menghentikan pembuatan makanan.";
            } else if (data === simulationData.temperature.COLD) {
                fullText = "❄️ <strong>Di dalam sel mesofil saat suhu dingin:</strong> Enzim-enzim di dalam kloroplas bekerja sangat kaku dan lamban pada suhu rendah. Laju perakitan glukosa berjalan tersendat-sendat.";
            } else if (data === simulationData.temperature.NORMAL) {
                fullText = "☀️ <strong>Di dalam sel mesofil saat suhu ideal (sedang):</strong> Enzim kloroplas bekerja pada kecepatan optimal! Pembentukan molekul gula dan pelepasan oksigen berlangsung sangat aktif dan sehat.";
            }
        } else if (currentViewMode === 'PROCESS' || currentViewMode === 'PLANT') {
            // Skala Organ: Di Luar Helaian Daun
            if (data === simulationData.time.DAY) {
                fullText = "☀️ <strong>Pada permukaan daun saat siang hari:</strong> Daun bermandikan cahaya matahari cerah! Gas CO₂ dihirup dari udara bebas melalui stomata di punggung daun, sementara air mengalir naik dari batang menyusuri urat-urat daun. Daun kemudian menghembuskan butiran oksigen (O₂) segar ke alam bebas!";
            } else if (data === simulationData.time.NIGHT) {
                fullText = "🌙 <strong>Pada daun saat malam hari:</strong> Tanpa sinar matahari, fotosintesis di helaian daun terhenti sementara. Pori-pori stomata di bawah daun menyempit rapat untuk menghemat kelembapan tanaman. Air tetap tenang tersimpan di dalam pembuluh dan urat daun.";
            } else if (data === simulationData.haze.CLEAN) {
                fullText = "🍃 <strong>Pada daun saat udara bersih:</strong> Helai daun bersih berkilau tanpa debu! Pori stomata terbuka leluasa menangkap gas CO₂ dari udara, dan seluruh berkas sinar surya menyinari permukaan daun secara maksimal.";
            } else if (data === simulationData.haze.THIN) {
                fullText = "🌫️ <strong>Pada daun saat kabut asap tipis:</strong> Asap tipis menyaring dan memudarkan sinar matahari yang menyinari daun. Suplai energi surya berkurang separuh (50%), membuat daun bekerja lebih lambat.";
            } else if (data === simulationData.haze.THICK) {
                fullText = "😷 <strong>Pada daun saat kabut asap pekat:</strong> Lapisan abu jelaga hitam menempel menutupi permukaan daun dan menyumbat lubang pori stomata! Gas CO₂ terhalang di udara luar dan tidak bisa diserap daun. Sinar matahari pun redup temaram.";
            } else if (data === simulationData.weather.RAIN_ON) {
                fullText = "🌧️ <strong>Pada daun saat cuaca hujan:</strong> Butiran air hujan membasahi tanah dan tanaman! Air berlimpah diserap akar dan dipompa ke atas melewati batang hingga membanjiri urat-urat daun dengan segar!";
            } else if (data === simulationData.weather.RAIN_OFF) {
                fullText = "🌤️ <strong>Pada daun saat cuaca cerah tanpa hujan:</strong> Tanaman memanfaatkan cadangan air yang tersimpan di dalam jaringan batang dan tanah untuk mencukupi kebutuhan fotosintesis daun.";
            } else if (data === simulationData.temperature.HOT) {
                fullText = "🔥 <strong>Pada daun saat suhu sangat panas:</strong> Hawa panas memicu penguapan tinggi. Demi menjaga agar daun tidak layu mengering, bibir pori stomata menutup rapat-rapat sehingga penyerapan CO₂ tertahan sementara di luar.";
            } else if (data === simulationData.temperature.COLD) {
                fullText = "❄️ <strong>Pada daun saat suhu dingin:</strong> Suhu dingin membuat aliran cairan dan metabolisme daun menjadi kaku dan bergerak sangat lamban.";
            } else if (data === simulationData.temperature.NORMAL) {
                fullText = "☀️ <strong>Pada daun saat suhu ideal (sedang):</strong> Daun hijau subur dan bugar! Pertukaran gas di permukaan daun dan aliran air di urat daun berlangsung lancar dan harmonis.";
            }
        }
        
        // Teks bersih untuk pembacaan suara
        const cleanText = fullText.replace(/<[^>]*>?/gm, ' ');
        currentSpeechText = `${data.title}. ${cleanText}`;
        
        if (typeWriterInterval) clearInterval(typeWriterInterval);
        expDesc.innerHTML = '';
        
        expDesc.innerHTML = fullText + '<br><br><strong style="color: var(--primary-dark);">💡 Ayo coba ubah variabel cuaca atau klik tombol molekul lain!</strong>';
        
        expPanel.style.display = 'block';
        expPanel.style.animation = 'none';
        expPanel.offsetHeight; // trigger reflow
        expPanel.style.animation = 'fadeIn 0.3s ease-out';
    };

    btnSpeakSim.onclick = () => {
        speakText(currentSpeechText);
    };

    if (btnCloseExp) {
        btnCloseExp.onclick = () => {
            stopSpeaking();
            if (typeWriterInterval) clearInterval(typeWriterInterval);
            expPanel.style.display = 'none';
        };
    }

    // --- INTERACTIVE MOLECULE FILTER HANDLERS ---
    const filterButtons = flowFilterGroup.querySelectorAll('.step-pill');
    filterButtons.forEach(btn => {
        btn.onclick = () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const flow = btn.getAttribute('data-flow');
            
            if (labManager) {
                labManager.setPhotosynthesisFilter(flow);
            }

            // Tampilkan penjelasan spesifik molekul yang diklik
            if (flow === 'ALL') {
                showExplanation({
                    title: "🌟 Aliran Lengkap Semua Molekul",
                    description: "Semua molekul Cahaya, Air (H₂O), Gas CO₂, Kloroplas, Oksigen (O₂), dan Glukosa aktif bersirkulasi di dalam sel mesofil!"
                }, "Siklus Lengkap");
            } else if (flow === 'LIGHT') {
                showExplanation({
                    title: "☀️ Foton Cahaya Matahari",
                    description: "Foton sinar matahari menembus lapisan bening epidermis atas. Energi cahaya ini diserap oleh klorofil dan menjadi sumber tenaga utama untuk memecah air."
                }, "Molekul: Cahaya");
            } else if (flow === 'WATER') {
                showExplanation({
                    title: "💧 Aliran Molekul Air (H₂O)",
                    description: "Air diserap bulu akar dari tanah, dinaikkan melewati pembuluh xilem ke urat daun, lalu meresap ke dalam sel mesofil menuju kloroplas."
                }, "Molekul: Air (H₂O)");
            } else if (flow === 'CO2') {
                showExplanation({
                    title: "💨 Molekul Karbon Dioksida (CO₂)",
                    description: "Gas CO₂ dihirup dari udara luar melewati lubang stomata di bawah daun, lalu melayang naik di antara rongga udara spons mesofil menuju kloroplas."
                }, "Molekul: Gas CO₂");
            } else if (flow === 'SYNTH') {
                showExplanation({
                    title: "🍃 Reaksi Sintesis di Kloroplas",
                    description: "Kloroplas adalah pabrik mikroskopis berkilau hijau! Di sinilah keajaiban terjadi: 6 molekul CO₂ + 6 molekul Air dirakit menjadi 1 molekul Glukosa manis dan 6 molekul Oksigen."
                }, "Pabrik Kloroplas");
            } else if (flow === 'PRODUCTS') {
                showExplanation({
                    title: "🌬️ Hasil Akhir: Glukosa & Oksigen",
                    description: "Glukosa manis dialirkan melewati pipa floem ke seluruh bagian tumbuhan untuk makanan. Sedangkan gas Oksigen (O₂) segar dilepas keluar melalui stomata ke udara!"
                }, "Hasil Fotosintesis");
            }
        };
    });

    // --- VIEW MODE HANDLERS (Tanaman Utuh vs Proses di Daun vs Sel Mesofil) ---
    btnViewPlant.onclick = () => {
        currentViewMode = 'PLANT';
        updateOpacity(btnViewPlant, [btnViewProcess, btnViewMesofil]);
        if (filterMoleculesPanel) filterMoleculesPanel.style.display = 'none';
        if (labManager) labManager.setViewMode('PLANT');
        showExplanation({
            title: "🌻 Seluruh Tanaman Bunga Matahari",
            description: "Kamu kembali melihat seluruh tanaman: akar menopang di dalam tanah, batang mengalirkan nutrisi, dan daun menangkap cahaya matahari."
        }, "Tanaman Utuh");
        store.logAction('sim_view_plant');
    };

    btnViewProcess.onclick = () => {
        if (currentViewMode === 'PROCESS') {
            // Jika diklik lagi saat sudah di mode proses, langsung masuk ke sel mesofil!
            btnViewMesofil.click();
            return;
        }
        currentViewMode = 'PROCESS';
        updateOpacity(btnViewProcess, [btnViewPlant, btnViewMesofil]);
        if (filterMoleculesPanel) {
            filterMoleculesPanel.style.display = 'block';
            const badge = filterMoleculesPanel.querySelector('#molecule-filter-badge');
            if (badge) badge.innerText = 'Luar Daun';
        }
        if (labManager) labManager.setViewMode('PROCESS');
        showExplanation({
            title: "🍃 Proses di Luar Daun (Skala Organ Tumbuhan)",
            description: "Lihatlah arah alirannya di luar daun! ☀️ Sinar surya turun dari langit, 💨 gas CO₂ diserap dari udara sekitar, dan 💧 air mengalir dari batang menyusuri urat-urat daun. Daun kemudian melepaskan 🌬️ oksigen (O₂) segar ke udara bebas! Klik tombol <strong>🔬 Sel Mesofil</strong> untuk masuk dan melihat proses di dalam sel."
        }, "Skala Luar Daun 3D");
        store.logAction('sim_view_process');
    };

    // Fitur klik 2x pada proses di daun -> berpindah ke dalam sel mesofil
    btnViewProcess.addEventListener('dblclick', () => {
        btnViewMesofil.click();
    });

    btnViewMesofil.onclick = () => {
        currentViewMode = 'MESOPHYLL';
        updateOpacity(btnViewMesofil, [btnViewPlant, btnViewProcess]);
        if (filterMoleculesPanel) {
            filterMoleculesPanel.style.display = 'block';
            const badge = filterMoleculesPanel.querySelector('#molecule-filter-badge');
            if (badge) badge.innerText = 'Dalam Sel';
        }
        if (labManager) labManager.setViewMode('MESOPHYLL');
        showExplanation({
            title: "🔬 Dapur Fotosintesis (Bagian Dalam Sel Mesofil)",
            description: "Kamu telah berpindah ke dalam jaringan sel mesofil daun! Di sini molekul air (H₂O) dari urat daun dan gas CO₂ dari stomata aktif dirangkai kloroplas menggunakan foton cahaya matahari menjadi glukosa manis serta menghasilkan oksigen (O₂)."
        }, "Mode Sel Mesofil 3D");
        store.logAction('sim_view_mesofil');
    };

    // --- TIME CONTROLS (Siang / Malam) ---
    btnDay.onclick = () => {
        updateOpacity(btnDay, [btnNight]);
        labManager.setSimulationState('isNight', false);
        showExplanation(simulationData.time.DAY);
        store.logAction('sim_set_day');
    };

    btnNight.onclick = () => {
        if (!store.state.progress.hasPredictedNight) {
            askPrediction({
                icon: "🌙",
                badge: "Tantangan Waktu Malam",
                title: "Bagaimana Jika Matahari Tenggelam?",
                context: "Jika matahari tenggelam dan lingkungan memasuki waktu malam yang gelap gulita...",
                option1: "Fotosintesis berhenti sementara karena ketiadaan cahaya matahari",
                option2: "Fotosintesis akan semakin cepat karena udara malam lebih sejuk",
                correctIndex: 1,
                feedbackCorrect: "Tepat sekali! Pigmen klorofil di kloroplas membutuhkan foton cahaya matahari sebagai bahan bakar pemecah air. Di malam hari tanpa sinar matahari, proses fotosintesis berhenti sementara dan celah stomata menyempit.",
                feedbackWrong: "Kurang tepat! Tumbuhan membutuhkan sinar surya sebagai energi utama fotosintesis. Tanpa cahaya di malam hari, kloroplas tidak bisa memasak glukosa sehingga fotosintesis berhenti sementara.",
                onContinue: () => {
                    store.update('progress.hasPredictedNight', true);
                    updateOpacity(btnNight, [btnDay]);
                    labManager.setSimulationState('isNight', true);
                    showExplanation(simulationData.time.NIGHT);
                    store.logAction('sim_set_night');
                }
            });
        } else {
            updateOpacity(btnNight, [btnDay]);
            labManager.setSimulationState('isNight', true);
            showExplanation(simulationData.time.NIGHT);
            store.logAction('sim_set_night');
        }
    };

    // --- WEATHER CONTROLS (Hujan / Cerah) ---
    btnRainOn.onclick = () => {
        updateOpacity(btnRainOn, [btnRainOff]);
        labManager.setSimulationState('isRaining', true);
        playRainSound();
        showExplanation(simulationData.weather.RAIN_ON);
        store.logAction('sim_set_rain_on');
    };

    btnRainOff.onclick = () => {
        updateOpacity(btnRainOff, [btnRainOn]);
        labManager.setSimulationState('isRaining', false);
        showExplanation(simulationData.weather.RAIN_OFF);
        store.logAction('sim_set_rain_off');
    };
    
    // --- TEMPERATURE CONTROLS (Dingin / Sedang / Panas) ---
    btnTempHot.onclick = () => {
        if (!store.state.progress.hasPredictedHot) {
            askPrediction({
                icon: "🔥",
                badge: "Tantangan Suhu Ekstrem",
                title: "Bagaimana Jika Cuaca Sangat Panas?",
                context: "Jika cuaca sangat panas menyengat dan suhu udara meningkat tajam...",
                option1: "Daun menjadi lebih subur dan menghasilkan oksigen berlipat ganda",
                option2: "Daun bisa kehilangan banyak air sehingga stomata menutup untuk bertahan",
                correctIndex: 2,
                feedbackCorrect: "Analisis hebat! Di bawah terik panas menyengat, tanaman berisiko mengalami kekeringan (dehidrasi). Daun secara otomatis menyempitkan stomata untuk menahan laju penguapan air.",
                feedbackWrong: "Kurang tepat! Suhu yang terlalu panas menyengat membuat air di dalam daun menguap sangat cepat. Tanaman akan menutup celah stomata untuk bertahan hidup dan menghemat air.",
                onContinue: () => {
                    store.update('progress.hasPredictedHot', true);
                    updateOpacity(btnTempHot, [btnTempCold, btnTempNormal]);
                    labManager.setSimulationState('temperature', 'HOT');
                    showExplanation(simulationData.temperature.HOT);
                    store.logAction('sim_set_temp_hot');
                }
            });
        } else {
            updateOpacity(btnTempHot, [btnTempCold, btnTempNormal]);
            labManager.setSimulationState('temperature', 'HOT');
            showExplanation(simulationData.temperature.HOT);
            store.logAction('sim_set_temp_hot');
        }
    };

    btnTempNormal.onclick = () => {
        updateOpacity(btnTempNormal, [btnTempCold, btnTempHot]);
        labManager.setSimulationState('temperature', 'NORMAL');
        showExplanation(simulationData.temperature.NORMAL);
        store.logAction('sim_set_temp_normal');
    };

    btnTempCold.onclick = () => {
        updateOpacity(btnTempCold, [btnTempNormal, btnTempHot]);
        labManager.setSimulationState('temperature', 'COLD');
        showExplanation(simulationData.temperature.COLD);
        store.logAction('sim_set_temp_cold');
    };

    // --- HAZE / KABUT ASAP CONTROLS (Bersih / Tipis / Tebal) ---
    btnHazeClean.onclick = () => {
        updateOpacity(btnHazeClean, [btnHazeThin, btnHazeThick]);
        labManager.setSimulationState('haze', 'CLEAN');
        showExplanation(simulationData.haze.CLEAN);
        store.logAction('sim_set_haze_clean');
    };

    btnHazeThin.onclick = () => {
        updateOpacity(btnHazeThin, [btnHazeClean, btnHazeThick]);
        labManager.setSimulationState('haze', 'THIN');
        playHazeSound();
        showExplanation(simulationData.haze.THIN);
        store.logAction('sim_set_haze_thin');
    };

    btnHazeThick.onclick = () => {
        if (!store.state.progress.hasPredictedHaze) {
            askPrediction({
                icon: "🌫️",
                badge: "Tantangan Kabut Asap Polusi",
                title: "Bagaimana Jika Udara Penuh Kabut Asap?",
                context: "Jika udara di sekitar tanaman tertutup oleh kabut asap polusi yang sangat tebal...",
                option1: "Fotosintesis terhenti karena cahaya terhalang dan stomata tersumbat abu polusi",
                option2: "Fotosintesis makin cepat karena tumbuhan memakan partikel kabut asap",
                correctIndex: 1,
                feedbackCorrect: "Prediksimu sangat akurat! Kabut asap tebal menghalangi sinar matahari mencapai daun, dan partikel abu polusi menyumbat lubang stomata sehingga gas CO₂ terhambat masuk. Fotosintesis pun terhenti!",
                feedbackWrong: "Kurang tepat! Tumbuhan hanya membutuhkan molekul gas CO₂ bersih, bukan asap polusi kotor. Asap tebal memblokir sinar matahari dan partikel abunya menutup lubang stomata daun.",
                onContinue: () => {
                    store.update('progress.hasPredictedHaze', true);
                    updateOpacity(btnHazeThick, [btnHazeClean, btnHazeThin]);
                    labManager.setSimulationState('haze', 'THICK');
                    playHazeSound();
                    showExplanation(simulationData.haze.THICK);
                    store.logAction('sim_set_haze_thick');
                }
            });
        } else {
            updateOpacity(btnHazeThick, [btnHazeClean, btnHazeThin]);
            labManager.setSimulationState('haze', 'THICK');
            playHazeSound();
            showExplanation(simulationData.haze.THICK);
            store.logAction('sim_set_haze_thick');
        }
    };

    // --- RESET BUTTON ---
    const resetAllSimulation = () => {
        // Reset View Mode ke Bunga Utuh
        currentViewMode = 'PLANT';
        updateOpacity(btnViewPlant, [btnViewProcess, btnViewMesofil]);
        if (filterMoleculesPanel) filterMoleculesPanel.style.display = 'none';
        if (labManager) labManager.setViewMode('PLANT');

        // Reset Filter Molekul
        filterButtons.forEach(b => b.classList.remove('active'));
        filterButtons[0].classList.add('active');
        if (labManager) labManager.setPhotosynthesisFilter('ALL');

        // Reset Waktu ke Siang
        updateOpacity(btnDay, [btnNight]);
        labManager.setSimulationState('isNight', false);

        // Reset Cuaca ke Cerah
        updateOpacity(btnRainOff, [btnRainOn]);
        labManager.setSimulationState('isRaining', false);

        // Reset Suhu ke Sedang
        updateOpacity(btnTempNormal, [btnTempCold, btnTempHot]);
        labManager.setSimulationState('temperature', 'NORMAL');

        // Reset Kabut Asap ke Bersih
        updateOpacity(btnHazeClean, [btnHazeThin, btnHazeThick]);
        labManager.setSimulationState('haze', 'CLEAN');
        
        stopSpeaking();
        if (typeWriterInterval) clearInterval(typeWriterInterval);
        expPanel.style.display = 'none';
        store.logAction('sim_reset_all');
    };

    btnReset.onclick = resetAllSimulation;

    const btnAudioSim = container.querySelector('#btn-master-audio-sim');
    if (btnAudioSim) {
        attachAudioToggle(btnAudioSim);
    }

    // Render Lucide icons di halaman
    if (window.lucide) window.lucide.createIcons();

    // Catat progress kunjungan pertama
    store.update('progress.simulasiUsed', true);

    return container;
}
