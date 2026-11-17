# PANDUAN PENJELASAN SINKRONISASI PLAN FRONTEND & MOCKUP STITCH (UNTUK PEMULA)
> **Modul**: Sinkronisasi Spesifikasi Frontend (`PLAN_02` s/d `PLAN_07`) dengan 15 Layar Google Stitch  
> **Berkas Terkait**: [PLAN_02_APP_LAYOUT_RBAC.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/Plan%20Frontend/PLAN_02_APP_LAYOUT_RBAC.md), [PLAN_03_BARISTA_OPERASIONAL_FEFO.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/Plan%20Frontend/PLAN_03_BARISTA_OPERASIONAL_FEFO.md), [PLAN_04_SUPERVISOR_MASTER_DATA.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/Plan%20Frontend/PLAN_04_SUPERVISOR_MASTER_DATA.md), [PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/Plan%20Frontend/PLAN_05_SUPERVISOR_MONITORING_INVENTARIS.md), [PLAN_06_WASTE_APPROVAL_CENTER.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/Plan%20Frontend/PLAN_06_WASTE_APPROVAL_CENTER.md), dan [PLAN_07_OWNER_ANALYTICS_DASHBOARD.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/Plan%20Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md)

---

## 1. Analogi Dunia Nyata Kafe: Mengapa Plan Harus Disinkronkan dengan Mockup Stitch?

Bayangkan Anda sedang merancang sebuah **Kafe Spesialti Kopi Baru ("BeanFlow")**:
* **Desain UI/UX di Google Stitch** adalah **maket arsitektur fisik 3D**: tata letak meja bar racik espresso, posisi rak chiller pendingin susu, laci kasir, dan papan menu di dinding.
* **Dokumen Rencana Teknis (PLAN_02 s/d PLAN_07)** adalah **buku gambar kerja teknik tukang bangunan**: mencatat ukuran presisi meja (misal: 60% meja racik, 40% rak susu), warna cat dinding (`#FAF7F2` - susu hangat), bahan kayu rak (`#4A2C11` - espresso pekat), serta instruksi operasional untuk staf.

Sebelumnya, dokumen plan kita masih berisi "prompt" (surat permintaan ke arsitek). Sekarang, maket 3D dari Google Stitch sudah selesai diunduh dalam bentuk 15 file HTML dan PNG nyata. Sinkronisasi ini memastikan **buku panduan tukang koding (React + Inertia + Tailwind)** 100% cocok dengan bentuk maket yang disepakati, sehingga tidak ada fitur yang meleset atau membingungkan mahasiswa pemula.

---

## 2. Penjelasan Per Komponen Utama Hasil Sinkronisasi

---

### Komponen: `FefoBatchSelector` (Pemilih Batch FEFO di Meja Bar)
* **Tujuan**: Membantu barista di stasiun espresso agar selalu mengambil karton susu atau kantong biji kopi yang tanggal kedaluwarsanya paling dekat, demi mencegah bahan basi di rak chiller.
* **Input / Props**:
  - `batches`: Daftar kumpulan batch fisik aktif untuk bahan yang dipilih (diurutkan dari tanggal kedaluwarsa terdekat ke yang terjauh / `expiry_date ASC`).
  - `selectedBatchId`: ID batch yang saat ini dipilih barista (secara otomatis memilih batch paling atas / terdekat kedaluwarsa).
  - `onSelectBatch`: Fungsi untuk memperbarui pilihan batch saat barista mengklik kartu lain.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menerima daftar batch dari database yang sudah diurutkan kronologis tanggal kedaluwarsanya.
  2. Batch urutan pertama (paling atas) otomatis ditandai dengan lencana kapsul espresso gelap: `[★ REKOMENDASI FEFO]`, border tebal cokelat tua (`border-2 border-[#4A2C11]`), dan radio button langsung tercentang (`checked`).
  3. Barista melihat sisa kuantitas stok di dalam batch tersebut (misal: *2.500 ml*) dan lokasi fisiknya (*"Karton Depan Chiller Utama"*).
  4. Jika barista tetap mengambil batch teratas, sistem mencatat status kepatuhan `is_fefo_compliant = true`.
* **Output / Return Value**: Kartu radio interaktif yang mengembalikan ID batch terpilih ke form pemakaian utama.
* **Kaitan dengan Bagian Lain**: Terhubung langsung dengan komponen `DeviationWarningCard` dan form pemotongan stok di `StockUsageController.php`.

---

### Komponen: `DeviationWarningCard` (Peringatan Cerdas Deviasi FEFO)
* **Tujuan**: Mencegah salah ambil bahan oleh barista tanpa mengunci sistem secara kaku. Jika barista secara sadar harus mengambil batch yang kedaluwarsanya lebih lama (misal: karton susu di belakang chiller sudah dibuka oleh shift sebelumnya), sistem mewajibkan pengisian alasan fisik.
* **Input / Props**:
  - `isDeviation`: Bernilai `true` jika batch yang dipilih barista BUKAN batch urutan pertama (`batchIndex !== 0`).
  - `reason`: Teks alasan deviasi yang diketik barista.
  - `onReasonChange`: Fungsi untuk memperbarui nilai alasan deviasi ke state `useForm`.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer mengecek apakah batch yang diklik barista sama dengan batch rekomendasi #0.
  2. Jika barista mengklik batch lain, kotak peringatan berwarna kuning amber (`bg-[#FFF7ED] border border-[#FED7AA]`) seketika muncul secara mulus di bawah kartu batch.
  3. Barista membaca pesan: *"Perhatian: Anda memilih batch yang kedaluwarsanya lebih lama. Mohon konfirmasi alasan fisik."*
  4. Barista wajib mengetikkan alasan minimal 5 karakter (misal: *"Karton depan chiller sudah terbuka segelnya oleh shift sebelumnya"*).
  5. Tombol submit pemakaian akan dinonaktifkan (*disabled*) sampai alasan ini diisi dengan benar.
* **Output / Return Value**: Blok peringatan interaktif dan string `deviation_reason` yang siap dikirim via POST.
* **Kaitan dengan Bagian Lain**: Nilai alasan ini disimpan permanen di kolom database `stock_usages.deviation_reason` dan akan diperiksa oleh Supervisor di halaman audit `supervisor_riwayat_audit_fefo.html`.

---

### Komponen: `ExpandableBatchTable` (Tabel Monitoring Chiller Bertingkat)
* **Tujuan**: Memberikan pandangan menyeluruh (*helicopter view*) kepada Supervisor tentang seluruh bahan baku di kafe, dengan kemampuan "membongkar" isi chiller per rak hanya dengan satu klik panah.
* **Input / Props**:
  - `ingredientsWithBatches`: Daftar seluruh bahan baku kafe beserta rincian batch fisiknya di rak chiller.
  - `filterStatus`: Filter lampu lalu lintas yang dipilih (`'all' | 'safe' | 'warning' | 'critical'`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Supervisor melihat baris utama bahan (misal: *Fresh Milk Diamond, Total Stok: 4.500 ml*).
  2. Di kolom status, terdapat lampu lalu lintas: 🟢 Aman (>7 hari), 🟡 Peringatan (3–7 hari), atau 🔴 Kritis (<3 hari).
  3. Saat panah Chevron di baris bahan diklik, baris tersebut melebar (*expand*) ke bawah tanpa berpindah halaman.
  4. Muncul sub-baris detail rak chiller: menampilkan nomor batch fisik (`BCH-20241026-A3F2`), lokasi fisik chiller (misal: *Chiller Bar Utama 03.5°C*), sisa volume per kotak, dan tombol aksi cepat.
* **Output / Return Value**: Tampilan tabel bertingkat yang rapi dan responsif.
* **Kaitan dengan Bagian Lain**: Diambil dari mockup [supervisor_monitoring_inventaris.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/supervisor_monitoring_inventaris.html), menggantikan tabel statis biasa.

---

### Komponen: `WasteMasterDetailWorkspace` (Pusat Approval Pemusnahan Bahan)
* **Tujuan**: Mempercepat tugas supervisor dalam menyetujui atau menolak laporan bahan rusak/basi dari barista tanpa terganggu jendela pop-up dialog yang bertumpuk-tumpuk.
* **Input / Props**:
  - `pendingTickets`: Daftar tiket laporan bahan rusak yang statusnya masih `pending`.
  - `selectedTicketId`: ID tiket yang sedang diperiksa fisiknya oleh supervisor.
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Layar dibagi menjadi 2 kolom berdampingan: Kolom Kiri (8 grid) adalah Tabel Antrean Tiket, dan Kolom Kanan (4 grid) adalah Panel Verifikasi Fisik.
  2. Saat supervisor mengklik salah satu baris di kolom kiri, panel kanan langsung berganti menampilkan rincian tiket tersebut: nama bahan, catatan barista, dan kalkulasi kerugian otomatis (`financial_loss = waste_quantity * cost_per_unit`).
  3. Supervisor menginspeksi fisik bahan di kafe:
     - Jika bahan memang basi: Supervisor mengklik tombol espresso `[Setujui Pemusnahan Stok]`. Sistem memotong stok batch menjadi 0 di dalam transaksi database yang aman (`DB::transaction`).
     - Jika laporan keliru: Supervisor mengklik `[Tolak Pengajuan]` dan memasukkan alasan penolakan.
* **Output / Return Value**: Workspace interaktif real-time tanpa reload dan tanpa modal pop-up.
* **Kaitan dengan Bagian Lain**: Diambil dari mockup [supervisor_waste_approval_center.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/supervisor_waste_approval_center.html) dan terhubung ke `WasteDisposalController.php`.

---

### Komponen: `UsageVsWasteChart` & Visualisasi Recharts Owner
* **Tujuan**: Menjawab pertanyaan terpenting pemilik kafe: *"Berapa banyak uang yang berhasil menjadi omzet minuman, dan berapa rupiah modal yang hangus terbuang di tong sampah?"*
* **Input / Props**:
  - `monthlyFinancialData`: Array data 12 bulan berisi nilai rupiah bahan terpakai (`usage_cost`) dan nilai kerugian limbah (`waste_cost`).
* **Alur Logika Bisnis (Langkah demi Langkah)**:
  1. Komputer menerima data agregasi finansial dari kueri Eloquent backend.
  2. Komponen merender grafik Recharts dengan palet warna kafe:
     - Batang Hijau Harvest (`#059669`): Nilai bahan terpakai efektif dalam penjualan kopi.
     - Batang Merah Terakota (`#8C3D2B`): Nilai bahan rusak/basi yang dibuang.
     - Garis putus-putus Amber (`#C88242`): Batas toleransi maksimal kerugian kafe per bulan (misal: maksimal Rp 500.000).
  3. Saat mouse diarahkan (*hover*) ke salah satu batang, muncul tooltip interaktif dengan angka format mata uang Rupiah (`Rp 14.250.000`).
* **Output / Return Value**: Komponen grafik SVG interaktif yang responsif di desktop maupun tablet iPad Pro Owner.
* **Kaitan dengan Bagian Lain**: Diambil dari mockup [owner_dasbor_finansial_analitik.html](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/stitch/owner_dasbor_finansial_analitik.html) dan file plan [PLAN_07_OWNER_ANALYTICS_DASHBOARD.md](file:///home/lasains/ssd2/matkul/pemograman%20lanjut/projek/docs/Plan%20Frontend/PLAN_07_OWNER_ANALYTICS_DASHBOARD.md).
