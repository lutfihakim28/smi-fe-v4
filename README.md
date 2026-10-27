# Web App Instructor Manager Attendance dan Payroll preparation Dashboard

Ini adalah coding test untuk perusahaan PT. Sinergi Mandiricipta Indonesia. Saya memilih soal test v4 untuk posisis Frontend Developer terkait "Web App Instructor Manager Attendance dan Payroll preparation Dashboard".

## Setup

Install dependency:

```bash
bun install
```

Tambahkan file `.env`:

```js
// contoh
VITE_BASE_URL=http://localhost:5173
VITE_REQUEST_DELAY=500 // untuk simulasi fetch server (opsional)
```

## Development Server

Jalankan server dev di `http://localhost:5173`:

```bash
bun dev
```

## Production

Build untuk produksi:

```bash
bun run build
```

Preview hasil build secara lokal:

```bash
bun run preview --port 5173
```

## Dependency

Aplikasi ini menggunakan dependency sebagai berikut:
- `vue`: menjadi core aplikasi sebagai framework yang ringan dan memiliki dx yang baik.
- `@nuxt/ui`: sebagai component library yang menyediakan banyak pilihan component yang mudah digunakan dan memiliki desain yang modern.
- `xlsx-js-style`: library utama yang digunakan untuk generate dan export file excel.
- `vue-router`: library routing official dari vue.
- `@internationalized/date`: library format tanggal dan menjadi layer di bawah `@nuxt/ui` untuk handle component date picker.
- `tailwindcss`: library styling, dipilih karena praktis dan menjadi layer pondasi untuk `@nuxt/ui` dalam handle styling component.
- `@tanstack/table-core`: layer pondasi untuk component table dalam `@nuxt/ui`.
- `@vueuse/core`: kumpulan utility function yang khusus dibuat untuk `vue`.
- `date-fns`: kumpulan utility function untuk tanggal.
- `@unhead/vue`: library untuk mengelola head pada halaman.
- library lainnya berfungsi sebagai tambahan untuk memberikan dx yang lebih baik selama pengerjaan.
