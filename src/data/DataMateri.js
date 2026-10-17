import { store } from '../utils/PenyimpananData.js';

export const educationalData = {
    // Mapping dari prefix nama objek 3D ke informasi edukasi
    "ROOT": {
        title: "Akar (Root)",
        description: "Akar bertugas menyerap air dan mineral dari dalam tanah. Akar juga berfungsi untuk menopang tumbuhan agar berdiri tegak.",
        learningPoint: "Air diserap melalui bulu-bulu akar, lalu bergerak naik menuju batang."
    },
    "STEM": {
        title: "Batang (Stem)",
        description: "Batang adalah jalan raya bagi tumbuhan! Di dalamnya terdapat pembuluh xilem (membawa air dari akar) dan floem (membawa makanan dari daun ke seluruh tubuh).",
        learningPoint: "Tanpa batang, air tidak bisa sampai ke daun untuk fotosintesis."
    },
    "LEAF": {
        title: "Daun (Skala Luar Organ)",
        description: "Helaian daun menangkap sinar matahari dari langit dan menyerap gas CO₂ dari udara sekitar. Air dari akar dialirkan melalui batang dan menyebar ke urat-urat daun.",
        learningPoint: "Di luar daun, gas O₂ segar dilepaskan ke udara bebas untuk kita bernapas. 💡 Klik 'Belah Daun & Intip Sel Mesofil' untuk melihat reaksi kimia di dalam sel!"
    },
    "DAUN": {
        title: "Daun (Skala Luar Organ)",
        description: "Helaian daun menangkap sinar matahari dari langit dan menyerap gas CO₂ dari udara sekitar. Air dari akar dialirkan melalui batang dan menyebar ke urat-urat daun.",
        learningPoint: "Di luar daun, gas O₂ segar dilepaskan ke udara bebas untuk kita bernapas. 💡 Klik 'Belah Daun & Intip Sel Mesofil' untuk melihat reaksi kimia di dalam sel!"
    },
    "PETAL": {
        title: "Mahkota Bunga",
        description: "Mahkota bunga memiliki warna yang sangat cerah (kuning) untuk menarik serangga seperti lebah.",
        learningPoint: "Serangga membantu proses penyerbukan agar bunga bisa menghasilkan biji."
    },
    "FLOWER": {
        title: "Bunga",
        description: "Bunga adalah alat perkembangbiakan tumbuhan. Di sinilah biji bunga matahari (kuaci) dibentuk.",
        learningPoint: "Biji-biji ini nantinya bisa tumbuh menjadi bunga matahari baru!"
    },
    "SEED": {
        title: "Biji",
        description: "Biji bunga matahari menyimpan cadangan makanan. Saat jatuh ke tanah yang sesuai, biji ini akan tumbuh menjadi tanaman baru.",
        learningPoint: "Proses berkembangnya biji menjadi tanaman disebut perkecambahan."
    },
    "EPIDERMIS_ATAS": {
        title: "Epidermis Atas",
        description: "Lapisan tipis (kulit luar) bening di bagian atas daun. Epidermis atas melindungi daun dari panas berlebih dan serangga.",
        learningPoint: "Lapisan ini bening seperti kaca, agar cahaya matahari tetap bisa masuk menerangi kloroplas di bawahnya."
    },
    "EPIDERMIS_BAWAH": {
        title: "Epidermis Bawah",
        description: "Lapisan pelindung di bagian bawah daun. Di lapisan inilah stomata (lubang udara) paling banyak ditemukan.",
        learningPoint: "Epidermis bawah lebih terlindung dari sinar matahari langsung, sehingga lebih lembap."
    },
    "BERKAS_PEMBULUH": {
        title: "Berkas Pembuluh (Tulang Daun)",
        description: "Jalan tol utama daun! Pembuluh ini bagaikan pipa-pipa kecil yang bercabang ke seluruh bagian daun.",
        learningPoint: "Jalur ini membawa air (dari akar) ke daun, lalu membawa makanan (hasil fotosintesis) kembali ke seluruh tumbuhan."
    },
    "SEL_MESOFIL": {
        title: "Sel Mesofil (Dapur Utama Daun)",
        description: "Selamat datang di dalam sel mesofil! Di sinilah dapur fotosintesis yang sesungguhnya. Terdiri dari jaringan tiang (palisade) yang dipenuhi butiran kloroplas hijau dan jaringan bunga karang (spons) dengan lorong udara luas untuk sirkulasi gas.",
        learningPoint: "Di dalam sel mesofil, klorofil menangkap foton sinar matahari, menggabungkannya dengan molekul air (H₂O) dari urat daun dan gas CO₂ dari stomata untuk memasak makanan (glukosa) serta menghasilkan oksigen (O₂) segar!",
        isProcessView: true,
        steps: [
            { icon: "☀️", key: "LIGHT", label: "Cahaya", title: "1. Penyerapan Cahaya", text: "Foton cahaya matahari menembus epidermis atas dan diserap pigmen klorofil di kloroplas." },
            { icon: "💧", key: "WATER", label: "Air (H₂O)", title: "2. Aliran Air dari Xilem", text: "Air yang diserap akar mengalir melalui pipa xilem masuk ke sel mesofil." },
            { icon: "💨", key: "CO2", label: "CO₂", title: "3. Gas CO₂ Masuk", text: "Stomata di bawah daun membuka, mengalirkan gas Karbon Dioksida ke rongga mesofil." },
            { icon: "🍃", key: "SYNTH", label: "Kloroplas", title: "4. Dapur Memasak (Sintesis)", text: "Kloroplas mengubah Air + CO₂ + Energi Cahaya menjadi Glukosa dan Oksigen!" },
            { icon: "🌬️", key: "PRODUCTS", label: "Hasil O₂ & Gula", title: "5. Pelepasan Oksigen & Energi", text: "Gas O₂ dilepas lewat stomata ke udara bebas, sedangkan Glukosa dialirkan floem ke seluruh tubuh tumbuhan." }
        ]
    },
    "KLOROPLAS": {
        title: "Kloroplas",
        description: "Kloroplas adalah pabrik makanan kecil di dalam sel! Di sinilah air, karbon dioksida, dan cahaya matahari diubah menjadi makanan (glukosa).",
        learningPoint: "Kloroplas mengandung klorofil yang membuat daun berwarna hijau."
    },
    "STOMATA": {
        title: "Stomata",
        description: "Stomata adalah 'hidung' tumbuhan, berbentuk lubang kecil di bawah daun. Tempat ini digunakan untuk mengambil Karbon Dioksida (CO₂) dari udara.",
        learningPoint: "Oksigen (O₂) hasil fotosintesis juga dibuang keluar lewat stomata."
    },
    "AIR": {
        title: "Air (H₂O)",
        description: "Air diserap dari tanah dan sangat dibutuhkan tumbuhan untuk melakukan fotosintesis.",
        learningPoint: "Tanpa air, tumbuhan akan layu dan mati."
    },
    "CO2": {
        title: "Karbon Dioksida (CO₂)",
        description: "Gas dari udara yang dihirup tumbuhan melalui stomata daun.",
        learningPoint: "Karbon dioksida adalah bahan baku utama pembuat makanan (glukosa)."
    },
    "SUN": {
        title: "Cahaya Matahari",
        description: "Sumber energi utama! Tumbuhan butuh cahaya untuk mengolah air dan CO₂.",
        learningPoint: "Jika tidak ada cahaya (malam hari), fotosintesis tidak bisa terjadi."
    }
};

export function getInfoByObjectName(objectName) {
    if (!objectName) return null;
    
    const env = store.state.environment;
    
    // Cari prefix yang cocok dengan nama object (contoh: "ROOT_HAIR_01" -> match "ROOT")
    const keys = Object.keys(educationalData);
    for (let i = 0; i < keys.length; i++) {
        if (objectName.toUpperCase().includes(keys[i])) {
            let info = {
                id: keys[i],
                ...educationalData[keys[i]]
            };

            // Dynamic Contextual Explanations based on Environment
            if (env) {
                if (keys[i] === "BERKAS_PEMBULUH" || keys[i] === "AIR" || keys[i] === "ROOT" || keys[i] === "STEM") {
                    if (env.rain) {
                        info.learningPoint += " 🌧️ Saat ini hujan, aliran air di pembuluh ini sangat melimpah dan lancar!";
                    } else if (env.temp > 30) {
                        info.learningPoint += " 🌡️ Karena cuaca sangat panas dan kering, pasokan air mengalir lebih sedikit. Tumbuhan harus berhemat!";
                    }
                }
                
                if (keys[i] === "STOMATA") {
                    if (env.temp > 33) {
                        info.learningPoint += " 🌡️ Cuaca terlalu panas! Stomata akan menutup sebagian pintunya agar tumbuhan tidak kehilangan terlalu banyak uap air (keringat).";
                    } else if (env.rain) {
                        info.learningPoint += " 🌧️ Kelembapan tinggi saat hujan membuat stomata dapat terbuka dengan rileks untuk bernapas.";
                    }
                }
                
                if (keys[i] === "KLOROPLAS" || keys[i] === "SEL_MESOFIL" || keys[i] === "LEAF") {
                    if (!env.sun) {
                        info.learningPoint += " ☁️ Langit sedang mendung. Kloroplas kekurangan cahaya matahari, sehingga dapur pembuatan makanan melambat.";
                    } else if (env.sun && env.temp <= 30) {
                        info.learningPoint += " ☀️ Cuaca cerah! Kloroplas sedang bekerja dengan kecepatan maksimal memproduksi makanan.";
                    } else if (env.sun && env.temp > 33) {
                        info.learningPoint += " ☀️ Cuaca sangat terik. Mesofil kepanasan, proses fotosintesis bisa sedikit terhambat.";
                    }
                }
            }

            return info;
        }
    }
    return null;
}
