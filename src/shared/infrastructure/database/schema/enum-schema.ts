import { pgEnum } from "drizzle-orm/pg-core";

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);

export const aiProviderTypeEnum = pgEnum("ai_provider_type", [
  "anthropic",
  "openai",
  "gemini",
  "custom", // OpenAI-compatible custom URL
  "platform_sumopod", // token disediakan platform
]);

export const knowledgeCategoryEnum = pgEnum("knowledge_category", [
  "product",   // spesifikasi, varian, fitur produk
  "pricing",   // harga, paket, promo
  "policy",    // kebijakan retur, garansi, pengiriman
  "faq",       // pertanyaan umum
  "other",
]);

export const momentumCategoryEnum = pgEnum("momentum_category", [
  "national_holiday",   // libur nasional resmi (Kemerdekaan, Natal, dst)
  "religious",           // hari besar keagamaan (Idul Fitri, Nyepi, Waisak, dst)
  "commercial",          // momen belanja (Harbolnas 12.12, 11.11, gajian)
  "cultural",            // hari peringatan non-libur (Kartini, Sumpah Pemuda, dst)
]);