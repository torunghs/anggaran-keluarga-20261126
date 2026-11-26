// DompetKeluarga — data contoh keluarga Indonesia.
// Semua angka adalah contoh realistis untuk satu keluarga di Jakarta,
// November 2026. Bukan data pribadi siapa pun; halaman Sumber menjelaskan
// asumsi dan acuan tiap angka.

export const KELUARGA = {
  nama: 'Keluarga Budi Santoso',
  kota: 'Jakarta Timur',
  anggota: 4,
  penghasilanBulanan: 12500000,
  rincianPenghasilan: [
    { sumber: 'Gaji pokok (ayah, staf administrasi)', jumlah: 9500000 },
    { sumber: 'Usaha sampingan (ibu, katering rumahan)', jumlah: 2500000 },
    { sumber: 'Lain-lain (lembur & bonus kecil)', jumlah: 500000 },
  ],
};

export const KATEGORI = [
  { id: 'belanja', nama: 'Belanja Harian', warna: '#2e7d5b', ikon: '🛒' },
  { id: 'makan', nama: 'Makan & Jajan', warna: '#c2703d', ikon: '🍽️' },
  { id: 'rumah', nama: 'Rumah & Utilitas', warna: '#3d6e9e', ikon: '🏠' },
  { id: 'transport', nama: 'Transportasi', warna: '#7a5ea8', ikon: '🚌' },
  { id: 'sekolah', nama: 'Sekolah Anak', warna: '#b0486e', ikon: '🎒' },
  { id: 'kesehatan', nama: 'Kesehatan', warna: '#4a9a8c', ikon: '💊' },
  { id: 'hiburan', nama: 'Hiburan', warna: '#8a6d3b', ikon: '🎬' },
  { id: 'tabungan', nama: 'Tabungan & Dana Darurat', warna: '#556b2f', ikon: '💰' },
];

// Anggaran bulanan keluarga contoh (November 2026), dalam rupiah.
export const ANGGARAN_AWAL = {
  belanja: 2200000,
  makan: 1200000,
  rumah: 1800000,
  transport: 900000,
  sekolah: 1500000,
  kesehatan: 500000,
  hiburan: 400000,
  tabungan: 1500000,
};

// Transaksi contoh: [tanggal, deskripsi, kategori, jenis, jumlah]
// jenis: 'keluar' | 'masuk'. Rentang September–November 2026.
const T = (tanggal, deskripsi, kategori, jenis, jumlah) => ({ tanggal, deskripsi, kategori, jenis, jumlah });

export const TRANSAKSI_AWAL = [
  // --- November 2026 ---
  T('2026-11-01', 'Gaji pokok November', 'tabungan', 'masuk', 9500000),
  T('2026-11-01', 'Belanja pasar minggu 1 (sayur, ayam, telur)', 'belanja', 'keluar', 385000),
  T('2026-11-02', 'Token listrik PLN 200 kWh', 'rumah', 'keluar', 289000),
  T('2026-11-02', 'Bensin motor (Pertalite 8 liter)', 'transport', 'keluar', 80000),
  T('2026-11-03', 'SPP sekolah anak pertama', 'sekolah', 'keluar', 750000),
  T('2026-11-03', 'Makan siang keluarga di warteg', 'makan', 'keluar', 68000),
  T('2026-11-04', 'Air PDAM bulan Oktober', 'rumah', 'keluar', 142000),
  T('2026-11-05', 'Pesanan katering ibu (pemasukan)', 'tabungan', 'masuk', 620000),
  T('2026-11-05', 'Belanja Indomaret (susu, roti, sabun)', 'belanja', 'keluar', 214000),
  T('2026-11-06', 'Internet rumah (50 Mbps)', 'rumah', 'keluar', 299000),
  T('2026-11-07', 'Ojek online ke kantor (4x)', 'transport', 'keluar', 96000),
  T('2026-11-08', 'Belanja pasar minggu 2', 'belanja', 'keluar', 342000),
  T('2026-11-09', 'Les bahasa Inggris anak', 'sekolah', 'keluar', 300000),
  T('2026-11-10', 'Makan malam bakso keluarga', 'makan', 'keluar', 112000),
  T('2026-11-11', 'Beli obat & vitamin di apotek', 'kesehatan', 'keluar', 186000),
  T('2026-11-12', 'Iuran RT & keamanan', 'rumah', 'keluar', 75000),
  T('2026-11-13', 'Bensin motor (Pertalite 8 liter)', 'transport', 'keluar', 80000),
  T('2026-11-14', 'Pesanan katering ibu (pemasukan)', 'tabungan', 'masuk', 540000),
  T('2026-11-15', 'Belanja pasar minggu 3', 'belanja', 'keluar', 398000),
  T('2026-11-16', 'SPP sekolah anak kedua', 'sekolah', 'keluar', 650000),
  T('2026-11-17', 'Beli buku & alat tulis anak', 'sekolah', 'keluar', 128000),
  T('2026-11-18', 'Makan siang nasi padang', 'makan', 'keluar', 95000),
  T('2026-11-19', 'Token listrik PLN 100 kWh', 'rumah', 'keluar', 146000),
  T('2026-11-20', 'Nonton bioskop keluarga (4 tiket)', 'hiburan', 'keluar', 200000),
  T('2026-11-21', 'Belanja pasar minggu 4', 'belanja', 'keluar', 356000),
  T('2026-11-22', 'Periksa gigi anak di puskesmas', 'kesehatan', 'keluar', 95000),
  T('2026-11-23', 'Pulsa & paket data (2 nomor)', 'rumah', 'keluar', 150000),
  T('2026-11-24', 'Bensin motor (Pertalite 8 liter)', 'transport', 'keluar', 80000),
  T('2026-11-25', 'Jajan anak sekolah (seminggu)', 'makan', 'keluar', 105000),
  T('2026-11-26', 'Setor tabungan dana darurat', 'tabungan', 'keluar', 1000000),
  // --- Oktober 2026 (ringkas, untuk tren) ---
  T('2026-10-01', 'Gaji pokok Oktober', 'tabungan', 'masuk', 9500000),
  T('2026-10-05', 'Pesanan katering ibu', 'tabungan', 'masuk', 2100000),
  T('2026-10-31', 'Total belanja harian Oktober', 'belanja', 'keluar', 1980000),
  T('2026-10-31', 'Total makan & jajan Oktober', 'makan', 'keluar', 1150000),
  T('2026-10-31', 'Total rumah & utilitas Oktober', 'rumah', 'keluar', 1720000),
  T('2026-10-31', 'Total transportasi Oktober', 'transport', 'keluar', 820000),
  T('2026-10-31', 'Total sekolah anak Oktober', 'sekolah', 'keluar', 1480000),
  T('2026-10-31', 'Total kesehatan Oktober', 'kesehatan', 'keluar', 420000),
  T('2026-10-31', 'Total hiburan Oktober', 'hiburan', 'keluar', 380000),
  T('2026-10-31', 'Setor tabungan Oktober', 'tabungan', 'keluar', 1500000),
  // --- September 2026 (ringkas, untuk tren) ---
  T('2026-09-01', 'Gaji pokok September', 'tabungan', 'masuk', 9500000),
  T('2026-09-05', 'Pesanan katering ibu', 'tabungan', 'masuk', 1800000),
  T('2026-09-30', 'Total belanja harian September', 'belanja', 'keluar', 2050000),
  T('2026-09-30', 'Total makan & jajan September', 'makan', 'keluar', 1230000),
  T('2026-09-30', 'Total rumah & utilitas September', 'rumah', 'keluar', 1690000),
  T('2026-09-30', 'Total transportasi September', 'transport', 'keluar', 780000),
  T('2026-09-30', 'Total sekolah anak September', 'sekolah', 'keluar', 1450000),
  T('2026-09-30', 'Total kesehatan September', 'kesehatan', 'keluar', 390000),
  T('2026-09-30', 'Total hiburan September', 'hiburan', 'keluar', 310000),
  T('2026-09-30', 'Setor tabungan September', 'tabungan', 'keluar', 1200000),
];

export const TIPS = [
  {
    judul: 'Belanja pasar seminggu sekali',
    isi: 'Buat daftar belanja sebelum ke pasar dan patuhi daftar itu. Keluarga contoh menghemat sekitar Rp 150.000 per bulan dengan cara ini dibanding belanja harian tanpa daftar.',
    hemat: '± Rp 150.000/bln',
  },
  {
    judul: 'Masak bekal, kurangi jajan di luar',
    isi: 'Satu porsi makan siang di luar rata-rata Rp 25.000–Rp 35.000. Membawa bekal 4 hari seminggu bisa memangkas pos Makan & Jajan sampai 30%.',
    hemat: '± Rp 300.000/bln',
  },
  {
    judul: 'Token listrik: pakai lampu LED & cabut charger',
    isi: 'Lampu LED 9 watt menggantikan bohlam 40 watt memangkas tagihan lampu sampai 70%. Keluarga contoh memakai token 200 kWh + 100 kWh per bulan.',
    hemat: '± Rp 80.000/bln',
  },
  {
    judul: 'Dana darurat dulu, baru hiburan',
    isi: 'Target dana darurat 3–6 kali pengeluaran bulanan. Keluarga contoh menabung Rp 1.000.000–Rp 1.500.000 per bulan sampai terkumpul Rp 30.000.000.',
    hemat: 'Target Rp 30 jt',
  },
  {
    judul: 'Bandingkan harga sebelum beli',
    isi: 'Untuk belanja bulanan (beras, minyak, sabun), cek harga di 2–3 tempat. Selisih Rp 2.000–Rp 5.000 per item terasa kalau dikali puluhan item.',
    hemat: '± Rp 100.000/bln',
  },
  {
    judul: 'Aturan 24 jam untuk belanja impulsif',
    isi: 'Tunda pembelian non-esensial 24 jam. Sebagian besar keinginan hilang sendiri — dan yang tersisa memang benar-benar dibutuhkan.',
    hemat: 'Tergantung barang',
  },
];

export const SUMBER = [
  { label: 'Upah Minimum Provinsi DKI Jakarta 2025', nilai: 'Rp 5.396.761/bulan', acuan: 'Pergub DKI Jakarta — dipakai sebagai acuan kewajaran gaji contoh' },
  { label: 'Tarif listrik rumah tangga 1.300 VA', nilai: '± Rp 1.444,70/kWh', acuan: 'Tarif dasar listrik PLN 2025 — token 200 kWh ≈ Rp 289.000' },
  { label: 'Harga Pertalite', nilai: 'Rp 10.000/liter', acuan: 'Harga eceran Pertamina 2025–2026' },
  { label: 'SPP sekolah swasta Jakarta Timur', nilai: 'Rp 650.000–Rp 750.000/bulan', acuan: 'Kisaran umum sekolah swasta — angka contoh, bukan tarif resmi satu sekolah' },
  { label: 'Aturan 50-30-20', nilai: '50% kebutuhan, 30% keinginan, 20% tabungan', acuan: 'Metode populer perencanaan anggaran rumah tangga (Elizabeth Warren, "All Your Worth")' },
  { label: 'Dana darurat ideal', nilai: '3–6 bulan pengeluaran', acuan: 'Anjuran umum perencana keuangan untuk keluarga dengan satu pencari nafkah utama' },
];

export const BULAN_NAMA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function namaBulan(kode) {
  // kode: '2026-11'
  const [tahun, bulan] = kode.split('-').map(Number);
  return `${BULAN_NAMA[bulan - 1]} ${tahun}`;
}

export function bulanDariTanggal(tanggal) {
  return tanggal.slice(0, 7);
}

export function formatRupiah(nilai) {
  return 'Rp ' + Math.round(nilai).toLocaleString('id-ID');
}

export function formatTanggal(tanggal) {
  const [t, b, h] = tanggal.split('-').map(Number);
  return `${h} ${BULAN_NAMA[b - 1]} ${t}`;
}
