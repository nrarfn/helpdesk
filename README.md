# 🎫 Aplikasi Helpdesk
**Dinas Lingkungan Hidup DKI Jakarta**

<p align="center">
  <img src="public/image.avif" alt="Helpdesk Application" width="600" style="border-radius: 8px;">
</p>

---

## 📋 Deskripsi

Aplikasi **Helpdesk** untuk Dinas Lingkungan Hidup DKI Jakarta adalah sistem manajemen tiket yang memungkinkan pegawai melaporkan masalah teknis dan operasional dengan format standar. Aplikasi ini menyediakan sistem pelacakan tiket yang transparan dan mudah digunakan dengan interface modern menggunakan React.js dan shadcn/ui.

---

## 🚀 Fitur Utama

### 👥 Role-based Access Control
- **Admin**: Mengelola master data, status, dan memantau semua tiket
- **User**: Membuat tiket dan melihat status tiket milik sendiri

### 🎫 Manajemen Tiket
- Auto-generate kode tiket (format: HD0001, HD0002, dst.)
- Form pelaporan dengan validasi lengkap
- Tracking status real-time
- Filter dan pencarian tiket

### 🏢 Master Data
- **Aplikasi**: Kelola daftar aplikasi/sistem yang tersedia
- **Status**: Kelola status tiket dengan warna dan urutan custom

### 🔐 Keamanan
- Supabase Authentication (email/password)
- Row Level Security (RLS) policies
- Session management dengan auto-refresh

---

## 🛠️ Stack Teknologi

- **Frontend**: React.js 18 + TypeScript
- **UI Components**: shadcn/ui (modern, accessible, customizable)
- **Backend**: Supabase (PostgreSQL + Auth + API)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Router**: React Router v7
- **Form Handling**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast)

---

## 📦 Instalasi & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd helpdesk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Buat file `.env` berdasarkan `.env.example`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Database schema sudah include:
- `applications` - Master data aplikasi
- `statuses` - Master data status tiket
- `profiles` - Profile pengguna (extends auth.users)
- `tickets` - Data tiket helpdesk
- `ticket_comments` - Komentar/respon tiket

### 5. Run Application
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## 🎯 Cara Penggunaan

### Untuk User (Pelapor):
1. **Login** dengan akun yang sudah terdaftar
2. **Buat Tiket** dengan mengisi:
   - Nama Penanya
   - Asal Instansi
   - No Kontak
   - Pilih Aplikasi terkait
   - Detail Masalah
3. **Pantau Status** tiket di dashboard
4. **Lihat Riwayat** tiket yang pernah dibuat

### Untuk Admin:
1. **Dashboard Admin** - Lihat semua tiket dengan filter
2. **Kelola Tiket** - Update status, assign, tambah komentar
3. **Master Aplikasi** - CRUD daftar aplikasi
4. **Master Status** - CRUD status dengan warna dan urutan
5. **User Management** - Promote user ke admin

---

## 🗄️ Database Schema

```sql
-- Profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    nama_lengkap VARCHAR(255),
    instansi VARCHAR(255),
    no_kontak VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_aplikasi VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Statuses
CREATE TABLE statuses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_status VARCHAR(100) NOT NULL,
    warna VARCHAR(7) DEFAULT '#000000',
    urutan INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets
CREATE TABLE tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kode_tiket VARCHAR(20) UNIQUE NOT NULL,
    nama_penanya VARCHAR(255) NOT NULL,
    asal_instansi VARCHAR(255) NOT NULL,
    no_kontak VARCHAR(50) NOT NULL,
    application_id UUID REFERENCES applications(id) NOT NULL,
    status_id UUID REFERENCES statuses(id) NOT NULL,
    detail_masalah TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    assigned_to UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Comments
CREATE TABLE ticket_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 Struktur Project

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Header)
│   └── ui/              # shadcn/ui components
├── context/
│   └── SessionContext.tsx  # Auth session management
├── hooks/
│   └── use-mobile.ts    # Custom hooks
├── lib/
│   └── utils.ts         # Utility functions
├── pages/
│   ├── admin/           # Admin pages
│   │   ├── AdminDashboardPage.tsx
│   │   ├── ApplicationsPage.tsx
│   │   ├── StatusesPage.tsx
│   │   └── TicketDetailsPage.tsx
│   ├── AuthPage.tsx     # Login/Register
│   ├── CreateTicketPage.tsx
│   ├── LoadingPage.tsx
│   ├── UserDashboardPage.tsx
│   └── 404Page.tsx
├── router/
│   ├── AdminProtectedRoute.tsx
│   ├── AuthProtectedRoute.tsx
│   └── index.tsx        # Route definitions
└── supabase/
    └── index.ts         # Supabase client
```

---

## 🎨 UI Components

Aplikasi menggunakan **shadcn/ui** yang menyediakan:
- 🎨 **Design System** yang konsisten
- ♿ **Accessibility** built-in
- 🌙 **Dark/Light mode** support
- 📱 **Responsive design**
- 🎛️ **Customizable** dengan Tailwind CSS

### Komponen Utama:
- `Button`, `Input`, `Select` - Form elements
- `Table`, `Card`, `Badge` - Data display
- `Dialog`, `Alert`, `Toast` - Feedback
- `Sidebar`, `Tabs`, `Dropdown` - Navigation

---

## 🔒 Security Features

### Row Level Security (RLS)
- **Profiles**: User hanya bisa edit profil sendiri
- **Tickets**: User hanya bisa lihat tiket sendiri, Admin lihat semua
- **Applications & Statuses**: User read-only, Admin full access
- **Comments**: Akses berdasarkan ownership tiket

### Authentication
- Email/Password dengan Supabase Auth
- Session management otomatis
- Protected routes berdasarkan role
- Auto-logout saat session expired

---

## 🚀 Deployment

### Supabase Setup:
1. Buat project baru di [Supabase](https://supabase.com)
2. Run migrations untuk setup database
3. Configure authentication settings
4. Set environment variables

### Frontend Deployment:
- **Vercel** (recommended): `npm run build` + deploy
- **Netlify**: Build command: `npm run build`, Publish directory: `dist`
- **Manual**: `npm run build` → host folder `dist/`

---

## 📊 Default Data

### Status Tiket:
- 🔴 **Open** - Tiket baru dibuat
- 🟡 **In Progress** - Sedang dikerjakan
- 🔵 **Waiting Response** - Menunggu respon
- 🟢 **Resolved** - Sudah diselesaikan
- ⚫ **Closed** - Tiket ditutup

### Sample Applications:
- SIMPEG - Sistem Informasi Manajemen Pegawai
- E-Office - Sistem Elektronik Perkantoran  
- SIMKEU - Sistem Informasi Manajemen Keuangan
- Website Portal - Website Portal Instansi

---

## 🧪 Testing Accounts

### Admin Account:
- **Email**: `admin@admin.com`
- **Password**: `admin1234`
- **Role**: Admin (full access)

### User Account:
- **Email**: `me@nurarif.in`
- **Password**: (set during registration)
- **Role**: User (limited access)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE.MD](LICENSE.MD) file for details.

---

## 👨‍💻 Developer

**Dinas Lingkungan Hidup DKI Jakarta**  
Internal Development Team

---

## 📞 Support

Untuk pertanyaan atau dukungan teknis, silakan hubungi:
- **Email**: admin@dinaslhdki.id
- **Internal**: Data Center PSMDI Dinas Lingkungan Hidup

---

*Dibuat dengan ❤️ menggunakan React.js + Supabase + shadcn/ui*
