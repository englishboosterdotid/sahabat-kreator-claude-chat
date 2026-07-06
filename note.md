Saya juga sempat melihat opini seperti itu. Setelah saya cek dokumentasi resmi dan diskusi komunitas, kesimpulannya sedikit berbeda:

Better Auth bukan tidak cocok untuk SSR. Justru Better Auth menganjurkan SSR untuk mengambil session pengguna. Di dokumentasi resminya bahkan ada contoh:

const session = await auth.api.getSession({
  headers: await headers(),
});

Lalu session tersebut diteruskan ke client sebagai fallback agar tidak perlu fetch ulang.

Yang sering disalahpahami adalah:

SSR untuk autentikasi/session → Sangat cocok.
Cek login.
Redirect jika belum login.
Ambil data user dasar.
Route protection.
SSR untuk semua business data → Tergantung arsitektur.

Jika setiap Server Component memanggil:

Server Component
    ↓
auth.getSession()
    ↓
fetch data API

maka memang ada overhead karena setiap request perlu memvalidasi cookie/session. Ini bukan keterbatasan Better Auth, tetapi konsekuensi arsitektur SSR berbasis cookie.

Kenapa ada yang bilang kurang cocok?

Banyak diskusi di Reddit berasal dari kasus backend dipisah (Express/Nest) dan frontend Next.js.

Alurnya menjadi:

Browser
    ↓ cookie
Next.js Server
    ↓ forward cookie
Auth Server
    ↓
Backend API

Di sini cookie harus diteruskan (forward) secara manual. Jika tidak, SSR akan mendapat 401. Ini yang sering dianggap "Better Auth tidak cocok untuk SSR", padahal masalahnya adalah forwarding cookie antar server.

Untuk proyekmu

Dari diskusi sebelumnya kita akan membuat:

Next.js Fullstack
DDD
Better Auth
AI Content Platform

Menurutku kombinasi ini justru ideal.

Gunakan pola:

Server Component
    ↓
auth.api.getSession()

    ↓

Server Action / Repository

    ↓

Database

Sedangkan data yang sering berubah (dashboard analytics, feed, notification, dsb.) bisa menggunakan client dengan TanStack Query atau SWR.

Jadi:

✅ Auth → SSR
✅ Route protection → SSR
✅ Initial user → SSR
✅ Dashboard live data → Client fetch
✅ Mutasi → Server Actions

Ini sejalan dengan rekomendasi resmi Better Auth yang menyarankan prefetch session di server untuk SSR.

Menurut saya, untuk proyek AI SaaS yang sedang kita rancang, Better Auth tetap merupakan pilihan yang sangat baik. Fokus optimasi sebaiknya pada pola pengambilan data (repository, caching, TanStack Query), bukan mengganti library autentikasinya.