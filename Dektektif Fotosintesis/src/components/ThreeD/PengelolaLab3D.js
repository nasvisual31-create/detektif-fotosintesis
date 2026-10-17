import { SceneManager } from './PengelolaScene3D.js';

export class LabManager extends SceneManager {
    constructor(container, onSimulationUpdate) {
        // Panggil parent constructor dengan handler interaksi klik untuk edukasi organ & sel
        super(container, (partName, obj) => {
            if (partName === 'SEL_MESOFIL') {
                this.setViewMode('MESOPHYLL');
            }
            if (this.onSimulationUpdate) {
                this.onSimulationUpdate('OBJECT_CLICK', { partName, obj });
            }
        });
        this.onSimulationUpdate = onSimulationUpdate;
        this.viewMode = 'PLANT'; // 'PLANT', 'PROCESS', or 'MESOPHYLL'
        
        // Lab specific states
        this.simState = {
            isNight: false,
            isRaining: false,
            temperature: 'NORMAL', // COLD, NORMAL, HOT
            haze: 'CLEAN'          // CLEAN, THIN, THICK
        };

        // References to dynamic objects
        this.dynamicMeshes = {
            sun: [],
            water: [],
            co2: [],
            glucose: [],
            oxygen: [],
            leaves: [],
            chloroplasts: [],
            stomata: []
        };
        
        this.originalLeafColors = new Map();

        // Tunggu model diload parent
        this.initLabInterval = setInterval(() => {
            if (this.interactableObjects && this.interactableObjects.length > 0) {
                this.extractDynamicObjects();
                this.setupProceduralEnvironment();
                this.applySimulationState();
                clearInterval(this.initLabInterval);
            }
        }, 100);
    }

    extractDynamicObjects() {
        this.interactableObjects.forEach(mesh => {
            const name = mesh.name.toUpperCase();
            if (name.includes('SUN_RAY') || name.includes('SUN_VISUAL')) {
                this.dynamicMeshes.sun.push(mesh);
            } else if (name.includes('AIR') || name.includes('WATER')) {
                this.dynamicMeshes.water.push(mesh);
            } else if (name.includes('CO2')) {
                this.dynamicMeshes.co2.push(mesh);
            } else if (name.includes('GLUKOSA')) {
                this.dynamicMeshes.glucose.push(mesh);
            } else if (name.includes('O2')) {
                this.dynamicMeshes.oxygen.push(mesh);
            } else if (name.includes('KLOROPLAS') || name.includes('CHLOROPLAST')) {
                this.dynamicMeshes.chloroplasts.push(mesh);
                if (mesh.material && !mesh.material.emissive) {
                    mesh.material = mesh.material.clone();
                }
            } else if (name.includes('STOMATA')) {
                this.dynamicMeshes.stomata.push(mesh);
            } else if (name.includes('SPHERE')) {
                // Fallback untuk model baru: anggap Sphere sebagai partikel air hujan atau oksigen secara acak
                if (Math.random() > 0.5) this.dynamicMeshes.water.push(mesh);
                else this.dynamicMeshes.oxygen.push(mesh);
            } else if (name.includes('LEAF') || name.includes('DAUN') || name.includes('PETAL')) {
                this.dynamicMeshes.leaves.push(mesh);
                // Simpan warna asli daun/bunga untuk simulasi suhu
                if (!this.originalLeafColors.has(mesh.material.uuid)) {
                    mesh.material = mesh.material.clone();
                    this.originalLeafColors.set(mesh.material.uuid, mesh.material.color.clone());
                }
            }
        });
        
        // Sembunyikan default partikel hujan/air
        this.dynamicMeshes.water.forEach(m => m.visible = false);
    }

    setupProceduralEnvironment() {
        // 1. Matahari 3D
        const sunGeo = new THREE.SphereGeometry(2, 24, 24);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 }); // Kuning terang
        this.sun = new THREE.Mesh(sunGeo, sunMat);
        this.sun.position.set(10, 15, -10);
        this.scene.add(this.sun);

        // 3. Bulan 3D
        const moonGeo = new THREE.SphereGeometry(1.5, 24, 24);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6, emissive: 0x333333 });
        this.moon = new THREE.Mesh(moonGeo, moonMat);
        this.moon.position.set(-10, -20, -10); // Awalnya sembunyi di bawah tanah
        this.scene.add(this.moon);

        // 4. Sistem Partikel Hujan (Lebih realistis dari sekadar Sphere)
        const rainGeo = new THREE.BufferGeometry();
        const rainCount = 1000;
        const positions = new Float32Array(rainCount * 3);
        for (let i = 0; i < rainCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 30;     // x
            positions[i+1] = Math.random() * 20 + 5;         // y
            positions[i+2] = (Math.random() - 0.5) * 30;     // z
        }
        rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const rainMat = new THREE.PointsMaterial({
            color: 0x93c5fd,
            size: 0.15,
            transparent: true,
            opacity: 0.7
        });
        this.rainSystem = new THREE.Points(rainGeo, rainMat);
        this.rainSystem.visible = false;
        this.scene.add(this.rainSystem);

        // 5. Sistem Partikel Kabut Asap (Procedural Haze & Smoke Particles)
        const hazeGeo = new THREE.BufferGeometry();
        const hazeCount = 500;
        const hazePositions = new Float32Array(hazeCount * 3);
        for (let i = 0; i < hazeCount * 3; i += 3) {
            hazePositions[i] = (Math.random() - 0.5) * 32;    // x
            hazePositions[i+1] = Math.random() * 16 - 1;       // y
            hazePositions[i+2] = (Math.random() - 0.5) * 32;    // z
        }
        hazeGeo.setAttribute('position', new THREE.BufferAttribute(hazePositions, 3));
        const hazeMat = new THREE.PointsMaterial({
            color: 0x9ca3af,
            size: 0.6,
            transparent: true,
            opacity: 0.0,
            depthWrite: false
        });
        this.hazeSystem = new THREE.Points(hazeGeo, hazeMat);
        this.hazeSystem.visible = false;
        this.scene.add(this.hazeSystem);
    }

    // Dipanggil dari UI
    setSimulationState(type, value) {
        this.simState[type] = value;
        this.applySimulationState();
    }

    setViewMode(mode) {
        this.viewMode = mode; // 'PLANT', 'PROCESS', or 'MESOPHYLL'
        
        if (mode === 'MESOPHYLL') {
            // Berpindah ke dalam sel mesofil (model 3D penampang daun interaktif)
            this.showProceduralLeaf();
            if (this.photosynthesisParticles) {
                this.photosynthesisParticles.setMode('MESOPHYLL_CELL');
                this.photosynthesisParticles.setVisible(true);
            }
        } else if (mode === 'PROCESS') {
            // Sudut pandang proses di luar daun (daun luar utuh dengan animasi aliran fotosintesis)
            if (this.proceduralLeafGroup) {
                this.proceduralLeafGroup.visible = false;
            }
            this.isProceduralMode = false;
            if (this.model) this.model.visible = true;
            if (this.grass) this.grass.visible = true;
            if (this.grassBlades) this.grassBlades.visible = true;
            if (this.ground) this.ground.visible = true;
            if (this.waterLevel) this.waterLevel.visible = true;

            // Daun luar HARUS selalu terlihat utuh (bukan cuma seratnya saja)!
            if (this.outerLeaves) {
                this.outerLeaves.forEach(l => {
                    l.visible = true;
                    if (l.material) {
                        l.material.transparent = false;
                        l.material.opacity = 1.0;
                        l.material.side = THREE.DoubleSide;
                    }
                });
            }
            if (this.innerParts) {
                this.innerParts.forEach(p => {
                    const uName = p.name.toUpperCase();
                    if (uName.includes('VEIN') || uName.includes('MIDRIB') || uName.includes('URAT')) {
                        p.visible = true;
                        if (p.material) {
                            p.material.transparent = false;
                            p.material.opacity = 1.0;
                        }
                    }
                });
            }

            // Cari daun utama untuk fokus kamera
            let targetPos = new THREE.Vector3(-2.8, 3.5, 0);
            if (this.outerLeaves && this.outerLeaves.length > 0) {
                const leaf = this.outerLeaves.find(l => l.name.includes('MAIN')) || this.outerLeaves[0];
                const box = new THREE.Box3().setFromObject(leaf);
                targetPos = box.getCenter(new THREE.Vector3());
            }

            // Aktifkan partikel fotosintesis mode LUAR DAUN (Skala Organ)
            if (this.photosynthesisParticles) {
                this.photosynthesisParticles.setMode('ORGAN_LEAF');
                this.photosynthesisParticles.setVisible(true);
            }
            
            this.controls.target.copy(targetPos);
            this.camera.position.set(targetPos.x + 2.2, targetPos.y + 1.6, targetPos.z + 4.2);
            this.controls.update();
        } else {
            // Kembali ke tampilan seluruh tanaman (PLANT)
            if (this.proceduralLeafGroup) {
                this.proceduralLeafGroup.visible = false;
            }
            this.isProceduralMode = false;
            if (this.model) this.model.visible = true;
            if (this.grass) this.grass.visible = true;
            if (this.grassBlades) this.grassBlades.visible = true;
            if (this.ground) this.ground.visible = true;
            if (this.waterLevel) this.waterLevel.visible = true;

            if (this.outerLeaves) {
                this.outerLeaves.forEach(l => {
                    l.visible = true;
                    if (l.material) {
                        l.material.transparent = false;
                        l.material.opacity = 1.0;
                        l.material.side = THREE.DoubleSide;
                    }
                });
            }
            if (this.innerParts) {
                this.innerParts.forEach(p => p.visible = false);
            }

            // Sembunyikan partikel fotosintesis saat melihat tanaman utuh
            if (this.photosynthesisParticles) {
                this.photosynthesisParticles.setVisible(false);
            }

            this.camera.position.copy(this.initialCameraPos);
            this.controls.target.copy(this.initialTargetPos);
            this.controls.update();
        }
        
        // Re-render titik tombol 3D untuk mode yang aktif (Tanaman vs Daun vs Sel Mesofil)
        this.renderHotspotElements();

        this.applySimulationState();
        if (this.onSimulationUpdate) {
            this.onSimulationUpdate('VIEW_MODE', this.viewMode);
        }
        if (this.onViewModeChange) {
            this.onViewModeChange(this.viewMode);
        }
    }

    applySimulationState() {
        if (!this.interactableObjects || this.interactableObjects.length === 0) return; // Belum terload

        const isNight = this.simState.isNight;
        const isRaining = this.simState.isRaining;
        const haze = this.simState.haze || 'CLEAN';

        // --- 1. SIANG / MALAM & KABUT ASAP (Background, Fog, dan Pencahayaan) ---
        if (isNight) {
            // Suasana Malam
            let nightBg = '#0f172a';
            let fogDensity = 0;
            let fogColor = 0x0f172a;

            if (haze === 'THICK') {
                nightBg = '#090d16'; // Malam berkabut pekat
                fogDensity = 0.05;
                fogColor = 0x0f172a;
            } else if (haze === 'THIN') {
                nightBg = '#0f172a';
                fogDensity = 0.02;
                fogColor = 0x1e293b;
            }

            this.scene.background = new THREE.Color(nightBg);
            this.scene.fog = fogDensity > 0 ? new THREE.FogExp2(fogColor, fogDensity) : null;

            this.scene.children.forEach(c => {
                if (c.isDirectionalLight) c.intensity = 0.1;
                if (c.isHemisphereLight) {
                    c.color.setHex(0x3b82f6);
                    c.groundColor.setHex(0x1e293b);
                    c.intensity = 0.3;
                }
            });

            // Posisi Matahari & Bulan
            if (this.sun) this.sun.position.y = -20;
            if (this.moon) this.moon.position.y = 15;
            
            // Matikan proses fotosintesis internal
            this.dynamicMeshes.sun.forEach(m => m.visible = false);
            this.dynamicMeshes.co2.forEach(m => m.visible = false);
            this.dynamicMeshes.glucose.forEach(m => m.visible = false);
            this.dynamicMeshes.oxygen.forEach(m => m.visible = false);

        } else {
            // Suasana Siang
            let dayBg = '#e0f2fe'; // Cerah normal
            let dirIntensity = 1.2;
            let hemiIntensity = 0.6;
            let fogDensity = 0;
            let fogColor = 0xd1d5db;

            if (haze === 'THICK') {
                // Kabut asap tebal: langit temaram keabuan-kusam, matahari redup oranye
                dayBg = isRaining ? '#57534e' : '#78716c';
                dirIntensity = 0.25;
                hemiIntensity = 0.35;
                fogDensity = 0.055;
                fogColor = 0x78716c;
                if (this.sun) this.sun.material.color.setHex(0xd97706); // Matahari tampak kemerahan/oranye redup tertutup asap
            } else if (haze === 'THIN') {
                // Kabut asap tipis: langit berkabut keabuan
                dayBg = isRaining ? '#94a3b8' : '#cbd5e1';
                dirIntensity = 0.7;
                hemiIntensity = 0.5;
                fogDensity = 0.025;
                fogColor = 0x9ca3af;
                if (this.sun) this.sun.material.color.setHex(0xfacc15); // Kuning sedikit redup
            } else if (isRaining) {
                // Hujan cerah tanpa asap: mendung
                dayBg = '#94a3b8';
                dirIntensity = 0.5;
                hemiIntensity = 0.45;
                fogDensity = 0.015;
                fogColor = 0x94a3b8;
                if (this.sun) this.sun.material.color.setHex(0xffd700);
            } else {
                // Normal cerah
                if (this.sun) this.sun.material.color.setHex(0xffd700);
            }

            this.scene.background = new THREE.Color(dayBg);
            this.scene.fog = fogDensity > 0 ? new THREE.FogExp2(fogColor, fogDensity) : null;

            this.scene.children.forEach(c => {
                if (c.isDirectionalLight) c.intensity = dirIntensity;
                if (c.isHemisphereLight) {
                    c.color.setHex(0xffffff);
                    c.groundColor.setHex(0x444444);
                    c.intensity = hemiIntensity;
                }
            });

            // Posisi Matahari & Bulan
            if (this.sun) this.sun.position.y = 15;
            if (this.moon) this.moon.position.y = -20;

            // Fotosintesis internal (Hanya jika tidak tertutup asap tebal)
            const isPhotosynthesisPossible = (haze !== 'THICK');

            this.dynamicMeshes.sun.forEach(m => {
                m.visible = true;
                if (m.material) {
                    m.material.opacity = (haze === 'THICK') ? 0.2 : (haze === 'THIN' ? 0.6 : 1.0);
                    m.material.transparent = true;
                }
            });
            this.dynamicMeshes.co2.forEach(m => m.visible = isPhotosynthesisPossible);
            this.dynamicMeshes.glucose.forEach(m => m.visible = isPhotosynthesisPossible);
            this.dynamicMeshes.oxygen.forEach(m => m.visible = isPhotosynthesisPossible);
        }

        // --- 1B. VISIBILITAS MODE PROSES vs TANAMAN LENGKAP vs SEL MESOFIL ---
        if (this.viewMode === 'MESOPHYLL') {
            // Tampilan Penampang Sel Mesofil (procedural leaf aktif, tanaman disembunyikan)
            if (this.proceduralLeafGroup) this.proceduralLeafGroup.visible = true;
            if (this.model) this.model.visible = false;
            if (this.grass) this.grass.visible = false;
            if (this.grassBlades) this.grassBlades.visible = false;
            if (this.ground) this.ground.visible = false;
            if (this.waterLevel) this.waterLevel.visible = false;

            if (this.photosynthesisParticles) {
                this.photosynthesisParticles.setMode('MESOPHYLL_CELL');
                this.photosynthesisParticles.setVisible(true);
            }
        } else if (this.viewMode === 'PROCESS') {
            // Tampilan Skala Luar Daun (model daun utuh dengan helaian dan urat daun)
            if (this.proceduralLeafGroup) this.proceduralLeafGroup.visible = false;
            if (this.model) this.model.visible = true;
            if (this.grass) this.grass.visible = true;
            if (this.grassBlades) this.grassBlades.visible = true;
            if (this.ground) this.ground.visible = true;
            if (this.waterLevel) this.waterLevel.visible = true;

            // Daun luar dan seratnya HARUS SELALU TERLIHAT UTUH!
            if (this.outerLeaves) {
                this.outerLeaves.forEach(l => {
                    l.visible = true;
                    if (l.material) {
                        l.material.transparent = false;
                        l.material.opacity = 1.0;
                        l.material.side = THREE.DoubleSide;
                    }
                });
            }
            if (this.innerParts) {
                this.innerParts.forEach(p => {
                    const uName = p.name.toUpperCase();
                    if (uName.includes('VEIN') || uName.includes('MIDRIB') || uName.includes('URAT')) {
                        p.visible = true;
                        if (p.material) {
                            p.material.transparent = false;
                            p.material.opacity = 1.0;
                        }
                    } else if (this.dynamicMeshes.co2.includes(p) || this.dynamicMeshes.oxygen.includes(p) || this.dynamicMeshes.glucose.includes(p)) {
                        p.visible = (!isNight && (haze !== 'THICK') && (this.simState.temperature !== 'HOT'));
                    } else if (this.dynamicMeshes.water.includes(p)) {
                        p.visible = !isNight && (this.simState.temperature !== 'HOT' || this.simState.isRaining);
                    } else {
                        p.visible = true;
                    }
                });
            }

            if (this.photosynthesisParticles) {
                this.photosynthesisParticles.setMode('ORGAN_LEAF');
                this.photosynthesisParticles.setVisible(true);
            }
        } else {
            // Tampilan Bunga Utuh (PLANT)
            if (this.proceduralLeafGroup) this.proceduralLeafGroup.visible = false;
            if (this.model) this.model.visible = true;
            if (this.grass) this.grass.visible = true;
            if (this.grassBlades) this.grassBlades.visible = true;
            if (this.ground) this.ground.visible = true;
            if (this.waterLevel) this.waterLevel.visible = true;

            if (this.outerLeaves) this.outerLeaves.forEach(l => l.visible = true);
            if (this.innerParts) this.innerParts.forEach(p => p.visible = false);
            this.dynamicMeshes.water.forEach(m => m.visible = false);

            if (this.photosynthesisParticles) {
                this.photosynthesisParticles.setVisible(false);
            }
        }

        // --- 2. SISTEM HUJAN ---
        if (this.simState.isRaining) {
            if (this.rainSystem) this.rainSystem.visible = true;
        } else {
            if (this.rainSystem) this.rainSystem.visible = false;
        }

        // --- 3. SISTEM PARTIKEL KABUT ASAP ---
        if (this.hazeSystem) {
            if (haze === 'THICK') {
                this.hazeSystem.visible = true;
                this.hazeSystem.material.opacity = 0.7;
                this.hazeSystem.material.color.setHex(0x78716c);
                this.hazeSystem.material.size = 1.0;
            } else if (haze === 'THIN') {
                this.hazeSystem.visible = true;
                this.hazeSystem.material.opacity = 0.35;
                this.hazeSystem.material.color.setHex(0xa8a29e);
                this.hazeSystem.material.size = 0.6;
            } else {
                this.hazeSystem.visible = false;
            }
        }

        // --- 4. TAMPILAN DAUN (Suhu + Efek Abu/Jelaga Kabut Asap) ---
        this.dynamicMeshes.leaves.forEach(mesh => {
            const origColor = this.originalLeafColors.get(mesh.material.uuid);
            if (!origColor) return;

            let r = origColor.r;
            let g = origColor.g;
            let b = origColor.b;

            // Efek Suhu
            if (this.simState.temperature === 'HOT') {
                r *= 1.2; g *= 0.9; b *= 0.5; // Menguning/layu
            } else if (this.simState.temperature === 'COLD') {
                r *= 0.8; g *= 1.0; b *= 1.2; // Kebiruan dingin
            }

            // Efek Jelaga Kabut Asap (Daun menjadi kusam keabu-abuan tertutup debu)
            if (haze === 'THICK') {
                r = r * 0.68 + 0.12;
                g = r * 0.68 + 0.12;
                b = b * 0.65 + 0.1;
            } else if (haze === 'THIN') {
                r = r * 0.86 + 0.05;
                g = g * 0.86 + 0.05;
                b = b * 0.84 + 0.04;
            }

            mesh.material.color.setRGB(r, g, b);
            mesh.material.needsUpdate = true;
        });
    }

    destroy() {
        if (this.initLabInterval) clearInterval(this.initLabInterval);
        super.destroy();
    }

    animate() {
        super.animate();
        
        if (!this.dynamicMeshes) return;
        
        const time = Date.now() * 0.001;
        const haze = this.simState.haze || 'CLEAN';
        
        // Komunikasi dengan SceneManager untuk animasi Wind Sway default
        this.isLabHotState = (this.simState.temperature === 'HOT');

        // Jika kepanasan, tumbuhan layu
        if (this.model && this.isLabHotState) {
            this.model.rotation.z = THREE.MathUtils.lerp(this.model.rotation.z, 0.15, 0.05);
            this.model.rotation.x = THREE.MathUtils.lerp(this.model.rotation.x, 0.0, 0.05);
        }

        // Animasi Matahari dan Bulan (Floating Tenang)
        if (this.sun && this.sun.position.y > 0) {
            this.sun.position.y = 15 + Math.sin(time * 0.8) * 0.35;
        }
        if (this.moon && this.moon.position.y > 0) {
            this.moon.position.y = 15 + Math.sin(time * 0.6) * 0.25;
        }

        // 1. Animasi Hujan Procedural
        if (this.simState.isRaining && this.rainSystem) {
            const positions = this.rainSystem.geometry.attributes.position.array;
            for(let i = 1; i < positions.length; i+=3) {
                positions[i] -= 0.5; // Kecepatan jatuh
                if (positions[i] < -3) { // Jika kena tanah
                    positions[i] = 20 + Math.random() * 5; // Reset ke atas awan
                }
            }
            this.rainSystem.geometry.attributes.position.needsUpdate = true;
        }

        // 2. Animasi Kabut Asap (Drifting Smoke / Haze Particles)
        if (this.hazeSystem && this.hazeSystem.visible) {
            const hazePos = this.hazeSystem.geometry.attributes.position.array;
            const speed = (haze === 'THICK') ? 0.04 : 0.02;
            for (let i = 0; i < hazePos.length; i += 3) {
                hazePos[i] += speed; // Hanyut ditiup angin
                hazePos[i+1] += Math.sin(time * 1.2 + hazePos[i] * 0.2) * 0.005; // Mengalun naik turun halus
                if (hazePos[i] > 16) {
                    hazePos[i] = -16; // Loop kembali dari sisi lain
                }
            }
            this.hazeSystem.geometry.attributes.position.needsUpdate = true;
        }

        // 3. Animasi Molekul Fotosintesis (Pelan dan Nyaman Dilihat)
        // Berjalan jika: Siang hari, tidak kepanasan (HOT), dan tidak terhalang asap tebal (THICK)
        if (!this.simState.isNight && this.simState.temperature !== 'HOT' && haze !== 'THICK') {
            // Jika kabut tipis, fotosintesis melambat (setengah kecepatan)
            const speedFactor = (haze === 'THIN') ? 0.5 : 1.0;

            this.dynamicMeshes.co2.forEach((m, i) => {
                if (m.userData.origY === undefined) m.userData.origY = m.position.y;
                // Melayang naik turun lembut menuju daun
                m.position.y = m.userData.origY + Math.sin((time * 0.8 * speedFactor) + i) * (0.15 * speedFactor);
            });
            
            this.dynamicMeshes.oxygen.forEach((m, i) => {
                if (m.userData.origY === undefined) m.userData.origY = m.position.y;
                // Melayang keluar santai
                m.position.y = m.userData.origY + Math.cos((time * 0.8 * speedFactor) + i) * (0.15 * speedFactor);
            });
            
            this.dynamicMeshes.glucose.forEach((m) => {
                // Berputar pelan dan anggun
                m.rotation.y += 0.008 * speedFactor;
                m.rotation.x += 0.004 * speedFactor;
            });

            // Animasi Molekul Air di pembuluh daun
            this.dynamicMeshes.water.forEach((m, i) => {
                if (m.userData.origY === undefined) m.userData.origY = m.position.y;
                m.position.y = m.userData.origY + Math.sin((time * 1.1 * speedFactor) + i) * 0.08;
            });

            // Efek Pendar Kloroplas (aktif memproduksi makanan)
            if (this.dynamicMeshes.chloroplasts) {
                const glow = (haze === 'THIN') ? 0.08 : 0.2;
                this.dynamicMeshes.chloroplasts.forEach(c => {
                    if (c.material && c.material.emissive) {
                        c.material.emissive.setRGB(0, glow * (0.85 + 0.15 * Math.sin(time * 1.5)), 0);
                    }
                });
            }
        } else {
            // Jika proses fotosintesis terhenti
            if (this.dynamicMeshes.chloroplasts) {
                this.dynamicMeshes.chloroplasts.forEach(c => {
                    if (c.material && c.material.emissive) {
                        c.material.emissive.setRGB(0, 0, 0);
                    }
                });
            }
        }

        // 4. Animasi Cahaya Matahari (Berdenyut Tenang)
        if (!this.simState.isNight) {
            this.dynamicMeshes.sun.forEach(m => {
                if (m.userData.origScale === undefined) {
                    m.userData.origScale = m.scale.x;
                }
                const pulseIntensity = (haze === 'THICK') ? 0.02 : (haze === 'THIN' ? 0.04 : 0.06);
                const scale = m.userData.origScale * (1 + Math.sin(time * 1.5) * pulseIntensity);
                m.scale.set(scale, scale, scale);
            });
        }

        // 5. Animasi Volume Air Tanah (Paling Bawah)
        if (this.waterLevel) {
            let targetWaterScale = 1.0; // Normal
            if (this.simState.isRaining) targetWaterScale = 2.0; // Hujan: air naik meresap ke tanah
            if (this.isLabHotState) targetWaterScale = 0.2; // Panas: air menyusut/kering
            
            this.waterLevel.scale.y = THREE.MathUtils.lerp(this.waterLevel.scale.y, targetWaterScale, 0.02);
            // Dasar silinder air berada di y = -3.6
            this.waterLevel.position.y = -3.6 + (1.5 * this.waterLevel.scale.y) / 2;
        }
    }
}
