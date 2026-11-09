# Periksa Keamanan Google (PWA)

Semua analisis berjalan di perangkat. Satu-satunya permintaan jaringan: cek kebocoran sandi
ke api.pwnedpasswords.com (hanya 5 karakter awal hash SHA-1 yang dikirim).

## Cara pasang
1. Unggah semua file ke hosting HTTPS: GitHub Pages, Netlify, atau Cloudflare Pages.
2. Buka alamatnya di HP, lalu pilih "Tambahkan ke layar utama" / "Pasang aplikasi".

## Keamanan
- CSP ketat: tidak ada script/style inline, tidak ada pihak ketiga selain api.pwnedpasswords.com.
- Sandi tidak disimpan, dan dihapus dari layar saat aplikasi ditutup.
- Yang tersimpan hanya centang checklist (localStorage).
- `_headers` (Netlify/Cloudflare Pages) menambah header keamanan. GitHub Pages tidak mendukungnya,
  tetapi CSP di index.html tetap berlaku.
