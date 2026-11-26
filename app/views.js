// DompetKeluarga — tampilan tiap halaman (hash routes).
// Setiap fungsi mengembalikan HTML untuk <main id="view">.

import { KATEGORI, TIPS, SUMBER, KELUARGA, formatRupiah, formatTanggal, namaBulan, bulanDariTanggal } from './data.js';
import { donatKategori, batangBulanan, garisTren, legendaDonat } from './charts.js';

function kartuJudul(label, nilai, sub) {
  return `<div class="kartu-stat"><span class="stat-label">${label}</span><strong class="stat-nilai">${nilai}</strong><span class="stat-sub">${sub}</span></div>`;
}

function opsiKategori(pilih = '') {
  return KATEGORI.map((k) => `<option value="${k.id}"${k.id === pilih ? ' selected' : ''}>${k.ikon} ${k.nama}</option>`).join('');
}

function barisTransaksi(tx, bisaUbah = true) {
  const kat = KATEGORI.find((k) => k.id === tx.kategori);
  const kelas = tx.jenis === 'masuk' ? 'masuk' : 'keluar';
  const tanda = tx.jenis === 'masuk' ? '+' : '−';
  return `<tr data-id="${tx.id}">
    <td>${formatTanggal(tx.tanggal)}</td>
    <td>${tx.deskripsi}</td>
    <td><span class="chip" style="--chip:${kat ? kat.warna : '#888'}">${kat ? kat.ikon + ' ' + kat.nama : tx.kategori}</span></td>
    <td class="angka ${kelas}">${tanda} ${formatRupiah(tx.jumlah)}</td>
    ${bisaUbah ? `<td class="aksi"><button class="tombol-kecil" data-ubah="${tx.id}">Ubah</button> <button class="tombol-kecil bahaya" data-hapus="${tx.id}">Hapus</button></td>` : ''}
  </tr>`;
}

export function renderBeranda(store) {
  const bulan = store.bulan;
  const masuk = store.totalMasuk(bulan);
  const keluar = store.totalKeluar(bulan);
  const sisa = masuk - keluar;
  const perKat = store.keluarPerKategori(bulan);
  const bagian = KATEGORI.filter((k) => k.id !== 'tabungan').map((k) => ({
    label: k.nama,
    nilai: perKat[k.id] || 0,
    warna: k.warna,
  }));
  const tren = ['2026-09', '2026-10', '2026-11'].map((b) => ({
    label: namaBulan(b).replace(' 2026', ''),
    nilai: store.totalKeluar(b),
  }));
  const terbaru = [...store.transaksi]
    .filter((t) => bulanDariTanggal(t.tanggal) === bulan)
    .sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
    .slice(0, 6);
  const hampirHabis = KATEGORI.filter((k) => {
    const ang = store.anggaran[k.id] || 0;
    return ang > 0 && (perKat[k.id] || 0) / ang >= 0.8 && k.id !== 'tabungan';
  });
  const peringatan = hampirHabis.length
    ? `<div class="peringatan" role="alert">⚠️ ${hampirHabis
        .map((k) => {
          const persen = Math.round(((perKat[k.id] || 0) / store.anggaran[k.id]) * 100);
          return `${k.nama} ${persen >= 100 ? 'melewati anggaran' : 'hampir habis'} (${persen}%)`;
        })
        .join(', ')}. <a href="#/anggaran">Atur anggaran →</a></div>`
    : '';
  return `
  <section class="hero">
    <div>
      <h1>Anggaran ${namaBulan(bulan)} keluarga ${KELUARGA.nama.replace('Keluarga ', '')} terkendali.</h1>
      <p class="hero-sub">${KELUARGA.kota} · ${KELUARGA.anggota} anggota keluarga · penghasilan ${formatRupiah(KELUARGA.penghasilanBulanan)}/bulan. Angka nyata dari catatan contoh — ubah bulan, tambah transaksi, atau atur anggaranmu sendiri.</p>
      <p><a class="tombol" href="#/transaksi">+ Tambah transaksi</a> <a class="tombol sekunder" href="#/kalkulator">Hitung 50-30-20 →</a></p>
    </div>
    <div class="hero-bulan">
      <label for="pilih-bulan">Bulan yang ditampilkan</label>
      <select id="pilih-bulan" data-pilih-bulan>
        ${['2026-09', '2026-10', '2026-11'].map((b) => `<option value="${b}"${b === bulan ? ' selected' : ''}>${namaBulan(b)}</option>`).join('')}
      </select>
      <p class="kecil">Data contoh tersedia September–November 2026.</p>
    </div>
  </section>
  ${peringatan}
  <section class="grid-stat">
    ${kartuJudul('Pemasukan', formatRupiah(masuk), 'gaji + usaha katering')}
    ${kartuJudul('Pengeluaran', formatRupiah(keluar), 'semua kategori di bulan ini')}
    ${kartuJudul('Sisa', formatRupiah(sisa), sisa >= 0 ? 'masih surplus — bagus!' : 'defisit, cek anggaran')}
    ${kartuJudul('Dana darurat', formatRupiah(store.danaDaruratTerkumpul()), 'dari target Rp 30.000.000')}
  </section>
  <section class="grid-dua">
    <div class="panel">
      <h2>Pengeluaran per kategori</h2>
      <div class="donat-wrap">${donatKategori(bagian)}<ul class="legenda">${legendaDonat(bagian)}</ul></div>
    </div>
    <div class="panel">
      <h2>Tren pengeluaran 3 bulan</h2>
      ${garisTren(tren)}
      <p class="kecil">Pengeluaran November turun dibanding Oktober — pos belanja harian dan hiburan lebih hemat.</p>
    </div>
  </section>
  <section class="panel">
    <h2>Transaksi terbaru — ${namaBulan(bulan)}</h2>
    <table class="tabel">
      <thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th class="angka">Jumlah</th></tr></thead>
      <tbody>${terbaru.map((t) => barisTransaksi(t, false)).join('')}</tbody>
    </table>
    <p><a href="#/transaksi">Lihat semua transaksi →</a></p>
  </section>`;
}

export function renderAnggaran(store) {
  const bulan = store.bulan;
  const perKat = store.keluarPerKategori(bulan);
  const totalAnggaran = KATEGORI.reduce((s, k) => s + (store.anggaran[k.id] || 0), 0);
  const totalPakai = KATEGORI.reduce((s, k) => s + (perKat[k.id] || 0), 0);
  const baris = KATEGORI.map((k) => {
    const ang = store.anggaran[k.id] || 0;
    const pakai = perKat[k.id] || 0;
    const persen = ang > 0 ? Math.min(100, Math.round((pakai / ang) * 100)) : 0;
    const status = persen >= 100 ? 'lewat' : persen >= 80 ? 'hampir' : 'aman';
    return `<article class="anggaran-item" data-kategori="${k.id}">
      <div class="anggaran-kepala"><span class="anggaran-nama">${k.ikon} ${k.nama}</span><span class="anggaran-pakai">${formatRupiah(pakai)} <span class="kecil">dari ${formatRupiah(ang)}</span></span></div>
      <div class="progress" role="progressbar" aria-valuenow="${persen}" aria-valuemin="0" aria-valuemax="100"><span class="progress-isi ${status}" style="width:${persen}%"></span></div>
      <div class="anggaran-kontrol">
        <label>Anggaran <input type="number" min="0" step="50000" value="${ang}" data-anggaran-input="${k.id}" aria-label="Anggaran ${k.nama}"> </label>
        <input type="range" min="0" max="3000000" step="50000" value="${ang}" data-anggaran-range="${k.id}" aria-label="Geser anggaran ${k.nama}">
        <span class="anggaran-persen ${status}">${persen}% terpakai</span>
      </div>
    </article>`;
  }).join('');
  return `
  <h1>Anggaran ${namaBulan(bulan)}</h1>
  <p class="intro">Atur batas belanja tiap kategori. Geser slider atau ketik angka — progress bar langsung berubah dan tersimpan otomatis di perangkatmu.</p>
  <section class="grid-stat">
    ${kartuJudul('Total anggaran', formatRupiah(totalAnggaran), 'semua kategori')}
    ${kartuJudul('Terpakai', formatRupiah(totalPakai), `${totalAnggaran ? Math.round((totalPakai / totalAnggaran) * 100) : 0}% dari total anggaran`)}
    ${kartuJudul('Sisa anggaran', formatRupiah(totalAnggaran - totalPakai), 'batas yang belum dipakai')}
  </section>
  <section class="anggaran-daftar">${baris}</section>
  <p><button class="tombol sekunder" id="reset-anggaran">Kembalikan anggaran contoh</button> <span class="kecil" id="anggaran-status" aria-live="polite"></span></p>`;
}

export function renderTransaksi(store) {
  const f = store.filter;
  const daftar = store.transaksiTerfilter();
  const totalMasuk = daftar.filter((t) => t.jenis === 'masuk').reduce((s, t) => s + t.jumlah, 0);
  const totalKeluar = daftar.filter((t) => t.jenis === 'keluar').reduce((s, t) => s + t.jumlah, 0);
  return `
  <h1>Transaksi</h1>
  <p class="intro">Semua pemasukan dan pengeluaran keluarga. Cari, saring, urutkan, tambah, ubah, atau hapus — perubahan tersimpan di perangkatmu (localStorage).</p>
  <section class="panel">
    <h2 id="judul-form">Tambah transaksi baru</h2>
    <form id="form-transaksi" class="form-grid">
      <input type="hidden" id="tx-id" value="">
      <label>Tanggal <input type="date" id="tx-tanggal" value="2026-11-26" required></label>
      <label>Deskripsi <input type="text" id="tx-deskripsi" placeholder="cth: Belanja pasar minggu 5" required maxlength="80"></label>
      <label>Kategori <select id="tx-kategori">${opsiKategori()}</select></label>
      <label>Jenis <select id="tx-jenis"><option value="keluar">Pengeluaran</option><option value="masuk">Pemasukan</option></select></label>
      <label>Jumlah (Rp) <input type="number" id="tx-jumlah" min="1000" step="1000" placeholder="150000" required></label>
      <span class="form-aksi"><button class="tombol" type="submit" id="tx-simpan">Simpan transaksi</button>
      <button class="tombol sekunder" type="button" id="tx-batal" hidden>Batal ubah</button></span>
    </form>
    <p class="kecil" id="form-status" aria-live="polite"></p>
  </section>
  <section class="panel">
    <div class="filter-bar">
      <label>Cari <input type="search" id="cari-transaksi" placeholder="cth: pasar, listrik, SPP" value="${f.cari}" aria-label="Cari transaksi"></label>
      <label>Kategori <select id="filter-kategori"><option value="">Semua kategori</option>${opsiKategori(f.kategori)}</select></label>
      <label>Jenis <select id="filter-jenis"><option value="">Semua</option><option value="masuk"${f.jenis === 'masuk' ? ' selected' : ''}>Pemasukan</option><option value="keluar"${f.jenis === 'keluar' ? ' selected' : ''}>Pengeluaran</option></select></label>
      <label>Bulan <select id="filter-bulan">
        <option value="">Semua bulan</option>
        ${['2026-09', '2026-10', '2026-11'].map((b) => `<option value="${b}"${f.bulan === b ? ' selected' : ''}>${namaBulan(b)}</option>`).join('')}
      </select></label>
      <label>Urutkan <select id="urut-transaksi">
        <option value="tanggal-desc"${f.urut === 'tanggal-desc' ? ' selected' : ''}>Tanggal (terbaru)</option>
        <option value="tanggal-asc"${f.urut === 'tanggal-asc' ? ' selected' : ''}>Tanggal (terlama)</option>
        <option value="jumlah-desc"${f.urut === 'jumlah-desc' ? ' selected' : ''}>Jumlah (terbesar)</option>
        <option value="jumlah-asc"${f.urut === 'jumlah-asc' ? ' selected' : ''}>Jumlah (terkecil)</option>
        <option value="nama-asc"${f.urut === 'nama-asc' ? ' selected' : ''}>Deskripsi (A–Z)</option>
      </select></label>
    </div>
    <p><strong>${daftar.length} transaksi</strong> · pemasukan ${formatRupiah(totalMasuk)} · pengeluaran ${formatRupiah(totalKeluar)} · selisih <strong>${formatRupiah(totalMasuk - totalKeluar)}</strong></p>
    <div class="tabel-scroll"><table class="tabel" id="tabel-transaksi">
      <thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th class="angka">Jumlah</th><th>Aksi</th></tr></thead>
      <tbody>${daftar.length ? daftar.map((t) => barisTransaksi(t)).join('') : '<tr><td colspan="5">Tidak ada transaksi yang cocok. Ubah pencarian atau tambahkan transaksi baru.</td></tr>'}</tbody>
    </table></div>
    <p><button class="tombol sekunder" id="reset-data">Kembalikan data contoh</button></p>
  </section>`;
}

export function renderLaporan(store) {
  const bulan = store.bulan;
  const masuk = store.totalMasuk(bulan);
  const keluar = store.totalKeluar(bulan);
  const perKat = store.keluarPerKategori(bulan);
  const seriKat = KATEGORI.filter((k) => k.id !== 'tabungan').map((k) => ({
    label: k.nama.replace(' & ', ' & ').split(' ')[0],
    nilai: perKat[k.id] || 0,
  }));
  const tren = ['2026-09', '2026-10', '2026-11'].map((b) => ({
    label: namaBulan(b).replace(' 2026', ''),
    nilai: store.totalKeluar(b),
  }));
  const terbesar = [...store.transaksi]
    .filter((t) => t.jenis === 'keluar' && bulanDariTanggal(t.tanggal) === bulan)
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 5);
  const vsAnggaran = KATEGORI.filter((k) => k.id !== 'tabungan').map((k) => {
    const ang = store.anggaran[k.id] || 0;
    const pakai = perKat[k.id] || 0;
    const selisih = ang - pakai;
    return `<tr><td>${k.ikon} ${k.nama}</td><td class="angka">${formatRupiah(ang)}</td><td class="angka">${formatRupiah(pakai)}</td><td class="angka ${selisih >= 0 ? 'masuk' : 'keluar'}">${selisih >= 0 ? 'hemat ' : 'lebih '}${formatRupiah(Math.abs(selisih))}</td></tr>`;
  }).join('');
  return `
  <h1>Laporan ${namaBulan(bulan)}</h1>
  <p class="intro">Ringkasan keuangan keluarga bulan ini: pemasukan, pengeluaran per kategori, tren tiga bulan, dan perbandingan dengan anggaran.</p>
  <div class="hero-bulan laporan-bulan">
    <label for="pilih-bulan-laporan">Bulan laporan</label>
    <select id="pilih-bulan-laporan" data-pilih-bulan>
      ${['2026-09', '2026-10', '2026-11'].map((b) => `<option value="${b}"${b === bulan ? ' selected' : ''}>${namaBulan(b)}</option>`).join('')}
    </select>
  </div>
  <section class="grid-stat">
    ${kartuJudul('Pemasukan', formatRupiah(masuk), 'gaji + usaha')}
    ${kartuJudul('Pengeluaran', formatRupiah(keluar), 'di luar setor tabungan')}
    ${kartuJudul('Tabungan bulan ini', formatRupiah(masuk - keluar), `${masuk ? Math.round(((masuk - keluar) / masuk) * 100) : 0}% dari pemasukan`)}
  </section>
  <section class="grid-dua">
    <div class="panel"><h2>Pengeluaran per kategori</h2>${batangBulanan(seriKat)}</div>
    <div class="panel"><h2>Tren pengeluaran</h2>${garisTren(tren)}
      <p class="kecil">September Rp ${(store.totalKeluar('2026-09') / 1000000).toFixed(2)} jt → Oktober Rp ${(store.totalKeluar('2026-10') / 1000000).toFixed(2)} jt → November Rp ${(keluar / 1000000).toFixed(2)} jt.</p>
    </div>
  </section>
  <section class="grid-dua">
    <div class="panel"><h2>5 pengeluaran terbesar</h2>
      <ol class="peringkat">${terbesar.map((t) => `<li><span>${formatTanggal(t.tanggal)} — ${t.deskripsi}</span><strong>${formatRupiah(t.jumlah)}</strong></li>`).join('')}</ol>
    </div>
    <div class="panel"><h2>Anggaran vs realisasi</h2>
      <table class="tabel"><thead><tr><th>Kategori</th><th class="angka">Anggaran</th><th class="angka">Realisasi</th><th class="angka">Selisih</th></tr></thead><tbody>${vsAnggaran}</tbody></table>
    </div>
  </section>
  <section class="panel"><h2>Kesimpulan bulan ini</h2>
    <p>Keluarga ${KELUARGA.nama.replace('Keluarga ', '')} menutup ${namaBulan(bulan)} dengan ${masuk - keluar >= 0 ? 'surplus' : 'defisit'} <strong>${formatRupiah(Math.abs(masuk - keluar))}</strong>. Kategori terbesar adalah <strong>${KATEGORI.find((k) => k.id === Object.entries(perKat).sort((a, b) => b[1] - a[1])[0][0])?.nama || '—'}</strong>. ${keluar < store.totalKeluar('2026-10') && bulan === '2026-11' ? 'Pengeluaran turun dibanding Oktober — kebiasaan belanja mingguan dengan daftar mulai terasa.' : 'Bandingkan dengan bulan lalu di grafik tren di atas.'} Dana darurat sudah terkumpul <strong>${formatRupiah(store.danaDaruratTerkumpul())}</strong> dari target Rp 30.000.000.</p>
  </section>`;
}

export function renderKalkulator(store) {
  return `
  <h1>Kalkulator Anggaran</h1>
  <p class="intro">Dua alat bantu: aturan 50-30-20 untuk membagi penghasilan, dan kalkulator dana darurat. Semua hitungan terjadi langsung di browser — tanpa dikirim ke mana pun.</p>
  <section class="grid-dua">
    <div class="panel">
      <h2>Aturan 50-30-20</h2>
      <p class="kecil">50% kebutuhan pokok · 30% keinginan · 20% tabungan &amp; utang. Metode dari buku <em>All Your Worth</em> (Elizabeth Warren).</p>
      <form id="form-503020" class="form-grid">
        <label>Penghasilan bulanan (Rp) <input type="number" id="kalk-gaji" min="0" step="1000" value="${KELUARGA.penghasilanBulanan}" required></label>
        <span class="form-aksi"><button class="tombol" type="submit" id="kalk-hitung">Hitung pembagian</button></span>
      </form>
      <div id="hasil-503020" aria-live="polite"></div>
    </div>
    <div class="panel">
      <h2>Kalkulator dana darurat</h2>
      <p class="kecil">Target umum: 3–6 bulan pengeluaran untuk keluarga dengan satu pencari nafkah utama.</p>
      <form id="form-darurat" class="form-grid">
        <label>Pengeluaran bulanan (Rp) <input type="number" id="dana-pengeluaran" min="0" step="1000" value="${store.totalKeluar('2026-11')}" required></label>
        <label>Target (bulan) <select id="dana-bulan"><option value="3">3 bulan (minimum)</option><option value="6" selected>6 bulan (aman)</option><option value="12">12 bulan (sangat aman)</option></select></label>
        <label>Sudah terkumpul (Rp) <input type="number" id="dana-terkumpul" min="0" step="1000" value="${store.danaDaruratTerkumpul()}" required></label>
        <span class="form-aksi"><button class="tombol" type="submit" id="dana-hitung">Hitung target</button></span>
      </form>
      <div id="hasil-darurat" aria-live="polite"></div>
    </div>
  </section>
  <section class="panel">
    <h2>Contoh pembagian untuk keluarga ini</h2>
    <p>Dengan penghasilan ${formatRupiah(KELUARGA.penghasilanBulanan)}: kebutuhan <strong>${formatRupiah(KELUARGA.penghasilanBulanan * 0.5)}</strong>, keinginan <strong>${formatRupiah(KELUARGA.penghasilanBulanan * 0.3)}</strong>, tabungan <strong>${formatRupiah(KELUARGA.penghasilanBulanan * 0.2)}</strong>. Realisasi November: kebutuhan (belanja + rumah + transport + sekolah + kesehatan) ${formatRupiah(store.kebutuhanBulan('2026-11'))} — ${store.kebutuhanBulan('2026-11') <= KELUARGA.penghasilanBulanan * 0.5 ? 'masih dalam batas 50%.' : 'melewati batas 50%, perlu ditinjau.'}</p>
  </section>`;
}

export function renderTips() {
  return `
  <h1>Tips Hemat &amp; Sumber Data</h1>
  <p class="intro">Enam kebiasaan hemat yang dipakai keluarga contoh, plus dari mana tiap angka acuan di situs ini berasal.</p>
  <section class="grid-tips">
    ${TIPS.map((t) => `<article class="panel tip"><h2>${t.judul}</h2><p>${t.isi}</p><p class="hemat">Potensi hemat: <strong>${t.hemat}</strong></p></article>`).join('')}
  </section>
  <section class="panel">
    <h2>Sumber &amp; asumsi angka</h2>
    <p class="kecil">Semua transaksi dan anggaran di situs ini adalah <strong>data contoh</strong> satu keluarga fiktif di Jakarta Timur, November 2026 — bukan data pribadi. Angka acuan di bawah ini dipakai untuk menjaga contoh tetap realistis.</p>
    <table class="tabel">
      <thead><tr><th>Acuan</th><th>Nilai</th><th>Keterangan</th></tr></thead>
      <tbody>${SUMBER.map((s) => `<tr><td>${s.label}</td><td>${s.nilai}</td><td>${s.acuan}</td></tr>`).join('')}</tbody>
    </table>
    <h3>Rincian penghasilan keluarga contoh</h3>
    <table class="tabel">
      <thead><tr><th>Sumber</th><th class="angka">Per bulan</th></tr></thead>
      <tbody>${KELUARGA.rincianPenghasilan.map((r) => `<tr><td>${r.sumber}</td><td class="angka">${formatRupiah(r.jumlah)}</td></tr>`).join('')}</tbody>
    </table>
  </section>`;
}
