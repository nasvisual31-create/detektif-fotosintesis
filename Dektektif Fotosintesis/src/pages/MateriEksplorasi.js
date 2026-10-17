import { store } from '../utils/PenyimpananData.js';
import { SceneManager } from '../components/ThreeD/PengelolaScene3D.js';
import { getInfoByObjectName } from '../data/DataMateri.js';
import { speakText, stopSpeaking } from '../utils/NarasiSuara.js';
import { showGuideModal } from '../components/ModalPetunjuk.js';
import { attachAudioToggle, playSound } from '../utils/SistemSuara.js';

export function renderMateri(router) {
    const container = document.createElement('div');
    container.className = 'view-container';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100vh';
    container.style.overflow = 'hidden';
    container.style.background = '#f8fafc';

    // 8 Level Pembelajaran Lengkap: Rangkuman, Kartu Konsep, dan Kuis Multi-Soal (Bukan Cuma 1 Soal)
    const levelsData = [
        {
            id: 1,
            title: "Kenali Tumbuhan",
            icon: "🌻",
            desc: "Pelajari bagian-bagian bunga matahari dan fungsinya.",
            xp: 30,
            has3D: true,
            viewMode: "PLANT",
            target3D: "FLOWER",
            summaryCard: {
                icon: "🌱",
                title: "Bagian-bagian Tumbuhan",
                desc: "Setiap bagian tumbuhan memiliki peran yang berbeda-beda. Yuk kenali bagian-bagian bunga matahari!"
            },
            conceptCards: [
                {
                    icon: "🌱",
                    title: "Akar",
                    color: "#8b5e34",
                    desc: "Menyerap air & mineral dari dalam tanah. Juga sebagai pondasi penopang tumbuhan agar tidak roboh."
                },
                {
                    icon: "🌿",
                    title: "Batang",
                    color: "#65a30d",
                    desc: "Menopang seluruh bagian tumbuhan dan mengangkut air & zat hara dari akar ke daun."
                },
                {
                    icon: "🍃",
                    title: "Daun",
                    color: "#10b981",
                    desc: "Tempat utama berlangsungnya fotosintesis. Mengandung klorofil yang menangkap cahaya matahari."
                },
                {
                    icon: "🌸",
                    title: "Bunga",
                    color: "#eab308",
                    desc: "Organ perkembangbiakan tumbuhan. Menghasilkan biji untuk menghasilkan tumbuhan baru."
                }
            ],
            questions: [
                {
                    question: "Bagian tumbuhan manakah yang berada di dalam tanah dan bertugas menyerap air serta mineral?",
                    options: [
                        { id: "A", text: "Bunga" },
                        { id: "B", text: "Daun" },
                        { id: "C", text: "Akar" },
                        { id: "D", text: "Batang" }
                    ],
                    correctId: "C",
                    feedbackWrong: "Belum tepat. Bagian tumbuhan ini berada di bawah tanah dan menjadi pondasi agar bunga matahari tidak roboh!",
                    feedbackCorrect: "Tepat sekali! Akar menyerap air dan mineral dari dalam tanah untuk disalurkan ke daun."
                },
                {
                    question: "Bagian manakah yang bertugas menopang seluruh tubuh tumbuhan dan mengalirkan air dari akar ke daun?",
                    options: [
                        { id: "A", text: "Batang" },
                        { id: "B", text: "Mahkota Bunga" },
                        { id: "C", text: "Akar Serabut" },
                        { id: "D", text: "Biji Kuaci" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Bagian ini berbentuk seperti tiang tegak yang menghubungkan akar dengan daun-daun!",
                    feedbackCorrect: "Hebat! Batang adalah tiang penopang sekaligus jalur pipa pengangkut air dari akar ke daun."
                },
                {
                    question: "Mengapa daun sangat penting bagi kelangsungan hidup bunga matahari?",
                    options: [
                        { id: "A", text: "Karena daun adalah tempat utama fotosintesis untuk memasak makanan" },
                        { id: "B", text: "Karena daun mengeluarkan suara musik merdu" },
                        { id: "C", text: "Karena daun hanya berfungsi sebagai hiasan taman" },
                        { id: "D", text: "Karena daun mengusir serangga malam" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Daun mengandung zat hijau klorofil yang menangkap sinar matahari untuk memasak makanan (fotosintesis)!",
                    feedbackCorrect: "Pintar sekali! Daun adalah dapur utama tempat fotosintesis memproduksi makanan bagi tumbuhan."
                }
            ]
        },
        {
            id: 2,
            title: "Apa Itu Fotosintesis?",
            icon: "📖",
            desc: "Pahami pengertian fotosintesis dengan cara yang menyenangkan.",
            xp: 30,
            has3D: false,
            summaryCard: {
                icon: "☀️",
                title: "Rahasia Dapur Alami Tumbuhan",
                desc: "Tumbuhan tidak bisa pergi ke pasar atau restoran. Tumbuhan punya keajaiban membuat makanannya sendiri!"
            },
            conceptCards: [
                {
                    icon: "🔤",
                    title: "Foto & Sintesis",
                    color: "#8b5cf6",
                    desc: "'Foto' berarti cahaya, dan 'sintesis' berarti menyusun atau membuat. Fotosintesis adalah memasak dengan energi cahaya!"
                },
                {
                    icon: "🍳",
                    title: "Produsen Mandiri",
                    color: "#10b981",
                    desc: "Tumbuhan disebut produsen mandiri karena mampu memproduksi glukosa (energi) sendiri tanpa memakan makhluk hidup lain."
                },
                {
                    icon: "🧪",
                    title: "Resep Alami",
                    color: "#0ea5e9",
                    desc: "Hanya butuh 3 bahan sederhana: Air (H₂O) dari tanah, Gas Karbon Dioksida (CO₂) dari udara, dan Cahaya Matahari."
                },
                {
                    icon: "🍎",
                    title: "Glukosa & Oksigen",
                    color: "#f59e0b",
                    desc: "Menghasilkan zat gula (glukosa) untuk pertumbuhan tumbuhan dan melepaskan gas oksigen (O₂) segar untuk pernapasan kita."
                }
            ],
            questions: [
                {
                    question: "Apakah arti kata fotosintesis berdasarkan asal bahasanya?",
                    options: [
                        { id: "A", text: "Membuat makanan sendiri menggunakan bantuan energi cahaya" },
                        { id: "B", text: "Mencetak gambar dengan kamera foto digital" },
                        { id: "C", text: "Mengeringkan daun saat musim kemarau panjang" },
                        { id: "D", text: "Menyiram tanaman dengan air hangat" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. 'Foto' berasal dari bahasa Yunani yang artinya cahaya, dan 'sintesis' artinya menyusun atau meracik!",
                    feedbackCorrect: "Luar biasa! Fotosintesis berarti meracik atau membuat makanan menggunakan bantuan energi cahaya matahari."
                },
                {
                    question: "Mengapa tumbuhan hijau disebut sebagai makhluk hidup produsen mandiri?",
                    options: [
                        { id: "A", text: "Karena mampu membuat makanannya sendiri melalui fotosintesis" },
                        { id: "B", text: "Karena memakan sisa-sisa makanan serangga" },
                        { id: "C", text: "Karena hanya meminum air embun pagi" },
                        { id: "D", text: "Karena tidur sepanjang musim hujan" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Disebut produsen karena tumbuhan memproduksi sendiri zat glukosa dari bahan-bahan alami!",
                    feedbackCorrect: "Tepat sekali! Tumbuhan tidak perlu berburu makanan karena daunnya bisa membuat makanan sendiri."
                },
                {
                    question: "Dua zat penting apakah yang dihasilkan dari proses fotosintesis pada daun?",
                    options: [
                        { id: "A", text: "Glukosa (gula energi) dan Gas Oksigen (O₂)" },
                        { id: "B", text: "Asap knalpot dan debu jalanan" },
                        { id: "C", text: "Pasir pantai dan batu kerikil" },
                        { id: "D", text: "Minyak goreng dan garam dapur" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Tumbuhan menghasilkan makanan manis untuk tubuhnya (glukosa) dan gas bersih untuk kita bernapas (oksigen)!",
                    feedbackCorrect: "Benar sekali! Glukosa disimpan sebagai energi tumbuhan dan gas oksigen dilepaskan ke udara."
                }
            ]
        },
        {
            id: 3,
            title: "Kenalan dengan Cahaya, Air, dan CO₂",
            icon: "☀️",
            desc: "Temukan tiga bahan penting yang dibutuhkan tumbuhan.",
            xp: 40,
            has3D: false,
            summaryCard: {
                icon: "💧",
                title: "Tiga Bahan Ajaib Fotosintesis",
                desc: "Sama seperti koki yang butuh bahan baku memasak, tumbuhan hijau butuh 3 bahan wajib ini agar bisa berfotosintesis!"
            },
            conceptCards: [
                {
                    icon: "☀️",
                    title: "Cahaya Matahari",
                    color: "#f59e0b",
                    desc: "Energi utama tata surya. Foton cahaya matahari ditangkap oleh klorofil di daun untuk menggerakkan reaksi kimia."
                },
                {
                    icon: "💧",
                    title: "Air Tanah (H₂O)",
                    color: "#0284c7",
                    desc: "Diserap oleh rambut-rambut akar dari tanah yang lembap, lalu dialirkan lewat pembuluh batang menuju daun."
                },
                {
                    icon: "💨",
                    title: "Gas CO₂ Udara",
                    color: "#14b8a6",
                    desc: "Gas tak kasat mata dari hembusan napas makhluk hidup & lingkungan, masuk melalui mulut daun (stomata)."
                }
            ],
            questions: [
                {
                    question: "Manakah 3 bahan utama yang wajib ada agar fotosintesis dapat berlangsung?",
                    options: [
                        { id: "A", text: "Air (H₂O), Gas Karbon Dioksida (CO₂), dan Cahaya Matahari" },
                        { id: "B", text: "Tanah liat, pupuk kimia, dan cacing tanah" },
                        { id: "C", text: "Oksigen murni, es batu, dan madu lebah" },
                        { id: "D", text: "Angin badai, debu jalanan, dan asap tebal" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Ingat 3 pahlawan fotosintesis: air dari tanah, CO₂ dari udara, dan energi dari cahaya matahari!",
                    feedbackCorrect: "Hebat! Ketiga bahan wajib fotosintesis adalah Air, Karbon Dioksida, dan Cahaya Matahari."
                },
                {
                    question: "Melalui bagian manakah gas Karbon Dioksida (CO₂) dari udara masuk ke dalam daun?",
                    options: [
                        { id: "A", text: "Pori-pori stomata pada daun" },
                        { id: "B", text: "Ujung akar tunggang di dalam tanah" },
                        { id: "C", text: "Kelopak mahkota bunga yang cerah" },
                        { id: "D", text: "Duri pelindung pada batang" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Pada permukaan daun terdapat pori-pori mikroskopis bernama stomata yang bertindak seperti mulut daun!",
                    feedbackCorrect: "Tepat sekali! Stomata adalah pintu gerbang keluar masuknya gas CO₂ dan O₂ pada daun."
                },
                {
                    question: "Bagian tubuh tumbuhan manakah yang bertugas menyerap air (H₂O) dari dalam tanah?",
                    options: [
                        { id: "A", text: "Rambut-rambut akar" },
                        { id: "B", text: "Kelopak bunga" },
                        { id: "C", text: "Ujung ranting atas" },
                        { id: "D", text: "Biji kuaci" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Rambut-rambut akar di dalam tanah menyerap air tanah seperti pipa sedotan alami!",
                    feedbackCorrect: "Pintar! Rambut akar menyerap air tanah lalu mengirimkannya ke batang hingga tiba di daun."
                }
            ]
        },
        {
            id: 4,
            title: "Dapur Tumbuhan",
            icon: "🍃",
            desc: "Saksikan proses fotosintesis secara animasi 3D!",
            xp: 40,
            has3D: true,
            viewMode: "MESOPHYLL",
            target3D: "SEL_MESOFIL",
            summaryCard: {
                icon: "🔬",
                title: "Anatomi Sel Mesofil & Kloroplas",
                desc: "Ayo intip ke dalam daun! Di dalam jaringan sel mesofil terdapat kloroplas yang menjadi pabrik sejati fotosintesis."
            },
            conceptCards: [
                {
                    icon: "🌿",
                    title: "Jaringan Mesofil",
                    color: "#10b981",
                    desc: "Lapisan daging daun yang terdiri dari sel tiang (palisade) dan sel spons, tempat ribuan kloroplas berada."
                },
                {
                    icon: "🟢",
                    title: "Pabrik Kloroplas",
                    color: "#22c55e",
                    desc: "Organel sel khusus berbentuk oval. Di sinilah reaksi peracikan air dan gas CO₂ menjadi makanan terjadi."
                },
                {
                    icon: "🧪",
                    title: "Zat Klorofil",
                    color: "#0d9488",
                    desc: "Pigmen alami hijau di dalam kloroplas yang bertindak sebagai panel surya penangkap spektrum cahaya matahari."
                },
                {
                    icon: "🚪",
                    title: "Pintu Stomata",
                    color: "#06b6d4",
                    desc: "Pori-pori diapit dua sel penjaga yang membuka untuk mengambil CO₂ dan mengeluarkan oksigen serta uap air."
                }
            ],
            questions: [
                {
                    question: "Di dalam sel mesofil daun, pabrik kecil tempat terjadinya fotosintesis disebut...",
                    options: [
                        { id: "A", text: "Kloroplas" },
                        { id: "B", text: "Tulang daun" },
                        { id: "C", text: "Kulit kayu" },
                        { id: "D", text: "Biji bunga" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Pabrik oval mikroskopis di dalam sel daun tempat klorofil berada adalah Kloroplas!",
                    feedbackCorrect: "Hebat! Kloroplas adalah organel sel yang berfungsi sebagai pabrik fotosintesis."
                },
                {
                    question: "Apakah fungsi utama pigmen klorofil yang memberi warna hijau pada daun?",
                    options: [
                        { id: "A", text: "Menangkap dan menyerap energi foton cahaya matahari" },
                        { id: "B", text: "Menakuti serangga ulat" },
                        { id: "C", text: "Menghasilkan aroma harum pada bunga" },
                        { id: "D", text: "Membuat daun terasa manis" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Klorofil berfungsi sebagai antena penangkap energi cahaya matahari untuk reaksi fotosintesis!",
                    feedbackCorrect: "Tepat sekali! Klorofil menyerap cahaya matahari untuk menggerakkan proses fotosintesis."
                },
                {
                    question: "Bagian sel apakah yang bertugas menjaga dan mengatur buka-tutupnya lubang stomata daun?",
                    options: [
                        { id: "A", text: "Sel penjaga (guard cells)" },
                        { id: "B", text: "Sel darah merah" },
                        { id: "C", text: "Sel akar serabut" },
                        { id: "D", text: "Sel serbuk sari" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Pintu stomata diapit oleh sepasang sel penjaga yang bisa mengembang dan mengempis!",
                    feedbackCorrect: "Luar biasa! Sel penjaga (guard cells) mengontrol stomata agar daun tidak dehidrasi saat panas."
                }
            ]
        },
        {
            id: 5,
            title: "Bagaimana Oksigen Dihasilkan?",
            icon: "💨",
            desc: "Pelajari hasil fotosintesis: makanan dan oksigen.",
            xp: 30,
            has3D: false,
            summaryCard: {
                icon: "💨",
                title: "Pelepasan Gas Oksigen Segar",
                desc: "Pernahkah kamu berteduh di bawah pohon rindang dan merasa sejuk? Itu karena jutaan molekul oksigen murni dilepaskan daun!"
            },
            conceptCards: [
                {
                    icon: "⚡",
                    title: "Pemecahan Air",
                    color: "#0284c7",
                    desc: "Energi foton matahari memecah molekul air (H₂O) di dalam kloroplas menjadi ion hidrogen dan gas oksigen murni (O₂)."
                },
                {
                    icon: "💨",
                    title: "Pelepasan O₂",
                    color: "#10b981",
                    desc: "Gas oksigen yang terbentuk tidak disimpan di daun, melainkan dihembuskan keluar melalui mulut stomata ke udara bebas."
                },
                {
                    icon: "🫁",
                    title: "Napas Kehidupan",
                    color: "#f43f5e",
                    desc: "Gas oksigen dari tumbuhan dihirup oleh manusia, kucing, burung, dan seluruh fauna untuk bernapas setiap detik."
                }
            ],
            questions: [
                {
                    question: "Dari pemecahan molekul apakah gas Oksigen (O₂) dihasilkan saat fotosintesis?",
                    options: [
                        { id: "A", text: "Pemecahan molekul air (H₂O) oleh energi cahaya matahari" },
                        { id: "B", text: "Pemecahan butiran tanah liat" },
                        { id: "C", text: "Penguapan pupuk tanaman" },
                        { id: "D", text: "Dari cangkang biji kuaci" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Molekul air (H₂O) yang diserap dari tanah dipecah oleh foton cahaya di dalam kloroplas sehingga melepaskan oksigen!",
                    feedbackCorrect: "Benar sekali! Reaksi pemecahan air (fotolisis) di kloroplas melepaskan gas oksigen murni!"
                },
                {
                    question: "Lewat pintu manakah gas Oksigen (O₂) dihembuskan keluar dari daun ke udara bebas?",
                    options: [
                        { id: "A", text: "Lubang pori-pori stomata daun" },
                        { id: "B", text: "Ujung akar serabut di tanah" },
                        { id: "C", text: "Batang pohon bagian bawah" },
                        { id: "D", text: "Ujung serbuk sari bunga" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Pintu keluar masuk gas pada permukaan daun adalah pori-pori stomata!",
                    feedbackCorrect: "Hebat! Gas oksigen keluar melalui stomata daun lalu menyebar ke udara bersih."
                },
                {
                    question: "Mengapa udara di bawah pohon rindang pada siang hari terasa sangat sejuk dan segar?",
                    options: [
                        { id: "A", text: "Karena daun aktif melepaskan oksigen segar dan melakukan penguapan air sejuk" },
                        { id: "B", text: "Karena daun menyemprotkan es batu halus" },
                        { id: "C", text: "Karena pohon menyerap semua suara angin" },
                        { id: "D", text: "Karena pohon mengeluarkan bau mentol" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Daun aktif memproduksi oksigen bersih dan melepaskan uap air segar yang mendinginkan udara sekitar!",
                    feedbackCorrect: "Tepat sekali! Produksi oksigen dan pelepasan uap air oleh pohon membuat udara terasa sangat segar."
                }
            ]
        },
        {
            id: 6,
            title: "Siang dan Malam",
            icon: "🌙",
            desc: "Pahami perbedaan fotosintesis di siang dan malam hari.",
            xp: 40,
            has3D: false,
            summaryCard: {
                icon: "🌗",
                title: "Aktivitas Tumbuhan Siang & Malam",
                desc: "Apakah tumbuhan memasak makanan 24 jam non-stop? Ternyata tumbuhan juga memiliki siklus siang dan malam yang unik!"
            },
            conceptCards: [
                {
                    icon: "☀️",
                    title: "Siang: Fotosintesis",
                    color: "#f59e0b",
                    desc: "Cahaya matahari berlimpah, stomata terbuka lebar, fotosintesis bekerja aktif memproduksi glukosa dan oksigen."
                },
                {
                    icon: "🌙",
                    title: "Malam: Respirasi",
                    color: "#6366f1",
                    desc: "Tanpa sinar matahari, fotosintesis terhenti. Tumbuhan hanya bernapas (respirasi) menghirup sedikit O₂ dan melepas CO₂."
                },
                {
                    icon: "⚖️",
                    title: "Juara Oksigen Bumi",
                    color: "#10b981",
                    desc: "Meskipun malam hari bernapas, jumlah oksigen yang dihasilkan tumbuhan di siang hari jauh lebih banyak (hingga 10x lipat)!"
                }
            ],
            questions: [
                {
                    question: "Apa yang terjadi pada proses fotosintesis tumbuhan saat malam hari yang gelap gulita?",
                    options: [
                        { id: "A", text: "Fotosintesis terhenti karena tidak ada energi cahaya matahari" },
                        { id: "B", text: "Fotosintesis berjalan lebih kencang karena udara dingin" },
                        { id: "C", text: "Tumbuhan langsung layu dan mati seketika" },
                        { id: "D", text: "Tumbuhan menghasilkan glukosa lima kali lipat" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Fotosintesis membutuhkan foton cahaya matahari. Di malam hari tanpa sinar matahari, fotosintesis berhenti!",
                    feedbackCorrect: "Pintar! Tanpa cahaya matahari, reaksi fotosintesis berhenti dan tumbuhan beristirahat."
                },
                {
                    question: "Aktivitas apakah yang tetap dilakukan tumbuhan di malam hari untuk mempertahankan hidupnya?",
                    options: [
                        { id: "A", text: "Respirasi (bernapas menghirup O₂ untuk memecah cadangan energi)" },
                        { id: "B", text: "Memanjangkan batang sepuluh meter" },
                        { id: "C", text: "Menghasilkan buah seketika" },
                        { id: "D", text: "Menyerap sinar bulan untuk fotosintesis" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Tumbuhan tetap bernapas (respirasi) seperti makhluk hidup lainnya untuk kelangsungan selnya!",
                    feedbackCorrect: "Hebat! Tumbuhan melakukan respirasi dengan menggunakan cadangan energi untuk metabolisme sel."
                },
                {
                    question: "Mengapa kita sebaiknya tidak meletakkan terlalu banyak tanaman rimbun di dalam kamar tidur tertutup rapat saat malam hari?",
                    options: [
                        { id: "A", text: "Karena di malam hari tanaman ikut bernapas menghirup oksigen di ruangan tertutup" },
                        { id: "B", text: "Karena tanaman bisa berjalan di malam hari" },
                        { id: "C", text: "Karena tanaman tidur mendengkur keras" },
                        { id: "D", text: "Karena daun mengeluarkan zat pemikat ular" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Di ruangan tertutup rapat, tanaman yang bernapas di malam hari ikut menghirup oksigen ruangan!",
                    feedbackCorrect: "Tepat sekali! Pada malam hari di ruangan tertutup rapat, tanaman bernapas menghirup oksigen ruangan."
                }
            ]
        },
        {
            id: 7,
            title: "Kenapa Fotosintesis Penting?",
            icon: "🌍",
            desc: "Temukan mengapa fotosintesis sangat penting bagi seluruh kehidupan.",
            xp: 30,
            has3D: false,
            summaryCard: {
                icon: "🌍",
                title: "Jantung Kehidupan Planet Bumi",
                desc: "Fotosintesis bukan sekadar teori IPA, melainkan pondasi utama seluruh rantai makanan dan kelestarian ekosistem dunia!"
            },
            conceptCards: [
                {
                    icon: "🌾",
                    title: "Produsen Makanan",
                    color: "#10b981",
                    desc: "Tumbuhan dimakan hewan herbivora (seperti sapi & kelinci), lalu hewan karnivora dan manusia memakan keduanya."
                },
                {
                    icon: "🌡️",
                    title: "Penyerap Emisi CO₂",
                    color: "#14b8a6",
                    desc: "Hutan dan kebun menyerap milyaran ton gas karbon dioksida dari atmosfer, mencegah bumi dari pemanasan global."
                },
                {
                    icon: "🌽",
                    title: "Pangan & Sandang",
                    color: "#f59e0b",
                    desc: "Beras, jagung, sayur, buah apel, kain katun untuk baju, hingga kayu perabot semuanya adalah hasil fotosintesis."
                }
            ],
            questions: [
                {
                    question: "Apakah kedudukan tumbuhan hijau di dalam rantai makanan sebuah ekosistem alam?",
                    options: [
                        { id: "A", text: "Sebagai produsen utama penyedia energi makanan bagi makhluk hidup lain" },
                        { id: "B", text: "Sebagai konsumen puncak pemangsa hewan lain" },
                        { id: "C", text: "Sebagai pengurai sampah anorganik" },
                        { id: "D", text: "Sebagai pemakan bangkai" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Tumbuhan adalah produsen tingkat pertama yang menopang kehidupan seluruh makhluk hidup di atasnya!",
                    feedbackCorrect: "Luar biasa! Tumbuhan adalah produsen utama yang menjadi sumber energi awal seluruh rantai makanan."
                },
                {
                    question: "Bagaimana cara hutan dan pohon-pohon hijau membantu mengurangi pemanasan global di bumi?",
                    options: [
                        { id: "A", text: "Menyerap gas Karbon Dioksida (CO₂) dari atmosfer untuk fotosintesis" },
                        { id: "B", text: "Menutupi sinar matahari dengan terpal" },
                        { id: "C", text: "Mendinginkan air laut dengan daun" },
                        { id: "D", text: "Membendung angin badai kutub" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Tumbuhan menyedot gas Karbon Dioksida (gas rumah kaca penyebab panas) untuk diubah menjadi biomassa!",
                    feedbackCorrect: "Tepat sekali! Tanaman menyerap CO₂ dari atmosfer sehingga membantu menjaga suhu bumi tetap seimbang."
                },
                {
                    question: "Manakah contoh kebutuhan hidup manusia sehari-hari yang merupakan produk dari fotosintesis?",
                    options: [
                        { id: "A", text: "Nasi, sayur bayam, buah-buahan, dan kaos katun" },
                        { id: "B", text: "Paku besi, seng atap, dan semen semenan" },
                        { id: "C", text: "Kaca jendela dan kabel tembaga" },
                        { id: "D", text: "Batu bata merah dan baterai aki" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Makanan pokok nabati dan kain katun dibuat dari bagian tanaman yang tumbuh lewat fotosintesis!",
                    feedbackCorrect: "Pintar! Bahan makanan nabati dan pakaian berbahan serat katun semuanya berakar dari fotosintesis tumbuhan."
                }
            ]
        },
        {
            id: 8,
            title: "Tantangan Simulator",
            icon: "🔬",
            desc: "Atur kondisi lingkungan dan amati pengaruhnya terhadap fotosintesis!",
            xp: 50,
            has3D: true,
            isSimulasiLink: true,
            summaryCard: {
                icon: "🔬",
                title: "Uji Coba Laboratorium Sains 3D",
                desc: "Saatnya membuktikan seluruh teorimu! Atur cuaca, suhu, air, dan intensitas cahaya matahari di simulator virtual."
            },
            conceptCards: [
                {
                    icon: "☀️",
                    title: "Cahaya & Sudut",
                    color: "#f59e0b",
                    desc: "Matahari terang mempercepat reaksi foton klorofil. Sedangkan kabut asap tebal menghalangi cahaya matahari sampai ke daun."
                },
                {
                    icon: "🌧️",
                    title: "Ketersediaan Air",
                    color: "#0284c7",
                    desc: "Hujan yang cukup menyuplai molekul H₂O ke sel mesofil. Jika tanah terlalu kering, stomata akan menutup rapat."
                },
                {
                    icon: "🌡️",
                    title: "Suhu Ideal (25-30°C)",
                    color: "#10b981",
                    desc: "Enzim fotosintesis bekerja paling aktif pada suhu sejuk bersahabat. Suhu ekstrem beku atau panas merusak kerja sel."
                }
            ],
            questions: [
                {
                    question: "Berdasarkan percobaan di laboratorium simulasi, kondisi apakah yang paling optimal bagi laju fotosintesis?",
                    options: [
                        { id: "A", text: "Cahaya matahari terang, air cukup, suhu sejuk normal (25-30°C), dan udara bersih tanpa asap" },
                        { id: "B", text: "Malam gelap gulita tanpa setetes air pun" },
                        { id: "C", text: "Suhu mendidih 45°C dengan kabut asap tebal" },
                        { id: "D", text: "Badai es ekstrem di bawah 0°C" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Fotosintesis maksimal membutuhkan foton cahaya cerah, air yang cukup, suhu sejuk 25-30°C, dan tanpa polusi asap!",
                    feedbackCorrect: "Sempurna! Kombinasi cahaya cerah, air cukup, suhu ideal, dan udara bersih menghasilkan laju fotosintesis tercepat."
                },
                {
                    question: "Mengapa kabut asap polusi yang tebal dapat menurunkan laju fotosintesis pada daun?",
                    options: [
                        { id: "A", text: "Karena partikel asap menghalangi sinar matahari dan menyumbat lubang stomata daun" },
                        { id: "B", text: "Karena asap membuat daun terasa manis" },
                        { id: "C", text: "Karena asap memberi terlalu banyak pupuk" },
                        { id: "D", text: "Karena daun menyukai udara berasap" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Asap menghalangi sinar matahari dan partikel debunya menutupi pori-pori stomata daun!",
                    feedbackCorrect: "Tepat sekali! Asap polusi meredupkan cahaya dan menyumbat pertukaran gas pada stomata."
                },
                {
                    question: "Selamat telah menuntaskan seluruh 8 Misi! Sikap mulia apakah yang harus kita lakukan terhadap tumbuhan hijau?",
                    options: [
                        { id: "A", text: "Merawat, menyiram, dan menanam pohon hijau agar lingkungan kita kaya akan oksigen segar" },
                        { id: "B", text: "Menebang semua pepohonan di halaman sekolah" },
                        { id: "C", text: "Merusak dan menginjak tanaman di taman" },
                        { id: "D", text: "Menyiram tanaman dengan air sabun deterjen" }
                    ],
                    correctId: "A",
                    feedbackWrong: "Belum tepat. Merawat dan menanam pepohonan hijau adalah cara terbaik menjaga bumi tetap asri dan sejuk!",
                    feedbackCorrect: "Luar Biasa Juara! Kamu resmi bergelar Ahli Fotosintesis Cilik dan Sahabat Bumi Kebanggaan!"
                }
            ]
        }
    ];

    // Helper Status Level
    const getLevelStatus = (levelId) => {
        const prog = store.state.progress || {};
        const completed = prog.completedLevels || [];
        const unlocked = prog.unlockedLevel || 1;

        if (completed.includes(levelId)) return 'completed';
        if (levelId <= unlocked) return 'active';
        return 'locked';
    };

    const getStats = () => {
        const prog = store.state.progress || {};
        const completed = prog.completedLevels || [];
        const xp = prog.xp || 0;
        const count = completed.length;
        const currentLvl = prog.unlockedLevel || 1;
        return { completed, xp, count, currentLvl };
    };

    let activeLevel = levelsData[0]; // Default Level 1
    let currentQuizIndex = 0;

    container.innerHTML = `
        <!-- Top App Bar Navigation -->
        <header style="background: white; border-bottom: 2px solid #e2e8f0; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 30; flex-shrink: 0; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <button id="btn-back" class="btn btn-secondary" style="padding: 8px 14px; border-radius: 12px; font-weight: 700; gap: 6px;">
                    <i data-lucide="arrow-left"></i> Menu Utama
                </button>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.5rem;">🌻</span>
                    <div>
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--primary-dark); font-weight: 800; line-height: 1.2;">Materi & Eksplorasi</h3>
                        <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Media Interaktif Siswa SD Kelas 4</span>
                    </div>
                </div>
            </div>

            <!-- Segmented Switcher Header -->
            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 14px; border: 1.5px solid #cbd5e1; gap: 4px;">
                <button id="tab-btn-missions" class="tab-pill active" style="padding: 8px 18px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 6px; background: var(--primary); color: white; transition: all 0.2s;">
                    🗺️ 8 Misi Belajar
                </button>
                <button id="tab-btn-3d" class="tab-pill" style="padding: 8px 18px; border-radius: 10px; border: none; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 6px; background: transparent; color: var(--text-main); transition: all 0.2s;">
                    🌻 Eksplorasi 3D & Tombol
                </button>
            </div>

            <!-- XP & Progress Badge -->
            <div style="display: flex; align-items: center; gap: 8px;">
                <!-- Master Audio Toggle Button -->
                <button id="btn-master-audio-materi" class="btn-master-audio" style="width: 36px; height: 36px; border-radius: 12px;" title="Suara Master (Musik & Efek Suara)">
                    <i data-lucide="volume-2" style="width: 18px; height: 18px;"></i>
                </button>
                <button id="btn-guide-materi" class="btn" style="background: #fef08a; color: #854d0e; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 0.85rem; border: 1.5px solid #facc15; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
                    📖 Petunjuk
                </button>
                <div id="badge-xp" style="background: #fef3c7; border: 1.5px solid #fde68a; padding: 6px 14px; border-radius: 20px; display: flex; align-items: center; gap: 6px; color: #b45309; font-weight: 800; font-size: 0.88rem;">
                    ⭐ ${getStats().xp} XP
                </div>
                <div id="badge-lvl" style="background: #dcfce7; border: 1.5px solid #bbf7d0; padding: 6px 14px; border-radius: 20px; display: flex; align-items: center; gap: 6px; color: #15803d; font-weight: 800; font-size: 0.88rem;">
                    🏆 Level ${getStats().currentLvl} (${getStats().count}/8 Selesai)
                </div>
            </div>
        </header>

        <!-- View Body Container -->
        <div id="materi-body" style="flex: 1; position: relative; overflow: hidden; display: flex;">
            
            <!-- PANEL 1: Peta 8 Misi Pembelajaran -->
            <div id="panel-missions" style="flex: 1; overflow-y: auto; padding: clamp(16px, 3vw, 32px); max-width: 1200px; margin: 0 auto; width: 100%;">
                
                <!-- Hero Header Misi -->
                <div style="margin-bottom: 24px; text-align: left;">
                    <h2 style="font-size: clamp(1.4rem, 2.5vw, 1.85rem); color: var(--primary-dark); font-weight: 800; margin-bottom: 6px;">
                        🗺️ Peta Petualangan Belajar Fotosintesis
                    </h2>
                    <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;">
                        Pilih level yang terbuka, pelajari materinya, dan <strong>kerjakan soal-soal kuis</strong> untuk membuka petualangan berikutnya!
                    </p>
                </div>

                <!-- Mission Grid Container -->
                <div class="mission-grid" id="missions-grid-container"></div>
            </div>

            <!-- PANEL 2: Tampilan Detail Level (Duplikasi Persis Screenshot Gambar Pengguna) -->
            <div id="panel-level-detail" style="flex: 1; display: none; flex-direction: column; height: 100%; overflow: hidden; background: #f0fdf4;">
                <!-- Container Konten Detail Level yang di-render secara dinamis -->
                <div id="level-detail-content-wrapper" style="flex: 1; display: flex; flex-direction: column; height: 100%; overflow-y: auto;"></div>
            </div>

            <!-- PANEL 3: Eksplorasi 3D (Dengan Titik Tombol Putih & Kontrol) -->
            <div id="panel-3d" style="flex: 1; display: none; width: 100%; height: 100%; position: relative;">
                
                <!-- Desktop Sidebar Controls -->
                <div id="materi-sidebar" class="sidebar-panel">
                    <div class="sidebar-header">
                        <button id="btn-back-sidebar" class="btn btn-secondary" style="padding: 8px 14px; border-radius: 10px;">
                            <i data-lucide="arrow-left"></i> <span id="label-btn-back-sidebar">Kembali ke Materi</span>
                        </button>
                        <h3 style="margin-left: 10px;">Eksplorasi 3D</h3>
                    </div>
                    
                    <div class="sidebar-content" id="info-content">
                        <div style="text-align: center; padding: 30px 16px; color: var(--text-muted);">
                            <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🎯</span>
                            <h4 style="color: var(--primary-dark); font-weight: 800;">Pencet Titik Tombol di Model 3D</h4>
                            <p style="font-size: 0.9rem; margin-top: 10px; line-height: 1.5;">
                                Model 3D ini dilengkapi <strong>titik tombol bulat putih</strong> yang bersih. Sentuh salah satu tombol untuk memunculkan penjelasan rahasia fotosintesis!
                            </p>
                            <div style="margin-top: 20px; padding: 14px; background: #ecfdf5; border-radius: 12px; color: #047857; font-size: 0.88rem; text-align: left; border: 1.5px solid #a7f3d0;">
                                💡 <strong>Petunjuk:</strong> Klik pada titik tombol <strong>Daun</strong> untuk membelah dan masuk ke dalam sel mesofil!
                            </div>
                        </div>
                    </div>

                    <!-- Tombol Aksi Bawah Sidebar -->
                    <div style="margin-top: auto; padding-top: 15px; border-top: 1px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 8px;">
                        <button id="btn-toggle-hotspots" class="btn btn-secondary" style="width: 100%; justify-content: center; font-size: 0.88rem; padding: 10px;">
                            <i data-lucide="target"></i> <span id="label-hotspots">Sembunyikan Titik Tombol</span>
                        </button>
                        <button id="btn-toggle-procedural" class="btn btn-secondary" style="width: 100%; justify-content: center; font-size: 0.88rem; padding: 10px;">
                            <i data-lucide="layers"></i> Model Jaringan Daun 3D
                        </button>
                        <button id="btn-reset-cam" class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 0.88rem; padding: 10px;">
                            <i data-lucide="refresh-cw"></i> Reset Tampilan
                        </button>
                    </div>
                </div>

                <!-- 3D Canvas Viewport -->
                <div id="canvas-wrapper" style="flex: 1; position: relative; height: 100%; overflow: hidden;">
                    <div id="three-container" style="width: 100%; height: 100%;"></div>

                    <!-- Clue Overlay Terapung -->
                    <div style="position: absolute; top: 16px; left: 16px; z-index: 15; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); padding: 8px 14px; border-radius: 12px; border: 1.5px solid #86efac; box-shadow: 0 4px 15px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 8px; pointer-events: none;">
                        <span style="font-size: 1.2rem;">👆</span>
                        <span style="font-size: 0.82rem; font-weight: 700; color: var(--primary-dark);">
                            Sentuh titik tombol putih bulat atau geser untuk memutar
                        </span>
                    </div>

                    <!-- Mobile Bottom Sheet -->
                    <div id="mobile-bottom-sheet" class="mobile-bottom-sheet collapsed">
                        <div class="sheet-handle-bar" id="sheet-handle"></div>
                        <div style="padding: 10px 16px 6px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.06);">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 1.3rem;" id="mobile-icon">🍃</span>
                                <div>
                                    <h4 id="mobile-title" style="margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--primary-dark);">Pencet Bagian 3D</h4>
                                    <span id="mobile-subtitle" style="font-size: 0.72rem; color: var(--text-muted);">Sentuh titik tombol berdenyut di model</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <button id="btn-speak-mobile" class="btn" style="padding: 6px 10px; background: rgba(34, 197, 94, 0.15); color: var(--primary-dark); font-size: 0.8rem; border-radius: 8px;">
                                    <i data-lucide="volume-2" style="width: 16px; height: 16px;"></i>
                                </button>
                                <button id="btn-sheet-toggle" class="btn" style="padding: 6px 8px; background: #f1f5f9; color: var(--text-main); font-size: 0.8rem; border-radius: 8px;">
                                    <i data-lucide="chevron-up" id="sheet-toggle-icon" style="width: 16px; height: 16px;"></i>
                                </button>
                            </div>
                        </div>
                        <div id="mobile-body-content" style="padding: 12px 16px 20px 16px; overflow-y: auto; flex: 1;">
                            <p id="mobile-desc" style="font-size: 0.9rem; line-height: 1.5; color: var(--text-main); margin-bottom: 12px;">Sentuh salah satu bagian tanaman pada model 3D di atas.</p>
                            <div id="mobile-extra-content"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- MODAL KUIS & PENJELASAN DENGAN BACKGROUND BLUR -->
        <div id="explanation-modal" class="modal-backdrop-blur" style="display: none;">
            <div class="modal-dialog-large">
                <button id="modal-btn-close" class="modal-close-btn" aria-label="Tutup">✕</button>
                
                <!-- Avatar Emoji Kartun -->
                <div class="modal-avatar" id="modal-avatar">🌻</div>

                <!-- Subtitle / Badge Level & Soal -->
                <div style="display: inline-block; padding: 4px 14px; background: #fef3c7; color: #b45309; font-weight: 800; font-size: 0.82rem; border-radius: 20px; margin-bottom: 8px; border: 1px solid #fde68a;" id="modal-badge">
                    LEVEL 1 • SOAL 1 DARI 3
                </div>

                <!-- Main Title -->
                <h2 id="modal-title" style="font-size: clamp(1.25rem, 2.3vw, 1.7rem); font-weight: 900; color: var(--text-main); margin: 0 0 10px 0;">
                    Kenali Tumbuhan
                </h2>

                <!-- Rounded Inner Clue Box -->
                <div class="modal-inner-box">
                    <h4 id="modal-clue-header">
                        💡 Petunjuk:
                    </h4>
                    <p id="modal-clue-text">
                        Pelajari materi dan pilih jawaban yang paling tepat.
                    </p>
                </div>

                <!-- Interactive Question & Options Area -->
                <div id="modal-interactive-area" style="margin-bottom: 18px; display: none;"></div>

                <!-- Action Controls -->
                <div id="modal-actions-container" style="display: flex; flex-direction: column; gap: 10px; align-items: center; justify-content: center; margin-top: 16px;">
                    <button id="modal-primary-action" class="modal-btn-action">
                        <i data-lucide="check"></i> MENGERTI
                    </button>
                    
                    <div id="modal-secondary-actions" style="display: flex; gap: 8px; width: 100%; max-width: 400px;">
                        <button id="modal-btn-speak" class="btn" style="flex: 1; background: #f1f5f9; color: var(--primary-dark); font-weight: 700; border-radius: 12px; padding: 10px; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <i data-lucide="volume-2" style="width: 16px; height: 16px;"></i> Suara
                        </button>
                        <button id="modal-btn-dismiss" class="btn" style="flex: 1; background: #f1f5f9; color: var(--text-muted); font-weight: 700; border-radius: 12px; padding: 10px; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            Tutup
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;

    // References
    const tabBtnMissions = container.querySelector('#tab-btn-missions');
    const tabBtn3D = container.querySelector('#tab-btn-3d');
    const panelMissions = container.querySelector('#panel-missions');
    const panelLevelDetail = container.querySelector('#panel-level-detail');
    const levelDetailContentWrapper = container.querySelector('#level-detail-content-wrapper');
    const panel3D = container.querySelector('#panel-3d');
    const missionsGridContainer = container.querySelector('#missions-grid-container');

    const badgeXp = container.querySelector('#badge-xp');
    const badgeLvl = container.querySelector('#badge-lvl');

    const modalBackdrop = container.querySelector('#explanation-modal');
    const modalAvatar = container.querySelector('#modal-avatar');
    const modalBadge = container.querySelector('#modal-badge');
    const modalTitle = container.querySelector('#modal-title');
    const modalClueHeader = container.querySelector('#modal-clue-header');
    const modalClueText = container.querySelector('#modal-clue-text');
    const modalInteractiveArea = container.querySelector('#modal-interactive-area');
    const modalPrimaryAction = container.querySelector('#modal-primary-action');
    const modalSecondaryActions = container.querySelector('#modal-secondary-actions');
    const modalBtnSpeak = container.querySelector('#modal-btn-speak');
    const modalBtnDismiss = container.querySelector('#modal-btn-dismiss');
    const modalBtnClose = container.querySelector('#modal-btn-close');

    const infoContent = container.querySelector('#info-content');
    const mobileSheet = container.querySelector('#mobile-bottom-sheet');
    const mobileTitle = container.querySelector('#mobile-title');
    const mobileSubtitle = container.querySelector('#mobile-subtitle');
    const mobileDesc = container.querySelector('#mobile-desc');
    const mobileExtra = container.querySelector('#mobile-extra-content');
    const sheetToggleIcon = container.querySelector('#sheet-toggle-icon');
    const btnSpeakMobile = container.querySelector('#btn-speak-mobile');

    let currentSpeechText = "";
    let isProceduralMode = false;
    let sceneManager = null;
    let threeInitialized = false;

    // Render Grid 8 Misi di Peta Belajar
    const renderMissionsGrid = () => {
        const stats = getStats();
        badgeXp.innerHTML = `⭐ ${stats.xp} XP`;
        badgeLvl.innerHTML = `🏆 Level ${stats.currentLvl} (${stats.count}/8 Selesai)`;

        missionsGridContainer.innerHTML = levelsData.map(m => {
            const status = getLevelStatus(m.id);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            const isLocked = status === 'locked';

            return `
                <div class="mission-card ${isActive ? 'active-mission' : ''} ${isLocked ? 'locked-card' : ''}" 
                     data-mission-id="${m.id}" 
                     role="button" 
                     tabindex="0"
                     style="${isLocked ? 'opacity: 0.75; border-color: #cbd5e1; background: #f8fafc;' : ''}">
                    <!-- Card Header -->
                    <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                        <div class="mission-number-circle ${status}">
                            ${isCompleted ? '✔' : m.id}
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: ${isLocked ? '#64748b' : 'var(--text-main)'}; display: flex; align-items: center; gap: 6px; line-height: 1.3;">
                                <span>${m.icon}</span> ${m.title}
                            </h4>
                        </div>
                    </div>

                    <!-- Card Description -->
                    <p style="font-size: 0.88rem; line-height: 1.5; color: var(--text-muted); margin: 0 0 18px 0; flex: 1;">
                        ${m.desc}
                    </p>

                    <!-- Card Footer -->
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid #f1f5f9;">
                        <span class="mission-badge-xp" style="${isLocked ? 'color: #94a3b8;' : ''}">
                            ⭐ +${m.xp} XP
                        </span>

                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${m.has3D ? `<span class="mission-badge-3d" style="${isLocked ? 'background: #94a3b8;' : ''}">🌿 3D</span>` : ''}

                            ${isCompleted ? `
                                <div style="width: 26px; height: 26px; border-radius: 6px; background: #22c55e; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 900;" title="Selesai">
                                    ✔
                                </div>
                            ` : isActive ? `
                                <div style="width: 26px; height: 26px; border-radius: 6px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;" title="Mulai Belajar">
                                    🔓
                                </div>
                            ` : `
                                <div style="width: 26px; height: 26px; border-radius: 6px; background: #e2e8f0; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;" title="Terkunci - Kerjakan level sebelumnya">
                                    🔒
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Klik Card Misi -> Buka Detail Level jika Terbuka
        missionsGridContainer.querySelectorAll('.mission-card').forEach(card => {
            card.addEventListener('click', () => {
                const mId = parseInt(card.dataset.missionId);
                const level = levelsData.find(l => l.id === mId);
                if (!level) return;

                const status = getLevelStatus(level.id);

                if (status === 'locked') {
                    showModal({
                        avatar: '🔒',
                        badge: `LEVEL ${level.id} MASIH TERKUNCI`,
                        title: 'Level Ini Belum Terbuka!',
                        clueHeader: '💡 Syarat Melanjutkan Petualangan:',
                        clueText: `Kamu harus mempelajari materi dan <strong>mengerjakan soal kuis pada Level ${level.id - 1}</strong> terlebih dahulu untuk membuka level ini!`,
                        actionHtml: `<i data-lucide="arrow-left-circle"></i> KERJAKAN LEVEL ${level.id - 1}`,
                        onAction: () => {
                            hideModal();
                            const prevLevel = levelsData.find(l => l.id === level.id - 1);
                            if (prevLevel) openLevelDetail(prevLevel);
                        }
                    });
                    return;
                }

                // Buka Tampilan Detail Level (Duplikasi Persis Screenshot)
                openLevelDetail(level);
            });
        });

        if (window.lucide) window.lucide.createIcons();
    };

    // =========================================================================
    // RENDER TAMPILAN DETAIL LEVEL (DUPLIKASI PERSIS SCREENSHOT USER)
    // =========================================================================
    const openLevelDetail = (level) => {
        activeLevel = level;
        currentQuizIndex = 0;

        // Header Sub-bar: [← PETA MISI]  Misi X  [Nama Level]  [+XP XP]
        // Sub-tabs: 📖 Materi | 🌻 Model 3D
        // Kotak Ringkasan Mint: [Icon] [Judul Ringkasan] [Teks Ringkasan]
        // Kartu-kartu Konsep: Grid Card (Top border warna-warni, Icon, Judul, Isi)
        // Tombol Bawah: 🎯 MULAI KUIS LEVEL X
        const summary = level.summaryCard || {
            icon: level.icon,
            title: level.title,
            desc: level.desc
        };

        const cards = level.conceptCards || [];

        levelDetailContentWrapper.innerHTML = `
            <!-- Header Bar Detail Level (Sesuai Screenshot Gambar) -->
            <div style="background: white; border-bottom: 2px solid #e2e8f0; padding: 12px clamp(14px, 3vw, 28px); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
                <!-- Sisi Kiri: Tombol Kembali ke Peta Misi & Judul Misi -->
                <div style="display: flex; align-items: center; gap: clamp(10px, 2vw, 18px); flex-wrap: wrap;">
                    <button id="btn-back-to-peta" class="btn" style="background: #e6fcf5; color: #047857; border: 1.5px solid #a7f3d0; padding: 8px 18px; border-radius: 24px; font-weight: 800; font-size: 0.92rem; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s;">
                        ← PETA MISI
                    </button>

                    <div style="display: flex; flex-direction: column;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="background: #d1fae5; color: #065f46; font-size: 0.76rem; font-weight: 800; padding: 2px 10px; border-radius: 20px;">
                                Misi ${level.id}
                            </span>
                        </div>
                        <h2 style="margin: 2px 0 0 0; font-size: clamp(1.15rem, 2vw, 1.4rem); font-weight: 900; color: #047857; line-height: 1.2;">
                            ${level.title}
                        </h2>
                    </div>
                </div>

                <!-- Sisi Kanan: Golden XP Badge -->
                <div style="background: #f59e0b; color: white; font-weight: 900; font-size: 0.95rem; padding: 6px 18px; border-radius: 24px; box-shadow: 0 3px 8px rgba(245, 158, 11, 0.35); flex-shrink: 0;">
                    +${level.xp} XP
                </div>
            </div>

            <!-- Sub-tab Bar: 📖 Materi vs 🌻 Model 3D -->
            <div style="display: flex; border-bottom: 2px solid #e2e8f0; background: #e6f7ef; flex-shrink: 0;">
                <button id="subtab-materi" style="flex: 1; text-align: center; padding: 12px 16px; border: none; border-bottom: 3.5px solid #10b981; background: white; font-weight: 800; font-size: 0.95rem; color: #047857; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    📖 Materi
                </button>
                <button id="subtab-3d" style="flex: 1; text-align: center; padding: 12px 16px; border: none; border-bottom: 3.5px solid transparent; background: transparent; font-weight: 700; font-size: 0.95rem; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                    🌻 Model 3D
                </button>
            </div>

            <!-- Area Isi Materi Berwarna Mint Soft -->
            <div style="flex: 1; overflow-y: auto; padding: clamp(16px, 3.5vw, 36px); max-width: 1140px; margin: 0 auto; width: 100%; box-sizing: border-box;">
                
                <!-- Kotak Ringkasan Atas (Mint Rounded Box Persis Gambar Pengguna) -->
                <div style="background: #ecfdf5; border: 1.5px solid #a7f3d0; border-radius: 20px; padding: clamp(16px, 2.5vw, 24px); display: flex; align-items: center; gap: clamp(14px, 2.5vw, 24px); margin-bottom: 24px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.06);">
                    <div style="font-size: clamp(2.4rem, 4vw, 3.4rem); line-height: 1; flex-shrink: 0;">
                        ${summary.icon}
                    </div>
                    <div>
                        <h3 style="margin: 0 0 6px 0; color: #047857; font-size: clamp(1.15rem, 2vw, 1.35rem); font-weight: 800; line-height: 1.25;">
                            ${summary.title}
                        </h3>
                        <p style="margin: 0; color: #334155; font-size: clamp(0.88rem, 1.6vw, 0.98rem); line-height: 1.55;">
                            ${summary.desc}
                        </p>
                    </div>
                </div>

                <!-- Baris / Grid Kartu-Kartu Konsep (Persis 4 Card di Gambar Pengguna) -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 32px;">
                    ${cards.map(c => `
                        <div style="background: white; border-radius: 18px; border: 1.5px solid #e2e8f0; border-top: 6px solid ${c.color}; padding: 22px 18px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
                            <div style="font-size: 2.2rem; margin-bottom: 12px; line-height: 1;">
                                ${c.icon}
                            </div>
                            <h4 style="margin: 0 0 10px 0; font-size: 1.15rem; font-weight: 800; color: ${c.color};">
                                ${c.title}
                            </h4>
                            <p style="margin: 0; font-size: 0.9rem; line-height: 1.55; color: #475569; flex: 1;">
                                ${c.desc}
                            </p>
                        </div>
                    `).join('')}
                </div>

                <!-- Tombol Aksi Kuis Utama di Bagian Bawah (Sesuai Gambar Pengguna) -->
                <div style="display: flex; justify-content: center; padding: 10px 0 30px 0;">
                    <button id="btn-start-quiz-action" class="btn" style="background: #059669; color: white; font-weight: 800; font-size: clamp(1rem, 2vw, 1.2rem); padding: 15px clamp(28px, 5vw, 48px); border-radius: 36px; border: none; box-shadow: 0 8px 24px rgba(5, 150, 105, 0.35); cursor: pointer; display: inline-flex; align-items: center; gap: 10px; transition: all 0.2s; letter-spacing: 0.5px;">
                        🎯 MULAI KUIS LEVEL ${level.id}
                    </button>
                </div>

            </div>
        `;

        // Switch Panel Display
        panelMissions.style.display = 'none';
        panel3D.style.display = 'none';
        panelLevelDetail.style.display = 'flex';

        // Update Label Back Button Sidebar
        const labelBackSidebar = container.querySelector('#label-btn-back-sidebar');
        if (labelBackSidebar) {
            labelBackSidebar.innerText = `Kembali ke Level ${level.id}`;
        }

        // Event: Tombol ← PETA MISI
        const btnBackToPeta = levelDetailContentWrapper.querySelector('#btn-back-to-peta');
        if (btnBackToPeta) {
            btnBackToPeta.addEventListener('click', () => {
                panelLevelDetail.style.display = 'none';
                panel3D.style.display = 'none';
                panelMissions.style.display = 'block';
                renderMissionsGrid();
            });
        }

        // Event: Subtab 🌻 Model 3D
        const subtab3D = levelDetailContentWrapper.querySelector('#subtab-3d');
        if (subtab3D) {
            subtab3D.addEventListener('click', () => {
                open3DLevel(level);
            });
        }

        // Event: Tombol 🎯 MULAI KUIS LEVEL X
        const btnStartQuiz = levelDetailContentWrapper.querySelector('#btn-start-quiz-action');
        if (btnStartQuiz) {
            btnStartQuiz.addEventListener('click', () => {
                startLevelQuiz(level);
            });
        }

        if (window.lucide) window.lucide.createIcons();
    };

    // =========================================================================
    // MULTI-SOAL KUIS PER LEVEL (SESUAI DENGAN MATERI & BUKAN CUMA 1 SOAL)
    // =========================================================================
    const startLevelQuiz = (level) => {
        currentQuizIndex = 0;
        showQuizQuestion(level, currentQuizIndex);
    };

    const showQuizQuestion = (level, qIndex) => {
        const questions = level.questions || [];
        if (qIndex >= questions.length) {
            // Semua soal pada level ini telah selesai!
            handleLevelComplete(level);
            return;
        }

        const q = questions[qIndex];
        const totalQ = questions.length;

        // Render Opsi Jawaban Kuis Interaktif
        let interactiveHtml = `
            <div style="background: #f8fafc; border-radius: 18px; padding: clamp(14px, 2.5vw, 20px); border: 1.5px solid #e2e8f0; margin-top: 10px; text-align: left;">
                <!-- Header Status Soal & Bar Progres -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 10px; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 0.82rem; font-weight: 800; color: #047857; background: #dcfce7; padding: 4px 12px; border-radius: 20px;">
                            SOAL ${qIndex + 1} DARI ${totalQ}
                        </span>
                        <span style="font-size: 0.82rem; font-weight: 700; color: #64748b;">
                            Level ${level.id}
                        </span>
                    </div>
                    <span style="font-size: 0.82rem; font-weight: 800; color: #d97706; background: #fef3c7; padding: 4px 12px; border-radius: 20px;">
                        ⭐ Hadiah: +${level.xp} XP
                    </span>
                </div>

                <!-- Visual Question Progress Indicators -->
                <div style="display: flex; gap: 6px; margin-bottom: 16px;">
                    ${questions.map((_, idx) => `
                        <div style="flex: 1; height: 6px; border-radius: 4px; background: ${idx < qIndex ? '#22c55e' : (idx === qIndex ? '#10b981' : '#e2e8f0')}; transition: all 0.3s;"></div>
                    `).join('')}
                </div>

                <!-- Teks Soal -->
                <p style="font-size: clamp(0.95rem, 1.8vw, 1.05rem); font-weight: 800; color: var(--text-main); margin-bottom: 16px; line-height: 1.5;">
                    ${q.question}
                </p>

                <!-- 4 Pilihan Jawaban A, B, C, D -->
                <div style="display: flex; flex-direction: column; gap: 10px;" id="quiz-options-container">
                    ${q.options.map(opt => `
                        <button class="btn-quiz-opt" data-opt-id="${opt.id}" style="text-align: left; padding: 12px 16px; border-radius: 14px; border: 2px solid #cbd5e1; background: white; color: var(--text-main); font-weight: 700; font-size: 0.92rem; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 12px;">
                            <span style="width: 32px; height: 32px; border-radius: 10px; background: #f1f5f9; color: var(--primary-dark); font-weight: 900; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid #cbd5e1;">
                                ${opt.id}
                            </span>
                            <span style="flex: 1; line-height: 1.4;">${opt.text}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        showModal({
            avatar: level.icon,
            badge: `MISI ${level.id} • SOAL ${qIndex + 1} DARI ${totalQ}`,
            title: level.title,
            clueHeader: '💡 Petunjuk Pengerjaan:',
            clueText: `Pilihlah salah satu jawaban yang paling tepat sesuai materi <strong>${level.title}</strong> yang telah kamu pelajari!`,
            interactiveHtml: interactiveHtml,
            onInteractiveBind: (areaEl) => {
                const optButtons = areaEl.querySelectorAll('.btn-quiz-opt');
                optButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const pickedId = btn.dataset.optId;
                        handleAnswerSubmit(level, qIndex, pickedId);
                    });
                });
            },
            actionHtml: '<i data-lucide="help-circle"></i> PILIH JAWABAN DI ATAS',
            onAction: () => {
                // Biarkan siswa memilih jawaban
            }
        });
    };

    // Evaluasi Jawaban Kuis per Soal
    const handleAnswerSubmit = (level, qIndex, chosenId) => {
        const q = level.questions[qIndex];
        const isCorrect = (chosenId === q.correctId);
        const isLastQuestion = (qIndex === level.questions.length - 1);

        if (!isCorrect) {
            playSound('wrong');
            // Tampilan Popup "Belum Tepat, Yuk Coba Lagi! 😊"
            showModal({
                avatar: '🤔',
                badge: `LEVEL ${level.id} • SOAL ${qIndex + 1} DARI ${level.questions.length}`,
                title: 'Belum Tepat, Yuk Coba Lagi! 😊',
                clueHeader: '💡 Petunjuk:',
                clueText: q.feedbackWrong,
                actionHtml: '<i data-lucide="refresh-cw"></i> COBA LAGI',
                onAction: () => {
                    // Coba lagi pada soal yang sama
                    showQuizQuestion(level, qIndex);
                }
            });
        } else {
            // Jawaban Benar!
            playSound('correct');
            if (!isLastQuestion) {
                // Ada soal berikutnya di level ini
                showModal({
                    avatar: '🎉',
                    badge: `SOAL ${qIndex + 1} SELESAI!`,
                    title: 'Hebat, Jawabanmu Benar!',
                    clueHeader: '💡 Penjelasan:',
                    clueText: `<strong>${q.feedbackCorrect}</strong><br><br>✨ Bersiaplah untuk <strong>Soal ${qIndex + 2} dari ${level.questions.length}</strong>!`,
                    actionHtml: `<i data-lucide="arrow-right"></i> LANJUT KE SOAL ${qIndex + 2}`,
                    onAction: () => {
                        showQuizQuestion(level, qIndex + 1);
                    }
                });
            } else {
                // Soal terakhir tuntas -> Level Selesai!
                handleLevelComplete(level);
            }
        }
    };

    // Callback saat Seluruh Soal dalam Level Selesai Dikerjakan dengan Benar
    const handleLevelComplete = (level) => {
        playSound('win');
        store.completeLevel(level.id, level.xp);
        renderMissionsGrid();

        const nextLvl = levelsData.find(l => l.id === level.id + 1);

        showModal({
            avatar: '🏆',
            badge: `MISI LEVEL ${level.id} SELESAI!`,
            title: 'Luar Biasa, Kamu Berhasil!',
            clueHeader: '🎉 Hadiah XP & Level Terbuka:',
            clueText: `Selamat! Kamu telah berhasil menuntaskan seluruh soal pada <strong>Misi ${level.id}: ${level.title}</strong>!<br><br>Kamu mendapatkan <strong>+${level.xp} XP</strong> ${nextLvl ? `dan berhasil membuka <strong>Level ${nextLvl.id}: ${nextLvl.title}</strong>!` : 'dan telah menyelesaikan seluruh petualangan!' }`,
            actionHtml: nextLvl ? `<i data-lucide="unlock"></i> BUKA LEVEL ${nextLvl.id}: ${nextLvl.title}` : '<i data-lucide="award"></i> KEMBALI KE PETA MISI',
            onAction: () => {
                hideModal();
                if (nextLvl) {
                    openLevelDetail(nextLvl);
                } else {
                    panelLevelDetail.style.display = 'none';
                    panelMissions.style.display = 'block';
                    renderMissionsGrid();
                }
            }
        });
    };

    // Buka Mode 3D untuk Level Tertentu
    const open3DLevel = (level) => {
        switchTab('3D');
        setTimeout(() => {
            if (sceneManager) {
                sceneManager.onWindowResize();
                if (level.viewMode === 'MESOPHYLL') {
                    sceneManager.showProceduralLeaf();
                    isProceduralMode = true;
                    handleObjectClick('SEL_MESOFIL', null, false);
                } else {
                    sceneManager.resetCamera();
                    isProceduralMode = false;
                    if (level.target3D) {
                        sceneManager.triggerHotspotClick(level.target3D);
                    }
                }
            }
        }, 300);
    };

    // Modal Display Functions (Blurry Backdrop)
    const showModal = (config) => {
        modalAvatar.innerText = config.avatar || '🌻';
        modalBadge.innerText = config.badge || 'MISI PEMBELAJARAN';
        modalTitle.innerText = config.title;
        modalClueHeader.innerHTML = config.clueHeader || '💡 Petunjuk:';
        modalClueText.innerHTML = config.clueText || '';
        currentSpeechText = `${config.title}. ${modalClueText.innerText}`;

        if (config.interactiveHtml) {
            modalInteractiveArea.innerHTML = config.interactiveHtml;
            modalInteractiveArea.style.display = 'block';
            if (config.onInteractiveBind) config.onInteractiveBind(modalInteractiveArea);
        } else {
            modalInteractiveArea.innerHTML = '';
            modalInteractiveArea.style.display = 'none';
        }

        modalPrimaryAction.innerHTML = config.actionHtml || '<i data-lucide="check"></i> MENGERTI';
        modalPrimaryAction.onclick = () => {
            if (config.onAction) {
                config.onAction();
            } else {
                hideModal();
            }
        };

        modalBackdrop.style.display = 'flex';
        if (window.lucide) window.lucide.createIcons();
    };

    const hideModal = () => {
        stopSpeaking();
        modalBackdrop.style.display = 'none';
    };

    modalBtnClose.addEventListener('click', hideModal);
    modalBtnDismiss.addEventListener('click', hideModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) hideModal();
    });
    modalBtnSpeak.addEventListener('click', () => {
        if (currentSpeechText) speakText(currentSpeechText);
    });

    // Navigation Events
    const handleExit = () => {
        stopSpeaking();
        if (sceneManager) sceneManager.destroy();
        router.navigate('/');
    };
    container.querySelector('#btn-back').addEventListener('click', handleExit);
    
    const btnGuideMateri = container.querySelector('#btn-guide-materi');
    if (btnGuideMateri) {
        btnGuideMateri.addEventListener('click', () => {
            showGuideModal('3d');
        });
    }

    const btnAudioMateri = container.querySelector('#btn-master-audio-materi');
    if (btnAudioMateri) {
        attachAudioToggle(btnAudioMateri);
    }

    const btnBackSidebar = container.querySelector('#btn-back-sidebar');
    if (btnBackSidebar) {
        btnBackSidebar.addEventListener('click', () => {
            // Kembali ke panel detail level jika ada activeLevel, atau ke peta misi
            if (activeLevel) {
                switchTab('level-detail');
            } else {
                switchTab('missions');
            }
        });
    }

    // Toggle Tabs
    const switchTab = (tab) => {
        if (tab === 'missions') {
            tabBtnMissions.classList.add('active');
            tabBtnMissions.style.background = 'var(--primary)';
            tabBtnMissions.style.color = 'white';
            tabBtn3D.classList.remove('active');
            tabBtn3D.style.background = 'transparent';
            tabBtn3D.style.color = 'var(--text-main)';

            panelMissions.style.display = 'block';
            panelLevelDetail.style.display = 'none';
            panel3D.style.display = 'none';
            renderMissionsGrid();
        } else if (tab === 'level-detail') {
            tabBtnMissions.classList.add('active');
            tabBtnMissions.style.background = 'var(--primary)';
            tabBtnMissions.style.color = 'white';
            tabBtn3D.classList.remove('active');
            tabBtn3D.style.background = 'transparent';
            tabBtn3D.style.color = 'var(--text-main)';

            panelMissions.style.display = 'none';
            panelLevelDetail.style.display = 'flex';
            panel3D.style.display = 'none';
        } else {
            tabBtn3D.classList.add('active');
            tabBtn3D.style.background = 'var(--primary)';
            tabBtn3D.style.color = 'white';
            tabBtnMissions.classList.remove('active');
            tabBtnMissions.style.background = 'transparent';
            tabBtnMissions.style.color = 'var(--text-main)';

            panelMissions.style.display = 'none';
            panelLevelDetail.style.display = 'none';
            panel3D.style.display = 'flex';

            if (!threeInitialized) {
                init3DScene();
            } else if (sceneManager) {
                setTimeout(() => sceneManager.onWindowResize(), 60);
            }
        }
        if (window.lucide) window.lucide.createIcons();
    };

    tabBtnMissions.addEventListener('click', () => switchTab('missions'));
    tabBtn3D.addEventListener('click', () => switchTab('3D'));

    // Toggle Mobile Sheet Expand/Collapse
    const toggleMobileSheet = (expand = null) => {
        const isCollapsed = mobileSheet.classList.contains('collapsed');
        const shouldExpand = (expand !== null) ? expand : isCollapsed;
        if (shouldExpand) {
            mobileSheet.classList.remove('collapsed');
            sheetToggleIcon.setAttribute('data-lucide', 'chevron-down');
        } else {
            mobileSheet.classList.add('collapsed');
            sheetToggleIcon.setAttribute('data-lucide', 'chevron-up');
        }
        if (window.lucide) window.lucide.createIcons();
    };

    container.querySelector('#sheet-handle').addEventListener('click', () => toggleMobileSheet());
    container.querySelector('#btn-sheet-toggle').addEventListener('click', () => toggleMobileSheet());

    btnSpeakMobile.addEventListener('click', () => {
        if (currentSpeechText) speakText(currentSpeechText);
    });

    // Callback saat objek 3D atau Hotspot diklik
    const handleObjectClick = (objectName, object3D, triggerModal = true) => {
        if (!objectName) {
            infoContent.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                    <span style="font-size: 3rem; display: block; margin-bottom: 12px;">🎯</span>
                    <h4 style="color: var(--primary-dark); font-weight: 800;">Pencet Titik Tombol di Model 3D</h4>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Sentuh titik tombol putih bulat pada bunga, daun, atau akar untuk melihat rahasia fotosintesis.</p>
                </div>
            `;
            mobileTitle.innerText = "Pencet Bagian 3D";
            mobileSubtitle.innerText = "Sentuh titik tombol berdenyut";
            mobileDesc.innerText = "Sentuh salah satu bagian tanaman pada model 3D di atas.";
            mobileExtra.innerHTML = "";
            toggleMobileSheet(false);
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        const isMesophyll = objectName.includes('MESOFIL') || objectName.includes('KLOROPLAS') || objectName.includes('STOMATA') || objectName.includes('PEMBULUH') || objectName.includes('URAT');
        const isLeaf = !isMesophyll && (objectName.includes('LEAF') || objectName.includes('DAUN'));

        if (sceneManager) {
            isProceduralMode = (sceneManager.viewMode === 'MESOPHYLL' || sceneManager.isProceduralMode);
        } else if (isMesophyll) {
            isProceduralMode = true;
        }

        const btnToggleProc = container.querySelector('#btn-toggle-procedural');
        if (btnToggleProc) {
            if (isProceduralMode) {
                btnToggleProc.innerHTML = '<i data-lucide="flower"></i> Kembali ke Model Tanaman';
            } else {
                btnToggleProc.innerHTML = '<i data-lucide="layers"></i> Model Jaringan Daun 3D';
            }
        }

        const data = getInfoByObjectName(objectName) || {
            title: objectName,
            description: "Bagian penting dari tanaman bunga matahari.",
            learningPoint: "Berperan aktif mendukung pertumbuhan tanaman."
        };

        // Render Desktop Sidebar
        infoContent.innerHTML = `
            <div style="animation: fadeIn 0.3s ease-out;">
                <div style="display: inline-block; padding: 4px 10px; background: var(--primary-light); color: var(--primary-dark); font-weight: 800; border-radius: 6px; font-size: 0.8rem; margin-bottom: 10px;">
                    ${isMesophyll ? '🔬 ANATOMI DALAM DAUN' : '🌻 ANATOMI TUMBUHAN'}
                </div>
                <h2 style="color: var(--primary-dark); font-size: 1.6rem; margin-bottom: 10px;">${data.title}</h2>
                <p style="font-size: 0.92rem; line-height: 1.55; margin-bottom: 16px; color: var(--text-main);">${data.description}</p>
                
                <div class="glass-panel" style="background: #ecfdf5; border-left: 4px solid var(--primary); padding: 12px; margin-bottom: 16px; border: 1.5px solid #a7f3d0;">
                    <h4 style="color: #047857; margin-bottom: 4px; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
                        <i data-lucide="lightbulb" style="width: 16px; height: 16px;"></i> Rahasia Sains
                    </h4>
                    <p style="font-size: 0.85rem; color: #1e293b; line-height: 1.45;">${data.learningPoint}</p>
                </div>

                ${isLeaf ? `
                    <button id="btn-split-leaf-sidebar" class="btn btn-secondary" style="width: 100%; margin-bottom: 10px; background: #dcfce7; color: var(--primary-dark); font-weight: 800;">
                        <i data-lucide="scissors"></i> Belah Daun & Intip Sel Mesofil
                    </button>
                ` : isProceduralMode ? `
                    <button id="btn-back-plant-sidebar" class="btn btn-secondary" style="width: 100%; margin-bottom: 10px; background: #fef3c7; color: #92400e; font-weight: 800;">
                        <i data-lucide="flower"></i> Kembali ke Model Tanaman
                    </button>
                ` : ''}

                <div style="display: flex; gap: 8px;">
                    <button id="btn-speak-sidebar" class="btn btn-secondary" style="flex: 1; padding: 8px; font-size: 0.85rem;">
                        <i data-lucide="volume-2" style="width: 16px; height: 16px;"></i> Suara
                    </button>
                    <button id="btn-focus-sidebar" class="btn btn-secondary" style="flex: 1; padding: 8px; font-size: 0.85rem;">
                        <i data-lucide="zoom-in" style="width: 16px; height: 16px;"></i> Fokus Dekat
                    </button>
                </div>
            </div>
        `;

        // Update Mobile Sheet
        mobileTitle.innerText = data.title;
        mobileSubtitle.innerText = isMesophyll ? "Dapur Dalam Daun" : "Organ Tumbuhan";
        mobileDesc.innerText = data.description;
        mobileExtra.innerHTML = `
            <div style="background: #ecfdf5; padding: 10px 12px; border-radius: 10px; border-left: 4px solid var(--primary); font-size: 0.85rem; margin-bottom: 10px;">
                <strong>💡 Rahasia Sains:</strong> ${data.learningPoint}
            </div>
            ${isLeaf ? `
                <button id="btn-split-leaf-mob" class="btn btn-secondary" style="width: 100%; font-size: 0.85rem; margin-bottom: 8px; background: #dcfce7; color: var(--primary-dark); font-weight: 800;">
                    <i data-lucide="scissors"></i> Belah Daun & Intip Sel Mesofil
                </button>
            ` : isProceduralMode ? `
                <button id="btn-back-plant-mob" class="btn btn-secondary" style="width: 100%; font-size: 0.85rem; margin-bottom: 8px; background: #fef3c7; color: #92400e; font-weight: 800;">
                    <i data-lucide="flower"></i> Kembali ke Model Tanaman
                </button>
            ` : ''}
        `;
        toggleMobileSheet(true);

        // Bind Leaf Split
        const bindLeafSplit = (btn) => {
            if (!btn) return;
            btn.onclick = () => {
                if (sceneManager) {
                    sceneManager.setViewMode('MESOPHYLL');
                    handleObjectClick('SEL_MESOFIL', null, true);
                }
            };
        };
        bindLeafSplit(infoContent.querySelector('#btn-split-leaf-sidebar'));
        bindLeafSplit(mobileExtra.querySelector('#btn-split-leaf-mob'));

        // Bind Back to Plant from Sidebar / Mobile
        const bindBackPlant = (btn) => {
            if (!btn) return;
            btn.onclick = () => {
                if (sceneManager) {
                    sceneManager.setViewMode('PLANT');
                    handleObjectClick(null, null, false);
                }
            };
        };
        bindBackPlant(infoContent.querySelector('#btn-back-plant-sidebar'));
        bindBackPlant(mobileExtra.querySelector('#btn-back-plant-mob'));

        const btnSpeakSidebar = infoContent.querySelector('#btn-speak-sidebar');
        if (btnSpeakSidebar) btnSpeakSidebar.onclick = () => speakText(`${data.title}. ${data.description}. ${data.learningPoint}`);
        
        const btnFocusSidebar = infoContent.querySelector('#btn-focus-sidebar');
        if (btnFocusSidebar && object3D) btnFocusSidebar.onclick = () => sceneManager.focusCameraOnObject(object3D);

        // Hanya tampilkan modal penjelasan besar jika dipicu secara eksplisit oleh klik pengguna
        if (triggerModal) {
            let modalActionHtml = '<i data-lucide="check"></i> SAYA MENGERTI';
            let onModalAction = hideModal;

            if (isLeaf && !isProceduralMode) {
                modalActionHtml = '<i data-lucide="scissors"></i> BELAH DAUN & MASUK KE SEL MESOFIL';
                onModalAction = () => {
                    hideModal();
                    if (sceneManager) {
                        sceneManager.setViewMode('MESOPHYLL');
                        handleObjectClick('SEL_MESOFIL', null, true);
                    }
                };
            } else if (isMesophyll || isProceduralMode) {
                modalActionHtml = '<i data-lucide="flower"></i> KEMBALI KE MODEL TANAMAN UTUH';
                onModalAction = () => {
                    hideModal();
                    if (sceneManager) {
                        sceneManager.setViewMode('PLANT');
                        handleObjectClick(null, null, false);
                    }
                };
            }

            showModal({
                avatar: isMesophyll ? '🔬' : isLeaf ? '🍃' : objectName.includes('FLOWER') ? '🌻' : objectName.includes('ROOT') ? '🌱' : '🪵',
                badge: isMesophyll ? 'LEVEL 4 • PROSES DALAM DAUN 3D' : 'LEVEL 1 • ORGAN TUMBUHAN 3D',
                title: data.title,
                clueHeader: '💡 Rahasia Sains Bunga Matahari:',
                clueText: `<strong>${data.description}</strong><br><br>✨ <em>${data.learningPoint}</em>`,
                actionHtml: modalActionHtml,
                onAction: onModalAction
            });
        }

        store.logAction(`explored_part_${objectName}`);
        if (window.lucide) window.lucide.createIcons();
    };

    // Inisialisasi 3D Scene
    const init3DScene = () => {
        if (threeInitialized) return;
        threeInitialized = true;

        const threeContainer = container.querySelector('#three-container');
        sceneManager = new SceneManager(threeContainer, (objName, obj3D) => {
            handleObjectClick(objName, obj3D, true);
        });
        window.sceneManager = sceneManager;

        sceneManager.onViewModeChange = (mode) => {
            isProceduralMode = (mode === 'MESOPHYLL');
            const btn = container.querySelector('#btn-toggle-procedural');
            if (btn) {
                if (mode === 'MESOPHYLL') {
                    btn.innerHTML = '<i data-lucide="flower"></i> Kembali ke Model Tanaman';
                } else {
                    btn.innerHTML = '<i data-lucide="layers"></i> Model Jaringan Daun 3D';
                }
                if (window.lucide) window.lucide.createIcons();
            }
        };

        setTimeout(() => {
            if (sceneManager) sceneManager.onWindowResize();
        }, 150);

        const resetView = () => {
            sceneManager.setViewMode('PLANT');
            handleObjectClick(null, null, false);
        };

        container.querySelector('#btn-reset-cam').addEventListener('click', resetView);

        // Toggle Procedural Leaf Cross-section Model
        const btnToggleProc = container.querySelector('#btn-toggle-procedural');
        btnToggleProc.addEventListener('click', () => {
            const inMesophyll = (sceneManager.viewMode === 'MESOPHYLL' || sceneManager.isProceduralMode);
            if (!inMesophyll) {
                sceneManager.setViewMode('MESOPHYLL');
                handleObjectClick('SEL_MESOFIL', null, false);
            } else {
                sceneManager.setViewMode('PLANT');
                handleObjectClick(null, null, false);
            }
            if (window.lucide) window.lucide.createIcons();
        });

        // Toggle Hotspots On/Off
        const btnToggleHotspots = container.querySelector('#btn-toggle-hotspots');
        const labelHotspots = container.querySelector('#label-hotspots');
        if (btnToggleHotspots) {
            btnToggleHotspots.addEventListener('click', () => {
                const isVisible = sceneManager.toggleHotspots();
                labelHotspots.innerText = isVisible ? 'Sembunyikan Titik Tombol' : 'Tampilkan Titik Tombol';
            });
        }
    };

    // Render Grid Awal
    renderMissionsGrid();

    // Default icon lucide pass
    setTimeout(() => {
        if (window.lucide) window.lucide.createIcons();
    }, 50);

    return container;
}
