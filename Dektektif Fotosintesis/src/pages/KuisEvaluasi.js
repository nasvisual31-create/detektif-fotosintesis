import { store } from '../utils/PenyimpananData.js';
import { quizData, badgeLevels } from '../data/DataKuis.js';
import { playSound } from '../utils/SistemSuara.js';
import { shootConfetti } from '../utils/EfekSelebrasi.js';

export function renderQuiz(router) {
    const container = document.createElement('div');
    container.className = 'view-container';
    container.style.backgroundColor = '#f8fafc';
    container.style.overflowY = 'auto';
    container.style.padding = '20px';

    let currentQuestionIndex = 0;
    let score = 0;

    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Header Kuis -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <button id="btn-back" class="btn btn-secondary" style="background: white; color: var(--text-main); border: 1px solid #e2e8f0;">
                    <i data-lucide="arrow-left"></i> Kembali
                </button>
                <div style="display: flex; align-items: center; gap: 10px; font-weight: bold; color: var(--primary-dark);">
                    <i data-lucide="star"></i>
                    <span id="score-display">Skor: ${store.state.progress.quizScore || 0}</span>
                </div>
            </div>

            <!-- Area Kuis Utama -->
            <div id="quiz-area" class="glass-panel" style="padding: 40px; text-align: center;">
                <div id="quiz-progress" style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px; font-weight: bold;">
                    Pertanyaan 1 dari ${quizData.length}
                </div>
                
                <h2 id="question-text" style="font-size: 1.8rem; margin-bottom: 40px; color: var(--text-main);">Memuat pertanyaan...</h2>
                
                <div id="options-container" style="display: flex; flex-direction: column; gap: 15px; max-width: 600px; margin: 0 auto;">
                    <!-- Opsi akan dirender di sini -->
                </div>
            </div>

            <!-- Panel Feedback (Tersembunyi Awalnya) -->
            <div id="feedback-panel" class="glass-panel" style="padding: 30px; margin-top: 20px; display: none; animation: fadeIn 0.3s ease-out; border-left: 5px solid transparent;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div id="feedback-icon"></div>
                    <h3 id="feedback-title" style="font-size: 1.5rem;">Judul Feedback</h3>
                </div>
                <p id="feedback-text" style="font-size: 1.1rem; color: var(--text-main); line-height: 1.6; margin-bottom: 25px;"></p>
                <button id="btn-next" class="btn btn-primary" style="width: 100%;">Lanjutkan</button>
            </div>
            
            <!-- Layar Selesai (Tersembunyi Awalnya) -->
            <div id="completion-screen" class="glass-panel" style="padding: 50px 30px; text-align: center; display: none;">
                <i data-lucide="award" style="width: 80px; height: 80px; color: var(--secondary); margin-bottom: 20px;"></i>
                <h1 style="font-size: 2.5rem; margin-bottom: 15px; color: var(--primary-dark);">Kuis Selesai!</h1>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Skor Akhir Kamu:</p>
                <h2 id="final-score" style="font-size: 3rem; color: var(--secondary-dark); margin-bottom: 30px;">0 / 100</h2>
                
                <div id="badge-display" style="background: var(--background); padding: 20px; border-radius: 12px; display: inline-block; margin-bottom: 30px;">
                    <h4 style="margin-bottom: 5px; color: var(--text-muted);">Peringkatmu:</h4>
                    <h3 id="badge-name" style="color: var(--primary-dark); display: flex; align-items: center; gap: 10px; justify-content: center;">
                        Lencana
                    </h3>
                </div>
                
                <br>
                <button id="btn-print" class="btn btn-primary" style="padding: 15px 40px; font-size: 1.2rem; margin-right: 15px; margin-bottom: 15px;">
                    <i data-lucide="printer"></i> Cetak Sertifikat
                </button>
                <button id="btn-finish" class="btn btn-secondary" style="padding: 15px 40px; font-size: 1.2rem; margin-bottom: 15px;">Kembali ke Beranda</button>
            </div>

            <!-- Sertifikat Tersembunyi (Hanya untuk Print) -->
            <div id="print-certificate" style="display: none; width: 100%; text-align: center; border: 10px solid #22c55e; padding: 50px; background: white; border-radius: 20px;">
                <h1 style="color: #22c55e; font-size: 4rem; margin-bottom: 20px;">SERTIFIKAT PENGHARGAAN</h1>
                <p style="font-size: 1.5rem; color: #64748b; margin-bottom: 20px;">Diberikan dengan bangga kepada:</p>
                <h2 style="font-size: 3rem; color: #0f172a; margin-bottom: 30px; text-decoration: underline;">${store.state.user ? store.state.user.name : 'Siswa Hebat'}</h2>
                <p style="font-size: 1.5rem; color: #64748b; margin-bottom: 40px;">Telah menyelesaikan misi <strong>Detektif Fotosintesis</strong> dengan Predikat:</p>
                <h3 id="print-badge" style="font-size: 2.5rem; color: #fbbf24; margin-bottom: 40px;">LENCANA EMAS</h3>
                <p style="font-size: 1.2rem; color: #94a3b8;">Ilmuwan Cilik Masa Depan!</p>
            </div>

        </div>
    `;

    // References
    const quizArea = container.querySelector('#quiz-area');
    const questionText = container.querySelector('#question-text');
    const optionsContainer = container.querySelector('#options-container');
    const progressText = container.querySelector('#quiz-progress');
    const scoreDisplay = container.querySelector('#score-display');
    
    const feedbackPanel = container.querySelector('#feedback-panel');
    const feedbackIcon = container.querySelector('#feedback-icon');
    const feedbackTitle = container.querySelector('#feedback-title');
    const feedbackText = container.querySelector('#feedback-text');
    const btnNext = container.querySelector('#btn-next');

    const completionScreen = container.querySelector('#completion-screen');

    const renderQuestion = () => {
        feedbackPanel.style.display = 'none';
        
        const q = quizData[currentQuestionIndex];
        progressText.innerText = `Pertanyaan ${currentQuestionIndex + 1} dari ${quizData.length}`;
        questionText.innerText = q.question;
        optionsContainer.innerHTML = '';

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.style.cssText = `
                background: white; color: var(--text-main); border: 2px solid #e2e8f0; 
                padding: 18px; font-size: 1.1rem; text-align: left; justify-content: flex-start;
                transition: all 0.2s;
            `;
            btn.innerHTML = `<strong style="color: var(--primary-dark); margin-right: 15px;">${opt.id}</strong> ${opt.text}`;
            
            btn.onmouseover = () => btn.style.borderColor = 'var(--primary)';
            btn.onmouseout = () => btn.style.borderColor = '#e2e8f0';
            
            btn.onclick = () => handleAnswer(opt.id, btn);
            optionsContainer.appendChild(btn);
        });
    };

    const handleAnswer = (selectedId, btnElement) => {
        // Disable all buttons
        const allBtns = optionsContainer.querySelectorAll('button');
        allBtns.forEach(b => {
            b.disabled = true;
            b.style.pointerEvents = 'none';
            b.onmouseout = null;
            b.onmouseover = null;
        });

        const q = quizData[currentQuestionIndex];
        const isCorrect = selectedId === q.correctId;

        if (isCorrect) {
            btnElement.style.backgroundColor = 'var(--success)';
            btnElement.style.color = 'white';
            btnElement.style.borderColor = 'var(--success)';
            score += Math.round(100 / quizData.length);
            if (currentQuestionIndex === quizData.length - 1 && score > 100) score = 100;
            
            feedbackPanel.style.borderLeftColor = 'var(--success)';
            feedbackTitle.innerText = "Benar!";
            feedbackTitle.style.color = 'var(--success)';
            feedbackIcon.innerHTML = '<i data-lucide="check-circle" style="color: var(--success); width: 32px; height: 32px;"></i>';
            feedbackText.innerText = q.feedbackCorrect;
            
            playSound('correct');
        } else {
            btnElement.style.backgroundColor = 'var(--error)';
            btnElement.style.color = 'white';
            btnElement.style.borderColor = 'var(--error)';
            
            // Highlight jawaban benar
            allBtns.forEach(b => {
                if (b.innerText.startsWith(q.correctId)) {
                    b.style.borderColor = 'var(--success)';
                    b.style.borderWidth = '3px';
                }
            });

            feedbackPanel.style.borderLeftColor = '#f59e0b';
            feedbackTitle.innerText = "Belum Tepat, Yuk Coba Lagi! 😊";
            feedbackTitle.style.color = '#d97706';
            feedbackIcon.innerHTML = '<i data-lucide="help-circle" style="color: #d97706; width: 32px; height: 32px;"></i>';
            feedbackText.innerText = q.feedbackWrong;
            
            playSound('wrong');
        }

        if (window.lucide) window.lucide.createIcons();
        feedbackPanel.style.display = 'block';
    };

    btnNext.onclick = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            renderQuestion();
        } else {
            showCompletion();
        }
    };

    const showCompletion = () => {
        quizArea.style.display = 'none';
        feedbackPanel.style.display = 'none';
        completionScreen.style.display = 'block';
        
        playSound('win');
        shootConfetti();
        
        container.querySelector('#final-score').innerText = `${score} / 100`;
        
        // Tentukan Badge/Level
        let activeBadge = badgeLevels[0];
        badgeLevels.forEach(badge => {
            if (score >= badge.threshold) {
                activeBadge = badge;
            }
        });

        container.querySelector('#badge-name').innerHTML = `<i data-lucide="${activeBadge.icon}"></i> ${activeBadge.title}`;
        container.querySelector('#print-badge').innerHTML = `${activeBadge.title.toUpperCase()} (Skor: ${score})`;
        if (window.lucide) window.lucide.createIcons();

        // Simpan ke Store
        store.update('progress.quizScore', score);
        store.logAction(`completed_quiz_score_${score}`);
    };

    container.querySelector('#btn-back').addEventListener('click', () => {
        router.navigate('/');
    });

    container.querySelector('#btn-finish').addEventListener('click', () => {
        router.navigate('/');
    });

    container.querySelector('#btn-print').addEventListener('click', () => {
        // Tampilkan hanya sertifikat saat di-print
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * { visibility: hidden; }
                #print-certificate, #print-certificate * { visibility: visible; }
                #print-certificate { position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 40px; box-sizing: border-box; }
            }
        `;
        document.head.appendChild(style);
        
        container.querySelector('#print-certificate').style.display = 'block';
        window.print();
        container.querySelector('#print-certificate').style.display = 'none';
        
        document.head.removeChild(style);
        store.logAction('printed_certificate');
    });

    // Mulai Kuis
    renderQuestion();

    return container;
}
