import { sql, type MigrateUpArgs } from '@payloadcms/db-postgres';

// Snapshot of the original copy. Reruns preserve all admin edits and existing records.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "services_page_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar NOT NULL,
      "heading" varchar NOT NULL,
      "intro" varchar NOT NULL,
      "empty_text" varchar NOT NULL,
      "cta_eyebrow" varchar NOT NULL,
      "cta_heading" varchar NOT NULL,
      "cta_label" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    INSERT INTO "services_page_content" ("eyebrow", "heading", "intro", "empty_text", "cta_eyebrow", "cta_heading", "cta_label", "updated_at", "created_at")
    SELECT 'Kapabilitas Studio', 'Services', 'Setiap proyek berawal dari kebutuhan yang berbeda. Temukan layanan studio kami dan diskusikan ruang lingkup yang sesuai dengan visi Anda.', 'Hubungi studio untuk mendiskusikan layanan dan kebutuhan proyek Anda.', 'Mulai Percakapan', 'Apa yang ingin Anda wujudkan?', 'Diskusikan Proyek', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "services_page_content");
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "awards_page_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar NOT NULL,
      "heading" varchar NOT NULL,
      "intro" varchar NOT NULL,
      "all_filter" varchar NOT NULL,
      "awards_filter" varchar NOT NULL,
      "competitions_filter" varchar NOT NULL,
      "awards_heading" varchar NOT NULL,
      "awards_count_label" varchar NOT NULL,
      "awards_empty_text" varchar NOT NULL,
      "project_label" varchar NOT NULL,
      "competitions_heading" varchar NOT NULL,
      "competitions_count_label" varchar NOT NULL,
      "competitions_empty_text" varchar NOT NULL,
      "organizer_label" varchar NOT NULL,
      "location_label" varchar NOT NULL,
      "design_label" varchar NOT NULL,
      "public_competition_label" varchar NOT NULL,
      "cta_eyebrow" varchar NOT NULL,
      "cta_heading" varchar NOT NULL,
      "cta_description" varchar NOT NULL,
      "projects_label" varchar NOT NULL,
      "cta_label" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    INSERT INTO "awards_page_content" ("eyebrow", "heading", "intro", "all_filter", "awards_filter", "competitions_filter", "awards_heading", "awards_count_label", "awards_empty_text", "project_label", "competitions_heading", "competitions_count_label", "competitions_empty_text", "organizer_label", "location_label", "design_label", "public_competition_label", "cta_eyebrow", "cta_heading", "cta_description", "projects_label", "cta_label", "updated_at", "created_at")
    SELECT 'Honors & Design Competitions', 'Awards & Competitions', 'Rekam jejak rekognisi profesi, penghargaan desain arsitektur, dan partisipasi sayembara gagasan spasial Petta Desain dalam mendorong standar tektonika tropis Indonesia.', 'Semua', 'Awards & Recognitions', 'Sayembara Arsitektur', 'Penghargaan & Rekognisi Arsitektur', 'Penghargaan', 'Belum ada penghargaan yang ditampilkan.', 'Karya:', 'Sayembara & Eksplorasi Gagasan', 'Sayembara', 'Belum ada sayembara yang ditampilkan.', 'Penyelenggara:', 'Lokasi:', 'Gagasan Desain', 'Sayembara Publik', 'Kolaborasi Desain', 'Ingin Merancang Bersama Petta Desain?', 'Konsultasikan gagasan arsitektur, perencanaan kawasan, maupun interior berkelas Anda bersama biro konsultan arsitektur kami di Kendari.', 'Lihat Proyek', 'Mulai Konsultasi', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "awards_page_content");
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "news_page_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar NOT NULL,
      "heading" varchar NOT NULL,
      "intro" varchar NOT NULL,
      "article_label" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    INSERT INTO "news_page_content" ("eyebrow", "heading", "intro", "article_label", "updated_at", "created_at")
    SELECT 'Journal & Updates', 'What’s On at Petta', 'Studio announcements, architectural awards, monograph releases, and theoretical essays exploring tropical modernism.', 'Read Article', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "news_page_content");
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "contact_page_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar NOT NULL,
      "heading" varchar NOT NULL,
      "intro" varchar NOT NULL,
      "success_heading" varchar NOT NULL,
      "success_description" varchar NOT NULL,
      "another_inquiry_label" varchar NOT NULL,
      "name_label" varchar NOT NULL,
      "email_label" varchar NOT NULL,
      "phone_label" varchar NOT NULL,
      "subject_label" varchar NOT NULL,
      "architecture_option" varchar NOT NULL,
      "interior_option" varchar NOT NULL,
      "permit_option" varchar NOT NULL,
      "structure_option" varchar NOT NULL,
      "visualization_option" varchar NOT NULL,
      "masterplan_option" varchar NOT NULL,
      "message_label" varchar NOT NULL,
      "office_heading" varchar NOT NULL,
      "social_heading" varchar NOT NULL,
      "instagram_label" varchar NOT NULL,
      "instagram_name" varchar NOT NULL,
      "founder_label" varchar NOT NULL,
      "founder_social_name" varchar NOT NULL,
      "founder_social_description" varchar NOT NULL,
      "facebook_label" varchar NOT NULL,
      "facebook_name" varchar NOT NULL,
      "hours_heading" varchar NOT NULL,
      "hours_text" varchar NOT NULL,
      "appointment_text" varchar NOT NULL,
      "name_placeholder" varchar NOT NULL,
      "email_placeholder" varchar NOT NULL,
      "phone_placeholder" varchar NOT NULL,
      "message_placeholder" varchar NOT NULL,
      "pending_label" varchar NOT NULL,
      "submit_label" varchar NOT NULL,
      "save_error" varchar NOT NULL,
      "connection_error" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    INSERT INTO "contact_page_content" ("eyebrow", "heading", "intro", "success_heading", "success_description", "another_inquiry_label", "name_label", "email_label", "phone_label", "subject_label", "architecture_option", "interior_option", "permit_option", "structure_option", "visualization_option", "masterplan_option", "message_label", "office_heading", "social_heading", "instagram_label", "instagram_name", "founder_label", "founder_social_name", "founder_social_description", "facebook_label", "facebook_name", "hours_heading", "hours_text", "appointment_text", "name_placeholder", "email_placeholder", "phone_placeholder", "message_placeholder", "pending_label", "submit_label", "save_error", "connection_error", "updated_at", "created_at")
    SELECT 'Konsultasi & Kemitraan Proyek', 'Hubungi {name}', 'Mulai dari perencanaan rumah tinggal, gedung institusi, desain interior eksekutif, hingga pengurusan PBG & SLF di Sulawesi Tenggara dan nasional.', 'Terima Kasih Atas Pertanyaan Anda', 'Pesan Anda telah tercatat di registri studio kami. Untuk kebutuhan mendesak, silakan hubungi studio melalui email atau telepon.', 'Kirim Pertanyaan Lain', 'Nama Lengkap *', 'Alamat Email *', 'Nomor WhatsApp / HP (opsional)', 'Layanan yang Dibutuhkan', 'Jasa Arsitektur & Perencanaan (Rumah / Gedung)', 'Desain Interior (Kantor / Rumah / Store)', 'Jasa Pengurusan PBG & SLF Resmi', 'Perhitungan Struktur Bangunan & Gempa', 'Visualisasi & Animasi 3D Sinematik', 'Konsultasi Kawasan / Masterplan', 'Deskripsi Kebutuhan & Lokasi Proyek *', 'Kantor Pusat Studio', 'Kanal Media Sosial Resmi', 'Instagram Studio:', '@pettadesain', 'Founder:', '@aams_ir', '(Ir. Ar. AAMS)', 'Facebook:', 'Andi Thagfir (Petta Desain)', 'Waktu Konsultasi', 'Senin — Sabtu: 08:30 — 17:30 WITA', 'Konsultasi tatap muka di studio atau survei lokasi lahan dengan konfirmasi jadwal terlebih dahulu.', 'e.g. Bapak / Ibu...', 'email@anda.com', '+62 812 0000 0000', 'Ceritakan rencana lokasi lahan (misal: Kendari, Kolaka, dll), perkiraan luas, tema rancangan, atau batas waktu...', 'Mengirim...', 'Kirimkan Pertanyaan Proyek', 'Pesan belum tersimpan.', 'Koneksi bermasalah. Silakan coba lagi.', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "contact_page_content");
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_text_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "nav_home" varchar NOT NULL,
      "nav_projects" varchar NOT NULL,
      "nav_services" varchar NOT NULL,
      "nav_awards" varchar NOT NULL,
      "nav_news" varchar NOT NULL,
      "nav_about" varchar NOT NULL,
      "nav_contact" varchar NOT NULL,
      "nav_inquire" varchar NOT NULL,
      "nav_all_disciplines" varchar NOT NULL,
      "nav_location" varchar NOT NULL,
      "nav_conversation" varchar NOT NULL,
      "footer_description" varchar NOT NULL,
      "footer_explore" varchar NOT NULL,
      "footer_portfolio" varchar NOT NULL,
      "footer_private_house" varchar NOT NULL,
      "footer_commercial" varchar NOT NULL,
      "footer_interior" varchar NOT NULL,
      "footer_services" varchar NOT NULL,
      "footer_about" varchar NOT NULL,
      "footer_awards" varchar NOT NULL,
      "footer_group" varchar NOT NULL,
      "footer_design" varchar NOT NULL,
      "footer_construction" varchar NOT NULL,
      "footer_printlab" varchar NOT NULL,
      "footer_archtech" varchar NOT NULL,
      "footer_network" varchar NOT NULL,
      "footer_office" varchar NOT NULL,
      "footer_copyright" varchar NOT NULL,
      "footer_location" varchar NOT NULL,
      "footer_instagram_label" varchar NOT NULL,
      "footer_founder_instagram_label" varchar NOT NULL,
      "footer_facebook_label" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    INSERT INTO "site_text_content" ("nav_home", "nav_projects", "nav_services", "nav_awards", "nav_news", "nav_about", "nav_contact", "nav_inquire", "nav_all_disciplines", "nav_location", "nav_conversation", "footer_description", "footer_explore", "footer_portfolio", "footer_private_house", "footer_commercial", "footer_interior", "footer_services", "footer_about", "footer_awards", "footer_group", "footer_design", "footer_construction", "footer_printlab", "footer_archtech", "footer_network", "footer_office", "footer_copyright", "footer_location", "footer_instagram_label", "footer_founder_instagram_label", "footer_facebook_label", "updated_at", "created_at")
    SELECT 'Home', 'Projects', 'Services', 'Awards & Sayembara', 'What''s On', 'About Us', 'Contact Us', 'Inquire', 'All Disciplines', 'Kendari · Sulawesi Tenggara', 'Start a Conversation', '{name} adalah studio biro konsultan arsitektur, interior, dan struktur yang berpusat di Kota Kendari. Didirikan oleh arsitek {founder}.', 'Eksplorasi', 'Portofolio Lengkap', 'Private House', 'Commercial & Campus', 'Interior Design', 'Services', 'Tentang Petta Desain', 'Awards & Sayembara', 'Petta Group', 'Petta Desain', 'Petta Konstruksi', 'Petta Printlab', 'Archtech Kendari', 'Arsitek Kendari Network', 'Kantor Studio', '© {year} {name}. Hak Cipta Dilindungi Undang-Undang.', 'Kendari, Sulawesi Tenggara', 'Instagram Petta Desain', 'Instagram Founder', 'Facebook Petta Desain', now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "site_text_content");
  `);
}

export async function down(): Promise<void> {
  // Intentionally retain these additive tables and all saved copy on rollback.
}
