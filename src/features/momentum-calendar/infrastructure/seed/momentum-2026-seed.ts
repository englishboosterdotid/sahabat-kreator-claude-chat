import { db } from "@/shared/infrastructure/database/client";
import { indonesiaMomentum } from "@/shared/infrastructure/database/schema";
import { nanoid } from "nanoid";

type SeedRow = {
  date: string;
  name: string;
  category: "national_holiday" | "religious" | "commercial" | "cultural";
  description?: string;
  contentAngleHint?: string;
  isTentative?: boolean;
};

const MOMENTUM_2026: SeedRow[] = [
  // ===== Libur Nasional & Keagamaan (sumber: SKB 3 Menteri 2026) =====
  { date: "2026-01-01", name: "Tahun Baru Masehi", category: "national_holiday", contentAngleHint: "Resolusi tahun baru, fresh start, evaluasi tahun lalu" },
  { date: "2026-01-16", name: "Isra Mikraj Nabi Muhammad SAW", category: "religious", isTentative: true, contentAngleHint: "Refleksi spiritual, konten edukasi ringan (kalau relevan dengan brand)" },
  { date: "2026-02-17", name: "Tahun Baru Imlek 2577", category: "religious", contentAngleHint: "Promo bertema Imlek, warna merah-emas, tema keberuntungan/rezeki baru" },
  { date: "2026-03-19", name: "Hari Suci Nyepi (Tahun Baru Saka 1948)", category: "religious", contentAngleHint: "Konten reflektif, tema hening/detox digital (unik karena Nyepi identik 'tanpa aktivitas')" },
  { date: "2026-03-21", name: "Hari Raya Idul Fitri 1447 H", category: "religious", isTentative: true, contentAngleHint: "THR, mudik, silaturahmi, promo baju/kue lebaran — puncak momentum belanja tahunan" },
  { date: "2026-05-01", name: "Hari Buruh Internasional", category: "national_holiday", contentAngleHint: "Apresiasi kerja keras, tema produktivitas" },
  { date: "2026-05-14", name: "Kenaikan Yesus Kristus", category: "religious", contentAngleHint: "Konten reflektif untuk audiens Kristiani" },
  { date: "2026-05-28", name: "Hari Raya Idul Adha 1447 H", category: "religious", isTentative: true, contentAngleHint: "Tema berbagi/kurban, kebersamaan keluarga" },
  { date: "2026-05-31", name: "Hari Raya Waisak 2570 BE", category: "religious", contentAngleHint: "Tema kedamaian, kebajikan" },
  { date: "2026-06-01", name: "Hari Lahir Pancasila", category: "national_holiday", contentAngleHint: "Tema nasionalisme, keberagaman Indonesia" },
  { date: "2026-06-16", name: "Tahun Baru Islam 1448 H", category: "religious", isTentative: true, contentAngleHint: "Tema muhasabah, awal yang baru" },
  { date: "2026-08-17", name: "Hari Kemerdekaan RI (HUT ke-81)", category: "national_holiday", contentAngleHint: "Tema merah-putih, semangat juara, lomba 17-an, diskon kemerdekaan" },
  { date: "2026-08-25", name: "Maulid Nabi Muhammad SAW", category: "religious", isTentative: true, contentAngleHint: "Konten edukasi/reflektif ringan" },
  { date: "2026-12-25", name: "Hari Raya Natal", category: "religious", contentAngleHint: "Tema hangat keluarga, promo akhir tahun, gift ideas" },

  // ===== Momen Komersial (e-commerce & marketing, tanggal fixed tahunan) =====
  { date: "2026-02-14", name: "Hari Valentine", category: "commercial", contentAngleHint: "Promo pasangan, self-love, gift ideas" },
  { date: "2026-04-21", name: "Hari Kartini", category: "cultural", contentAngleHint: "Tema pemberdayaan perempuan, cocok untuk brand dengan audiens wanita" },
  { date: "2026-05-02", name: "Hari Pendidikan Nasional", category: "cultural", contentAngleHint: "Tema belajar, growth, edukasi produk" },
  { date: "2026-09-09", name: "Harbolnas 9.9", category: "commercial", contentAngleHint: "Flash sale, diskon besar-besaran" },
  { date: "2026-10-10", name: "Harbolnas 10.10", category: "commercial", contentAngleHint: "Flash sale, diskon besar-besaran" },
  { date: "2026-10-28", name: "Hari Sumpah Pemuda", category: "cultural", contentAngleHint: "Tema semangat muda, persatuan" },
  { date: "2026-11-10", name: "Hari Pahlawan", category: "cultural", contentAngleHint: "Tema apresiasi jasa, semangat juang" },
  { date: "2026-11-11", name: "Harbolnas 11.11", category: "commercial", contentAngleHint: "Salah satu hari belanja online terbesar tahun ini — persiapkan konten jauh-jauh hari" },
  { date: "2026-12-12", name: "Harbolnas 12.12", category: "commercial", contentAngleHint: "Penutup tahun, last chance sale" },
  { date: "2026-12-22", name: "Hari Ibu", category: "cultural", contentAngleHint: "Tema apresiasi ibu, gift ideas" },
];

export async function seedMomentum2026() {
  const rows = MOMENTUM_2026.map((row) => ({
    id: nanoid(),
    date: row.date,
    name: row.name,
    category: row.category,
    description: row.description ?? null,
    contentAngleHint: row.contentAngleHint ?? null,
    isTentative: row.isTentative ?? false,
    year: 2026,
  }));

  await db.insert(indonesiaMomentum).values(rows);
  console.log(`Seeded ${rows.length} momentum events for 2026.`);
}