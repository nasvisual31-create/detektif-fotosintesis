export const quizData = [
    {
        id: 1,
        question: "Bagian tumbuhan manakah yang terutama digunakan untuk menyerap air dari dalam tanah?",
        options: [
            { id: "A", text: "Bunga" },
            { id: "B", text: "Daun" },
            { id: "C", text: "Akar" },
            { id: "D", text: "Batang" }
        ],
        correctId: "C",
        feedbackCorrect: "Hebat! Jawabanmu benar! Akar bertugas menyerap air dan mineral dari dalam tanah untuk digunakan oleh tumbuhan.",
        feedbackWrong: "Belum tepat. Bagian yang tersembunyi di dalam tanah inilah yang bertugas mencari dan menyerap air. Jawabannya adalah Akar."
    },
    {
        id: 2,
        question: "Di bagian manakah proses pembuatan makanan (fotosintesis) paling banyak terjadi?",
        options: [
            { id: "A", text: "Daun" },
            { id: "B", text: "Akar" },
            { id: "C", text: "Bunga" },
            { id: "D", text: "Biji" }
        ],
        correctId: "A",
        feedbackCorrect: "Tepat sekali! Daun ibarat dapur bagi tumbuhan. Di situlah proses fotosintesis paling banyak terjadi.",
        feedbackWrong: "Belum tepat. Proses fotosintesis membutuhkan cahaya matahari, sehingga terjadi di bagian atas yang permukaannya lebar, yaitu Daun."
    },
    {
        id: 3,
        question: "Apa nama zat hijau pada daun yang bertugas menangkap cahaya matahari?",
        options: [
            { id: "A", text: "Stomata" },
            { id: "B", text: "Klorofil" },
            { id: "C", text: "Oksigen" },
            { id: "D", text: "Xilem" }
        ],
        correctId: "B",
        feedbackCorrect: "Luar biasa! Klorofil yang terdapat di dalam kloroplas itulah yang membuat daun berwarna hijau dan bisa menangkap energi matahari.",
        feedbackWrong: "Hampir benar, tapi belum tepat. Zat penangkap cahaya yang membuat daun berwarna hijau disebut Klorofil."
    },
    {
        id: 4,
        question: "Tumbuhan mengambil Karbon Dioksida (CO₂) dari udara melalui lubang kecil di daun. Lubang ini disebut...",
        options: [
            { id: "A", text: "Kloroplas" },
            { id: "B", text: "Akar" },
            { id: "C", text: "Epidermis" },
            { id: "D", text: "Stomata" }
        ],
        correctId: "D",
        feedbackCorrect: "Benar sekali! Stomata adalah 'hidung' tumbuhan yang menjadi pintu keluar masuknya udara (CO₂ masuk, O₂ keluar).",
        feedbackWrong: "Belum tepat. Lubang kecil pernapasan pada daun disebut Stomata."
    },
    {
        id: 5,
        question: "Apa yang terjadi pada fotosintesis jika tumbuhan berada di tempat gelap (malam hari)?",
        options: [
            { id: "A", text: "Tumbuhan memproduksi makanan lebih banyak" },
            { id: "B", text: "Proses fotosintesis terhenti sementara" },
            { id: "C", text: "Daun berubah warna menjadi kuning" },
            { id: "D", text: "Tumbuhan berhenti bernafas" }
        ],
        correctId: "B",
        feedbackCorrect: "Bagus! Fotosintesis mutlak membutuhkan cahaya. Saat malam, proses ini berhenti, tetapi tumbuhan tetap hidup dengan berespirasi (bernafas).",
        feedbackWrong: "Kurang tepat. Tumbuhan tetap hidup dan bernafas, namun tanpa cahaya, fotosintesis tidak dapat berlangsung sehingga terhenti sementara."
    },
    {
        id: 6,
        question: "Bagaimana pengaruh kabut asap tebal terhadap proses fotosintesis pada tumbuhan?",
        options: [
            { id: "A", text: "Fotosintesis semakin cepat karena asap memberi makanan" },
            { id: "B", text: "Fotosintesis sangat terhambat karena sinar matahari terhalang dan stomata tersumbat" },
            { id: "C", text: "Tumbuhan menghasilkan oksigen dua kali lebih banyak" },
            { id: "D", text: "Akar berhenti menyerap air seketika" }
        ],
        correctId: "B",
        feedbackCorrect: "Hebat sekali! Jawabanmu tepat! Asap tebal menghalangi sinar matahari dan partikel abunya dapat menyumbat lubang stomata daun, sehingga fotosintesis sangat terhambat.",
        feedbackWrong: "Belum tepat. Asap bukanlah makanan tumbuhan. Partikel asap menghalangi cahaya matahari dan dapat menyumbat stomata daun, sehingga fotosintesis terhambat."
    }
];

export const badgeLevels = [
    { threshold: 0, title: "Level 1: Benih Penjelajah", icon: "seedling" },
    { threshold: 30, title: "Level 2: Tunas Ingin Tahu", icon: "sprout" },
    { threshold: 65, title: "Level 3: Penjaga Air & Cahaya", icon: "sun" },
    { threshold: 90, title: "Level 4: Ahli Bunga Matahari", icon: "award" }
];
