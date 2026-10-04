import { sql, type MigrateUpArgs } from '@payloadcms/db-postgres';
import { DEFAULT_ABOUT_PAGE_CONTENT as copy } from '../lib/about-page-content';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "about_page_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "hero_title" varchar NOT NULL,
      "hero_intro" varchar NOT NULL,
      "hero_tagline" varchar NOT NULL,
      "philosophy_eyebrow" varchar NOT NULL,
      "philosophy_title" varchar NOT NULL,
      "philosophy_text1" varchar NOT NULL,
      "philosophy_text2" varchar NOT NULL,
      "philosophy_metric_label" varchar NOT NULL,
      "philosophy_metric_text" varchar NOT NULL,
      "mission_eyebrow" varchar NOT NULL,
      "mission_title" varchar NOT NULL,
      "mission_text1" varchar NOT NULL,
      "mission_text2" varchar NOT NULL,
      "mission_accountability_label" varchar NOT NULL,
      "mission_accountability_text" varchar NOT NULL,
      "mission_studio_tag" varchar NOT NULL,
      "mission_est_tag" varchar NOT NULL,
      "pillars_eyebrow" varchar NOT NULL,
      "pillars_heading" varchar NOT NULL,
      "pillars_subtitle" varchar NOT NULL,
      "pillar1_tag" varchar NOT NULL,
      "pillar1_title" varchar NOT NULL,
      "pillar1_desc" varchar NOT NULL,
      "pillar2_tag" varchar NOT NULL,
      "pillar2_title" varchar NOT NULL,
      "pillar2_desc" varchar NOT NULL,
      "pillar3_tag" varchar NOT NULL,
      "pillar3_title" varchar NOT NULL,
      "pillar3_desc" varchar NOT NULL,
      "pillar4_tag" varchar NOT NULL,
      "pillar4_title" varchar NOT NULL,
      "pillar4_desc" varchar NOT NULL,
      "principal_role" varchar NOT NULL,
      "principal_name" varchar NOT NULL,
      "principal_credentials" varchar NOT NULL,
      "principal_bio1" varchar NOT NULL,
      "principal_bio2" varchar NOT NULL,
      "principal_badge_title" varchar NOT NULL,
      "principal_badge_subtitle" varchar NOT NULL,
      "principal_instagram_label" varchar NOT NULL,
      "principal_facebook_label" varchar NOT NULL,
      "team_eyebrow" varchar NOT NULL,
      "team_heading" varchar NOT NULL,
      "team_intro" varchar NOT NULL,
      "entities_eyebrow" varchar NOT NULL,
      "entities_heading" varchar NOT NULL,
      "entities_subtitle" varchar NOT NULL,
      "services_eyebrow" varchar NOT NULL,
      "services_heading" varchar NOT NULL,
      "services_subtitle" varchar NOT NULL,
      "location_heading" varchar NOT NULL,
      "location_office_title" varchar NOT NULL,
      "location_areas_title" varchar NOT NULL,
      "cta_eyebrow" varchar NOT NULL,
      "cta_heading" varchar NOT NULL,
      "cta_text" varchar NOT NULL,
      "cta_button_label" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
  `);

  await db.execute(sql`
    INSERT INTO "about_page_content" (
      "hero_title", "hero_intro", "hero_tagline",
      "philosophy_eyebrow", "philosophy_title", "philosophy_text1", "philosophy_text2", "philosophy_metric_label", "philosophy_metric_text",
      "mission_eyebrow", "mission_title", "mission_text1", "mission_text2", "mission_accountability_label", "mission_accountability_text", "mission_studio_tag", "mission_est_tag",
      "pillars_eyebrow", "pillars_heading", "pillars_subtitle",
      "pillar1_tag", "pillar1_title", "pillar1_desc",
      "pillar2_tag", "pillar2_title", "pillar2_desc",
      "pillar3_tag", "pillar3_title", "pillar3_desc",
      "pillar4_tag", "pillar4_title", "pillar4_desc",
      "principal_role", "principal_name", "principal_credentials", "principal_bio1", "principal_bio2", "principal_badge_title", "principal_badge_subtitle", "principal_instagram_label", "principal_facebook_label",
      "team_eyebrow", "team_heading", "team_intro",
      "entities_eyebrow", "entities_heading", "entities_subtitle",
      "services_eyebrow", "services_heading", "services_subtitle",
      "location_heading", "location_office_title", "location_areas_title",
      "cta_eyebrow", "cta_heading", "cta_text", "cta_button_label",
      "updated_at", "created_at"
    )
    SELECT
      ${copy.heroTitle}, ${copy.heroIntro}, ${copy.heroTagline},
      ${copy.philosophyEyebrow}, ${copy.philosophyTitle}, ${copy.philosophyText1}, ${copy.philosophyText2}, ${copy.philosophyMetricLabel}, ${copy.philosophyMetricText},
      ${copy.missionEyebrow}, ${copy.missionTitle}, ${copy.missionText1}, ${copy.missionText2}, ${copy.missionAccountabilityLabel}, ${copy.missionAccountabilityText}, ${copy.missionStudioTag}, ${copy.missionEstTag},
      ${copy.pillarsEyebrow}, ${copy.pillarsHeading}, ${copy.pillarsSubtitle},
      ${copy.pillar1Tag}, ${copy.pillar1Title}, ${copy.pillar1Desc},
      ${copy.pillar2Tag}, ${copy.pillar2Title}, ${copy.pillar2Desc},
      ${copy.pillar3Tag}, ${copy.pillar3Title}, ${copy.pillar3Desc},
      ${copy.pillar4Tag}, ${copy.pillar4Title}, ${copy.pillar4Desc},
      ${copy.principalRole}, ${copy.principalName}, ${copy.principalCredentials}, ${copy.principalBio1}, ${copy.principalBio2}, ${copy.principalBadgeTitle}, ${copy.principalBadgeSubtitle}, ${copy.principalInstagramLabel}, ${copy.principalFacebookLabel},
      ${copy.teamEyebrow}, ${copy.teamHeading}, ${copy.teamIntro},
      ${copy.entitiesEyebrow}, ${copy.entitiesHeading}, ${copy.entitiesSubtitle},
      ${copy.servicesEyebrow}, ${copy.servicesHeading}, ${copy.servicesSubtitle},
      ${copy.locationHeading}, ${copy.locationOfficeTitle}, ${copy.locationAreasTitle},
      ${copy.ctaEyebrow}, ${copy.ctaHeading}, ${copy.ctaText}, ${copy.ctaButtonLabel},
      now(), now()
    WHERE NOT EXISTS (SELECT 1 FROM "about_page_content");
  `);
}

export async function down(): Promise<void> {
  // Keep the additive table and all owner-edited content on rollback.
}
