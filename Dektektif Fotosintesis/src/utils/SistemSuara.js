import { store } from './PenyimpananData.js';

// =====================================================================
// SISTEM AUDIO MASTER (1-KLIK ON/OFF GLOBAL)
// =====================================================================
// Menghasilkan musik latar ceria ramah anak & seluruh SFX kuis secara sintesis procedural
// 100% offline, instan, tanpa file MP3 besar, dan terjamin bersuara jernih di semua speaker!

let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

// Global unlock saat interaksi pertama pengguna di layar
if (typeof window !== 'undefined') {
    const unlockUserAudio = () => {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
    };
    window.addEventListener('pointerdown', unlockUserAudio, { once: true });
    window.addEventListener('keydown', unlockUserAudio, { once: true });
}

// Status aktif suara saat ini
let isAudioActive = false;

export const isMasterAudioEnabled = () => {
    return isAudioActive;
};

// =====================================================================
// 1. NADA-NADA MUSIK KALIMBA & BELL CHIME
// =====================================================================
const N = {
    C3: 130.81, F3: 174.61, G3: 196.00, A3: 220.00,
    C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00,
    C6: 1046.50
};

// Memainkan 1 not nada jernih (Glockenspiel / Bell Chime)
function playTone(freq, duration = 0.35, vol = 0.28, type = 'sine', startTimeOffset = 0) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const now = ctx.currentTime + startTimeOffset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Amplop suara akustik: serang cepat, peluruhan merdu
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.start(now);
        osc.stop(now + duration + 0.05);
    } catch (e) {
        console.warn('Audio tone error:', e);
    }
}

// Melodi 16 ketukan ceria bunga matahari (Tempo ~88 BPM / 340ms)
const bgmNotes = [
    { note: N.C5, bass: N.C3, dur: 0.35 },
    { note: N.E5, dur: 0.25 },
    { note: N.G5, dur: 0.35 },
    { note: N.E5, dur: 0.25 },
    { note: N.A5, bass: N.F3, dur: 0.40 },
    { note: N.G5, dur: 0.28 },
    { note: N.E5, dur: 0.32 },
    { note: N.D5, dur: 0.28 },

    { note: N.C5, bass: N.G3, dur: 0.35 },
    { note: N.D5, dur: 0.25 },
    { note: N.E5, dur: 0.35 },
    { note: N.G5, dur: 0.25 },
    { note: N.C6, bass: N.C3, dur: 0.50 },
    { note: N.A5, dur: 0.28 },
    { note: N.G5, dur: 0.32 },
    { note: N.E5, dur: 0.35 }
];

let bgmTimer = null;
let bgmIndex = 0;

function startBgmLoop() {
    stopBgmLoop();
    bgmIndex = 0;

    const playNextBeat = () => {
        if (!isAudioActive) {
            stopBgmLoop();
            return;
        }

        const step = bgmNotes[bgmIndex];
        if (step) {
            playTone(step.note, step.dur, 0.24, 'triangle');
            if (step.bass) {
                playTone(step.bass, 0.55, 0.16, 'sine');
            }
        }

        bgmIndex = (bgmIndex + 1) % bgmNotes.length;
    };

    // Mainkan ketukan pertama seketika
    playNextBeat();
    bgmTimer = setInterval(playNextBeat, 340);
}

function stopBgmLoop() {
    if (bgmTimer) {
        clearInterval(bgmTimer);
        bgmTimer = null;
    }
}

// =====================================================================
// 2. NADA KONFIRMASI TOMBOL & SFX
// =====================================================================
function playToggleFeedback(turnOn) {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (turnOn) {
        // Nada ceria lonceng naik 4 ketukan: C5 -> E5 -> G5 -> C6 ("Deng-Ding-Dong-DENG! 🔔")
        playTone(N.C5, 0.18, 0.32, 'triangle', 0.00);
        playTone(N.E5, 0.18, 0.32, 'triangle', 0.09);
        playTone(N.G5, 0.20, 0.35, 'triangle', 0.18);
        playTone(N.C6, 0.38, 0.38, 'triangle', 0.27);
    } else {
        // Nada lembut turun: G5 -> E5 -> C5 ("Hening")
        playTone(N.G5, 0.15, 0.22, 'triangle', 0.00);
        playTone(N.E5, 0.15, 0.22, 'triangle', 0.08);
        playTone(N.C5, 0.22, 0.20, 'triangle', 0.16);
    }
}

// =====================================================================
// 1B. AMBIENT WIND SYNTHESIZER (Parametric Web Audio API)
// White Noise + Bandpass Filter + LFO Oscillator untuk Semilir Angin
// =====================================================================
let windSource = null;
let windLFO = null;
let windGain = null;

function startWindSynthesizer() {
    stopWindSynthesizer();
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        const bufferSize = ctx.sampleRate * 2.5;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        windSource = ctx.createBufferSource();
        windSource.buffer = noiseBuffer;
        windSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 450;
        filter.Q.value = 1.8;

        windLFO = ctx.createOscillator();
        windLFO.frequency.value = 0.16; // Ayunan sepoi-sepoi lambat 6 detik per siklus
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 220; // Modulasi frekuensi 230Hz - 670Hz
        windLFO.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        windGain = ctx.createGain();
        windGain.gain.setValueAtTime(0.001, ctx.currentTime);
        windGain.gain.exponentialRampToValueAtTime(0.065, ctx.currentTime + 1.0);

        windSource.connect(filter);
        filter.connect(windGain);
        windGain.connect(ctx.destination);

        windLFO.start();
        windSource.start();
    } catch (e) {
        console.warn('Wind synth error:', e);
    }
}

function stopWindSynthesizer() {
    if (windGain && audioCtx) {
        try {
            windGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        } catch (e) {}
    }
    setTimeout(() => {
        if (windSource) {
            try { windSource.stop(); } catch (e) {}
            windSource = null;
        }
        if (windLFO) {
            try { windLFO.stop(); } catch (e) {}
            windLFO = null;
        }
        windGain = null;
    }, 350);
}

// Master Audio Controls
export const setMasterAudio = (enabled) => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }

    isAudioActive = Boolean(enabled);
    store.update('masterAudioEnabled', isAudioActive);

    if (isAudioActive) {
        playToggleFeedback(true);
        startWindSynthesizer();
        setTimeout(() => {
            if (isAudioActive) {
                startBgmLoop();
            }
        }, 450);
    } else {
        playToggleFeedback(false);
        stopWindSynthesizer();
        stopBgmLoop();
    }

    updateAllAudioButtons();
    return isAudioActive;
};

export const toggleMasterAudio = () => {
    return setMasterAudio(!isAudioActive);
};

export const toggleAmbientWind = toggleMasterAudio;
export const startAmbientWind = () => {
    if (isAudioActive && !bgmTimer) {
        startWindSynthesizer();
        startBgmLoop();
    }
};
export const stopAmbientWind = () => {
    stopWindSynthesizer();
    stopBgmLoop();
};

// SFX Rintik Hujan Prosedural
export const playRainSound = () => {
    if (!isAudioActive) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
        const bufferSize = ctx.sampleRate * 1.5;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.15;
        }
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1800;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        src.start();
    } catch (e) {}
};

// SFX Kabut Asap Atmosferik
export const playHazeSound = () => {
    if (!isAudioActive) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
        const bufferSize = ctx.sampleRate * 1.5;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.25;
        }
        const src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 320;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.4);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        src.start();
    } catch (e) {}
};

// SFX Kuis & Selebrasi
export const playSound = (type) => {
    if (!isAudioActive) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    if (type === 'correct') {
        // "Ting!" Ceria & Sukses
        playTone(N.C5, 0.14, 0.30, 'sine', 0);
        playTone(N.A5, 0.35, 0.35, 'triangle', 0.07);
    } else if (type === 'wrong') {
        // Suara Lembut & Suportif "Yuk Coba Lagi!" Ramah Anak SD (Warm Marimba Chime)
        // Melodi 3 nada ramah & memotivasi: F4 (349Hz) -> D4 (294Hz) -> G4 (392Hz, resolusi naik ceria memberi semangat)
        playTone(349.23, 0.16, 0.22, 'triangle', 0.00);
        playTone(293.66, 0.18, 0.20, 'triangle', 0.10);
        playTone(392.00, 0.28, 0.24, 'sine', 0.20);
    } else if (type === 'win') {
        // Fanfare Selebrasi Ceria
        playTone(N.C5, 0.18, 0.30, 'triangle', 0.00);
        playTone(N.E5, 0.18, 0.30, 'triangle', 0.10);
        playTone(N.G5, 0.18, 0.32, 'triangle', 0.20);
        playTone(N.C6, 0.45, 0.38, 'triangle', 0.30);
    } else if (type === 'click') {
        // Klik UI Taktil Halus
        playTone(N.G5, 0.04, 0.12, 'sine', 0.00);
    }
};

// =====================================================================
// 3. SINKRONISASI VISUAL SEMUA TOMBOL AUDIO DI HALAMAN
// =====================================================================
export const updateAudioButtonVisual = (button) => {
    if (!button) return;
    button.setAttribute('aria-pressed', isAudioActive ? 'true' : 'false');

    if (isAudioActive) {
        button.title = 'Suara Master: AKTIF (Musik & Efek Suara Menyala) • Klik untuk Matikan';
        button.style.background = '#dcfce7';
        button.style.borderColor = '#22c55e';
        button.style.color = '#15803d';
        button.style.boxShadow = '0 2px 10px rgba(34, 197, 94, 0.35)';
        button.innerHTML = '<i data-lucide="volume-2" style="width: 18px; height: 18px; color: #15803d;"></i>';
    } else {
        button.title = 'Suara Master: MATI (Hening) • Klik untuk Nyalakan Musik';
        button.style.background = '#fef2f2';
        button.style.borderColor = '#f87171';
        button.style.color = '#dc2626';
        button.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
        button.innerHTML = '<i data-lucide="volume-x" style="width: 18px; height: 18px; color: #dc2626;"></i>';
    }
    if (window.lucide) window.lucide.createIcons();
};

export const updateAllAudioButtons = () => {
    const buttons = document.querySelectorAll('.btn-master-audio, #btn-music');
    buttons.forEach(btn => updateAudioButtonVisual(btn));
};

export const attachAudioToggle = (button) => {
    if (!button) return;
    updateAudioButtonVisual(button);
    button.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMasterAudio();
    };
};
