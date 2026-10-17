import { store } from '../utils/PenyimpananData.js';
import { shootConfetti } from '../utils/EfekSelebrasi.js';
import { playSound } from '../utils/SistemSuara.js';

export function renderConceptMap(router) {
    const container = document.createElement('div');
    container.className = 'view-container';
    container.style.backgroundColor = '#f8fafc';
    container.style.overflowY = 'auto';
    container.style.padding = '20px';

    const state = store.state;
    const p = state.progress;

    // Hitung persentase
    let completedSteps = 0;
    if (p.homeVisited) completedSteps++;
    if (p.materiCompleted) completedSteps++;
    if (p.simulasiUsed) completedSteps++;
    if (p.quizScore > 0) completedSteps++;
    const totalSteps = 4;
    const progressPercent = Math.round((completedSteps / totalSteps) * 100);

    if (progressPercent === 100) {
        setTimeout(() => {
            playSound('win');
            shootConfetti();
        }, 500);
    }

    container.innerHTML = `
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button id="btn-back" class="btn btn-secondary" style="background: white; color: var(--text-main); border: 1px solid #e2e8f0;">
                    <i data-lucide="arrow-left"></i> Kembali
                </button>
                <h2 style="color: var(--primary-dark);"><i data-lucide="map"></i> Peta Perjalanan & Konsep</h2>
            </div>

            <!-- Progress Map Section -->
            <div class="glass-panel" style="padding: 30px; margin-bottom: 40px; text-align: center;">
                <h3 style="margin-bottom: 20px; color: var(--text-main);">Progres Petualanganmu</h3>
                
                <div style="width: 100%; height: 12px; background: #e2e8f0; border-radius: 6px; margin: 0 auto 20px; overflow: hidden;">
                    <div style="width: ${progressPercent}%; height: 100%; background: var(--success); transition: width 0.5s;"></div>
                </div>

                <div style="display: flex; justify-content: space-between; position: relative;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${p.homeVisited ? 'var(--success)' : '#cbd5e1'}; color: white; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="${p.homeVisited ? 'check' : 'lock'}"></i>
                        </div>
                        <span style="font-size: 0.8rem; font-weight: bold; color: var(--text-muted);">Mulai</span>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${p.materiCompleted ? 'var(--success)' : '#cbd5e1'}; color: white; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="${p.materiCompleted ? 'check' : 'lock'}"></i>
                        </div>
                        <span style="font-size: 0.8rem; font-weight: bold; color: var(--text-muted);">Eksplorasi</span>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${p.simulasiUsed ? 'var(--success)' : '#cbd5e1'}; color: white; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="${p.simulasiUsed ? 'check' : 'lock'}"></i>
                        </div>
                        <span style="font-size: 0.8rem; font-weight: bold; color: var(--text-muted);">Eksperimen</span>
                    </div>

                    <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${p.quizScore > 0 ? 'var(--secondary)' : '#cbd5e1'}; color: white; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="${p.quizScore > 0 ? 'star' : 'lock'}"></i>
                        </div>
                        <span style="font-size: 0.8rem; font-weight: bold; color: var(--text-muted);">Ahli</span>
                    </div>
                </div>
            </div>

            <!-- Concept Map Section -->
            <div class="glass-panel" style="padding: 40px; text-align: center; background: linear-gradient(to bottom, #ffffff, #f0fdf4); position: relative; overflow: hidden; margin-bottom: 20px;">
                <h3 style="margin-bottom: 30px; color: var(--primary-dark); font-size: 1.8rem;">Rahasia Dapur Tumbuhan (Fotosintesis)</h3>
                
                <style>
                    @keyframes flowDown {
                        0% { transform: translateY(-10px); opacity: 0.2; }
                        50% { opacity: 1; }
                        100% { transform: translateY(10px); opacity: 0.2; }
                    }
                    @keyframes pulseGlow {
                        0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.2); transform: scale(1); }
                        50% { box-shadow: 0 0 25px rgba(34, 197, 94, 0.6); transform: scale(1.05); }
                        100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.2); transform: scale(1); }
                    }
                    .ing {
                        padding: 15px 25px; border-radius: 12px; font-weight: 800; font-size: 1.1rem; color: white;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s; width: 160px;
                    }
                    .ing:hover { transform: translateY(-5px) scale(1.05); }
                    .flow-icon { width: 32px; height: 32px; color: var(--primary); animation: flowDown 1.5s infinite; }
                </style>

                <div style="display: flex; flex-direction: column; gap: 20px; align-items: center; font-family: 'Nunito', sans-serif;">
                    
                    <!-- Bahan Baku -->
                    <div style="display: flex; gap: 15px; align-items: center; justify-content: center; flex-wrap: wrap;">
                        <div class="ing" style="background: #38bdf8;">💧 Air (H₂O)<br><span style="font-size:0.8rem; font-weight:normal;">dari Akar</span></div>
                        <span style="font-size: 2rem; color: #94a3b8; font-weight: bold;">+</span>
                        <div class="ing" style="background: #64748b;">💨 Karbon Dioksida<br><span style="font-size:0.8rem; font-weight:normal;">dari Stomata</span></div>
                        <span style="font-size: 2rem; color: #94a3b8; font-weight: bold;">+</span>
                        <div class="ing" style="background: #f59e0b;">☀️ Cahaya<br><span style="font-size:0.8rem; font-weight:normal;">dari Matahari</span></div>
                    </div>
                    
                    <!-- Proses mengalir -->
                    <div style="display: flex; gap: 190px;">
                        <i data-lucide="arrow-down" class="flow-icon" style="animation-delay: 0s;"></i>
                        <i data-lucide="arrow-down" class="flow-icon" style="animation-delay: 0.2s;"></i>
                        <i data-lucide="arrow-down" class="flow-icon" style="animation-delay: 0.4s;"></i>
                    </div>
                    
                    <!-- Dapur -->
                    <div style="background: var(--primary-dark); color: white; padding: 25px 50px; border-radius: 20px; font-size: 1.5rem; font-weight: 900; animation: pulseGlow 3s infinite; position: relative;">
                        🍃 KLOROPLAS
                        <div style="font-size: 0.9rem; font-weight: normal; margin-top: 5px;">(Pabrik Makanan di Daun)</div>
                    </div>

                    <!-- Hasil mengalir -->
                    <div style="display: flex; gap: 80px;">
                        <i data-lucide="arrow-down" class="flow-icon" style="animation-delay: 0.5s;"></i>
                        <i data-lucide="arrow-down" class="flow-icon" style="animation-delay: 0.7s;"></i>
                    </div>

                    <!-- Hasil Produk -->
                    <div style="display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap;">
                        <div class="ing" style="background: var(--secondary); color: var(--text-main);">🥞 Glukosa<br><span style="font-size:0.8rem; font-weight:normal;">(Makanan Tumbuhan)</span></div>
                        <span style="font-size: 2rem; color: #94a3b8; font-weight: bold;">+</span>
                        <div class="ing" style="background: #e2e8f0; color: var(--text-main);">🌬️ Oksigen (O₂)<br><span style="font-size:0.8rem; font-weight:normal;">(Dilepas ke udara)</span></div>
                    </div>

                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        container.querySelector('#btn-back').addEventListener('click', () => {
            router.navigate('/');
        });
        if (window.lucide) window.lucide.createIcons();
    }, 50);

    return container;
}
