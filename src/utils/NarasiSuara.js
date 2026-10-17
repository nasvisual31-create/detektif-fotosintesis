// Simple Text-to-Speech Utility menggunakan Web Speech API bawaan browser
export const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
        console.warn('Text-to-speech tidak didukung di browser ini.');
        return;
    }

    // Hentikan suara yang sedang berjalan agar tidak bertumpuk
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Konfigurasi suara
    utterance.lang = 'id-ID'; // Bahasa Indonesia
    utterance.rate = 0.9;     // Kecepatan (sedikit lambat agar anak mudah paham)
    utterance.pitch = 1.2;    // Pitch agak tinggi agar terdengar ramah (seperti suara pemandu)

    // Coba temukan suara perempuan bahasa Indonesia jika tersedia di sistem
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang === 'id-ID' && v.name.toLowerCase().includes('female'));
    if (idVoice) {
        utterance.voice = idVoice;
    }

    window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
};
