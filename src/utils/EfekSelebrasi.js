// Simple Confetti Generator
export const shootConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    // Tambahkan canvas untuk confetti jika belum ada
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#4ade80', '#fbbf24', '#38bdf8', '#f472b6', '#a78bfa'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 100, // Mulai dari tengah bawah
            r: Math.random() * 6 + 4, // Ukuran
            dx: Math.random() * 20 - 10, // Kecepatan X
            dy: Math.random() * -15 - 5, // Kecepatan Y (melompat ke atas)
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10,
            tiltAngle: 0,
            tiltAngleInc: (Math.random() * 0.07) + 0.05
        });
    }

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let remaining = false;
        
        particles.forEach(p => {
            p.tiltAngle += p.tiltAngleInc;
            p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2 + p.dy;
            p.x += Math.sin(p.tiltAngle) * 2 + p.dx;
            p.dy += 0.5; // Gravitasi

            if (p.y <= canvas.height) remaining = true;

            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();
        });

        if (Date.now() < end || remaining) {
            requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    render();
};
