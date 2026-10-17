import { store } from '../utils/PenyimpananData.js';
import { attachAudioToggle } from '../utils/SistemSuara.js';
import { showGuideModal } from '../components/ModalPetunjuk.js';

export function renderHome(router) {
    const container = document.createElement('div');
    container.className = 'view-container home-reference-view';
    container.style.cssText = `
        min-height: 100vh;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        background: linear-gradient(180deg, #c4edf6 0%, #dbf6eb 48%, #b9ebd3 100%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: 'Nunito', sans-serif;
        box-sizing: border-box;
    `;

    const state = store.state;
    const currentMisi = Math.min(state.progress.unlockedLevel || 1, 8);
    const totalXP = (state.progress && typeof state.progress.quizScore === 'number') 
        ? state.progress.quizScore 
        : ((state.progress && typeof state.progress.xp === 'number') ? state.progress.xp : 0);

    container.innerHTML = `
        <!-- Floating Background Nature Elements -->
        <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1;">
            <!-- Floating Glowing Sun (Top Right) -->
            <div style="position: absolute; right: 6%; top: 10%; filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.7)); animation: gentleFloat 5s ease-in-out infinite;">
                <svg width="86" height="86" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: rotateSun 35s linear infinite;">
                    <g fill="#F59E0B">
                        <polygon points="50,2 55,18 45,18" />
                        <polygon points="50,98 55,82 45,82" />
                        <polygon points="2,50 18,55 18,45" />
                        <polygon points="98,50 82,55 82,45" />
                        <polygon points="16,16 30,24 24,30" />
                        <polygon points="84,84 70,76 76,70" />
                        <polygon points="16,84 24,70 30,76" />
                        <polygon points="84,16 76,30 70,24" />
                    </g>
                    <circle cx="50" cy="50" r="28" fill="url(#sunGradHome)" />
                    <defs>
                        <radialGradient id="sunGradHome" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#FEF08A" />
                            <stop offset="55%" stop-color="#FBBF24" />
                            <stop offset="100%" stop-color="#F59E0B" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            <!-- Floating Clouds -->
            <div style="position: absolute; left: 8%; top: 22%; opacity: 0.85; font-size: 2.2rem; filter: drop-shadow(0 4px 10px rgba(255,255,255,0.8)); animation: driftLeftRight 18s ease-in-out infinite alternate;">☁️</div>
            <div style="position: absolute; right: 18%; top: 36%; opacity: 0.75; font-size: 1.9rem; filter: drop-shadow(0 4px 10px rgba(255,255,255,0.8)); animation: driftLeftRight 22s ease-in-out infinite alternate-reverse;">☁️</div>
            <div style="position: absolute; left: 24%; top: 12%; opacity: 0.55; font-size: 1.5rem;">☁️</div>

            <!-- Little Nature Floating Particles -->
            <span style="position: absolute; left: 12%; top: 58%; opacity: 0.65; font-size: 1.3rem; animation: gentleBob 4s ease-in-out infinite;">🌻</span>
            <span style="position: absolute; right: 12%; top: 62%; opacity: 0.55; font-size: 1.2rem; animation: gentleBob 5s ease-in-out infinite 1s;">🌻</span>
            <span style="position: absolute; left: 28%; top: 72%; opacity: 0.65; font-size: 1.4rem; animation: gentleBob 4.5s ease-in-out infinite 0.5s;">🍃</span>
            <span style="position: absolute; right: 26%; top: 80%; opacity: 0.6; font-size: 1.3rem; animation: gentleBob 6s ease-in-out infinite 2s;">🍃</span>
            <span style="position: absolute; right: 38%; top: 24%; opacity: 0.45; font-size: 1rem;">💧</span>
            <span style="position: absolute; left: 4%; top: 85%; opacity: 0.5; font-size: 1rem;">💧</span>
            <span style="position: absolute; right: 5%; top: 90%; opacity: 0.6; font-size: 1.1rem;">🌱</span>
            <span style="position: absolute; left: 34%; top: 18%; opacity: 0.5; font-size: 0.9rem;">✨</span>
            <span style="position: absolute; right: 32%; top: 68%; opacity: 0.6; font-size: 1rem;">✨</span>
            <span style="position: absolute; left: 16%; top: 78%; opacity: 0.5; font-size: 0.9rem;">✨</span>
        </div>

        <!-- Top Navigation Bar -->
        <header style="padding: 14px clamp(16px, 4vw, 36px); display: flex; justify-content: space-between; align-items: center; z-index: 20; position: relative;">
            <!-- Brand Logo Left -->
            <div id="nav-brand" style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                <span style="font-size: 1.6rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">🔍🌻</span>
                <span style="font-size: 1.25rem; font-weight: 900; color: #15803d; letter-spacing: -0.3px;">Detektif Fotosintesis</span>
            </div>

            <!-- Badges & Tools Right -->
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <!-- XP Pill -->
                <div style="background: #fef9c3; border: 1.5px solid #facc15; padding: 6px 14px; border-radius: 20px; font-weight: 800; color: #854d0e; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; box-shadow: 0 2px 6px rgba(250, 204, 21, 0.25);">
                    <span style="color: #eab308; font-size: 1.05rem;">⭐</span>
                    <span id="header-xp-val">${totalXP} XP</span>
                </div>

                <!-- Mission Progress Pill -->
                <div style="background: #ccfbf1; border: 1.5px solid #5eead4; padding: 6px 14px; border-radius: 20px; font-weight: 800; color: #0f766e; display: flex; align-items: center; gap: 6px; font-size: 0.88rem; box-shadow: 0 2px 6px rgba(94, 234, 212, 0.25);">
                    <span style="color: #0d9488; font-size: 1.05rem;">🎯</span>
                    <span>Misi ${currentMisi}/8</span>
                </div>

                <!-- Master Audio Toggle Button -->
                <button id="btn-music" class="btn-nav-icon btn-master-audio" title="Suara Master (Musik & Efek Suara)" aria-label="Toggle Suara Master">
                    <i data-lucide="volume-2" style="width: 18px; height: 18px; color: #0f766e;"></i>
                </button>

                <!-- Profile / Progres Button -->
                <button id="btn-profil" class="btn-nav-icon" title="Progres & Profil Siswa" aria-label="Progres Siswa">
                    <span style="font-size: 1.1rem; line-height: 1;">📊</span>
                </button>

                <!-- Fullscreen / Papan Interaktif Button -->
                <button id="btn-fullscreen" class="btn-nav-icon" title="Layar Penuh / Papan" aria-label="Layar Penuh">
                    <i data-lucide="maximize" style="width: 16px; height: 16px; color: #0f766e;"></i>
                </button>
            </div>
        </header>

        <!-- Center Hero & Interactive Buttons Cluster -->
        <main style="margin: auto 0; padding: 20px clamp(16px, 4vw, 32px); text-align: center; z-index: 10; max-width: 860px; width: 100%; align-self: center; display: flex; flex-direction: column; align-items: center;">
            
            <!-- Main Title -->
            <h1 style="font-size: clamp(2.4rem, 6.5vw, 3.8rem); font-weight: 900; color: #16382b; margin: 0 0 10px 0; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(22, 56, 43, 0.08);">
                Detektif Fotosintesis
            </h1>

            <!-- Subtitle -->
            <p style="font-size: clamp(1rem, 2.2vw, 1.25rem); color: #2d4f3e; font-weight: 700; margin: 0 auto 20px auto; max-width: 660px; line-height: 1.5; opacity: 0.92;">
                Pecahkan misteri bagaimana tumbuhan membuat makanan dan menghasilkan oksigen!
            </p>

            <!-- Cute Center Animated Sunflower Character -->
            <div style="margin: 0 auto 24px auto; width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 8px 18px rgba(0,0,0,0.12)); animation: gentleBob 3.5s ease-in-out infinite;">
                <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Sunflower Petals -->
                    <g fill="#FBBF24" stroke="#F59E0B" stroke-width="1.5">
                        <circle cx="50" cy="18" r="10" />
                        <circle cx="72" cy="27" r="10" />
                        <circle cx="82" cy="50" r="10" />
                        <circle cx="72" cy="73" r="10" />
                        <circle cx="50" cy="82" r="10" />
                        <circle cx="28" cy="73" r="10" />
                        <circle cx="18" cy="50" r="10" />
                        <circle cx="28" cy="27" r="10" />
                    </g>
                    <!-- Center seed disk -->
                    <circle cx="50" cy="50" r="22" fill="#78350F" stroke="#92400E" stroke-width="2" />
                    <circle cx="50" cy="50" r="18" fill="#92400E" />
                    <!-- Cute Face -->
                    <circle cx="43" cy="48" r="2.5" fill="#FEF3C7" />
                    <circle cx="57" cy="48" r="2.5" fill="#FEF3C7" />
                    <path d="M44 54 Q50 60 56 54" stroke="#FEF3C7" stroke-width="2.5" stroke-linecap="round" fill="none" />
                    <!-- Stem & Leaves -->
                    <path d="M50 72 Q50 92 50 96" stroke="#16A34A" stroke-width="6" stroke-linecap="round" />
                    <path d="M50 84 Q66 80 68 88 Q58 92 50 88" fill="#22C55E" />
                    <path d="M50 84 Q34 80 32 88 Q42 92 50 88" fill="#22C55E" />
                </svg>
            </div>

            <!-- Primary Action Button: 🚀 MULAI BELAJAR -->
            <button id="btn-start" class="btn-game-primary" style="margin-bottom: 16px;">
                <span style="font-size: 1.35rem; line-height: 1;">🚀</span>
                <span>MULAI BELAJAR</span>
            </button>

            <!-- Secondary Actions Row: ❓ CARA PENGGUNAAN & 🔬 LAB SIMULASI & 📊 PROGRES -->
            <div style="display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 18px;">
                <!-- Button Cara Penggunaan -->
                <button id="btn-guide" class="btn-game-sec btn-game-white">
                    <span style="color: #ef4444; font-size: 1.15rem; font-weight: 900; line-height: 1;">❓</span>
                    <span>CARA PENGGUNAAN</span>
                </button>

                <!-- Button Lab Eksplorasi / Simulasi -->
                <button id="btn-simulasi" class="btn-game-sec btn-game-blue">
                    <span style="font-size: 1.15rem; line-height: 1;">🔬</span>
                    <span>LAB SIMULASI</span>
                </button>

                <!-- Button Progres Siswa -->
                <button id="btn-progres-mid" class="btn-game-sec btn-game-glass">
                    <span style="font-size: 1.15rem; line-height: 1;">📊</span>
                    <span>PROGRES</span>
                </button>
            </div>

            <!-- Tertiary Action Link: ℹ️ TENTANG & PROFIL PENGEMBANG -->
            <button id="btn-tentang" class="btn-game-link">
                <span style="font-size: 1.15rem; line-height: 1;">ℹ️</span>
                <span>TENTANG & PROFIL PENGEMBANG</span>
            </button>
        </main>

        <!-- Bottom Feature Highlights Ribbon -->
        <footer style="padding: 16px 20px; text-align: center; font-size: clamp(0.78rem, 1.8vw, 0.92rem); color: #375344; font-weight: 800; display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap; z-index: 10; user-select: none;">
            <span>🌸 8 Misi Seru</span>
            <span style="opacity: 0.35;">•</span>
            <span>🌾 Model 3D Interaktif</span>
            <span style="opacity: 0.35;">•</span>
            <span>🎮 Kuis Bertingkat</span>
            <span style="opacity: 0.35;">•</span>
            <span>🏆 Sistem Badge</span>
        </footer>
    `;

    // Inject Game Button Styles & Keyframe Animations
    const style = document.createElement('style');
    style.innerHTML = `
        /* Game 3D Push Button Styles */
        .btn-game-primary {
            background: #00c853;
            color: white;
            font-size: clamp(1.15rem, 2.5vw, 1.35rem);
            font-weight: 900;
            padding: 16px clamp(36px, 6vw, 54px);
            border-radius: 40px;
            border: none;
            box-shadow: 0 6px 0 #009624, 0 12px 24px rgba(0, 200, 83, 0.35);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.15s ease;
            letter-spacing: 0.5px;
            user-select: none;
        }
        .btn-game-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 0 #009624, 0 16px 28px rgba(0, 200, 83, 0.4);
            background: #05d65a;
        }
        .btn-game-primary:active {
            transform: translateY(4px);
            box-shadow: 0 2px 0 #009624, 0 6px 12px rgba(0, 200, 83, 0.3);
        }

        .btn-game-sec {
            font-size: clamp(0.92rem, 1.8vw, 1.05rem);
            font-weight: 900;
            padding: 12px 24px;
            border-radius: 28px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.15s ease;
            letter-spacing: 0.3px;
            user-select: none;
        }

        .btn-game-white {
            background: white;
            color: #00875a;
            border: 2.5px solid #00c853;
            box-shadow: 0 5px 0 #009624, 0 8px 18px rgba(0,0,0,0.06);
        }
        .btn-game-white:hover {
            transform: translateY(-2px);
            background: #f0fdf4;
            box-shadow: 0 7px 0 #009624, 0 10px 20px rgba(0,0,0,0.08);
        }
        .btn-game-white:active {
            transform: translateY(3px);
            box-shadow: 0 2px 0 #009624;
        }

        .btn-game-blue {
            background: #0284c7;
            color: white;
            border: none;
            box-shadow: 0 5px 0 #0369a1, 0 8px 18px rgba(2, 132, 199, 0.28);
        }
        .btn-game-blue:hover {
            transform: translateY(-2px);
            background: #0390d9;
            box-shadow: 0 7px 0 #0369a1, 0 10px 22px rgba(2, 132, 199, 0.35);
        }
        .btn-game-blue:active {
            transform: translateY(3px);
            box-shadow: 0 2px 0 #0369a1;
        }

        .btn-game-glass {
            background: rgba(255, 255, 255, 0.75);
            color: #166534;
            border: 2px solid rgba(22, 101, 52, 0.25);
            box-shadow: 0 5px 0 rgba(22, 101, 52, 0.2), 0 8px 16px rgba(0,0,0,0.04);
            backdrop-filter: blur(8px);
        }
        .btn-game-glass:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 7px 0 rgba(22, 101, 52, 0.22);
        }
        .btn-game-glass:active {
            transform: translateY(3px);
            box-shadow: 0 2px 0 rgba(22, 101, 52, 0.2);
        }

        .btn-game-link {
            background: rgba(255, 255, 255, 0.55);
            color: #374151;
            font-size: 0.92rem;
            font-weight: 800;
            padding: 8px 20px;
            border-radius: 20px;
            border: 1.5px solid rgba(0,0,0,0.08);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
            transition: all 0.2s ease;
            letter-spacing: 0.4px;
        }
        .btn-game-link:hover {
            background: white;
            color: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-color: #86efac;
        }

        .btn-nav-icon {
            background: rgba(255, 255, 255, 0.85);
            border: 1.5px solid rgba(15, 118, 110, 0.25);
            width: 38px;
            height: 38px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            transition: all 0.15s ease;
        }
        .btn-nav-icon:hover {
            background: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            border-color: #0f766e;
        }
        .btn-nav-icon:active {
            transform: translateY(1px);
        }

        /* Subtle Keyframe Animations */
        @keyframes gentleBob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-7px); }
        }
        @keyframes gentleFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes rotateSun {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes driftLeftRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(35px); }
        }
    `;
    container.appendChild(style);

    // Event Listeners
    container.querySelector('#nav-brand').addEventListener('click', () => {
        router.navigate('/');
    });

    // Mulai Belajar -> Halaman Materi 8 Level
    container.querySelector('#btn-start').addEventListener('click', () => {
        router.navigate('/materi');
    });

    // Cara Penggunaan -> Buka Panduan Modal
    container.querySelector('#btn-guide').addEventListener('click', () => {
        showGuideModal('3d');
    });

    // Lab Simulasi -> Halaman Simulasi
    container.querySelector('#btn-simulasi').addEventListener('click', () => {
        router.navigate('/simulasi');
    });

    // Progres Siswa (Mid Button & Header Icon)
    container.querySelector('#btn-progres-mid').addEventListener('click', () => {
        router.navigate('/profil');
    });
    container.querySelector('#btn-profil').addEventListener('click', () => {
        router.navigate('/profil');
    });

    // Tentang & Profil Pengembang
    container.querySelector('#btn-tentang').addEventListener('click', () => {
        router.navigate('/pengembang');
    });

    // Fullscreen API untuk Papan Interaktif
    const btnFullscreen = container.querySelector('#btn-fullscreen');
    btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting fullscreen: ${err.message}`);
            });
            btnFullscreen.title = 'Keluar Layar Penuh';
        } else {
            document.exitFullscreen();
            btnFullscreen.title = 'Layar Penuh / Papan';
        }
    });

    // Master Audio Toggle (Musik + SFX)
    const btnMusic = container.querySelector('#btn-music');
    if (btnMusic) {
        attachAudioToggle(btnMusic);
    }

    return container;
}
