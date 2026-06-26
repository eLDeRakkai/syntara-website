// ─────────────────────────────────────────────
// TIPE DATA
// ─────────────────────────────────────────────

export interface MembandingkanSoal {
  id: number;
  huruf: string;
  pilihan: string[];   // semua pilihan kata
  jawabanBaku: string; // kata yang baku
}

export interface DetektifSoal {
  id: number;
  judul: string;
  paragraf: string[];  // array per paragraf
  kataJawaban: string[]; // kata tidak baku yang harus ditemukan
}

export interface AnalisisSoal {
  id: number;
  huruf: string;
  kalimat: string;
  kataSalah: string;   // kata tidak baku dalam kalimat
  kataBenar: string;   // jawaban yang benar (kata baku)
}

// ─────────────────────────────────────────────
// DATA: MEMBANDINGKAN KATA
// ─────────────────────────────────────────────

export const membandingkanData: MembandingkanSoal[] = [
  { id: 1,  huruf: 'A', pilihan: ['aktifitas', 'aktivitas', 'aktifitis'], jawabanBaku: 'aktivitas' },
  { id: 2,  huruf: 'A', pilihan: ['analisa', 'analisis', 'analisys'], jawabanBaku: 'analisis' },
  { id: 3,  huruf: 'A', pilihan: ['apotik', 'apotek', 'apothek'], jawabanBaku: 'apotek' },
  { id: 4,  huruf: 'A', pilihan: ['antri', 'antre', 'antree'], jawabanBaku: 'antre' },
  { id: 5,  huruf: 'B', pilihan: ['bis', 'bus', 'buss'], jawabanBaku: 'bus' },
  { id: 6,  huruf: 'B', pilihan: ['berfikir', 'berpikir', 'berpikirr'], jawabanBaku: 'berpikir' },
  { id: 7,  huruf: 'C', pilihan: ['cabai', 'cabe', 'cabay'], jawabanBaku: 'cabai' },
  { id: 8,  huruf: 'D', pilihan: ['diagnosa', 'diagnosis', 'diagnosys'], jawabanBaku: 'diagnosis' },
  { id: 9,  huruf: 'D', pilihan: ['do\'a', 'doa', 'dooa'], jawabanBaku: 'doa' },
  { id: 10, huruf: 'F', pilihan: ['fasilitas', 'fasilities', 'fasilites'], jawabanBaku: 'fasilitas' },
  { id: 11, huruf: 'G', pilihan: ['gizi', 'gisi', 'gizzi'], jawabanBaku: 'gizi' },
  { id: 12, huruf: 'H', pilihan: ['hafal', 'hapal', 'haphall'], jawabanBaku: 'hafal' },
  { id: 13, huruf: 'H', pilihan: ['hipotesa', 'hipotesis', 'hypothesa'], jawabanBaku: 'hipotesis' },
  { id: 14, huruf: 'I', pilihan: ['ijin', 'izin', 'idzin'], jawabanBaku: 'izin' },
  { id: 15, huruf: 'J', pilihan: ['jadual', 'jadwal', 'jadwall'], jawabanBaku: 'jadwal' },
  { id: 16, huruf: 'K', pilihan: ['karir', 'karier', 'karriir'], jawabanBaku: 'karier' },
  { id: 17, huruf: 'K', pilihan: ['komplek', 'kompleks', 'compleks'], jawabanBaku: 'kompleks' },
  { id: 18, huruf: 'L', pilihan: ['lobster', 'louster', 'lobsterr'], jawabanBaku: 'lobster' },
  { id: 19, huruf: 'M', pilihan: ['merubah', 'mengubah', 'merubahh'], jawabanBaku: 'mengubah' },
  { id: 20, huruf: 'N', pilihan: ['nasehat', 'nasihat', 'nasehatt'], jawabanBaku: 'nasihat' },
  { id: 21, huruf: 'O', pilihan: ['obyek', 'objek', 'objectt'], jawabanBaku: 'objek' },
  { id: 22, huruf: 'P', pilihan: ['praktek', 'praktik', 'practek'], jawabanBaku: 'praktik' },
  { id: 23, huruf: 'P', pilihan: ['problematika', 'problematik', 'problematiika'], jawabanBaku: 'problematika' },
  { id: 24, huruf: 'R', pilihan: ['resiko', 'risiko', 'resiiko'], jawabanBaku: 'risiko' },
  { id: 25, huruf: 'S', pilihan: ['silakan', 'silahkan', 'silakkan'], jawabanBaku: 'silakan' },
  { id: 26, huruf: 'S', pilihan: ['sistim', 'sistem', 'systemm'], jawabanBaku: 'sistem' },
  { id: 27, huruf: 'S', pilihan: ['syukur', 'sukur', 'shukur'], jawabanBaku: 'syukur' },
  { id: 28, huruf: 'T', pilihan: ['tehnik', 'teknik', 'technik'], jawabanBaku: 'teknik' },
  { id: 29, huruf: 'U', pilihan: ['utama', 'utaama', 'uttama'], jawabanBaku: 'utama' },
  { id: 30, huruf: 'Z', pilihan: ['zaman', 'jaman', 'zamaan'], jawabanBaku: 'zaman' },
];

// ─────────────────────────────────────────────
// DATA: DETEKTIF KATA
// ─────────────────────────────────────────────

export const detektifData: DetektifSoal[] = [
  {
    id: 1,
    judul: 'Kegiatan Sehari-hari di Sekolah',
    paragraf: [
      'Setiap pagi, siswa-siswa datang ke sekolah dengan penuh semangat. Mereka mempersiapkan buku dan peralatan belajar sebelum pelajaran dimulai. Guru pun telah siap memberikan materi dengan jadual yang sudah disusun.',
      'Pada jam istirahat, mereka antri di kantin untuk membeli makanan. Beberapa siswa memilih untuk duduk di taman sambil berdiskusi mengenai pelajaran yang baru saja mereka pelajari bersama.',
      'Setelah pulang sekolah, para siswa diharuskan mengerjakan PR. Mereka harus berfikir keras agar bisa menyelesaikan soal-soal yang diberikan oleh guru mereka dengan benar.',
      'Di akhir semester, seluruh siswa mengikuti ujian. Mereka berharap bisa meraih prestasi terbaik dan mendapat nasehat dari guru untuk terus belajar dengan giat setiap harinya.',
    ],
    kataJawaban: ['jadual', 'antri', 'berfikir', 'nasehat'],
  },
  {
    id: 2,
    judul: 'Dunia Kerja Modern',
    paragraf: [
      'Di era modern ini, banyak perusahaan yang mencari karyawan dengan karir yang menjanjikan. Setiap pelamar harus memiliki ijin kerja yang sah dan pengalaman di bidangnya masing-masing.',
      'Dalam dunia kerja, kemampuan analisa data menjadi keahlian yang sangat dibutuhkan. Para profesional dituntut untuk bisa mengolah informasi dengan cepat dan akurat.',
      'Resiko kegagalan dalam bisnis selalu ada, namun dengan persiapan yang matang, hal tersebut dapat diminimalkan. Perusahaan perlu memiliki sistem yang baik untuk mengatasi berbagai tantangan.',
    ],
    kataJawaban: ['karir', 'ijin', 'analisa', 'Resiko'],
  },
  {
    id: 3,
    judul: 'Kesehatan dan Gaya Hidup',
    paragraf: [
      'Menjaga kesehatan adalah hal utama yang harus diperhatikan. Dokter menyarankan agar kita rutin berolahraga dan mengonsumsi makanan bergizi setiap harinya.',
      'Saat sakit, kita dianjurkan untuk pergi ke apotek terdekat atau langsung ke rumah sakit. Diagnosa yang tepat dari dokter akan membantu proses penyembuhan lebih cepat.',
    ],
    kataJawaban: ['apotek', 'Diagnosa'],
  },
];

// ─────────────────────────────────────────────
// DATA: ANALISIS KALIMAT
// ─────────────────────────────────────────────

export const analisisData: AnalisisSoal[] = [
  { id: 1,  huruf: 'A', kalimat: 'Tingkat aktifitas masyarakat meningkat selama liburan panjang kemarin.', kataSalah: 'aktifitas', kataBenar: 'aktivitas' },
  { id: 2,  huruf: 'A', kalimat: 'Tim peneliti melakukan analisa mendalam terhadap data yang terkumpul.', kataSalah: 'analisa', kataBenar: 'analisis' },
  { id: 3,  huruf: 'A', kalimat: 'Pasien itu langsung pergi ke apotik untuk menebus resep dokternya.', kataSalah: 'apotik', kataBenar: 'apotek' },
  { id: 4,  huruf: 'A', kalimat: 'Pengunjung diminta untuk antri dengan tertib di depan loket tiket.', kataSalah: 'antri', kataBenar: 'antre' },
  { id: 5,  huruf: 'B', kalimat: 'Dia selalu berfikir positif dalam menghadapi setiap tantangan hidupnya.', kataSalah: 'berfikir', kataBenar: 'berpikir' },
  { id: 6,  huruf: 'C', kalimat: 'Ibu membeli cabe merah di pasar untuk dimasak menjadi sambal segar.', kataSalah: 'cabe', kataBenar: 'cabai' },
  { id: 7,  huruf: 'D', kalimat: 'Dokter memberikan diagnosa awal bahwa pasien tersebut mengidap flu berat.', kataSalah: 'diagnosa', kataBenar: 'diagnosis' },
  { id: 8,  huruf: 'H', kalimat: 'Mahasiswa itu diminta mengajukan hipotesa sebelum memulai penelitiannya.', kataSalah: 'hipotesa', kataBenar: 'hipotesis' },
  { id: 9,  huruf: 'I', kalimat: 'Pegawai baru itu belum mendapat ijin untuk memasuki ruang server perusahaan.', kataSalah: 'ijin', kataBenar: 'izin' },
  { id: 10, huruf: 'J', kalimat: 'Jadual pertandingan telah diumumkan oleh panitia penyelenggara kemarin sore.', kataSalah: 'jadual', kataBenar: 'jadwal' },
  { id: 11, huruf: 'K', kalimat: 'Ia berhasil membangun karir yang gemilang di bidang teknologi informasi.', kataSalah: 'karir', kataBenar: 'karier' },
  { id: 12, huruf: 'M', kalimat: 'Kebijakan baru itu tidak akan merubah struktur organisasi yang telah ada.', kataSalah: 'merubah', kataBenar: 'mengubah' },
  { id: 13, huruf: 'N', kalimat: 'Guru itu memberikan nasehat bijak kepada muridnya yang hampir menyerah.', kataSalah: 'nasehat', kataBenar: 'nasihat' },
  { id: 14, huruf: 'P', kalimat: 'Dokter menyarankan agar pasien menjalani praktek terapi fisik setiap minggu.', kataSalah: 'praktek', kataBenar: 'praktik' },
  { id: 15, huruf: 'R', kalimat: 'Investasi di pasar saham selalu memiliki resiko yang harus dipahami investor.', kataSalah: 'resiko', kataBenar: 'risiko' },
  { id: 16, huruf: 'S', kalimat: 'Silahkan duduk dan tunggu sebentar, petugas kami akan segera melayani Anda.', kataSalah: 'Silahkan', kataBenar: 'Silakan' },
  { id: 17, huruf: 'S', kalimat: 'Sistim keamanan gedung ini telah diperbarui dengan teknologi terkini.', kataSalah: 'Sistim', kataBenar: 'Sistem' },
  { id: 18, huruf: 'T', kalimat: 'Mahasiswa tehnik harus menguasai ilmu matematika dan fisika dengan baik.', kataSalah: 'tehnik', kataBenar: 'teknik' },
  { id: 19, huruf: 'Z', kalimat: 'Pada jaman dulu, nenek moyang kita sudah mengenal berbagai kerajinan tangan.', kataSalah: 'jaman', kataBenar: 'zaman' },
  { id: 20, huruf: 'H', kalimat: 'Dia sudah hapal semua lirik lagu kebangsaan sejak duduk di bangku SD.', kataSalah: 'hapal', kataBenar: 'hafal' },
];
