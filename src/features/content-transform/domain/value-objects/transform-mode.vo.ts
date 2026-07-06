export type TransformMode = "variant" | "repurpose" | "carousel";

export const TRANSFORM_MODE_LABELS: Record<TransformMode, { label: string; description: string }> = {
  variant: {
    label: "Buat Variasi",
    description: "Beberapa versi alternatif untuk platform yang sama (beda hook/tone/panjang)",
  },
  repurpose: {
    label: "Ubah Platform",
    description: "Adaptasi konten ke platform/format lain",
  },
  carousel: {
    label: "Jadikan Carousel",
    description: "Pecah jadi beberapa slide dengan hook & CTA",
  }
};