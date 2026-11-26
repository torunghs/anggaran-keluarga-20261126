// DompetKeluarga — router hash, state (localStorage), dan wiring kontrol.
// Semua data tersimpan lokal di perangkat; situs tidak mengirim apa pun.

import { KATEGORI, TRANSAKSI_AWAL, ANGGARAN_AWAL, KELUARGA, formatRupiah, bulanDariTanggal } from './data.js';
import { renderBeranda, renderAnggaran, renderTransaksi, renderLaporan, renderKalkulator, renderTips } from './views.js';

const KUNCI = 'dompetkeluarga-v1';
const DANA_DARURAT_TARGET = 30000000;

function muatState() {
  try {
    const mentah = localStorage.getItem(KUNCI);
    if (mentah) {
      const parsed = JSON.parse(mentah);
      if (Array.isArray(parsed.transaksi) && parsed.anggaran) return parsed;
    }
  } catch {
    // localStorage rusak / tidak tersedia: pakai data contoh.
  }
  return {
    transaksi: TRANSAKSI_AWAL.map((t, i) => ({ ...t, id: `awal-${i + 1}` })),
    anggaran: { ...ANGGARAN_AWAL },
  };
}

function simpanState() {
  try {
    localStorage.setItem(KUNCI, JSON.stringify({ transaksi: store.transaksi, anggaran: store.anggaran }));
  } catch {
    // Penyimpanan penuh / tidak tersedia: situs tetap jalan di memori.
  }
}

const data = muatState();

const store = {
  bulan: '2026-11',
  transaksi: data.transaksi,
  anggaran: data.anggaran,
  filter: { cari: '', kategori: '', jenis: '', bulan: '', urut: 'tanggal-desc' },

  totalMasuk(bulan) {
    return this.transaksi
      .filter((t) => t.jenis === 'masuk' && bulanDariTanggal(t.tanggal) === bulan)
      .reduce((s, t) => s + t.jumlah, 0);
  },
  totalKeluar(bulan) {
    return this.transaksi
      .filter((t) => t.jenis === 'keluar' && bulanDariTanggal(t.tanggal) === bulan && t.kategori !== 'tabungan')
      .reduce((s, t) => s + t.jumlah, 0);
  },
  keluarPerKategori(bulan) {
    const hasil = {};
    for (const t of this.transaksi) {
      if (t.jenis === 'keluar' && bulanDariTanggal(t.tanggal) === bulan) {
        hasil[t.kategori] = (hasil[t.kategori] || 0) + t.jumlah;
      }
    }
    return hasil;
  },
  danaDaruratTerkumpul() {
    return this.transaksi
      .filter((t) => t.kategori === 'tabungan' && t.jenis === 'keluar')
      .reduce((s, t) => s + t.jumlah, 0);
  },
  kebutuhanBulan(bulan) {
    const butuh = ['belanja', 'rumah', 'transport', 'sekolah', 'kesehatan'];
    return this.transaksi
      .filter((t) => t.jenis === 'keluar' && bulanDariTanggal(t.tanggal) === bulan && butuh.includes(t.kategori))
      .reduce((s, t) => s + t.jumlah, 0);
  },
  transaksiTerfilter() {
    const f = this.filter;
    let daftar = [...this.transaksi];
    if (f.cari) {
      const q = f.cari.toLowerCase();
      daftar = daftar.filter(
        (t) =>
          t.deskripsi.toLowerCase().includes(q) ||
          (KATEGORI.find((k) => k.id === t.kategori)?.nama.toLowerCase().includes(q) ?? false),
      );
    }
    if (f.kategori) daftar = daftar.filter((t) => t.kategori === f.kategori);
    if (f.jenis) daftar = daftar.filter((t) => t.jenis === f.jenis);
    if (f.bulan) daftar = daftar.filter((t) => bulanDariTanggal(t.tanggal) === f.bulan);
    const urut = {
      'tanggal-desc': (a, b) => (a.tanggal < b.tanggal ? 1 : -1),
      'tanggal-asc': (a, b) => (a.tanggal > b.tanggal ? 1 : -1),
      'jumlah-desc': (a, b) => b.jumlah - a.jumlah,
      'jumlah-asc': (a, b) => a.jumlah - b.jumlah,
      'nama-asc': (a, b) => a.deskripsi.localeCompare(b.deskripsi, 'id'),
    };
    daftar.sort(urut[f.urut] || urut['tanggal-desc']);
    return daftar;
  },
  tambah(tx) {
    tx.id = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.transaksi.push(tx);
    simpanState();
    return tx;
  },
  ubah(id, tx) {
    const i = this.transaksi.findIndex((t) => t.id === id);
    if (i >= 0) {
      this.transaksi[i] = { ...tx, id };
      simpanState();
    }
  },
  hapus(id) {
    this.transaksi = this.transaksi.filter((t) => t.id !== id);
    simpanState();
  },
  setAnggaran(id, nilai) {
    this.anggaran[id] = Math.max(0, Math.round(nilai));
    simpanState();
  },
  reset() {
    this.transaksi = TRANSAKSI_AWAL.map((t, i) => ({ ...t, id: `awal-${i + 1}` }));
    this.anggaran = { ...ANGGARAN_AWAL };
    simpanState();
  },
};

const RUTE = {
  '/': renderBeranda,
  '/anggaran': renderAnggaran,
  '/transaksi': renderTransaksi,
  '/laporan': renderLaporan,
  '/kalkulator': renderKalkulator,
  '/tips': renderTips,
};

const view = document.getElementById('view');
const nav = document.querySelectorAll('nav a[data-route]');

function ruteSaatIni() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return RUTE[hash] ? hash : '/';
}

function render() {
  const rute = ruteSaatIni();
  view.innerHTML = RUTE[rute](store);
  nav.forEach((a) => a.classList.toggle('aktif', a.dataset.route === rute));
  window.scrollTo(0, 0);
  pasangKontrol(rute);
}

function pasangKontrol(rute) {
  // Pemilih bulan (Beranda & Laporan).
  document.querySelectorAll('[data-pilih-bulan]').forEach((sel) => {
    sel.addEventListener('change', () => {
      store.bulan = sel.value;
      render();
    });
  });

  if (rute === '/anggaran') {
    document.querySelectorAll('[data-anggaran-input]').forEach((input) => {
      input.addEventListener('change', () => {
        store.setAnggaran(input.dataset.anggaranInput, Number(input.value) || 0);
        render();
      });
    });
    document.querySelectorAll('[data-anggaran-range]').forEach((range) => {
      range.addEventListener('input', () => {
        const id = range.dataset.anggaranRange;
        store.setAnggaran(id, Number(range.value) || 0);
        const item = range.closest('.anggaran-item');
        const angka = item.querySelector(`[data-anggaran-input="${id}"]`);
        if (angka) angka.value = range.value;
        const persenEl = item.querySelector('.anggaran-persen');
        const pakai = store.keluarPerKategori(store.bulan)[id] || 0;
        const ang = store.anggaran[id];
        const persen = ang > 0 ? Math.min(100, Math.round((pakai / ang) * 100)) : 0;
        if (persenEl) {
          persenEl.textContent = `${persen}% terpakai`;
          persenEl.className = `anggaran-persen ${persen >= 100 ? 'lewat' : persen >= 80 ? 'hampir' : 'aman'}`;
        }
        const isi = item.querySelector('.progress-isi');
        if (isi) {
          isi.style.width = `${persen}%`;
          isi.className = `progress-isi ${persen >= 100 ? 'lewat' : persen >= 80 ? 'hampir' : 'aman'}`;
        }
        const kepala = item.querySelector('.anggaran-pakai');
        if (kepala) kepala.innerHTML = `${formatRupiah(pakai)} <span class="kecil">dari ${formatRupiah(ang)}</span>`;
        const status = document.getElementById('anggaran-status');
        if (status) status.textContent = 'Anggaran tersimpan otomatis.';
      });
    });
    const reset = document.getElementById('reset-anggaran');
    if (reset) {
      reset.addEventListener('click', () => {
        store.anggaran = { ...ANGGARAN_AWAL };
        simpanState();
        render();
      });
    }
  }

  if (rute === '/transaksi') {
    const form = document.getElementById('form-transaksi');
    const status = document.getElementById('form-status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const tx = {
        tanggal: document.getElementById('tx-tanggal').value,
        deskripsi: document.getElementById('tx-deskripsi').value.trim(),
        kategori: document.getElementById('tx-kategori').value,
        jenis: document.getElementById('tx-jenis').value,
        jumlah: Number(document.getElementById('tx-jumlah').value),
      };
      if (!tx.tanggal || !tx.deskripsi || !(tx.jumlah > 0)) {
        status.textContent = 'Lengkapi tanggal, deskripsi, dan jumlah yang valid.';
        return;
      }
      const idEdit = document.getElementById('tx-id').value;
      if (idEdit) {
        store.ubah(idEdit, tx);
        status.textContent = `Transaksi "${tx.deskripsi}" berhasil diubah.`;
      } else {
        store.tambah(tx);
        status.textContent = `Transaksi "${tx.deskripsi}" (${formatRupiah(tx.jumlah)}) berhasil ditambahkan.`;
      }
      render();
      const st = document.getElementById('form-status');
      if (st) st.textContent = status.textContent;
    });
    document.getElementById('tx-batal').addEventListener('click', () => render());

    const terapkanFilter = () => {
      store.filter.cari = document.getElementById('cari-transaksi').value;
      store.filter.kategori = document.getElementById('filter-kategori').value;
      store.filter.jenis = document.getElementById('filter-jenis').value;
      store.filter.bulan = document.getElementById('filter-bulan').value;
      store.filter.urut = document.getElementById('urut-transaksi').value;
      render();
      const cari = document.getElementById('cari-transaksi');
      if (cari) {
        cari.focus();
        cari.setSelectionRange(cari.value.length, cari.value.length);
      }
    };
    document.getElementById('cari-transaksi').addEventListener('input', terapkanFilter);
    ['filter-kategori', 'filter-jenis', 'filter-bulan', 'urut-transaksi'].forEach((id) => {
      document.getElementById(id).addEventListener('change', terapkanFilter);
    });

    document.querySelectorAll('[data-ubah]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tx = store.transaksi.find((t) => t.id === btn.dataset.ubah);
        if (!tx) return;
        document.getElementById('tx-id').value = tx.id;
        document.getElementById('tx-tanggal').value = tx.tanggal;
        document.getElementById('tx-deskripsi').value = tx.deskripsi;
        document.getElementById('tx-kategori').value = tx.kategori;
        document.getElementById('tx-jenis').value = tx.jenis;
        document.getElementById('tx-jumlah').value = tx.jumlah;
        document.getElementById('judul-form').textContent = 'Ubah transaksi';
        document.getElementById('tx-simpan').textContent = 'Simpan perubahan';
        document.getElementById('tx-batal').hidden = false;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    document.querySelectorAll('[data-hapus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tx = store.transaksi.find((t) => t.id === btn.dataset.hapus);
        if (tx && window.confirm(`Hapus transaksi "${tx.deskripsi}" (${formatRupiah(tx.jumlah)})?`)) {
          store.hapus(tx.id);
          render();
          const st = document.getElementById('form-status');
          if (st) st.textContent = `Transaksi "${tx.deskripsi}" dihapus.`;
        }
      });
    });
    const reset = document.getElementById('reset-data');
    if (reset) {
      reset.addEventListener('click', () => {
        if (window.confirm('Kembalikan semua data ke contoh awal? Perubahanmu akan hilang.')) {
          store.reset();
          render();
        }
      });
    }
  }

  if (rute === '/kalkulator') {
    document.getElementById('form-503020').addEventListener('submit', (e) => {
      e.preventDefault();
      const gaji = Number(document.getElementById('kalk-gaji').value) || 0;
      const kebutuhan = Math.round(gaji * 0.5);
      const keinginan = Math.round(gaji * 0.3);
      const tabungan = Math.round(gaji * 0.2);
      const realisasi = store.kebutuhanBulan('2026-11');
      document.getElementById('hasil-503020').innerHTML = `
        <table class="tabel hasil">
          <thead><tr><th>Pos</th><th class="angka">Aturan</th><th class="angka">Jumlah</th></tr></thead>
          <tbody>
            <tr><td>Kebutuhan pokok</td><td class="angka">50%</td><td class="angka">${formatRupiah(kebutuhan)}</td></tr>
            <tr><td>Keinginan</td><td class="angka">30%</td><td class="angka">${formatRupiah(keinginan)}</td></tr>
            <tr><td>Tabungan &amp; utang</td><td class="angka">20%</td><td class="angka">${formatRupiah(tabungan)}</td></tr>
          </tbody>
        </table>
        <p class="kecil">Kebutuhan keluarga contoh bulan November: ${formatRupiah(realisasi)} — ${realisasi <= kebutuhan ? 'masih di bawah batas 50% (' + formatRupiah(kebutuhan) + ').' : 'melewati batas 50% (' + formatRupiah(kebutuhan) + '), perlu ditinjau.'}</p>`;
    });
    document.getElementById('form-darurat').addEventListener('submit', (e) => {
      e.preventDefault();
      const pengeluaran = Number(document.getElementById('dana-pengeluaran').value) || 0;
      const bulanTarget = Number(document.getElementById('dana-bulan').value) || 6;
      const terkumpul = Number(document.getElementById('dana-terkumpul').value) || 0;
      const target = pengeluaran * bulanTarget;
      const kurang = Math.max(0, target - terkumpul);
      const persen = target > 0 ? Math.min(100, Math.round((terkumpul / target) * 100)) : 0;
      const perBulan = Math.ceil(kurang / 12);
      document.getElementById('hasil-darurat').innerHTML = `
        <p>Target dana darurat <strong>${bulanTarget} bulan</strong>: <strong>${formatRupiah(target)}</strong></p>
        <div class="progress"><span class="progress-isi ${persen >= 100 ? 'lewat' : persen >= 50 ? 'hampir' : 'aman'}" style="width:${persen}%"></span></div>
        <p>Terkumpul <strong>${formatRupiah(terkumpul)}</strong> (${persen}%) · masih kurang <strong>${formatRupiah(kurang)}</strong>${kurang > 0 ? ` · menabung ${formatRupiah(perBulan)}/bulan melunasinya dalam 12 bulan.` : ' · target tercapai, pertahankan!'}</p>`;
    });
    // Hitung sekali saat halaman dibuka, agar hasilnya langsung terlihat.
    document.getElementById('kalk-hitung').click();
    document.getElementById('dana-hitung').click();
  }
}

window.addEventListener('hashchange', render);
render();
