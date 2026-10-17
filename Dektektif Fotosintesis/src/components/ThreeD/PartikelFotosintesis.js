// PhotosynthesisParticles.js - Sistem Animasi Partikel Aliran Molekul Fotosintesis Interaktif
// Mendukung 2 Skala Berbeda yang Jelas untuk Siswa:
// 1. ORGAN_LEAF: Skala Luar Daun (Sinar dari Langit, CO₂ dari Udara Bebas, Air dari Batang lewat Urat Daun, O₂ dilepas ke Atmosfer, Glukosa ke Batang)
// 2. MESOPHYLL_CELL: Skala Dalam Sel (Reaksi Mikroskopis Kloroplas, Stomata, Xilem & Floem)
// 100% Offline, Three.js & In-Memory Canvas Texture

export class PhotosynthesisParticles {
    constructor(scene, centerPos = new THREE.Vector3(-2.8, 3.5, 0)) {
        this.scene = scene;
        this.leafCenter = centerPos.clone(); // Posisi daun bunga matahari pada model tanaman
        this.cellCenter = new THREE.Vector3(0, 0, 0); // Posisi tengah penampang sel mesofil prosedural
        
        this.mode = 'ORGAN_LEAF'; // 'ORGAN_LEAF' atau 'MESOPHYLL_CELL'
        this.group = new THREE.Group();
        this.group.name = "PHOTOSYNTHESIS_FLOW_SYSTEM";
        this.scene.add(this.group);

        this.particles = [];
        this.speedFactor = 1.0;
        this.stepFilter = 'ALL'; // 'ALL', 'LIGHT', 'WATER', 'CO2', 'SYNTH', 'PRODUCTS'

        // Badge Textures terpisah untuk Luar Daun vs Dalam Sel
        this.textures = {
            organ: {
                co2: this.createBadgeTexture('💨 CO₂ dari Udara', '#ea580c'),
                o2: this.createBadgeTexture('🌬️ O₂ Lepas ke Alam', '#0284c7'),
                h2o: this.createBadgeTexture('💧 H₂O dari Batang', '#2563eb'),
                sugar: this.createBadgeTexture('🥞 Glukosa ke Batang', '#d97706'),
                light: this.createBadgeTexture('☀️ Sinar dari Langit', '#ca8a04')
            },
            cell: {
                co2: this.createBadgeTexture('💨 CO₂ Stomata', '#ea580c'),
                o2: this.createBadgeTexture('🌬️ O₂ dari Kloroplas', '#0284c7'),
                h2o: this.createBadgeTexture('💧 H₂O Xilem', '#2563eb'),
                sugar: this.createBadgeTexture('🥞 Glukosa Floem', '#d97706'),
                light: this.createBadgeTexture('☀️ Foton Kloroplas', '#ca8a04')
            }
        };

        // Geometri & Material bersama
        this.geos = {
            sphereSm: new THREE.SphereGeometry(0.08, 8, 8),
            sphereMd: new THREE.SphereGeometry(0.12, 8, 8),
            lightBeam: new THREE.CylinderGeometry(0.02, 0.05, 1.2, 6),
            lightBeamOrgan: new THREE.CylinderGeometry(0.04, 0.12, 2.5, 8)
        };

        this.mats = {
            light: new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.95 }),
            lightBeam: new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.25 }),
            water: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, roughness: 0.2 }),
            co2: new THREE.MeshStandardMaterial({ color: 0xfb923c, emissive: 0xc2410c, roughness: 0.3 }),
            o2: new THREE.MeshStandardMaterial({ color: 0x7dd3fc, emissive: 0x0369a1, roughness: 0.2, transparent: true, opacity: 0.85 }),
            sugar: new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xb45309, roughness: 0.3 })
        };

        this.setupLightBeams();
        this.initParticles();
        this.setMode('ORGAN_LEAF');
    }

    createBadgeTexture(text, bgColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 170;
        canvas.height = 46;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        const r = 23, w = 170, h = 46;
        ctx.moveTo(r, 0);
        ctx.lineTo(w - r, 0);
        ctx.quadraticCurveTo(w, 0, w, r);
        ctx.lineTo(w, h - r);
        ctx.quadraticCurveTo(w, h, w - r, h);
        ctx.lineTo(r, h);
        ctx.quadraticCurveTo(0, h, 0, h - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = 'bold 18px "Nunito", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, w / 2, h / 2);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }

    createMoleculeMesh(type, labelTex, colorMat) {
        const group = new THREE.Group();
        const mesh = new THREE.Mesh(this.geos.sphereMd, colorMat);
        mesh.castShadow = true;
        group.add(mesh);

        const spriteMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(0.85, 0.25, 1);
        sprite.position.y = 0.25;
        group.add(sprite);
        group.userData.sprite = sprite;

        return group;
    }

    setupLightBeams() {
        this.lightBeamsGroup = new THREE.Group();
        this.beams = [];
        for (let i = 0; i < 6; i++) {
            const beam = new THREE.Mesh(this.geos.lightBeamOrgan, this.mats.lightBeam);
            this.lightBeamsGroup.add(beam);
            this.beams.push(beam);
        }
        this.group.add(this.lightBeamsGroup);
    }

    initParticles() {
        // Pool partikel untuk Air (H2O)
        this.waterParticles = [];
        for (let i = 0; i < 7; i++) {
            const p = this.createMoleculeMesh('H2O', this.textures.organ.h2o, this.mats.water);
            p.userData.type = 'WATER';
            p.userData.t = i / 7;
            this.group.add(p);
            this.waterParticles.push(p);
        }

        // Pool partikel untuk CO2
        this.co2Particles = [];
        for (let i = 0; i < 7; i++) {
            const p = this.createMoleculeMesh('CO2', this.textures.organ.co2, this.mats.co2);
            p.userData.type = 'CO2';
            p.userData.t = i / 7;
            this.group.add(p);
            this.co2Particles.push(p);
        }

        // Pool partikel untuk Cahaya (Foton)
        this.lightParticles = [];
        for (let i = 0; i < 8; i++) {
            const mesh = new THREE.Mesh(this.geos.sphereSm, this.mats.light);
            mesh.userData.type = 'LIGHT';
            mesh.userData.t = i / 8;
            this.group.add(mesh);
            this.lightParticles.push(mesh);
        }

        // Pool partikel untuk O2
        this.o2Particles = [];
        for (let i = 0; i < 7; i++) {
            const p = this.createMoleculeMesh('O2', this.textures.organ.o2, this.mats.o2);
            p.userData.type = 'O2';
            p.userData.t = i / 7;
            this.group.add(p);
            this.o2Particles.push(p);
        }

        // Pool partikel untuk Glukosa
        this.sugarParticles = [];
        for (let i = 0; i < 6; i++) {
            const p = this.createMoleculeMesh('Glukosa', this.textures.organ.sugar, this.mats.sugar);
            p.userData.type = 'SUGAR';
            p.userData.t = i / 6;
            this.group.add(p);
            this.sugarParticles.push(p);
        }
    }

    setMode(mode) {
        this.mode = mode; // 'ORGAN_LEAF' atau 'MESOPHYLL_CELL'
        const isOrgan = (mode === 'ORGAN_LEAF');
        const texGroup = isOrgan ? this.textures.organ : this.textures.cell;

        // 1. Update Tekstur Sprite
        this.waterParticles.forEach(p => {
            if (p.userData.sprite) p.userData.sprite.material.map = texGroup.h2o;
        });
        this.co2Particles.forEach(p => {
            if (p.userData.sprite) p.userData.sprite.material.map = texGroup.co2;
        });
        this.o2Particles.forEach(p => {
            if (p.userData.sprite) p.userData.sprite.material.map = texGroup.o2;
        });
        this.sugarParticles.forEach(p => {
            if (p.userData.sprite) p.userData.sprite.material.map = texGroup.sugar;
        });

        // 2. Tentukan Jalur & Titik Arah Aliran Partikel
        if (isOrgan) {
            // === SKALA ORGAN: PROSES DI LUAR DAUN ===
            // Pusat daun utama bunga matahari: x = -2.8, y = 3.5, z = 0.0

            // Berkas Sinar Matahari: Dari Atas Langit Menghujam Turun ke Daun
            this.beams.forEach((b, i) => {
                b.geometry = this.geos.lightBeamOrgan;
                b.position.set(-3.4 + (i * 0.28), 4.8, 0.2 + (Math.sin(i) * 0.3));
                b.rotation.set(0.1, 0, 0.05);
            });

            // Foton Cahaya: Vertikal dari Langit ke Permukaan Daun
            this.lightParticles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(-3.5 + (i * 0.26), 6.2, 0.3 + (Math.sin(i) * 0.3));
                p.userData.end = new THREE.Vector3(-3.5 + (i * 0.26), 3.65, 0.15 + (Math.sin(i) * 0.2));
            });

            // Air (H₂O): Dari Batang (x=0) ➔ Tangkai Daun ➔ Ibu Tulang Daun & Urat-Urat Daun
            this.waterParticles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(0.0, 3.2, 0.0); // Dari batang
                p.userData.mid = new THREE.Vector3(-1.4, 3.35, 0.08); // Lewat tangkai daun
                // Menyebar ke urat-urat daun di helaian
                p.userData.end = new THREE.Vector3(-2.6 - (i * 0.18), 3.55 + (Math.sin(i) * 0.45), 0.15 + (Math.cos(i) * 0.3));
            });

            // Gas CO₂: Melayang Dari Udara Sekitar ➔ Diserap Masuk ke Permukaan Bawah Daun (Stomata)
            this.co2Particles.forEach((p, i) => {
                // Di udara terbuka
                p.userData.start = new THREE.Vector3(-3.8 + (i * 0.4), 1.8 + (Math.sin(i) * 0.4), 1.4 + (Math.cos(i) * 0.5));
                p.userData.mid = new THREE.Vector3(-3.2 + (i * 0.25), 2.6, 0.7);
                // Masuk ke punggung daun (tempat stomata berada)
                p.userData.end = new THREE.Vector3(-2.8 + (i * 0.15), 3.35, 0.1);
            });

            // Gas Oksigen (O₂): Dari Permukaan Daun ➔ Menghembus Naik Terbang Bebas ke Atmosfer / Alam
            this.o2Particles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(-2.8 + (i * 0.2), 3.6, 0.2); // Keluar dari daun
                p.userData.mid = new THREE.Vector3(-2.4 + (i * 0.25), 4.4, 0.8);
                p.userData.end = new THREE.Vector3(-1.8 + (i * 0.3), 5.5, 1.8); // Bebas di udara
            });

            // Glukosa (Hasil Makanan): Terbentuk di Helaian Daun ➔ Mengalir Kembali Menuju Batang
            this.sugarParticles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(-3.5 + (i * 0.2), 3.6, 0.15); // Dari helaian daun
                p.userData.mid = new THREE.Vector3(-1.6, 3.4, 0.08); // Menyusuri tulang daun
                p.userData.end = new THREE.Vector3(0.0, 3.2, 0.0); // Masuk kembali ke batang
            });

        } else {
            // === SKALA MIKRO: PROSES DI DALAM PENAMPANG SEL MESOFIL ===
            // Pusat penampang sel prosedural: x = 0, y = 0, z = 0

            // Berkas Cahaya: Dari Epidermis Atas ke Silinder Palisade
            this.beams.forEach((b, i) => {
                b.geometry = this.geos.lightBeam;
                b.position.set(-1.0 + (i * 0.4), 1.1, -0.2 + (Math.sin(i) * 0.3));
                b.rotation.set(0, 0, 0);
            });

            // Foton: Dari Atas Epidermis (y=1.8) ke Sel Palisade (y=0.5)
            this.lightParticles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(-1.5 + (i * 0.4), 1.8, (Math.sin(i) * 0.4));
                p.userData.end = new THREE.Vector3(-1.5 + (i * 0.4), 0.5, (Math.sin(i) * 0.4));
            });

            // Air: Dari Silinder Xilem (x=0) Keluar Menyebar ke Sel Spons Mesofil
            this.waterParticles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(0.0, 0.1, (i * 0.3) - 0.9);
                p.userData.mid = new THREE.Vector3(-0.8, 0.2, (Math.sin(i) * 0.5));
                p.userData.end = new THREE.Vector3(-1.8, 0.4, (Math.cos(i) * 0.6));
            });

            // CO₂: Dari Pori Stomata di Bawah (y=-1.2) Naik Masuk ke Rongga Udara Mesofil
            this.co2Particles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(-1.8 + (i * 0.5), -1.2, -0.2);
                p.userData.mid = new THREE.Vector3(-1.5 + (i * 0.4), -0.5, 0.1);
                p.userData.end = new THREE.Vector3(-1.2 + (i * 0.3), 0.3, 0.0);
            });

            // Oksigen: Dari Kloroplas Menuju Ruang Udara Spons lalu Keluar Stomata
            this.o2Particles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(-1.2 + (i * 0.3), 0.4, 0.0);
                p.userData.mid = new THREE.Vector3(-1.4 + (i * 0.4), -0.5, 0.2);
                p.userData.end = new THREE.Vector3(-1.6 + (i * 0.5), -1.5, -0.2);
            });

            // Glukosa: Dari Kloroplas Masuk ke Pembuluh Floem di Tengah
            this.sugarParticles.forEach((p, i) => {
                p.userData.start = new THREE.Vector3(-1.5, 0.4, (Math.sin(i) * 0.5));
                p.userData.mid = new THREE.Vector3(-0.7, 0.1, (Math.cos(i) * 0.3));
                p.userData.end = new THREE.Vector3(0.1, -0.2, (i * 0.2) - 0.5);
            });
        }
    }

    setCenter(pos) {
        if (!pos) return;
        this.group.position.set(0, 0, 0); // Koordinat partikel sudah absolut dihitung di start/mid/end
    }

    update(dt = 0.016, simState = { isNight: false, isRaining: false, temperature: 'NORMAL', haze: 'CLEAN' }) {
        if (!this.group.visible) return;

        const isNight = simState ? Boolean(simState.isNight) : false;
        const haze = simState ? (simState.haze || 'CLEAN') : 'CLEAN';
        const isHot = simState ? (simState.temperature === 'HOT') : false;
        const isCold = simState ? (simState.temperature === 'COLD') : false;
        const isRaining = simState ? Boolean(simState.isRaining) : false;

        // Faktor kecepatan dinamis sesuai kondisi lingkungan
        let speed = 1.0;
        let isPhotosynthesisRunning = true;

        if (isNight) {
            // Malam hari: fotosintesis istirahat, molekul air & gas tetap ada melayang sangat santai
            speed = 0.16;
            isPhotosynthesisRunning = false;
        } else if (haze === 'THICK') {
            // Kabut tebal: sinar terhalang jelaga, gerak partikel sangat lambat
            speed = 0.18;
            isPhotosynthesisRunning = false;
        } else if (haze === 'THIN') {
            // Kabut tipis: laju melambat separuh (50%)
            speed = 0.5;
            isPhotosynthesisRunning = true;
        } else if (isHot) {
            // Panas terik: stomata menyempit demi menghemat air
            speed = 0.22;
            isPhotosynthesisRunning = false;
        } else if (isCold) {
            // Dingin: enzim kaku, gerakan melambat
            speed = 0.45;
            isPhotosynthesisRunning = true;
        }

        // 1. Cahaya Matahari (Sinar Berdenyut Halus & Foton Mengalir Pelan)
        const lightVisible = !isNight && (this.stepFilter === 'ALL' || this.stepFilter === 'LIGHT');
        this.lightBeamsGroup.visible = lightVisible;
        if (lightVisible) {
            const baseOpacity = (haze === 'THICK') ? 0.08 : (haze === 'THIN' ? 0.18 : 0.35);
            // Denyut cahaya yang lambat dan lembut
            this.mats.lightBeam.opacity = baseOpacity * (0.85 + 0.15 * Math.sin(Date.now() * 0.0018));
        }

        this.lightParticles.forEach(p => {
            // Saat malam foton padam, namun saat kabut asap tebal foton tetap redup temaram berjuang menembus asap
            p.visible = lightVisible;
            if (p.visible && p.userData.start && p.userData.end) {
                const lightSpeedFactor = (haze === 'THICK') ? 0.12 : (haze === 'THIN' ? 0.22 : 0.32);
                p.userData.t += (dt * lightSpeedFactor * (speed > 0 ? speed : 0.2));
                if (p.userData.t > 1) p.userData.t = 0;
                p.position.lerpVectors(p.userData.start, p.userData.end, p.userData.t);
            }
        });

        // 2. Air (H2O) - Mengalir Tenang Melalui Pembuluh & Urat Daun (Selalu Ada di Jaringan Tanaman)
        const waterSpeed = isRaining ? 1.4 : (isHot ? 0.35 : (isNight ? 0.45 : (speed > 0 ? speed : 0.5)));
        const waterVisible = (this.stepFilter === 'ALL' || this.stepFilter === 'WATER');
        this.waterParticles.forEach(p => {
            p.visible = waterVisible;
            if (p.visible && p.userData.start && p.userData.end) {
                p.userData.t += (dt * 0.22 * waterSpeed);
                if (p.userData.t > 1) p.userData.t = 0;
                
                const t = p.userData.t;
                const p0 = p.userData.start;
                const p1 = p.userData.mid;
                const p2 = p.userData.end;
                p.position.x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
                p.position.y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
                p.position.z = Math.pow(1 - t, 2) * p0.z + 2 * (1 - t) * t * p1.z + Math.pow(t, 2) * p2.z;
            }
        });

        // 3. Karbon Dioksida (CO2) - Partikel Tetap Tampak di Udara Bebas / Sekitar Stomata
        const co2Visible = (this.stepFilter === 'ALL' || this.stepFilter === 'CO2');
        this.co2Particles.forEach(p => {
            p.visible = co2Visible;
            if (p.visible && p.userData.start && p.userData.end) {
                p.userData.t += (dt * 0.22 * speed);
                if (p.userData.t > 1) p.userData.t = 0;

                const t = p.userData.t;
                const p0 = p.userData.start;
                const p1 = p.userData.mid;
                const p2 = p.userData.end;
                p.position.x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
                p.position.y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
                p.position.z = Math.pow(1 - t, 2) * p0.z + 2 * (1 - t) * t * p1.z + Math.pow(t, 2) * p2.z;
            }
        });

        // 4. Oksigen (O2) - Menghembus Naik Perlahan ke Udara Bebas (Atau Melayang Santai Saat Reaksi Istirahat)
        const o2Visible = (this.stepFilter === 'ALL' || this.stepFilter === 'PRODUCTS' || this.stepFilter === 'SYNTH');
        this.o2Particles.forEach(p => {
            p.visible = o2Visible;
            if (p.visible && p.userData.start && p.userData.end) {
                p.userData.t += (dt * 0.20 * speed);
                if (p.userData.t > 1) p.userData.t = 0;

                const t = p.userData.t;
                const p0 = p.userData.start;
                const p1 = p.userData.mid;
                const p2 = p.userData.end;
                p.position.x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
                p.position.y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
                p.position.z = Math.pow(1 - t, 2) * p0.z + 2 * (1 - t) * t * p1.z + Math.pow(t, 2) * p2.z;
            }
        });

        // 5. Glukosa (Gula Nutrisi Makanan) - Mengalir Tenang Menuju Batang
        const sugarVisible = (this.stepFilter === 'ALL' || this.stepFilter === 'PRODUCTS' || this.stepFilter === 'SYNTH');
        this.sugarParticles.forEach(p => {
            p.visible = sugarVisible;
            if (p.visible && p.userData.start && p.userData.end) {
                p.userData.t += (dt * 0.18 * speed);
                if (p.userData.t > 1) p.userData.t = 0;

                const t = p.userData.t;
                const p0 = p.userData.start;
                const p1 = p.userData.mid;
                const p2 = p.userData.end;
                p.position.x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
                p.position.y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
                p.position.z = Math.pow(1 - t, 2) * p0.z + 2 * (1 - t) * t * p1.z + Math.pow(t, 2) * p2.z;
            }
        });
    }

    setFilter(stepName) {
        this.stepFilter = stepName;
    }

    setVisible(visible) {
        this.group.visible = Boolean(visible);
    }

    destroy() {
        if (this.group && this.scene) {
            this.scene.remove(this.group);
        }
    }
}
