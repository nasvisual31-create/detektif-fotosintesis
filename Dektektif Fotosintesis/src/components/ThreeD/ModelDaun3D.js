// THREE is globally available via script tag
export function createProceduralLeaf() {
    const leafGroup = new THREE.Group();

    const width = 10;
    const depth = 10;
    const epiThickness = 0.15;

    // Materials
    const epidermisMat = new THREE.MeshStandardMaterial({ 
        color: 0xdeeebb, transparent: true, opacity: 0.5,
        roughness: 0.2, metalness: 0.1, side: THREE.DoubleSide
    });
    const upperEpiMat = epidermisMat.clone();
    const lowerEpiMat = epidermisMat.clone();

    const palisadeMat = new THREE.MeshStandardMaterial({ color: 0x81c784, roughness: 0.7 });
    const spongyMat = new THREE.MeshStandardMaterial({ color: 0xaed581, roughness: 0.8 });
    
    const chloroplastMat = new THREE.MeshStandardMaterial({ 
        color: 0x00e676, emissive: 0x003300, roughness: 0.4 
    });
    
    const veinSheathMat = new THREE.MeshStandardMaterial({ color: 0x81d4fa, roughness: 0.6, transparent: true, opacity: 0.8 }); 
    const xylemMat = new THREE.MeshStandardMaterial({ color: 0x03a9f4, roughness: 0.5 }); 
    const phloemMat = new THREE.MeshStandardMaterial({ color: 0x0288d1, roughness: 0.5 }); 
    
    const guardCellMat = new THREE.MeshStandardMaterial({ color: 0x66bb6a, roughness: 0.6 });
    const stomaHoleMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });

    // Store materials for highlight resets later
    const allMaterials = [
        upperEpiMat, lowerEpiMat, palisadeMat, spongyMat,
        chloroplastMat, veinSheathMat, xylemMat, phloemMat,
        guardCellMat, stomaHoleMat
    ];

    allMaterials.forEach(mat => {
        mat.userData = {
            opacity: mat.opacity,
            transparent: mat.transparent,
            origOpacity: mat.opacity,
            origTransparent: mat.transparent,
            emissive: mat.emissive ? mat.emissive.clone() : new THREE.Color(0x000000)
        };
    });
    leafGroup.userData.materials = allMaterials;

    // Epidermis Atas
    const upperEpiGeo = new THREE.BoxGeometry(width, epiThickness, depth);
    const upperEpi = new THREE.Mesh(upperEpiGeo, upperEpiMat);
    upperEpi.position.y = 1.35;
    upperEpi.receiveShadow = true;
    upperEpi.name = "EPIDERMIS_ATAS";
    leafGroup.add(upperEpi);

    // Mesofil (Palisade)
    const palisadeGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.1, 16);
    const chloroGeo = new THREE.SphereGeometry(0.12, 8, 8); 

    for (let x = -4.6; x <= 4.6; x += 0.65) {
        for (let z = -4.6; z <= 4.6; z += 0.65) {
            if (Math.abs(x) < 1.8) continue; // Ruang untuk berkas pembuluh

            const cell = new THREE.Mesh(palisadeGeo, palisadeMat);
            cell.position.set(x + (Math.random()*0.1), 0.7, z + (Math.random()*0.1));
            cell.castShadow = true;
            cell.receiveShadow = true;
            cell.name = "SEL_MESOFIL";
            
            for(let c = 0; c < 8; c++) {
                const chloro = new THREE.Mesh(chloroGeo, chloroplastMat);
                const angle = Math.random() * Math.PI * 2;
                const r = 0.3; 
                const cy = (Math.random() - 0.5) * 0.9;
                chloro.position.set(Math.cos(angle) * r, cy, Math.sin(angle) * r);
                chloro.name = "KLOROPLAS";
                cell.add(chloro);
            }
            
            leafGroup.add(cell);
        }
    }

    // Mesofil (Spongy)
    const spongyGeo = new THREE.SphereGeometry(0.35, 16, 16);
    for (let i = 0; i < 90; i++) {
        const x = (Math.random() - 0.5) * 9.2;
        const z = (Math.random() - 0.5) * 9.2;
        const y = -0.8 + (Math.random() * 0.7); 
        
        if (Math.abs(x) < 2.0 && y > -0.3) continue;
        
        const cell = new THREE.Mesh(spongyGeo, spongyMat);
        cell.position.set(x, y, z);
        cell.scale.set(1 + Math.random()*0.3, 1 + Math.random()*0.3, 1 + Math.random()*0.3);
        cell.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        cell.castShadow = true;
        cell.receiveShadow = true;
        cell.name = "SEL_MESOFIL";

        for(let c = 0; c < 5; c++) {
            const chloro = new THREE.Mesh(chloroGeo, chloroplastMat);
            const r = 0.35;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            chloro.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            chloro.name = "KLOROPLAS";
            cell.add(chloro);
        }
        leafGroup.add(cell);
    }

    // Berkas Pembuluh
    const veinGroup = new THREE.Group();
    veinGroup.name = "BERKAS_PEMBULUH";
    const sheathGeo = new THREE.CylinderGeometry(1.2, 1.2, depth, 32);
    const sheath = new THREE.Mesh(sheathGeo, veinSheathMat);
    sheath.rotation.x = Math.PI / 2;
    sheath.receiveShadow = true;
    sheath.castShadow = true;
    sheath.name = "BERKAS_PEMBULUH";
    veinGroup.add(sheath);

    const xylemTGeo = new THREE.CylinderGeometry(0.2, 0.2, depth + 0.1, 16);
    for(let i = 0; i < 7; i++) {
        const x = (Math.random() - 0.5) * 1.2;
        const y = 0.2 + Math.random() * 0.5;
        if(Math.sqrt(x*x + y*y) > 0.8) continue;
        
        const xylem = new THREE.Mesh(xylemTGeo, xylemMat);
        xylem.rotation.x = Math.PI / 2;
        xylem.position.set(x, y, 0);
        xylem.name = "AIR"; // Untuk Xilem, bawa air
        veinGroup.add(xylem);
    }

    const phloemTGeo = new THREE.CylinderGeometry(0.15, 0.15, depth + 0.1, 16);
    for(let i = 0; i < 10; i++) {
        const x = (Math.random() - 0.5) * 1.2;
        const y = -0.2 - Math.random() * 0.5;
        if(Math.sqrt(x*x + y*y) > 0.8) continue;

        const phloem = new THREE.Mesh(phloemTGeo, phloemMat);
        phloem.rotation.x = Math.PI / 2;
        phloem.position.set(x, y, 0);
        phloem.name = "GLUKOSA"; // Floem bawa hasil makanan
        veinGroup.add(phloem);
    }

    veinGroup.position.set(0, 0.1, 0);
    leafGroup.add(veinGroup);

    // Epidermis Bawah
    const lowerEpiGeo = new THREE.BoxGeometry(width, epiThickness, depth);
    const lowerEpi = new THREE.Mesh(lowerEpiGeo, lowerEpiMat);
    lowerEpi.position.y = -1.15;
    lowerEpi.receiveShadow = true;
    lowerEpi.name = "EPIDERMIS_BAWAH";
    leafGroup.add(lowerEpi);

    // Stomata
    const guardGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const holeGeo = new THREE.PlaneGeometry(0.15, 0.45);

    for(let i = 0; i < 25; i++) { 
        const x = (Math.random() - 0.5) * 9;
        const z = (Math.random() - 0.5) * 9;
        
        const stomaGroup = new THREE.Group();
        
        const guardLeft = new THREE.Mesh(guardGeo, guardCellMat);
        guardLeft.scale.set(0.5, 0.5, 1.5);
        guardLeft.position.set(-0.1, 0, 0);
        guardLeft.name = "STOMATA";
        
        const guardRight = new THREE.Mesh(guardGeo, guardCellMat);
        guardRight.scale.set(0.5, 0.5, 1.5);
        guardRight.position.set(0.1, 0, 0);
        guardRight.name = "STOMATA";
        
        const hole = new THREE.Mesh(holeGeo, stomaHoleMat);
        hole.rotation.x = -Math.PI / 2;
        hole.name = "STOMATA";
        
        stomaGroup.add(guardLeft);
        stomaGroup.add(guardRight);
        stomaGroup.add(hole);
        
        stomaGroup.position.set(x, -1.25, z);
        stomaGroup.rotation.y = Math.random() * Math.PI;
        
        leafGroup.add(stomaGroup);
    }
    
    // Scale down a bit to fit screen
    leafGroup.scale.set(0.8, 0.8, 0.8);

    return leafGroup;
}
