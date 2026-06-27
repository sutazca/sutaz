-- ============================================================================
-- sutaz.ca — Initial schema (PostgreSQL 16)
-- ============================================================================
-- Adapted from the blueprint Section 11.1, with two correctness improvements:
--   1. Least-privilege roles (no Supabase RLS — we self-host). The web app
--      connects as `sutaz_app`, which can INSERT roi_calculations + leads and
--      UPDATE lead status, but CANNOT bulk-read the leads table.
--   2. The 210-lead seed is deduplicated (DISTINCT on company+domain+scope)
--      in 002_seed.sql BEFORE insert — no DELETE-on-production.
-- ============================================================================

-- pgcrypto for gen_random_uuid() (preferred over the older uuid-ossp)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums (values sourced from Canada_210_Real_Verified_Leads.xlsx categories)
-- ---------------------------------------------------------------------------
CREATE TYPE lead_status AS ENUM (
  'new_lead',
  'contacted',
  'audit_scheduled',
  'audit_completed',
  'proposal_sent',
  'closed_won',
  'closed_lost',
  'nurture'
);

CREATE TYPE industry_category AS ENUM (
  'web_design_seo',
  'commercial_construction',
  'real_estate_brokerage',
  'digital_marketing_agency',
  'construction_engineering',
  'creative_agency',
  'commercial_contractor',
  'marketing_seo',
  'general_contractor',
  'ecommerce_digital_agency',
  'infrastructure_construction',
  'full_service_marketing',
  'contracting_building',
  'property_management',
  'software_tech_agency',
  'home_renovations',
  'custom_home_builder',
  'b2b_digital_marketing',
  'digital_experience_agency',
  'industrial_construction',
  'performance_marketing',
  'digital_marketing_pr',
  'ecommerce_web_design',
  'digital_product_studio',
  'branding_web_design',
  'digital_strategy',
  'renewable_energy',
  'social_media_digital',
  'luxury_home_builder',
  'b2b_tech_marketing',
  'residential_construction',
  'home_remodeling',
  'general_contracting_engineering'
);

CREATE TYPE automation_pitch AS ENUM (
  'lead_data_synchronization',
  'site_milestone_updates',
  'lead_to_booking_system',
  'client_onboarding_pipeline',
  'workflow_automation',
  'creative_asset_pipeline',
  'supplier_quote_collator',
  'ecommerce_tracking',
  'reporting_automation',
  'compliance_automation',
  'client_scheduling_ai',
  'supply_order_automation',
  'maintenance_triage',
  'fleet_log_aggregator'
);

CREATE TYPE canadian_province AS ENUM (
  'ontario',
  'alberta',
  'british_columbia',
  'quebec',
  'manitoba',
  'saskatchewan',
  'nova_scotia',
  'new_brunswick',
  'newfoundland_labrador',
  'prince_edward_island',
  'northwest_territories',
  'yukon',
  'nunavut'
);

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Main leads table (seed data + inbound form submissions)
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province        canadian_province NOT NULL,
  city            TEXT NOT NULL,
  industry        industry_category NOT NULL,
  company_name    TEXT NOT NULL,
  website_domain  TEXT NOT NULL,
  automation_scope automation_pitch NOT NULL,
  status          lead_status NOT NULL DEFAULT 'new_lead',

  -- Contact information (enriched later; required for inbound form leads)
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,

  -- Metadata
  notes           TEXT,
  first_contact_date TIMESTAMPTZ,
  last_contact_date  TIMESTAMPTZ,
  next_follow_up      TIMESTAMPTZ,

  -- Source attribution (distinguishes seeded prospects from form leads)
  source          TEXT NOT NULL DEFAULT 'seed',

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_website_domain CHECK (website_domain ~* '^https?://'),
  CONSTRAINT valid_company_name   CHECK (char_length(company_name) >= 2)
);

CREATE INDEX idx_leads_province         ON leads(province);
CREATE INDEX idx_leads_industry         ON leads(industry);
CREATE INDEX idx_leads_status           ON leads(status);
CREATE INDEX idx_leads_automation_scope ON leads(automation_scope);
CREATE INDEX idx_leads_city             ON leads(city);
CREATE INDEX idx_leads_contact_email    ON leads(contact_email);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION sutaz_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION sutaz_set_updated_at();

-- Webhook events (Calendly invitee.created, etc.)
CREATE TABLE webhook_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source      TEXT NOT NULL,        -- 'calendly', 'form_submission', ...
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL,
  processed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_source     ON webhook_events(source);

-- ROI calculations (anonymous analytics — no PII)
CREATE TABLE roi_calculations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_size            INTEGER NOT NULL,
  average_salary       INTEGER NOT NULL,
  hours_lost_per_week  INTEGER NOT NULL,
  annual_waste         INTEGER NOT NULL,
  calculated_roi       INTEGER NOT NULL,
  converted_to_lead    BOOLEAN NOT NULL DEFAULT FALSE,
  source               TEXT,        -- 'homepage', 'ecosystems_realestate', ...
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roi_created_at ON roi_calculations(created_at);

-- ---------------------------------------------------------------------------
-- Roles & least-privilege grants
-- ---------------------------------------------------------------------------
-- The web app connects as `sutaz_app`. Password is set at deploy time via
-- the .env (POSTGRES_APP_PASSWORD), never committed.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sutaz_app') THEN
    CREATE ROLE sutaz_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END $$;

-- App can write ROI calculations (public calculator) and insert/update leads,
-- but CANNOT SELECT the full leads table (protects the 210-prospect list +
-- inbound submissions from a compromised app role reading bulk PII).
GRANT INSERT ON roi_calculations TO sutaz_app;
GRANT INSERT, UPDATE ON leads TO sutaz_app;
GRANT INSERT ON webhook_events TO sutaz_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sutaz_app;

-- The migration/seed runs as the superuser (POSTGRES_PASSWORD) — full access.
