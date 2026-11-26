// DompetKeluarga — grafik SVG murni, tanpa pustaka dan tanpa jaringan.
// Donat kategori, batang bulanan, dan garis tren pengeluaran.

export function donatKategori(bagian, ukuran = 220) {
  // bagian: [{label, nilai, warna}]
  const total = bagian.reduce((s, b) => s + b.nilai, 0);
  const r = 80;
  const cx = ukuran / 2;
  const cy = ukuran / 2;
  const keliling = 2 * Math.PI * r;
  let offset = 0;
  const busur = bagian
    .filter((b) => b.nilai > 0)
    .map((b) => {
      const fraksi = b.nilai / total;
      const panjang = fraksi * keliling;
      const s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${b.warna}" stroke-width="34" stroke-dasharray="${panjang.toFixed(2)} ${(
        keliling - panjang
      ).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"><title>${b.label}: ${b.nilai.toLocaleString(
        'id-ID',
      )}</title></circle>`;
      offset += panjang;
      return s;
    })
    .join('');
  const tengah = `<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donat-total">Rp ${(total / 1000000).toFixed(1)} jt</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donat-label">pengeluaran bulan ini</text>`;
  return `<svg viewBox="0 0 ${ukuran} ${ukuran}" class="grafik-donat" role="img" aria-label="Grafik donat pengeluaran per kategori">${busur}${tengah}</svg>`;
}

export function batangBulanan(series, tinggi = 200) {
  // series: [{label, nilai}]
  const maks = Math.max(...series.map((s) => s.nilai), 1);
  const lebar = 560;
  const alas = tinggi - 28;
  const lebarBar = Math.floor((lebar - 40) / series.length) - 14;
  const batang = series
    .map((s, i) => {
      const h = Math.max(4, Math.round((s.nilai / maks) * (alas - 30)));
      const x = 30 + i * (lebarBar + 14);
      const y = alas - h;
      return `<rect x="${x}" y="${y}" width="${lebarBar}" height="${h}" rx="5" fill="#2e7d5b"><title>${s.label}: Rp ${s.nilai.toLocaleString(
        'id-ID',
      )}</title></rect><text x="${x + lebarBar / 2}" y="${alas + 18}" text-anchor="middle" class="grafik-sumbut">${s.label}</text><text x="${x + lebarBar / 2}" y="${y - 6}" text-anchor="middle" class="grafik-nilai">Rp ${(s.nilai / 1000000).toFixed(1)} jt</text>`;
    })
    .join('');
  const garis = `<line x1="20" y1="${alas}" x2="${lebar - 10}" y2="${alas}" class="grafik-garis"/>`;
  return `<svg viewBox="0 0 ${lebar} ${tinggi}" class="grafik-batang" role="img" aria-label="Grafik batang pengeluaran bulanan">${garis}${batang}</svg>`;
}

export function garisTren(titik, tinggi = 200) {
  // titik: [{label, nilai}]
  const lebar = 560;
  const maks = Math.max(...titik.map((t) => t.nilai), 1);
  const min = Math.min(...titik.map((t) => t.nilai), 0);
  const rentang = Math.max(maks - min, 1);
  const atas = 24;
  const bawah = tinggi - 30;
  const x = (i) => 34 + (i * (lebar - 68)) / Math.max(titik.length - 1, 1);
  const y = (v) => bawah - ((v - min) / rentang) * (bawah - atas);
  const path = titik.map((t, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(t.nilai).toFixed(1)}`).join(' ');
  const area = `${path} L${x(titik.length - 1).toFixed(1)},${bawah} L${x(0).toFixed(1)},${bawah} Z`;
  const simpul = titik
    .map(
      (t, i) =>
        `<circle cx="${x(i).toFixed(1)}" cy="${y(t.nilai).toFixed(1)}" r="5" fill="#2e7d5b"><title>${t.label}: Rp ${t.nilai.toLocaleString(
          'id-ID',
        )}</title></circle><text x="${x(i).toFixed(1)}" y="${bawah + 18}" text-anchor="middle" class="grafik-sumbut">${t.label}</text><text x="${x(i).toFixed(1)}" y="${y(t.nilai).toFixed(1) - 10}" text-anchor="middle" class="grafik-nilai">Rp ${(t.nilai / 1000000).toFixed(1)} jt</text>`,
    )
    .join('');
  return `<svg viewBox="0 0 ${lebar} ${tinggi}" class="grafik-garis-tren" role="img" aria-label="Grafik garis tren pengeluaran"><path d="${area}" class="grafik-area"/><path d="${path}" class="grafik-jalur" fill="none"/>${simpul}</svg>`;
}

export function legendaDonat(bagian) {
  const total = bagian.reduce((s, b) => s + b.nilai, 0);
  return bagian
    .filter((b) => b.nilai > 0)
    .map(
      (b) =>
        `<li><span class="swatch" style="background:${b.warna}"></span><span class="legenda-nama">${b.label}</span><strong>${((b.nilai / total) * 100).toFixed(0)}%</strong><span class="legenda-nilai">Rp ${b.nilai.toLocaleString('id-ID')}</span></li>`,
    )
    .join('');
}
