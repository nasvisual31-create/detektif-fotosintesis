import { createProceduralLeaf } from './ModelDaun3D.js';
import { PhotosynthesisParticles } from './PartikelFotosintesis.js';

export class SceneManager {
    constructor(container, onObjectClick) {
        this.container = container;
        this.onObjectClick = onObjectClick; // Callback ke UI
        this.width = Math.max(container.clientWidth || window.innerWidth, 200);
        this.height = Math.max(container.clientHeight || window.innerHeight, 200);

        this.scene = new THREE.Scene();
        // Warna background cerah dan natural
        this.scene.background = new THREE.Color('#e0f2fe');

        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.initialCameraPos = new THREE.Vector3(12, 8, 15);
        this.camera.position.copy(this.initialCameraPos);
        this.isProceduralMode = false;
        this.viewMode = 'PLANT';
        this.onViewModeChange = null;

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Setup Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 50;
        this.initialTargetPos = new THREE.Vector3(0, 3, 0);
        this.controls.target.copy(this.initialTargetPos);

        // Setup Lighting
        this.setupLighting();

        // Raycaster Setup
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.pointerDownPos = new THREE.Vector2();
        this.interactableObjects = []; // Meshes from GLB
        this.materialsMap = new Map(); // Store original material state
        this.innerParts = []; // Bagian dalam daun
        this.outerLeaves = []; // Daun luar

        // Sistem Partikel Aliran Molekul Fotosintesis (CO2, H2O, Cahaya, O2, Glukosa)
        this.photosynthesisParticles = new PhotosynthesisParticles(this.scene, new THREE.Vector3(-2.8, 3.5, 0));
        this.photosynthesisParticles.setMode('ORGAN_LEAF');
        this.photosynthesisParticles.setVisible(false); // Sembunyikan saat melihat seluruh tanaman utuh

        // Load Model
        this.loadModel('./assets/models/bunga_matahari.glb');

        // Events
        this.bindEvents();

        // XR Support (AR)
        this.renderer.xr.enabled = true;

        // Setup 3D Interactive Hotspot Markers ("Titik Tombol")
        this.hotspotsVisible = true;
        this.setupHotspots();

        // Loop
        this.animate = this.animate.bind(this);
        this.renderer.setAnimationLoop(this.animate);
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(10, 15, 10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        this.scene.add(dirLight);
    }

    loadModel(url) {
        const loader = new THREE.GLTFLoader();

        // Jika UI ingin tau progress, kita bisa panggil callback
        loader.load(
            url,
            (gltf) => {
                this.model = gltf.scene;

                // Traverse model to setup shadows and materials
                const innerKeywords = ['MESOFIL', 'KLOROPLAS', 'STOMATA', 'INNER', 'DALAM', 'XYLEM', 'FLOEM', 'PHLOEM', 'AIR', 'WATER', 'CO2', 'O2', 'GLUKOSA', 'SUN', 'MOLECULE'];

                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        this.interactableObjects.push(child);

                        const upperName = child.name.toUpperCase();
                        const isLeafMesh = upperName.includes('LEAF') || upperName.includes('DAUN');
                        
                        // Khusus kelopak bunga (PETAL) dan daun/urat daun (LEAF/VEIN/MIDRIB) BUKAN inner part tersembunyi!
                        // Seluruh bagian daun (helaian dan serat urat daunnya) harus selalu utuh terlihat bersama!
                        const isInnerPart = !isLeafMesh && !upperName.includes('PETAL') && innerKeywords.some(kw => upperName.includes(kw));

                        if (isInnerPart) {
                            child.visible = false;
                            this.innerParts.push(child);
                        } else if (isLeafMesh) {
                            child.visible = true;
                            this.outerLeaves.push(child);

                            // Berikan material solid hijau segar, dua sisi (DoubleSide), agar tidak tembus/hilang
                            if (child.material) {
                                child.material.side = THREE.DoubleSide;
                                child.material.transparent = false;
                                child.material.opacity = 1.0;
                                child.material.depthWrite = true;
                                if (upperName.includes('VEIN') || upperName.includes('MIDRIB') || upperName.includes('URAT')) {
                                    // Urat daun hijau muda cerah berkilau di atas helaian
                                    child.material.color = new THREE.Color(0x4ade80);
                                } else {
                                    // Helaian daun hijau tua subur alami
                                    child.material.color = new THREE.Color(0x15803d);
                                    child.material.roughness = 0.55;
                                }
                            }
                        }

                        // Backup original material state for highlighting
                        const mat = child.material;
                        if (!this.materialsMap.has(mat.uuid)) {
                            // Clone material if it's shared so we can highlight parts independently,
                            // or just store original opacity if we modify it directly.
                            this.materialsMap.set(mat.uuid, {
                                opacity: mat.opacity,
                                transparent: mat.transparent,
                                emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000)
                            });
                        }
                    }
                });

                // Tengahkan sedikit model
                this.model.position.set(0, 0, 0);
                this.scene.add(this.model);

                this.setupGround();
            },
            (xhr) => {
                // Progress
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened while loading GLB', error);
            }
        );
    }

    bindEvents() {
        this.resizeHandler = () => {
            const w = this.container.clientWidth || window.innerWidth;
            const h = this.container.clientHeight || (window.innerHeight - 80);
            if (w <= 0 || h <= 0) return;
            this.width = w;
            this.height = h;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        };
        window.addEventListener('resize', this.resizeHandler);

        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                this.resizeHandler();
            });
            this.resizeObserver.observe(this.container);
        }

        // Raycasting Support (Mouse & Touch)
        this.lastClickTime = 0;
        this.onPointerDown = (e) => {
            if (e.target.tagName !== 'CANVAS') return;
            this.pointerDownPos.set(e.clientX, e.clientY);
        };

        this.onPointerUp = (e) => {
            if (e.target.tagName !== 'CANVAS') return;
            const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
            // Click vs Drag
            if (dist < 5) {
                const now = Date.now();
                const isDoubleClick = (now - this.lastClickTime < 300);
                this.lastClickTime = now;
                this.processClick(e.clientX, e.clientY, isDoubleClick);
            }
        };

        this.container.addEventListener('pointerdown', this.onPointerDown);
        this.container.addEventListener('pointerup', this.onPointerUp);
    }

    onWindowResize() {
        if (this.resizeHandler) {
            this.resizeHandler();
        }
    }

    processClick(clientX, clientY, isDoubleClick = false) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactableObjects, false);

        if (intersects.length > 0) {
            let object = intersects[0].object;
            const upperName = object.name.toUpperCase();
            const isLeaf = this.outerLeaves.includes(object) || upperName.includes('LEAF') || upperName.includes('DAUN');

            // Jika double click: berpindah antara model tanaman dan sel mesofil
            if (isDoubleClick) {
                if (this.isProceduralMode || this.viewMode === 'MESOPHYLL') {
                    this.setViewMode('PLANT');
                } else {
                    this.setViewMode('MESOPHYLL');
                }
                return;
            }

            // Single click pada daun
            if (isLeaf) {
                this.highlightObject(object);
                // Hanya aktifkan aliran fotosintesis jika sedang di mode proses daun, jangan saat melihat seluruh tanaman utuh
                if (this.viewMode === 'PROCESS' && this.photosynthesisParticles) {
                    this.photosynthesisParticles.setMode('ORGAN_LEAF');
                    this.photosynthesisParticles.setVisible(true);
                }
                if (this.onObjectClick) {
                    this.onObjectClick('DAUN', object);
                }
                return;
            }

            // Objek lainnya (Bunga, Batang, Akar)
            this.highlightObject(object);
            if (this.onObjectClick) {
                this.onObjectClick(object.name, object);
            }
        } else {
            // Double click di area kanvas kosong
            if (isDoubleClick) {
                if (this.isProceduralMode || this.viewMode === 'MESOPHYLL') {
                    this.setViewMode('PLANT');
                } else if (this.viewMode === 'PROCESS') {
                    this.setViewMode('MESOPHYLL');
                } else {
                    this.setViewMode('MESOPHYLL');
                }
            } else {
                // Klik tempat kosong (bukan double click)
                this.resetHighlight();
                if (this.onObjectClick) this.onObjectClick(null, null);
            }
        }
    }

    highlightObject(targetObject) {
        // Extract base name to highlight similar parts (e.g. highlight all SEEDs if one SEED is clicked)
        const nameParts = targetObject.name.split('_');
        const prefix = nameParts[0];
        const upperTargetName = targetObject.name.toUpperCase();
        const isLeafTarget = upperTargetName.includes('LEAF') || upperTargetName.includes('DAUN') || upperTargetName.includes('VEIN') || upperTargetName.includes('MIDRIB');

        this.interactableObjects.forEach(mesh => {
            const mat = mesh.material;
            if (!mat) return;
            const orig = this.materialsMap.get(mat.uuid);
            if (!orig) return;

            const upperMeshName = mesh.name.toUpperCase();
            const isLeafMesh = upperMeshName.includes('LEAF') || upperMeshName.includes('DAUN') || upperMeshName.includes('VEIN') || upperMeshName.includes('MIDRIB');

            // Jika yang diklik adalah daun, pertahankan SELURUH daun (helaian + urat-urat) tetap solid & menyala!
            if (isLeafTarget && isLeafMesh) {
                mat.transparent = false;
                mat.opacity = 1.0;
                mat.side = THREE.DoubleSide;
                if (mat.emissive) mat.emissive.setHex(0x1e3a1e); // Pendar hijau segar
            } else if (!isLeafTarget && (mesh.name.startsWith(prefix) || mesh === targetObject)) {
                mat.transparent = false;
                mat.opacity = 1.0;
                if (mat.emissive) mat.emissive.setHex(0x333333);
            } else {
                // Dim other objects to 35%
                mat.transparent = true;
                mat.opacity = 0.35;
                if (mat.emissive) mat.emissive.setHex(0x000000);
            }
            mat.needsUpdate = true;
        });
    }

    resetHighlight() {
        this.interactableObjects.forEach(mesh => {
            const mat = mesh.material;
            if (!mat) return;
            const orig = this.materialsMap.get(mat.uuid);
            if (!orig) return;

            mat.transparent = orig.transparent !== undefined ? orig.transparent : (orig.origTransparent !== undefined ? orig.origTransparent : false);
            mat.opacity = orig.opacity !== undefined ? orig.opacity : (orig.origOpacity !== undefined ? orig.origOpacity : 1.0);
            if (mat.emissive && orig.emissive) {
                mat.emissive.copy(orig.emissive);
            } else if (mat.emissive) {
                mat.emissive.setHex(0x000000);
            }
            mat.needsUpdate = true;
        });
    }

    resetCamera() {
        if (this.proceduralLeafGroup) {
            this.proceduralLeafGroup.visible = false;
        }
        this.isProceduralMode = false;
        if (this.model) this.model.visible = true;
        if (this.grass) this.grass.visible = true;
        if (this.grassBlades) this.grassBlades.visible = true;
        if (this.ground) this.ground.visible = true;
        if (this.waterLevel) this.waterLevel.visible = true;

        // Kembalikan visibilitas daun luar
        if (this.outerLeaves) {
            this.outerLeaves.forEach(l => l.visible = true);
        }
        if (this.innerParts) {
            this.innerParts.forEach(p => p.visible = false);
        }

        // Sembunyikan partikel fotosintesis saat melihat tanaman utuh
        if (this.photosynthesisParticles) {
            this.photosynthesisParticles.setVisible(false);
        }

        this.resetHighlight();
        this.camera.position.copy(this.initialCameraPos);
        this.controls.target.copy(this.initialTargetPos);
        this.controls.update();
        this.isProceduralMode = false;
        this.viewMode = 'PLANT';
        this.renderHotspotElements();
        if (this.onViewModeChange) this.onViewModeChange('PLANT');
    }

    setViewMode(mode) {
        this.viewMode = mode;
        if (mode === 'MESOPHYLL') {
            this.showProceduralLeaf();
        } else if (mode === 'PROCESS') {
            this.showLeafProcessView();
        } else {
            this.resetCamera();
        }
        if (this.onViewModeChange) {
            this.onViewModeChange(this.viewMode);
        }
    }

    showLeafProcessView() {
        if (this.proceduralLeafGroup) {
            this.proceduralLeafGroup.visible = false;
        }
        this.isProceduralMode = false;
        if (this.model) this.model.visible = true;
        if (this.grass) this.grass.visible = true;
        if (this.grassBlades) this.grassBlades.visible = true;
        if (this.ground) this.ground.visible = true;
        if (this.waterLevel) this.waterLevel.visible = true;

        // Pastikan daun luar dan urat-urat daunnya tetap terlihat utuh 100%!
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

        // Cari daun utama untuk fokus kamera dekat
        let targetPos = new THREE.Vector3(-2.8, 3.5, 0);
        if (this.outerLeaves && this.outerLeaves.length > 0) {
            const leaf = this.outerLeaves.find(l => l.name.includes('MAIN')) || this.outerLeaves[0];
            const box = new THREE.Box3().setFromObject(leaf);
            targetPos = box.getCenter(new THREE.Vector3());
        }

        this.controls.target.copy(targetPos);
        this.camera.position.set(targetPos.x + 2.0, targetPos.y + 1.4, targetPos.z + 4.0);
        this.controls.update();

        // Aktifkan partikel fotosintesis pada skala luar daun!
        if (this.photosynthesisParticles) {
            this.photosynthesisParticles.setMode('ORGAN_LEAF');
            this.photosynthesisParticles.setVisible(true);
        }

        this.renderHotspotElements();
    }

    showProceduralLeaf() {
        if (!this.proceduralLeafGroup) {
            this.proceduralLeafGroup = createProceduralLeaf();
            this.scene.add(this.proceduralLeafGroup);

            // Register materials for highlight logic
            this.proceduralLeafGroup.userData.materials.forEach(mat => {
                this.materialsMap.set(mat.uuid, {
                    opacity: mat.opacity,
                    transparent: mat.transparent,
                    emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000)
                });
            });

            // Add all interactable parts to raycaster
            this.proceduralLeafGroup.children.forEach(child => {
                if (child.name) this.interactableObjects.push(child);
                if (child.children) {
                    child.children.forEach(sub => {
                        if (sub.name) this.interactableObjects.push(sub);
                    });
                }
            });
        }

        // Hide GLB and ground
        if (this.model) this.model.visible = false;
        if (this.grass) this.grass.visible = false;
        if (this.grassBlades) this.grassBlades.visible = false;
        if (this.ground) this.ground.visible = false;
        if (this.waterLevel) this.waterLevel.visible = false;

        // Show procedural leaf
        this.proceduralLeafGroup.visible = true;
        this.isProceduralMode = true;
        this.viewMode = 'MESOPHYLL';
        this.renderHotspotElements();

        // Posisikan partikel fotosintesis dalam sel mesofil mikroskopis
        if (this.photosynthesisParticles) {
            this.photosynthesisParticles.setMode('MESOPHYLL_CELL');
            this.photosynthesisParticles.setVisible(true);
        }

        // Focus camera
        this.camera.position.set(0, 15, 20);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        if (this.onViewModeChange) {
            this.onViewModeChange('MESOPHYLL');
        }
    }

    focusCameraOnObject(object) {
        if (!object) return;

        // Bounding box focus
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());

        // Animate or just set
        this.controls.target.copy(center);
        this.controls.update();
    }

    setupGround() {
        if (!this.ground) {
            // 1. Rumput Hijau (Di atas akar, di bawah batang)
            const grassGeo = new THREE.CylinderGeometry(10, 10, 0.2, 32);
            const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 1.0 });
            this.grass = new THREE.Mesh(grassGeo, grassMat);
            this.grass.position.y = -0.5; // Estimasi batas batang & akar
            this.grass.receiveShadow = true;
            this.scene.add(this.grass);

            // Detail Helai Rumput (InstancedMesh Realistis)
            // Menggunakan PlaneGeometry yang dilengkungkan (curved) agar rata dan tidak seperti duri
            const bladeGeo = new THREE.PlaneGeometry(0.2, 1.2, 1, 3);
            bladeGeo.translate(0, 0.6, 0); // Origin di bawah

            const posAttr = bladeGeo.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                const y = posAttr.getY(i);
                // Menipis di bagian atas (taper)
                const taper = Math.max(0, 1.0 - (y / 1.2));
                posAttr.setX(i, posAttr.getX(i) * taper);
                // Melengkung ke depan
                const bend = Math.pow(y / 1.2, 2) * 0.4;
                posAttr.setZ(i, posAttr.getZ(i) + bend);
            }
            bladeGeo.computeVertexNormals(); // Update pencahayaan

            const bladeMat = new THREE.MeshStandardMaterial({
                color: 0x4ade80,
                roughness: 0.8,
                side: THREE.DoubleSide // Karena bentuknya pipih
            });

            const bladeCount = 1000; // Tingkatkan jumlah karena pipih
            this.grassBlades = new THREE.InstancedMesh(bladeGeo, bladeMat, bladeCount);

            const dummy = new THREE.Object3D();
            const color = new THREE.Color();
            this.grassBlades.userData.blades = []; // Simpan data awal untuk animasi

            for (let i = 0; i < bladeCount; i++) {
                // Posisi acak dalam lingkaran radius 9.5
                const r = 9.5 * Math.sqrt(Math.random());
                const theta = Math.random() * 2 * Math.PI;
                const x = r * Math.cos(theta);
                const z = r * Math.sin(theta);
                dummy.position.set(x, -0.4, z);

                // Rotasi acak (menghadap arah acak, kemiringan bervariasi)
                const ry = Math.random() * Math.PI * 2;
                const rx = (Math.random() - 0.5) * 0.2;
                const rz = (Math.random() - 0.5) * 0.2;
                dummy.rotation.set(rx, ry, rz);

                // Skala acak (tinggi rumput)
                const s = 0.4 + Math.random() * 0.6;
                dummy.scale.set(s, s, s);

                dummy.updateMatrix();
                this.grassBlades.setMatrixAt(i, dummy.matrix);

                // Simpan untuk dianimasikan nanti
                this.grassBlades.userData.blades.push({ x, z, rx, ry, rz, s });

                // Variasi warna hijau (campuran hijau muda dan tua)
                color.setHSL(0.3 + Math.random() * 0.08, 0.8, 0.3 + Math.random() * 0.3);
                this.grassBlades.setColorAt(i, color);
            }
            this.grassBlades.receiveShadow = true;
            this.grassBlades.castShadow = true;
            this.scene.add(this.grassBlades);

            // 2. Tanah (Di bawah rumput)
            const groundGeo = new THREE.CylinderGeometry(10, 10, 1.5, 32);
            const groundMat = new THREE.MeshStandardMaterial({
                color: 0x4a3728,
                roughness: 0.9,
                transparent: true,
                opacity: 0.85 // Agak transparan agar akar di dalamnya tetap bisa terlihat/diklik
            });
            this.ground = new THREE.Mesh(groundGeo, groundMat);
            this.ground.position.y = -1.35; // Tepat di bawah rumput (-0.5 - 0.1 - 0.75)
            this.ground.receiveShadow = true;
            this.scene.add(this.ground);

            // 3. Air Tanah (Paling bawah)
            const waterGeo = new THREE.CylinderGeometry(10, 10, 1.5, 32);
            const waterMat = new THREE.MeshStandardMaterial({
                color: 0x3b82f6,
                transparent: true,
                opacity: 0.6,
                roughness: 0.1
            });
            this.waterLevel = new THREE.Mesh(waterGeo, waterMat);

            // Setup default (normal water level)
            this.waterLevel.scale.y = 1.0;
            this.waterLevel.position.y = -2.85; // Tepat di bawah tanah
            this.scene.add(this.waterLevel);
        }
    }

    setupHotspots() {
        if (!this.container) return;
        this.hotspotsContainer = document.createElement('div');
        this.hotspotsContainer.id = 'hotspots-overlay';
        this.container.appendChild(this.hotspotsContainer);

        // Definisi Hotspot Bagian Tumbuhan (Plant Mode)
        this.plantHotspots = [
            {
                id: 'FLOWER',
                target: 'FLOWER',
                pos: new THREE.Vector3(0, 5.0, 0.3),
                icon: '🌻',
                label: 'Bunga & Mahkota',
                sub: 'Sentuh Aku!'
            },
            {
                id: 'LEAF',
                target: 'LEAF',
                pos: new THREE.Vector3(-2.4, 3.2, 0.4),
                icon: '🍃',
                label: 'Daun (Fotosintesis)',
                sub: 'Sentuh Aku!'
            },
            {
                id: 'STEM',
                target: 'STEM',
                pos: new THREE.Vector3(0, 2.1, 0.2),
                icon: '🪵',
                label: 'Batang Tanaman',
                sub: 'Sentuh Aku!'
            },
            {
                id: 'ROOT',
                target: 'ROOT',
                pos: new THREE.Vector3(0, 0.5, 0.3),
                icon: '🌱',
                label: 'Akar Tumbuhan',
                sub: 'Sentuh Aku!'
            }
        ];

        // Definisi Hotspot Bagian Sel Mesofil Daun (Mesophyll Mode)
        this.mesophyllHotspots = [
            {
                id: 'KLOROPLAS',
                target: 'KLOROPLAS',
                pos: new THREE.Vector3(-2.2, 0.9, 0.6),
                icon: '🟢',
                label: 'Kloroplas (Klorofil)',
                sub: 'Pabrik Fotosintesis'
            },
            {
                id: 'STOMATA',
                target: 'STOMATA',
                pos: new THREE.Vector3(0, -1.3, 1.3),
                icon: '👄',
                label: 'Pori Stomata',
                sub: 'Pintu Gas CO₂ & O₂'
            },
            {
                id: 'BERKAS_PEMBULUH',
                target: 'BERKAS_PEMBULUH',
                pos: new THREE.Vector3(2.2, 0.3, 0.6),
                icon: '💧',
                label: 'Urat Daun (Xilem)',
                sub: 'Pipa Air & Makanan'
            }
        ];

        // Definisi Hotspot Sudut Pandang Daun (Process Mode)
        this.processHotspots = [
            {
                id: 'LEAF_DETAIL',
                target: 'LEAF',
                pos: new THREE.Vector3(-2.8, 3.5, 0.4),
                icon: '🍃',
                label: 'Jaringan Daun',
                sub: 'Sentuh / Masuk Sel'
            },
            {
                id: 'STOMATA_LEAF',
                target: 'STOMATA',
                pos: new THREE.Vector3(-2.2, 2.9, 0.3),
                icon: '👄',
                label: 'Pori Stomata',
                sub: 'Pintu Gas CO₂ & O₂'
            },
            {
                id: 'VEIN_LEAF',
                target: 'BERKAS_PEMBULUH',
                pos: new THREE.Vector3(-3.2, 3.8, 0.3),
                icon: '💧',
                label: 'Urat Daun (Xilem)',
                sub: 'Aliran Air H₂O'
            }
        ];

        this.renderHotspotElements();
    }

    renderHotspotElements() {
        if (!this.hotspotsContainer) return;
        this.hotspotsContainer.innerHTML = '';
        if (!this.hotspotsVisible) return;

        const isMesophyll = (this.isProceduralMode || this.viewMode === 'MESOPHYLL');
        const isProcess = (this.viewMode === 'PROCESS');

        let activeList = this.plantHotspots;
        if (isMesophyll) {
            activeList = this.mesophyllHotspots;
        } else if (isProcess && this.processHotspots) {
            activeList = this.processHotspots;
        }

        this.currentActiveHotspots = activeList.map(h => {
            const el = document.createElement('div');
            el.className = 'hotspot-pin';
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.setAttribute('aria-label', `Pencet ${h.label}`);
            el.innerHTML = `
                <div class="hotspot-white-btn" aria-hidden="true"></div>
                <div class="hotspot-white-tooltip">
                    <span class="hotspot-tooltip-title">${h.icon} ${h.label}</span>
                    <span class="hotspot-tooltip-sub">${h.sub}</span>
                </div>
            `;

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerHotspotClick(h.target);
            });

            this.hotspotsContainer.appendChild(el);
            return { data: h, el: el };
        });

        // Segera perbarui posisi tombol di layar agar tidak flicker atau telat
        this.updateHotspots();
    }

    triggerHotspotClick(targetKey) {
        let foundMesh = null;
        for (let mesh of this.interactableObjects) {
            const uName = mesh.name.toUpperCase();
            if (uName.includes(targetKey)) {
                foundMesh = mesh;
                break;
            }
        }
        if (!foundMesh && this.interactableObjects.length > 0) {
            foundMesh = this.interactableObjects[0];
        }

        if (foundMesh) {
            this.highlightObject(foundMesh);
            this.focusCameraOnObject(foundMesh);
        }

        if (this.onObjectClick) {
            this.onObjectClick(targetKey, foundMesh);
        }
    }

    toggleHotspots(visible = null) {
        if (visible === null) {
            this.hotspotsVisible = !this.hotspotsVisible;
        } else {
            this.hotspotsVisible = Boolean(visible);
        }
        this.renderHotspotElements();
        return this.hotspotsVisible;
    }

    updateHotspots() {
        if (!this.hotspotsContainer || !this.hotspotsVisible || !this.currentActiveHotspots) return;

        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;
        const tempVec = new THREE.Vector3();

        this.currentActiveHotspots.forEach(item => {
            tempVec.copy(item.data.pos);
            tempVec.project(this.camera);

            // Jika di belakang kamera, sembunyikan
            if (tempVec.z > 1.0 || tempVec.z < -1.0) {
                item.el.style.display = 'none';
                return;
            }

            const x = (tempVec.x * 0.5 + 0.5) * width;
            const y = (-(tempVec.y * 0.5) + 0.5) * height;

            item.el.style.display = 'flex';
            item.el.style.left = `${x}px`;
            item.el.style.top = `${y}px`;
        });
    }

    animate() {
        this.controls.update();

        // Animasi Tumbuhan Ditiup Angin (Wind Sway) Default
        // Bisa di-override oleh LabManager (misal saat suhu kepanasan)
        if (this.model && !this.isLabHotState) {
            const time = Date.now() * 0.001;
            this.model.rotation.z = Math.sin(time * 0.8) * 0.015;
            this.model.rotation.x = Math.sin(time * 0.6) * 0.008;

            // Animasi Gelombang Rumput
            if (this.grassBlades && this.grassBlades.userData.blades) {
                const dummy = new THREE.Object3D();
                this.grassBlades.userData.blades.forEach((blade, i) => {
                    dummy.position.set(blade.x, -0.4, blade.z);
                    dummy.scale.set(blade.s, blade.s, blade.s);

                    // Hitung efek gelombang angin santai
                    const windForce = Math.sin(time * 1.2 + blade.x * 0.5 + blade.z * 0.5) * 0.1;

                    dummy.rotation.set(
                        blade.rx + windForce,
                        blade.ry,
                        blade.rz + windForce * 0.5
                    );

                    dummy.updateMatrix();
                    this.grassBlades.setMatrixAt(i, dummy.matrix);
                });
                this.grassBlades.instanceMatrix.needsUpdate = true;
            }
        }

        // Update animasi partikel fotosintesis interaktif (di luar daun atau di dalam sel mesofil)
        if (this.photosynthesisParticles && this.photosynthesisParticles.group && this.photosynthesisParticles.group.visible) {
            this.photosynthesisParticles.update(0.016, this.simState);
        }

        // Update posisi titik tombol interaktif di layar kanvas
        this.updateHotspots();

        this.renderer.render(this.scene, this.camera);
    }

    startAR() {
        if (!('xr' in navigator)) {
            alert('Perangkat Anda tidak mendukung WebXR (Augmented Reality). Pastikan Anda menggunakan Chrome di Android.');
            return;
        }
        navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
            if (supported) {
                navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local'] }).then((session) => {
                    this.renderer.xr.setReferenceSpaceType('local');
                    this.renderer.xr.setSession(session);

                    // Geser model agar terlihat di depan mata saat AR
                    if (this.model) {
                        this.model.position.set(0, -1, -5);
                    }

                    session.addEventListener('end', () => {
                        // Kembalikan posisi model
                        if (this.model) {
                            this.model.position.set(0, 0, 0);
                        }
                    });
                });
            } else {
                alert('Sensor AR (ARCore) tidak tersedia di perangkat Anda.');
            }
        });
    }

    setPhotosynthesisFilter(filter) {
        if (this.photosynthesisParticles) {
            this.photosynthesisParticles.setFilter(filter);
        }
    }

    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.container.removeEventListener('pointerdown', this.onPointerDown);
        this.container.removeEventListener('pointerup', this.onPointerUp);
        this.renderer.setAnimationLoop(null);
        if (this.photosynthesisParticles) {
            this.photosynthesisParticles.destroy();
        }
        // Clean up WebGL
        if (this.renderer) {
            this.renderer.dispose();
            this.container.innerHTML = '';
        }
    }
}
