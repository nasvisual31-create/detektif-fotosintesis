import { store } from '../utils/PenyimpananData.js';
import { showGuideModal } from '../components/ModalPetunjuk.js';
import { startAmbientWind } from '../utils/SistemSuara.js';

export function renderLoading(router) {
    const container = document.createElement('div');
    container.className = 'view-container';
    container.style.backgroundColor = '#15803d';
    container.style.backgroundImage = 'radial-gradient(circle at 50% 30%, #22c55e 0%, #15803d 70%, #14532d 100%)';
    container.style.color = 'white';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.padding = '20px';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    const currentUser = (store.state.user && store.state.user.name && !store.state.user.isGuest && store.state.user.name.toLowerCase() !== 'tamu') ? store.state.user : null;

    container.innerHTML = `
        <!-- Floating Animated Background Particles -->
        <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden;" id="loading-particles">
            <span style="position: absolute; top: 15%; left: 10%; font-size: 2.5rem; opacity: 0.35; animation: floatSlow 4s infinite ease-in-out;">🍃</span>
            <span style="position: absolute; top: 25%; right: 12%; font-size: 3rem; opacity: 0.4; animation: floatSlow 5s infinite 1s ease-in-out;">☀️</span>
            <span style="position: absolute; bottom: 20%; left: 15%; font-size: 2rem; opacity: 0.35; animation: floatSlow 4.5s infinite 0.5s ease-in-out;">💧</span>
            <span style="position: absolute; bottom: 25%; right: 18%; font-size: 2.2rem; opacity: 0.3; animation: floatSlow 6s infinite 1.5s ease-in-out;">🌱</span>
        </div>

        <div style="text-align: center; max-width: 650px; width: 100%; z-index: 10; animation: fadeIn 0.5s ease-out;">
            
            <!-- Animated Rotating Sunflower -->
            <div style="position: relative; width: 130px; height: 130px; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <div style="position: absolute; inset: -15px; border-radius: 50%; background: rgba(254, 240, 138, 0.25); filter: blur(20px); animation: pulseGlow 2s infinite alternate;"></div>
                <div style="font-size: 5.5rem; line-height: 1; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.25)); animation: spinSunflower 16s infinite linear;">
                    🌻
                </div>
            </div>

            <!-- Title & Subtitle -->
            <div style="display: inline-block; padding: 4px 14px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); border-radius: 20px; font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.3);">
                Media Pembelajaran Interaktif 3D
            </div>
            
            <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin: 0 0 10px 0; color: white; text-shadow: 0 4px 16px rgba(0,0,0,0.3); line-height: 1.15;">
                Detektif Fotosintesis Interaktif
            </h1>
            
            <p style="font-size: clamp(0.95rem, 2.5vw, 1.15rem); margin: 0 auto 28px auto; opacity: 0.95; max-width: 520px; line-height: 1.5; color: #f0fdf4;">
                Pecahkan Rahasia Struktur Tumbuhan & Fotosintesis IPAS Kelas 4 SD
            </p>

            <!-- Loading Progress Bar Area -->
            <div id="loading-bar-area" style="width: 100%; max-width: 440px; margin: 0 auto 20px auto;">
                <div style="width: 100%; height: 16px; background: rgba(0, 0, 0, 0.25); border-radius: 20px; padding: 3px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.3); border: 1.5px solid rgba(255,255,255,0.3); overflow: hidden;">
                    <div id="loading-progress" style="width: 0%; height: 100%; background: linear-gradient(90deg, #facc15, #f59e0b); border-radius: 20px; transition: width 0.25s ease-out; box-shadow: 0 0 12px #facc15;"></div>
                </div>
                <p id="loading-text" style="margin-top: 12px; font-weight: 700; font-size: 0.92rem; color: #fef08a; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    Menyiapkan laboratorium virtual... 0%
                </p>
            </div>

            <!-- Ready Action Buttons Area (Hidden until loading completes) -->
            <div id="ready-actions-area" style="display: none; animation: popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; flex-direction: column; gap: 12px; align-items: center; max-width: 480px; margin: 0 auto;">
                
                ${currentUser ? `
                    <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); padding: 14px 20px; border-radius: 16px; border: 1.5px solid rgba(255,255,255,0.4); margin-bottom: 4px; width: 100%;">
                        <div style="font-size: 0.85rem; opacity: 0.9;">Selamat Datang Kembali:</div>
                        <div style="font-size: 1.3rem; font-weight: 900; color: #fef08a;">${currentUser.name} (Kelas ${currentUser.class})</div>
                    </div>
                    
                    <button id="btn-enter-app" class="btn" style="width: 100%; background: #f59e0b; color: white; font-size: 1.15rem; font-weight: 900; padding: 14px 28px; border-radius: 18px; box-shadow: 0 6px 0 #b45309, 0 12px 24px rgba(0,0,0,0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                        🚀 Lanjutkan Petualangan
                    </button>
                    
                    <button id="btn-switch-user" class="btn" style="width: 100%; background: rgba(255, 255, 255, 0.2); color: white; font-size: 0.92rem; font-weight: 700; padding: 10px 18px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.4);">
                        👤 Ganti Siswa / Ubah Profil
                    </button>
                ` : `
                    <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); padding: 12px 18px; border-radius: 16px; border: 1.5px solid rgba(255,255,255,0.3); margin-bottom: 4px; width: 100%;">
                        <div style="font-size: 0.95rem; font-weight: 800; color: #fef08a;">Siap Belajar Hari Ini?</div>
                        <div style="font-size: 0.82rem; opacity: 0.9; margin-top: 2px;">Tuliskan namamu & pilih kelas (4A-4E) agar bintang XP dan pialamu tersimpan.</div>
                    </div>

                    <button id="btn-login-first" class="btn" style="width: 100%; background: #f59e0b; color: white; font-size: 1.1rem; font-weight: 900; padding: 14px 24px; border-radius: 16px; box-shadow: 0 5px 0 #b45309, 0 10px 20px rgba(0,0,0,0.25); text-transform: uppercase; letter-spacing: 0.5px;">
                        📝 Isi Nama & Pilih Kelas (4A - 4E)
                    </button>
                    
                    <button id="btn-guest-enter" class="btn" style="width: 100%; background: rgba(255, 255, 255, 0.2); color: white; font-size: 0.95rem; font-weight: 700; padding: 12px 20px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.4);">
                        ✨ Masuk Langsung Sebagai Tamu
                    </button>
                `}

                <button id="btn-open-guide-loading" class="btn" style="background: transparent; color: #fef08a; font-size: 0.9rem; font-weight: 700; text-decoration: underline; margin-top: 4px; padding: 6px 12px;">
                    📖 Baca Petunjuk & Cara Penggunaan Media
                </button>
            </div>

        </div>
    `;

    // Add Keyframe Animations
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spinSunflower {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes floatSlow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(8deg); }
        }
        @keyframes pulseGlow {
            from { opacity: 0.3; transform: scale(0.9); }
            to { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes popUp {
            from { transform: scale(0.85); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    container.appendChild(style);

    const bar = container.querySelector('#loading-progress');
    const text = container.querySelector('#loading-text');
    const loadingArea = container.querySelector('#loading-bar-area');
    const actionsArea = container.querySelector('#ready-actions-area');

    const tips = [
        "Menyiapkan tanah gembur & sistem akar...",
        "Merakit batang & pipa pembuluh xilem...",
        "Memasang daun hijau & dapur kloroplas 3D...",
        "Mengalirkan partikel foton cahaya & udara CO₂...",
        "Semua organ siap! Selamat datang di laboratorium!"
    ];

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 14) + 8;
        const tipIdx = Math.min(Math.floor((progress / 100) * tips.length), tips.length - 1);
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bar.style.width = '100%';
            text.innerText = "Selesai! 100%";
            
            setTimeout(() => {
                loadingArea.style.display = 'none';
                actionsArea.style.display = 'flex';
                store.update('progress.homeVisited', true);
            }, 300);
        } else {
            bar.style.width = `${progress}%`;
            text.innerText = `${tips[tipIdx]} (${progress}%)`;
        }
    }, 160);

    // Bind Button Events
    setTimeout(() => {
        const btnEnterApp = container.querySelector('#btn-enter-app');
        if (btnEnterApp) {
            btnEnterApp.addEventListener('click', () => {
                startAmbientWind();
                router.navigate('/');
            });
        }

        const btnSwitchUser = container.querySelector('#btn-switch-user');
        if (btnSwitchUser) {
            btnSwitchUser.addEventListener('click', () => {
                router.navigate('/profil');
            });
        }

        const btnLoginFirst = container.querySelector('#btn-login-first');
        if (btnLoginFirst) {
            btnLoginFirst.addEventListener('click', () => {
                router.navigate('/profil');
            });
        }

        const btnGuestEnter = container.querySelector('#btn-guest-enter');
        if (btnGuestEnter) {
            btnGuestEnter.addEventListener('click', () => {
                store.loginGuest();
                startAmbientWind();
                router.navigate('/');
            });
        }

        const btnGuide = container.querySelector('#btn-open-guide-loading');
        if (btnGuide) {
            btnGuide.addEventListener('click', () => {
                showGuideModal('3d');
            });
        }
    }, 50);

    return container;
}
