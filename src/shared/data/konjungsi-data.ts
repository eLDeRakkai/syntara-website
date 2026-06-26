export type KonjungsiJenis = 'koordinatif' | 'subordinatif' | 'korelatif' | 'antarkalimat' | 'campuran';

export interface LengkapiKalimatSoal {
  id: number;
  jenis: KonjungsiJenis;
  kalimat: string; // The blank should be represented by "___"
  pilihan: string[];
  jawaban: string;
}

export interface TebakJenisSoal {
  id: number;
  kalimat: string; // The conjunction should be highlighted or marked, e.g., "Budi sakit **karena** kehujanan"
  konjungsi: string;
  pilihan: string[];
  jawaban: string; // e.g., "Sebab", "Akibat", etc.
}

export interface AnalisisTextSoal {
  id: number;
  judul: string;
  paragraf: { kalimat: string; salah: boolean; koreksi?: string }[][];
}

export interface LengkapiTextSoal {
  id: number;
  judul: string;
  paragraf: string[]; // Places for blanks represented by "[[B_id]]"
  blanks: { id: string; jawaban: string }[];
  kataBank: string[]; // Words to drag + distractors
}

export const tebakJenisData: TebakJenisSoal[] = [
  { id: 1, kalimat: 'Adik menangis **karena** mainannya rusak.', konjungsi: 'karena', pilihan: ['Menyatakan Sebab', 'Menyatakan Akibat', 'Menyatakan Syarat', 'Menyatakan Tujuan'], jawaban: 'Menyatakan Sebab' },
  { id: 2, kalimat: 'Dia belajar dengan giat **sehingga** lulus ujian dengan nilai memuaskan.', konjungsi: 'sehingga', pilihan: ['Menyatakan Syarat', 'Menyatakan Sebab', 'Menyatakan Akibat', 'Menyatakan Pertentangan'], jawaban: 'Menyatakan Akibat' },
  { id: 3, kalimat: 'Saya akan datang ke pestamu **jika** cuaca cerah.', konjungsi: 'jika', pilihan: ['Menyatakan Waktu', 'Menyatakan Syarat', 'Menyatakan Tujuan', 'Menyatakan Sebab'], jawaban: 'Menyatakan Syarat' },
  { id: 4, kalimat: 'Budi anak yang pintar, **tetapi** ia sering malas belajar.', konjungsi: 'tetapi', pilihan: ['Menyatakan Penambahan', 'Menyatakan Pemilihan', 'Menyatakan Pertentangan', 'Menyatakan Akibat'], jawaban: 'Menyatakan Pertentangan' },
  { id: 5, kalimat: 'Ibu memasak sayur bayam **dan** menggoreng ikan di dapur.', konjungsi: 'dan', pilihan: ['Menyatakan Penambahan', 'Menyatakan Pemilihan', 'Menyatakan Syarat', 'Menyatakan Waktu'], jawaban: 'Menyatakan Penambahan' },
  { id: 6, kalimat: 'Kamu ingin minum teh **atau** kopi hitam?', konjungsi: 'atau', pilihan: ['Menyatakan Penambahan', 'Menyatakan Pemilihan', 'Menyatakan Pertentangan', 'Menyatakan Sebab'], jawaban: 'Menyatakan Pemilihan' },
  { id: 7, kalimat: 'Paman berolahraga setiap pagi **agar** tubuhnya selalu sehat.', konjungsi: 'agar', pilihan: ['Menyatakan Akibat', 'Menyatakan Sebab', 'Menyatakan Tujuan', 'Menyatakan Syarat'], jawaban: 'Menyatakan Tujuan' },
  { id: 8, kalimat: 'Dia sudah tinggal di rumah itu **sejak** tahun 2015.', konjungsi: 'sejak', pilihan: ['Menyatakan Tempat', 'Menyatakan Waktu', 'Menyatakan Syarat', 'Menyatakan Tujuan'], jawaban: 'Menyatakan Waktu' },
  { id: 9, kalimat: 'Baju itu mahal harganya, **meskipun demikian** banyak orang yang membelinya.', konjungsi: 'meskipun demikian', pilihan: ['Menyatakan Penambahan', 'Menyatakan Pertentangan', 'Menyatakan Sebab', 'Menyatakan Akibat'], jawaban: 'Menyatakan Pertentangan' },
  { id: 10, kalimat: 'Hujan turun sangat deras. **Oleh karena itu**, jalanan menjadi banjir.', konjungsi: 'Oleh karena itu', pilihan: ['Menyatakan Akibat', 'Menyatakan Sebab', 'Menyatakan Syarat', 'Menyatakan Tujuan'], jawaban: 'Menyatakan Akibat' },
];

export const lengkapiKalimatData: LengkapiKalimatSoal[] = [
  // Koordinatif
  { id: 1, jenis: 'koordinatif', kalimat: 'Budi suka bermain bola, ___ adiknya lebih suka membaca buku.', pilihan: ['tetapi', 'sedangkan', 'atau', 'dan'], jawaban: 'sedangkan' },
  { id: 2, jenis: 'koordinatif', kalimat: 'Ibu membeli sayur, buah, ___ daging di pasar.', pilihan: ['tetapi', 'sedangkan', 'atau', 'dan'], jawaban: 'dan' },
  { id: 3, jenis: 'koordinatif', kalimat: 'Kamu mau minum kopi ___ teh?', pilihan: ['tetapi', 'melainkan', 'atau', 'sedangkan'], jawaban: 'atau' },
  { id: 4, jenis: 'koordinatif', kalimat: 'Dia tidak marah, ___ tersenyum mendengar berita itu.', pilihan: ['melainkan', 'tetapi', 'dan', 'atau'], jawaban: 'melainkan' },
  { id: 5, jenis: 'koordinatif', kalimat: 'Ayah membaca koran, ___ ibu memasak di dapur.', pilihan: ['lalu', 'sedangkan', 'tetapi', 'melainkan'], jawaban: 'sedangkan' },
  { id: 6, jenis: 'koordinatif', kalimat: 'Bajunya bagus, ___ warnanya tidak cocok untuknya.', pilihan: ['tetapi', 'dan', 'atau', 'sedangkan'], jawaban: 'tetapi' },
  { id: 7, jenis: 'koordinatif', kalimat: 'Saya datang ke rumahnya, ___ dia sedang tidak ada di rumah.', pilihan: ['dan', 'atau', 'tetapi', 'melainkan'], jawaban: 'tetapi' },
  { id: 8, jenis: 'koordinatif', kalimat: 'Ia membuka pintu, ___ menyalakan lampu ruang tamu.', pilihan: ['tetapi', 'lalu', 'atau', 'sedangkan'], jawaban: 'lalu' },
  
  // Subordinatif
  { id: 9, jenis: 'subordinatif', kalimat: 'Dia tidak pergi ke sekolah ___ sedang sakit.', pilihan: ['sehingga', 'karena', 'jika', 'agar'], jawaban: 'karena' },
  { id: 10, jenis: 'subordinatif', kalimat: 'Belajarlah yang rajin ___ kamu lulus ujian.', pilihan: ['karena', 'sebab', 'agar', 'meskipun'], jawaban: 'agar' },
  { id: 11, jenis: 'subordinatif', kalimat: '___ hujan turun sangat deras, pertandingan tetap dilanjutkan.', pilihan: ['Walaupun', 'Karena', 'Sehingga', 'Jika'], jawaban: 'Walaupun' },
  { id: 12, jenis: 'subordinatif', kalimat: 'Saya akan datang ke pestamu ___ tidak turun hujan.', pilihan: ['jika', 'sebab', 'meskipun', 'agar'], jawaban: 'jika' },
  { id: 13, jenis: 'subordinatif', kalimat: 'Dia menangis ___ mendengar kabar duka itu.', pilihan: ['sejak', 'ketika', 'agar', 'jika'], jawaban: 'ketika' },
  { id: 14, jenis: 'subordinatif', kalimat: 'Adik berlari sangat kencang ___ menabrak tembok.', pilihan: ['sehingga', 'karena', 'agar', 'kalau'], jawaban: 'sehingga' },
  { id: 15, jenis: 'subordinatif', kalimat: 'Pencuri itu lari ___ melihat ada polisi datang.', pilihan: ['setelah', 'agar', 'sehingga', 'padahal'], jawaban: 'setelah' },
  { id: 16, jenis: 'subordinatif', kalimat: 'Dia sudah tinggal di Jakarta ___ tahun 2010.', pilihan: ['sejak', 'ketika', 'setelah', 'karena'], jawaban: 'sejak' },

  // Korelatif
  { id: 17, jenis: 'korelatif', kalimat: 'Jangankan berjalan, berdiri ___ dia tidak sanggup.', pilihan: ['pun', 'saja', 'juga', 'pula'], jawaban: 'pun' },
  { id: 18, jenis: 'korelatif', kalimat: 'Baik ayah ___ ibu, keduanya sangat menyayangi anak itu.', pilihan: ['ataupun', 'dan', 'maupun', 'serta'], jawaban: 'maupun' },
  { id: 19, jenis: 'korelatif', kalimat: 'Bukan hanya pintar, ___ dia juga sangat rajin.', pilihan: ['melainkan', 'tetapi', 'dan', 'namun'], jawaban: 'melainkan' },
  { id: 20, jenis: 'korelatif', kalimat: 'Entah benar ___ salah, kabar itu sudah menyebar luas.', pilihan: ['atau', 'maupun', 'dan', 'entah'], jawaban: 'entah' },
  { id: 21, jenis: 'korelatif', kalimat: '___ sulitnya ujian itu, kita harus tetap berusaha.', pilihan: ['Bagaimanapun', 'Meskipun', 'Walaupun', 'Biarpun'], jawaban: 'Bagaimanapun' },
  { id: 22, jenis: 'korelatif', kalimat: 'Tidak hanya sedih, ___ dia sangat kecewa dengan hasilnya.', pilihan: ['melainkan', 'tetapi', 'dan', 'namun'], jawaban: 'tetapi' },
  { id: 23, jenis: 'korelatif', kalimat: 'Sedemikian rupa indahnya pemandangan itu ___ aku tak bisa berkata-kata.', pilihan: ['sehingga', 'sampai', 'maka', 'agar'], jawaban: 'sehingga' },
  { id: 24, jenis: 'korelatif', kalimat: 'Bukannya saya tidak mau membantu, ___ saya sendiri sedang sibuk.', pilihan: ['tetapi', 'melainkan', 'namun', 'hanya'], jawaban: 'melainkan' },

  // Antarkalimat
  { id: 25, jenis: 'antarkalimat', kalimat: 'Harga bahan bakar naik. ___, harga bahan pokok juga ikut naik.', pilihan: ['Oleh karena itu', 'Meskipun demikian', 'Sebaliknya', 'Bahkan'], jawaban: 'Oleh karena itu' },
  { id: 26, jenis: 'antarkalimat', kalimat: 'Dia sudah berusaha keras. ___, hasilnya masih belum memuaskan.', pilihan: ['Oleh sebab itu', 'Namun', 'Selain itu', 'Bahkan'], jawaban: 'Namun' },
  { id: 27, jenis: 'antarkalimat', kalimat: 'Hujan turun dengan deras. ___, mereka tetap berangkat sekolah.', pilihan: ['Oleh karena itu', 'Meskipun demikian', 'Selain itu', 'Selanjutnya'], jawaban: 'Meskipun demikian' },
  { id: 28, jenis: 'antarkalimat', kalimat: 'Proyek itu sudah selesai dikerjakan. ___, kita perlu mengevaluasi hasilnya.', pilihan: ['Namun', 'Selain itu', 'Oleh karena itu', 'Selanjutnya'], jawaban: 'Selanjutnya' },
  { id: 29, jenis: 'antarkalimat', kalimat: 'Anak itu sangat cerdas. ___, dia juga rajin beribadah.', pilihan: ['Sebaliknya', 'Selain itu', 'Oleh sebab itu', 'Akan tetapi'], jawaban: 'Selain itu' },
  { id: 30, jenis: 'antarkalimat', kalimat: 'Pemerintah sudah memberikan bantuan. ___, masih banyak warga yang mengeluh.', pilihan: ['Selain itu', 'Oleh karena itu', 'Akan tetapi', 'Bahkan'], jawaban: 'Akan tetapi' },
  { id: 31, jenis: 'antarkalimat', kalimat: 'Kita harus menjaga kebersihan lingkungan. ___, kita akan terhindar dari penyakit.', pilihan: ['Dengan demikian', 'Meskipun begitu', 'Namun', 'Selain itu'], jawaban: 'Dengan demikian' },
  { id: 32, jenis: 'antarkalimat', kalimat: 'Kemarin cuaca sangat panas. ___, hari ini turun hujan lebat.', pilihan: ['Oleh karena itu', 'Selain itu', 'Sebaliknya', 'Bahkan'], jawaban: 'Sebaliknya' },
];

export const analisisTextData: AnalisisTextSoal[] = [
  {
    id: 1,
    judul: 'Kegiatan di Akhir Pekan',
    paragraf: [
      [
        { kalimat: 'Setiap akhir pekan, keluarga Pak Budi selalu menghabiskan waktu bersama.', salah: false },
        { kalimat: 'Mereka sering pergi ke taman bermain tetapi sekadar bersantai di rumah.', salah: true, koreksi: 'atau' },
        { kalimat: 'Anak-anak sangat senang jika diajak berenang.', salah: false },
        { kalimat: 'Namun, minggu lalu mereka tidak pergi ke mana-mana karena hujan turun sangat deras.', salah: false },
      ],
      [
        { kalimat: 'Pagi harinya, Bu Budi memasak makanan kesukaan keluarga.', salah: false },
        { kalimat: 'Pak Budi membantu membersihkan halaman rumah sehingga memotong rumput.', salah: true, koreksi: 'dan' },
        { kalimat: 'Setelah semua pekerjaan selesai, mereka makan siang bersama di ruang makan.', salah: false },
      ],
      [
        { kalimat: 'Sore harinya, hujan mulai reda.', salah: false },
        { kalimat: 'Anak-anak meminta izin untuk bermain di luar.', salah: false },
        { kalimat: 'Pak Budi mengizinkan mereka, melainkan dengan syarat harus pulang sebelum magrib.', salah: true, koreksi: 'tetapi' },
        { kalimat: 'Mereka pun bermain dengan gembira sampai sore hari.', salah: false },
      ],
      [
        { kalimat: 'Malam harinya, keluarga itu berkumpul di ruang keluarga.', salah: false },
        { kalimat: 'Mereka menonton televisi sambil mengobrol santai.', salah: false },
        { kalimat: 'Liburan kali ini terasa singkat, meskipun demikian mereka sangat menikmatinya.', salah: false },
      ]
    ]
  },
  {
    id: 2,
    judul: 'Pentingnya Berolahraga',
    paragraf: [
      [
        { kalimat: 'Kesehatan tubuh merupakan investasi yang sangat berharga bagi setiap orang.', salah: false },
        { kalimat: 'Untuk menjaga kesehatan tersebut, olahraga harus dilakukan secara rutin.', salah: false },
        { kalimat: 'Banyak orang malas berolahraga sehingga menganggapnya melelahkan.', salah: true, koreksi: 'karena' },
      ],
      [
        { kalimat: 'Padahal, olahraga memiliki banyak manfaat bagi tubuh kita.', salah: false },
        { kalimat: 'Selain menjaga kebugaran, olahraga juga dapat mengurangi stres atau meningkatkan suasana hati.', salah: true, koreksi: 'dan' },
        { kalimat: 'Orang yang rajin berolahraga cenderung memiliki daya tahan tubuh yang lebih baik.', salah: false },
      ],
      [
        { kalimat: 'Meskipun waktu sangat padat, kita harus meluangkan waktu untuk bergerak.', salah: false },
        { kalimat: 'Tidak perlu olahraga berat, berjalan kaki selama 30 menit sehari saja sudah cukup.', salah: false },
        { kalimat: 'Oleh sebab itu, banyak ahli kesehatan yang merekomendasikan hal ini.', salah: false },
      ],
      [
        { kalimat: 'Jadi, tidak ada alasan lagi untuk malas berolahraga.', salah: false },
        { kalimat: 'Mari mulai hidup sehat dari sekarang, melainkan kita akan menyesal di kemudian hari.', salah: true, koreksi: 'sebab' },
        { kalimat: 'Kesehatan adalah kunci utama untuk menikmati hidup dengan bahagia.', salah: false },
      ]
    ]
  },
  {
    id: 3,
    judul: 'Perjalanan ke Pegunungan',
    paragraf: [
      [
        { kalimat: 'Pada liburan semester lalu, saya dan teman-teman pergi ke daerah pegunungan.', salah: false },
        { kalimat: 'Kami berangkat pagi-pagi sekali karena tidak terjebak macet.', salah: true, koreksi: 'agar' },
        { kalimat: 'Perjalanan yang ditempuh memakan waktu sekitar empat jam.', salah: false },
      ],
      [
        { kalimat: 'Setibanya di sana, udara dingin langsung menyambut kami.', salah: false },
        { kalimat: 'Pemandangan alam yang hijau sangat memanjakan mata.', salah: false },
        { kalimat: 'Kami segera mendirikan tenda dan menyalakan api unggun untuk menghangatkan badan.', salah: true, koreksi: 'lalu' },
      ],
      [
        { kalimat: 'Malam harinya, kami duduk melingkar sambil bercerita.', salah: false },
        { kalimat: 'Suasana sangat tenang, atau hanya terdengar suara serangga malam.', salah: true, koreksi: 'dan' },
        { kalimat: 'Pengalaman ini sungguh tak terlupakan bagi kami semua.', salah: false },
      ]
    ]
  },
  {
    id: 4,
    judul: 'Teknologi di Era Modern',
    paragraf: [
      [
        { kalimat: 'Perkembangan teknologi saat ini berlangsung dengan sangat pesat.', salah: false },
        { kalimat: 'Berbagai perangkat canggih telah diciptakan untuk memudahkan kehidupan manusia.', salah: false },
        { kalimat: 'Namun, teknologi juga bisa membawa dampak negatif tetapi tidak digunakan dengan bijak.', salah: true, koreksi: 'jika' },
      ],
      [
        { kalimat: 'Salah satu contohnya adalah penggunaan gawai secara berlebihan.', salah: false },
        { kalimat: 'Banyak anak-anak yang kecanduan bermain game online.', salah: false },
        { kalimat: 'Selain itu, mereka sering melupakan waktu belajar dan bersosialisasi.', salah: true, koreksi: 'Akibatnya' },
      ],
      [
        { kalimat: 'Oleh karena itu, peran orang tua sangat penting dalam mengawasi anak-anak.', salah: false },
        { kalimat: 'Mereka harus membatasi waktu penggunaan gawai agar mengarahkan anak pada kegiatan positif.', salah: true, koreksi: 'dan' },
        { kalimat: 'Dengan demikian, dampak negatif teknologi dapat diminimalkan.', salah: false },
      ]
    ]
  }
];

export const lengkapiTextData: LengkapiTextSoal[] = [
  {
    id: 1,
    judul: 'Pentingnya Sarapan Pagi',
    paragraf: [
      'Sarapan sering disebut sebagai waktu makan paling penting dalam sehari. [[B_1]] tubuh telah berpuasa selama kita tidur di malam hari, sarapan memberikan energi yang dibutuhkan untuk memulai aktivitas. Orang yang melewatkan sarapan cenderung merasa lelah [[B_2]] sulit berkonsentrasi di siang hari.',
      'Banyak orang mengabaikan sarapan dengan alasan tidak punya waktu. [[B_3]], sarapan tidak harus selalu berupa makanan berat. Sepotong roti panggang [[B_4]] segelas susu sudah cukup untuk mengganjal perut.',
      '[[B_5]], membiasakan diri untuk sarapan setiap pagi adalah langkah awal menuju gaya hidup yang lebih sehat. Jangan biarkan alasan sibuk membuat Anda mengabaikan kesehatan pencernaan.',
      'Beberapa penelitian juga menunjukkan bahwa anak-anak yang rutin sarapan memiliki prestasi yang lebih baik di sekolah. [[B_6]] orang dewasa, sarapan membantu menjaga metabolisme tubuh tetap stabil.'
    ],
    blanks: [
      { id: 'B_1', jawaban: 'Karena' },
      { id: 'B_2', jawaban: 'dan' },
      { id: 'B_3', jawaban: 'Padahal' },
      { id: 'B_4', jawaban: 'atau' },
      { id: 'B_5', jawaban: 'Oleh karena itu' },
      { id: 'B_6', jawaban: 'Sedangkan bagi' }
    ],
    kataBank: ['Karena', 'dan', 'Padahal', 'atau', 'Oleh karena itu', 'Sedangkan bagi', 'Tetapi', 'Jika', 'Meskipun', 'Serta']
  },
  {
    id: 2,
    judul: 'Dampak Perubahan Iklim',
    paragraf: [
      'Perubahan iklim merupakan salah satu tantangan terbesar yang dihadapi umat manusia saat ini. Pemanasan global menyebabkan suhu bumi terus meningkat. [[B_1]], es di kutub mulai mencair dan permukaan air laut semakin tinggi.',
      'Fenomena ini mengancam kehidupan di pesisir pantai. Beberapa pulau kecil bahkan terancam tenggelam [[B_2]] tindakan pencegahan tidak segera dilakukan. [[B_3]] itu, cuaca ekstrem seperti badai dan kekeringan menjadi lebih sering terjadi.',
      'Para ilmuwan telah lama memperingatkan bahaya ini. [[B_4]], masih banyak pihak yang enggan mengurangi emisi karbon demi kepentingan ekonomi. Mereka lebih mementingkan keuntungan jangka pendek [[B_5]] kelestarian bumi di masa depan.',
      'Kita semua harus mengambil peran dalam menjaga lingkungan. Mulai dari hal kecil seperti mengurangi penggunaan plastik, [[B_6]] menanam pohon di sekitar lingkungan rumah kita.'
    ],
    blanks: [
      { id: 'B_1', jawaban: 'Akibatnya' },
      { id: 'B_2', jawaban: 'jika' },
      { id: 'B_3', jawaban: 'Selain' },
      { id: 'B_4', jawaban: 'Namun' },
      { id: 'B_5', jawaban: 'daripada' },
      { id: 'B_6', jawaban: 'hingga' }
    ],
    kataBank: ['Akibatnya', 'jika', 'Selain', 'Namun', 'daripada', 'hingga', 'Karena', 'Tetapi', 'Walaupun', 'Atau']
  },
  {
    id: 3,
    judul: 'Sejarah Kemerdekaan Indonesia',
    paragraf: [
      'Kemerdekaan Indonesia tidak diraih dengan mudah, [[B_1]] melalui perjuangan panjang yang penuh pengorbanan. Para pahlawan rela mengorbankan harta, benda, [[B_2]] nyawa demi mengusir penjajah dari tanah air.',
      'Pada tanggal 17 Agustus 1945, Soekarno dan Hatta memproklamasikan kemerdekaan Indonesia. Peristiwa ini disambut dengan sukacita oleh seluruh rakyat. [[B_3]], perjuangan belum benar-benar selesai.',
      'Belanda masih berusaha untuk kembali menguasai Indonesia. [[B_4]], terjadilah pertempuran di berbagai daerah seperti di Surabaya, Bandung, dan Ambarawa. Rakyat Indonesia berjuang dengan gigih [[B_5]] hanya bersenjatakan bambu runcing.',
      'Akhirnya, setelah melalui berbagai perundingan dan tekanan internasional, Belanda mengakui kedaulatan Indonesia secara penuh. Kemerdekaan yang kita nikmati saat ini adalah hasil jerih payah mereka. [[B_6]], kita harus mengisi kemerdekaan ini dengan hal-hal yang positif.'
    ],
    blanks: [
      { id: 'B_1', jawaban: 'melainkan' },
      { id: 'B_2', jawaban: 'bahkan' },
      { id: 'B_3', jawaban: 'Akan tetapi' },
      { id: 'B_4', jawaban: 'Oleh sebab itu' },
      { id: 'B_5', jawaban: 'meskipun' },
      { id: 'B_6', jawaban: 'Dengan demikian' }
    ],
    kataBank: ['melainkan', 'bahkan', 'Akan tetapi', 'Oleh sebab itu', 'meskipun', 'Dengan demikian', 'Karena', 'Atau', 'Serta', 'Sehingga']
  },
  {
    id: 4,
    judul: 'Pentingnya Membaca Buku',
    paragraf: [
      'Buku adalah jendela dunia. Melalui membaca, kita bisa mendapatkan pengetahuan baru tanpa harus pergi ke mana-mana. [[B_1]] banyak orang yang menyadari manfaatnya, minat baca di kalangan masyarakat kita masih tergolong rendah.',
      'Salah satu penyebabnya adalah maraknya hiburan digital seperti media sosial [[B_2]] game online. Anak-anak zaman sekarang lebih memilih menghabiskan waktu menatap layar gawai [[B_3]] membaca buku cerita.',
      'Untuk mengatasi masalah ini, peran orang tua dan sekolah sangat dibutuhkan. Orang tua perlu membiasakan anak membaca sejak usia dini. [[B_4]], pihak sekolah bisa memperbanyak koleksi buku bacaan yang menarik di perpustakaan.',
      'Jika kebiasaan membaca sudah tertanam kuat, generasi penerus bangsa akan tumbuh menjadi individu yang cerdas dan berwawasan luas. [[B_5]], mari kita luangkan waktu sejenak setiap hari untuk membaca buku, [[B_6]] hanya 15 menit saja.'
    ],
    blanks: [
      { id: 'B_1', jawaban: 'Walaupun' },
      { id: 'B_2', jawaban: 'serta' },
      { id: 'B_3', jawaban: 'ketimbang' },
      { id: 'B_4', jawaban: 'Sementara itu' },
      { id: 'B_5', jawaban: 'Maka dari itu' },
      { id: 'B_6', jawaban: 'meskipun' }
    ],
    kataBank: ['Walaupun', 'serta', 'ketimbang', 'Sementara itu', 'Maka dari itu', 'meskipun', 'Karena', 'Atau', 'Tetapi', 'Sehingga']
  }
];
