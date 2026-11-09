'use strict';
(() => {
  const $ = (s, r = document) => r.querySelector(s);

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of kids) n.append(c);
    return n;
  }

  /* ---------- Tabs ---------- */
  const tabButtons = document.querySelectorAll('.tabs button');
  function showTab(name) {
    document.querySelectorAll('.panel').forEach(p => { p.hidden = p.id !== 'tab-' + name; });
    tabButtons.forEach(b => {
      if (b.dataset.tab === name) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
  }
  tabButtons.forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));

  /* ---------- Checklist ---------- */
  const G = 'https://myaccount.google.com/';
  const GROUPS = [
    {
      name: 'Masuk ke akun',
      items: [
        { id: 'two_step', w: 3, t: 'Verifikasi 2 Langkah aktif', d: 'Pelaku tetap tidak bisa masuk walau tahu sandi Anda.', u: G + 'signinoptions/twosv' },
        { id: 'unique_pw', w: 3, t: 'Sandi unik, minimal 12 karakter', d: 'Tidak dipakai di situs lain. Uji di tab Sandi.', u: G + 'signinoptions/password' },
        { id: 'passkey', w: 2, t: 'Passkey dibuat', d: 'Masuk dengan sidik jari, wajah, atau PIN. Tahan terhadap phishing.', u: G + 'signinoptions/passkeys' },
        { id: 'pw_checkup', w: 2, t: 'Checkup Pengelola Sandi bersih', d: 'Tidak ada sandi bocor, lemah, atau dipakai ulang.', u: 'https://passwords.google.com' },
        { id: 'no_sms', w: 1, t: 'Verifikasi pakai prompt atau aplikasi, bukan hanya SMS', d: 'SMS bisa dibajak lewat pemindahan nomor (SIM swap).', u: G + 'signinoptions/twosv' },
        { id: 'backup', w: 1, t: 'Kode cadangan disimpan aman', d: 'Dipakai bila HP hilang. Simpan di tempat terpisah dari HP.', u: G + 'signinoptions/twosv' }
      ]
    },
    {
      name: 'Pemulihan akun',
      items: [
        { id: 'rec_mail', w: 3, t: 'Email pemulihan benar dan milik Anda', d: 'Jika email ini dikuasai orang lain, akun Anda bisa diambil.', u: G + 'recovery/email' },
        { id: 'rec_phone', w: 2, t: 'Nomor pemulihan benar dan masih aktif', d: 'Hapus nomor lama yang sudah tidak Anda pegang.', u: G + 'recovery/phone' },
        { id: 'inactive', w: 1, t: 'Pengelola Akun Tidak Aktif diatur', d: 'Tentukan nasib akun jika lama tidak dipakai.', u: G + 'inactive' },
        { id: 'adv', w: 1, t: 'Pertimbangkan Program Perlindungan Lanjutan', d: 'Untuk yang berisiko tinggi, misalnya jurnalis, aktivis, atau pejabat.', u: 'https://landing.google.com/advancedprotection/' }
      ]
    },
    {
      name: 'Perangkat dan aktivitas',
      items: [
        { id: 'devices', w: 3, t: 'Semua perangkat yang masuk dikenali', d: 'Keluarkan perangkat asing, lama, atau bekas.', u: G + 'device-activity' },
        { id: 'recent', w: 3, t: 'Aktivitas keamanan terbaru tidak mencurigakan', d: 'Cari login dari lokasi atau perangkat yang asing.', u: G + 'notifications' },
        { id: 'alerts', w: 2, t: 'Pemberitahuan keamanan aktif', d: 'Agar Anda langsung tahu bila ada login baru.', u: G + 'notifications' },
        { id: 'lock', w: 2, t: 'HP dan komputer memakai kunci layar', d: 'PIN panjang atau biometrik. Hindari pola sederhana.' },
        { id: 'updates', w: 2, t: 'Sistem, browser, dan aplikasi diperbarui', d: 'Pembaruan menambal celah yang dipakai penyerang.' },
        { id: 'shared', w: 1, t: 'Tidak ada login tersisa di perangkat umum', d: 'Warnet, komputer kantor lama, atau HP teman.' }
      ]
    },
    {
      name: 'Aplikasi pihak ketiga',
      items: [
        { id: 'third', w: 3, t: 'Semua aplikasi yang punya akses dikenali', d: 'Cabut yang tidak dikenal atau sudah tidak dipakai.', u: G + 'connections' },
        { id: 'app_pw', w: 2, t: 'Sandi aplikasi tidak ada atau dikenali', d: 'Sandi aplikasi melewati Verifikasi 2 Langkah.', u: G + 'apppasswords' },
        { id: 'ext', w: 2, t: 'Ekstensi browser mencurigakan dihapus', d: 'Ekstensi bisa membaca semua yang Anda ketik.' }
      ]
    },
    {
      name: 'Pengaturan Gmail',
      items: [
        { id: 'fwd', w: 3, t: 'Tidak ada penerusan email ke alamat asing', d: 'Penyerang sering menerusi email diam-diam.', u: 'https://mail.google.com/mail/u/0/#settings/fwdandpop' },
        { id: 'filters', w: 3, t: 'Tidak ada filter yang mencurigakan', d: 'Waspadai filter yang menghapus atau menyembunyikan email keamanan.', u: 'https://mail.google.com/mail/u/0/#settings/filters' },
        { id: 'deleg', w: 2, t: 'Tidak ada delegasi akses yang asing', d: 'Orang lain tidak boleh bisa membaca atau mengirim email Anda.', u: 'https://mail.google.com/mail/u/0/#settings/accounts' }
      ]
    },
    {
      name: 'Kebiasaan',
      items: [
        { id: 'otp', w: 3, t: 'Tidak pernah membagikan kode OTP', d: 'Google tidak pernah meminta kode lewat chat atau telepon.' },
        { id: 'links', w: 2, t: 'Memeriksa tautan sebelum login', d: 'Ragu? Pakai tab Tautan, atau ketik alamatnya sendiri.' },
        { id: 'dark', w: 1, t: 'Memantau laporan web gelap bila tersedia', d: 'Tahu kapan email Anda muncul di data bocoran.', u: G + 'dark-web-report' }
      ]
    }
  ];

  const ALL = GROUPS.flatMap(g => g.items);
  const TOTAL_W = ALL.reduce((s, i) => s + i.w, 0);
  const KEY = 'gsa.v1';
  const CIRC = 326.73;
  let state = { done: {}, at: null };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && typeof p.done === 'object') state = { done: p.done || {}, at: p.at || null };
      }
    } catch (_) { /* penyimpanan tidak tersedia */ }
  }
  function save() {
    state.at = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* abaikan */ }
  }

  function render() {
    const root = $('#groups');
    root.replaceChildren();
    for (const g of GROUPS) {
      const doneN = g.items.filter(i => state.done[i.id]).length;
      const list = el('ul', { class: 'items' });
      for (const i of g.items) {
        const cb = el('input', { type: 'checkbox', id: 'c-' + i.id });
        cb.checked = !!state.done[i.id];
        cb.addEventListener('change', () => {
          if (cb.checked) state.done[i.id] = true; else delete state.done[i.id];
          save();
          update();
          li.classList.toggle('done', cb.checked);
        });
        const label = el('label', { class: 'check', for: 'c-' + i.id },
          cb,
          el('span', {}, el('strong', { text: i.t }), el('small', { text: i.d }))
        );
        const tag = el('span', { class: 'tag t' + i.w, text: i.w === 3 ? 'Penting' : i.w === 2 ? 'Disarankan' : 'Tambahan' });
        const meta = el('div', { class: 'meta' }, tag);
        if (i.u) meta.append(el('a', { class: 'open', href: i.u, target: '_blank', rel: 'noopener noreferrer', text: 'Buka pengaturan' }));
        const li = el('li', { class: 'item' + (cb.checked ? ' done' : ''), id: 'item-' + i.id }, label, meta);
        list.append(li);
      }
      const head = el('div', { class: 'group-head' },
        el('h3', { text: g.name }),
        el('span', { text: doneN + '/' + g.items.length, 'data-group': g.name })
      );
      root.append(el('section', { class: 'group' }, head, list));
    }
    update();
  }

  function update() {
    // group counters
    document.querySelectorAll('.group').forEach((sec, idx) => {
      const g = GROUPS[idx];
      const n = g.items.filter(i => state.done[i.id]).length;
      sec.querySelector('.group-head span').textContent = n + '/' + g.items.length;
    });

    const got = ALL.reduce((s, i) => s + (state.done[i.id] ? i.w : 0), 0);
    const pct = Math.round((got / TOTAL_W) * 100);
    const count = ALL.filter(i => state.done[i.id]).length;
    const level = pct >= 80 ? 'good' : pct >= 45 ? 'mid' : 'low';
    const label = count === 0 ? 'Belum diperiksa' : pct >= 90 ? 'Kuat' : pct >= 70 ? 'Baik' : pct >= 45 ? 'Cukup' : 'Rawan';

    $('#score').dataset.level = level;
    $('#scoreNum').textContent = pct;
    $('#scoreLabel').textContent = label;
    $('#scoreCount').textContent = count + ' dari ' + ALL.length + ' pemeriksaan selesai';
    $('#scoreDate').textContent = state.at
      ? 'Terakhir diubah ' + new Date(state.at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    $('#ringFg').style.strokeDashoffset = String(CIRC * (1 - pct / 100));

    // priority: top critical unchecked
    const todo = ALL.filter(i => i.w === 3 && !state.done[i.id]).slice(0, 3);
    const box = $('#priority');
    const ul = $('#priorityList');
    ul.replaceChildren();
    box.hidden = todo.length === 0;
    for (const i of todo) {
      const b = el('button', { type: 'button', text: i.t });
      b.addEventListener('click', () => {
        const target = $('#item-' + i.id);
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        $('#c-' + i.id).focus({ preventScroll: true });
      });
      ul.append(el('li', {}, b));
    }
  }

  $('#reset').addEventListener('click', () => {
    if (!confirm('Hapus semua centang?')) return;
    state = { done: {}, at: null };
    try { localStorage.removeItem(KEY); } catch (_) { /* abaikan */ }
    render();
  });

  /* ---------- Darurat ---------- */
  const STEPS = [
    ['Ganti sandi Google sekarang', 'Pakai sandi baru yang belum pernah dipakai di tempat lain.', G + 'signinoptions/password'],
    ['Keluarkan semua perangkat asing', 'Pilih perangkat yang tidak dikenal, lalu keluar.', G + 'device-activity'],
    ['Aktifkan Verifikasi 2 Langkah', 'Dan hapus metode yang bukan milik Anda.', G + 'signinoptions/twosv'],
    ['Cabut aplikasi pihak ketiga', 'Cabut semua yang tidak Anda kenali.', G + 'connections'],
    ['Periksa penerusan email dan filter Gmail', 'Penyerang sering menyisakan aturan tersembunyi.', 'https://mail.google.com/mail/u/0/#settings/fwdandpop'],
    ['Periksa email dan nomor pemulihan', 'Ganti bila sudah diubah oleh orang lain.', G + 'recovery/email'],
    ['Ganti sandi akun lain yang sandinya sama', 'Utamakan email lain, mobile banking, dan e-wallet.'],
    ['Beri tahu kontak dan bank bila perlu', 'Penyerang sering meminta uang atas nama Anda. Laporkan bila ada transaksi mencurigakan.']
  ];
  const stepsEl = $('#steps');
  for (const [t, d, u] of STEPS) {
    const li = el('li', {}, el('strong', { text: t }), el('span', { text: d }));
    if (u) li.append(el('a', { href: u, target: '_blank', rel: 'noopener noreferrer', text: 'Buka pengaturan' }));
    stepsEl.append(li);
  }

  /* ---------- Sandi: analisis lokal ---------- */
  const COMMON = new Set(['password', 'password1', 'passw0rd', '123456', '1234567', '12345678', '123456789', '1234567890', '111111', '000000', '123123', '654321', 'qwerty', 'qwerty123', 'qwertyuiop', 'abc123', 'iloveyou', 'admin', 'admin123', 'welcome', 'letmein', 'monkey', 'dragon', 'master', 'login', 'sayang', 'sayangku', 'rahasia', 'indonesia', 'bismillah', 'jakarta', 'bandung', 'surabaya', 'garudapancasila', 'pancasila', 'kucing', 'anjing', 'cintaku', 'cinta123', 'sandi', 'katasandi', 'gmail', 'google', 'google123', 'facebook', 'whatsapp', 'bahagia', 'merdeka']);
  const WORDS = ['password', 'passw0rd', 'qwerty', 'asdf', 'zxcv', 'admin', 'login', 'sayang', 'rahasia', 'indonesia', 'bismillah', 'jakarta', 'cinta', 'google', 'gmail', 'welcome', 'iloveyou', 'sandi', 'pancasila', 'merdeka'];

  function analyze(pw) {
    const chars = [...pw];
    const len = chars.length;
    if (!len) return null;
    const issues = [];
    let pool = 0;
    if (/[a-z]/.test(pw)) pool += 26;
    if (/[A-Z]/.test(pw)) pool += 26;
    if (/[0-9]/.test(pw)) pool += 10;
    if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
    let bits = len * Math.log2(pool || 1);

    const low = pw.toLowerCase();
    const leet = low.replace(/[@4]/g, 'a').replace(/3/g, 'e').replace(/[1!|]/g, 'i').replace(/0/g, 'o').replace(/[$5]/g, 's').replace(/7/g, 't');

    let common = false;
    if (COMMON.has(low) || COMMON.has(leet)) {
      common = true;
      issues.push('Sandi ini ada di daftar sandi paling umum.');
      bits = Math.min(bits, 12);
    } else {
      for (const w of WORDS) {
        if (leet.includes(w)) {
          issues.push('Mengandung kata atau pola yang mudah ditebak: "' + w + '".');
          bits -= Math.min(w.length * 4, 24);
          break;
        }
      }
    }
    if (/(.)\1{2,}/.test(pw)) { issues.push('Ada karakter yang diulang berturut-turut.'); bits -= 8; }
    if (hasSequence(low)) { issues.push('Ada urutan mudah ditebak seperti abc atau 123.'); bits -= 10; }
    if (/(19|20)\d{2}/.test(pw)) { issues.push('Mengandung tahun, yang biasanya tebakan pertama.'); bits -= 6; }
    if (/^[A-Za-z]{3,10}\d{1,4}[^A-Za-z0-9]?$/.test(pw)) {
      issues.push('Pola paling umum: satu kata, angka, lalu simbol. Penyerang mencoba ini lebih dulu.');
      bits = Math.min(bits, 30);
    }
    if (/^\d+$/.test(pw)) issues.push('Hanya angka. Tambahkan huruf dan simbol.');
    else if (/^[a-zA-Z]+$/.test(pw)) issues.push('Hanya huruf. Tambahkan angka dan simbol.');
    if (len < 8) issues.push('Terlalu pendek. Google mewajibkan minimal 8 karakter.');
    else if (len < 12) issues.push('Disarankan minimal 12 karakter.');

    bits = Math.max(0, bits);
    let level = bits < 28 ? 1 : bits < 40 ? 2 : bits < 60 ? 3 : bits < 80 ? 4 : 5;
    if (len < 8 || common) level = 1;
    else if (len < 12) level = Math.min(level, 3);
    const names = ['', 'Sangat lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat kuat'];
    return { level, name: names[level], bits, issues, len };
  }

  function hasSequence(s) {
    let run = 1, dir = 0;
    for (let i = 1; i < s.length; i++) {
      const d = s.charCodeAt(i) - s.charCodeAt(i - 1);
      if ((d === 1 || d === -1) && (dir === 0 || d === dir)) { run++; dir = d; if (run >= 3) return true; }
      else { run = (d === 1 || d === -1) ? 2 : 1; dir = (d === 1 || d === -1) ? d : 0; }
    }
    return false;
  }

  function crackTime(bits) {
    const seconds = Math.pow(2, bits) / 2 / 1e10; // 10 miliar tebakan/detik (serangan offline cepat)
    if (seconds < 1) return 'kurang dari 1 detik';
    const units = [[60, 'detik'], [60, 'menit'], [24, 'jam'], [365, 'hari']];
    let v = seconds;
    for (const [div, name] of units) {
      if (v < div) return Math.round(v) + ' ' + name;
      v /= div;
    }
    if (v < 1000) return Math.round(v) + ' tahun';
    if (v < 1e6) return Math.round(v / 1e3) + ' ribu tahun';
    if (v < 1e9) return Math.round(v / 1e6) + ' juta tahun';
    return 'lebih dari 1 miliar tahun';
  }

  const pw = $('#pw');
  const breach = $('#breach');

  function onPwInput() {
    breach.hidden = true;
    const r = analyze(pw.value);
    $('#pwCheck').disabled = !r;
    const issues = $('#issues');
    issues.replaceChildren();
    if (!r) {
      $('#meter').dataset.level = '0';
      $('#strength').textContent = 'Ketik sandi untuk mulai.';
      $('#crack').textContent = '';
      return;
    }
    $('#meter').dataset.level = String(r.level);
    $('#strength').textContent = r.name + ' (' + r.len + ' karakter)';
    $('#crack').textContent = 'Perkiraan kasar waktu untuk menebak: ' + crackTime(r.bits) + '.';
    r.issues.forEach(t => issues.append(el('li', { text: t })));
  }
  pw.addEventListener('input', onPwInput);
  $('#pwShow').addEventListener('change', e => { pw.type = e.target.checked ? 'text' : 'password'; });
  $('#pwClear').addEventListener('click', clearPw);
  function clearPw() {
    pw.value = '';
    $('#pwShow').checked = false;
    pw.type = 'password';
    onPwInput();
  }
  // bersihkan sandi saat aplikasi ditutup atau pindah
  window.addEventListener('pagehide', clearPw);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearPw(); });

  async function sha1Hex(s) {
    const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function setBreach(cls, text) {
    breach.className = 'result ' + cls;
    breach.textContent = text;
    breach.hidden = false;
  }

  $('#pwCheck').addEventListener('click', async () => {
    const value = pw.value;
    if (!value) return;
    if (!window.crypto || !crypto.subtle) {
      setBreach('warn', 'Cek kebocoran butuh koneksi aman (HTTPS). Buka aplikasi lewat alamat https.');
      return;
    }
    const btn = $('#pwCheck');
    btn.disabled = true;
    setBreach('warn', 'Memeriksa...');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    try {
      const hash = await sha1Hex(value);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch('https://api.pwnedpasswords.com/range/' + prefix, {
        headers: { 'Add-Padding': 'true' },
        cache: 'no-store',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        signal: ctrl.signal
      });
      if (!res.ok) throw new Error('status ' + res.status);
      const text = await res.text();
      let count = 0;
      for (const line of text.split('\n')) {
        const [h, c] = line.trim().split(':');
        if (h === suffix) { count = parseInt(c, 10) || 0; break; }
      }
      if (count > 0) {
        setBreach('bad', 'Sandi ini pernah bocor dan muncul ' + count.toLocaleString('id-ID') + ' kali di data pembobolan. Jangan dipakai. Ganti di semua tempat yang memakainya.');
      } else {
        setBreach('ok', 'Tidak ditemukan di data kebocoran yang diketahui. Ini bukan jaminan, jadi tetap pakai sandi unik.');
      }
    } catch (e) {
      setBreach('warn', 'Gagal memeriksa. Periksa koneksi internet lalu coba lagi.');
    } finally {
      clearTimeout(timer);
      btn.disabled = !pw.value;
    }
  });

  /* ---------- Generator ---------- */
  function rnd(max) {
    const lim = Math.floor(0x100000000 / max) * max;
    const a = new Uint32Array(1);
    do { crypto.getRandomValues(a); } while (a[0] >= lim);
    return a[0] % max;
  }
  const SETS = ['abcdefghijkmnopqrstuvwxyz', 'ABCDEFGHJKLMNPQRSTUVWXYZ', '23456789', '!@#$%^&*-_=+?'];
  function generate(len) {
    const all = SETS.join('');
    for (;;) {
      let out = '';
      for (let i = 0; i < len; i++) out += all[rnd(all.length)];
      if (SETS.every(s => [...s].some(c => out.includes(c)))) return out;
    }
  }
  const genLen = $('#genLen');
  genLen.addEventListener('input', () => { $('#genLenOut').textContent = genLen.value; });
  let generated = '';
  $('#genBtn').addEventListener('click', () => {
    generated = generate(parseInt(genLen.value, 10));
    $('#genOut').textContent = generated;
    $('#genCopy').disabled = false;
    $('#genMsg').textContent = '';
  });
  $('#genCopy').addEventListener('click', async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      $('#genMsg').textContent = 'Tersalin. Clipboard dikosongkan dalam 30 detik.';
      const copied = generated;
      setTimeout(async () => {
        try {
          const cur = await navigator.clipboard.readText();
          if (cur === copied) await navigator.clipboard.writeText('');
        } catch (_) {
          try { await navigator.clipboard.writeText(''); } catch (__) { /* abaikan */ }
        }
      }, 30000);
    } catch (_) {
      $('#genMsg').textContent = 'Tidak bisa menyalin otomatis. Tekan lama teks sandi lalu salin.';
    }
  });
  window.addEventListener('pagehide', () => { generated = ''; $('#genOut').textContent = 'Tekan Buat'; $('#genCopy').disabled = true; });

  /* ---------- Cek tautan ---------- */
  const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 's.id', 'cutt.ly', 'rb.gy', 'is.gd', 'shorturl.at', 'ow.ly', 'goo.gl', 'lnkd.in', 'tiny.cc', 'bit.do', 'v.gd'];
  const USER_HOSTED = ['sites.google.com', 'script.google.com', 'docs.google.com', 'drive.google.com', 'forms.gle', 'storage.googleapis.com', 'googleusercontent.com', 'firebaseapp.com', 'web.app', 'appspot.com', 'blogspot.com', 'weebly.com', 'wixsite.com', 'github.io', 'netlify.app', 'vercel.app', 'pages.dev', 'workers.dev', 'glitch.me', 'herokuapp.com'];
  const ODD_TLDS = ['xyz', 'top', 'click', 'zip', 'mov', 'icu', 'cfd', 'sbs', 'rest', 'gq', 'tk', 'ml', 'cf', 'ga', 'buzz', 'monster', 'cyou', 'lol', 'work'];
  const BAIT = ['login', 'signin', 'verify', 'verif', 'secure', 'account', 'akun', 'update', 'support', 'recovery', 'security', 'password', 'konfirmasi', 'bantuan'];

  const endsWithHost = (h, d) => h === d || h.endsWith('.' + d);

  function analyzeUrl(raw) {
    raw = raw.trim();
    if (!raw) return null;
    const flags = [];
    let level = 'ok';
    const bump = l => { if (l === 'bad' || (l === 'warn' && level === 'ok')) level = l; };
    const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw);
    let url;
    try { url = new URL(hasScheme ? raw : 'https://' + raw); }
    catch (_) { return { level: 'bad', title: 'Format tautan tidak valid', host: raw.slice(0, 120), flags: ['Tautan tidak bisa dibaca. Jangan dibuka.'] }; }

    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      flags.push('Bukan tautan web biasa (' + url.protocol + '). Jangan dibuka.'); bump('bad');
    } else if (url.protocol === 'http:') {
      flags.push('Tidak terenkripsi (http). Situs login asli selalu memakai https.'); bump('warn');
    }
    if (url.username || url.password) {
      flags.push('Ada "nama@" sebelum alamat. Ini trik agar tautan tampak seperti situs lain. Tujuan sebenarnya adalah ' + host + '.'); bump('bad');
    }
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith('[')) {
      flags.push('Memakai alamat IP, bukan nama situs.'); bump('bad');
    }
    // eslint-disable-next-line no-control-regex
    if (host.split('.').some(p => p.startsWith('xn--')) || /[^\x00-\x7F]/.test(raw.split('/')[hasScheme ? 2 : 0] || '')) {
      flags.push('Memakai huruf aneh (punycode) yang meniru nama situs lain.'); bump('bad');
    }

    const official = endsWithHost(host, 'google.com') || host === 'g.co' || host === 'accounts.youtube.com';
    const userHosted = USER_HOSTED.some(d => endsWithHost(host, d));
    const mentionsBrand = /google|gmail|g00gle|gooogle|googel/.test(host);

    if (!official && mentionsBrand && !userHosted) {
      flags.push('Nama situs memuat "Google" atau "Gmail" tetapi bukan domain google.com.'); bump('bad');
    }
    if (userHosted) {
      flags.push('Layanan ini bisa dipakai siapa saja untuk membuat halaman, jadi isinya belum tentu dari Google atau pemilik layanan.'); bump('warn');
    }
    if (SHORTENERS.includes(host)) {
      flags.push('Tautan pendek menyembunyikan tujuan sebenarnya.'); bump('warn');
    }
    const tld = host.split('.').pop();
    if (!official && ODD_TLDS.includes(tld)) {
      flags.push('Akhiran .' + tld + ' sering dipakai situs penipuan.'); bump('warn');
    }
    if (!official && BAIT.some(k => host.includes(k))) {
      flags.push('Nama situs memakai kata pancingan seperti "login" atau "verify".'); bump('warn');
    }
    if ((host.match(/-/g) || []).length >= 3) { flags.push('Terlalu banyak tanda hubung di nama situs.'); bump('warn'); }
    if (host.split('.').length >= 5) { flags.push('Terlalu banyak sub-domain.'); bump('warn'); }

    let title;
    if (level === 'bad') title = 'Sangat mencurigakan. Jangan dibuka.';
    else if (level === 'warn') title = 'Hati-hati.';
    else if (official) { title = 'Domain Google resmi.'; flags.push('Meski resmi, jangan masukkan sandi bila Anda tidak sedang meminta login.'); }
    else { level = 'warn'; title = 'Bukan milik Google.'; flags.push('Tidak ada tanda penipuan yang jelas, tetapi jangan masukkan sandi Google di sini.'); }
    return { level, title, host, flags };
  }

  $('#urlCheck').addEventListener('click', runUrl);
  $('#url').addEventListener('keydown', e => { if (e.key === 'Enter') runUrl(); });
  $('#urlClear').addEventListener('click', () => { $('#url').value = ''; $('#urlResult').hidden = true; });
  function runUrl() {
    const r = analyzeUrl($('#url').value);
    const box = $('#urlResult');
    if (!r) { box.hidden = true; return; }
    box.className = 'verdict ' + r.level;
    $('#urlTitle').textContent = r.title;
    $('#urlHost').textContent = 'Tujuan: ' + r.host;
    const ul = $('#urlFlags');
    ul.replaceChildren();
    r.flags.forEach(f => ul.append(el('li', { text: f })));
    box.hidden = false;
  }

  /* ---------- Pasang & service worker ---------- */
  let deferred = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    $('#install').hidden = false;
  });
  $('#install').addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    $('#install').hidden = true;
  });
  if ('serviceWorker' in navigator) {
    let reg = null;
    const busy = () => !!($('#pw').value || $('#url').value);
    const applyUpdate = () => {
      if (!busy()) location.reload();
      else $('#update').hidden = false;
    };
    $('#reload').addEventListener('click', () => location.reload());
    navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'updated') applyUpdate(); });
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!busy()) location.reload(); });

    // Cek versi baru: saat aplikasi dibuka kembali dan tiap 30 menit.
    const check = () => {
      if (reg) reg.update().catch(() => {});
      fetch('app.js', { cache: 'no-cache' }).catch(() => {}); // lewat service worker, yang membandingkan versi
    };
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(r => { reg = r; }).catch(() => {});
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    setInterval(() => { if (!document.hidden) check(); }, 30 * 60 * 1000);
  }

  load();
  render();
})();
