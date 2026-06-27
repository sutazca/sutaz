/**
 * Central content store for sutaz.ca.
 *
 * Every string here is copied VERBATIM from the project blueprint source
 * documents. The source is cited inline per block. Editing these strings
 * breaks the verbatim guarantee — change only with an explicit brief.
 *
 * Sources:
 *  - "Blueprint Doc"     = Automation_Agency_Website_Blueprint_260627_121017.pdf
 *  - "Master Blueprint"  = Complete_7_Figure_Automation_Agency_Master_Bluepri_260627_122019.pdf
 */

export const SITE = {
  name: "Sutaz Automation",
  domain: "sutaz.ca",
  /** Primary CTA label (Master Blueprint Doc — used consistently in navbar + hero). */
  ctaPrimary: "Schedule System Audit",
} as const;

/* --------------------------------------------------------------------------
 * Homepage — Hero
 * Source: Master Blueprint Doc, Section 3 (primary, authoritative)
 * -------------------------------------------------------------------------- */
export const HERO = {
  /** Master Blueprint Doc Section 3. */
  headline:
    "We Engineer Enterprise-Grade Workflows That Permanently Eliminate Your Team's Admin Bottlenecks.",
  /** Master Blueprint Doc Section 3. */
  subheadline:
    "Stop letting manual data shuffling, disjointed software platforms, and human data entry mistakes drain your profit margins. We design, deploy, and maintain custom cloud automation engines and internal tools engineered specifically for Canadian Real Estate, Construction, and High-Scale Agency operations.",
} as const;

/* --------------------------------------------------------------------------
 * Homepage — Problem / Solution pairs
 * Primary pair is VERBATIM (Blueprint Doc Section 3).
 * Remaining three pairs are derived from Master Blueprint Doc Section 1
 * friction points (documented as such in the blueprint).
 * -------------------------------------------------------------------------- */
export interface PainCurePair {
  /** Blueprint Doc source label. */
  pain: string;
  cure: string;
}

export const PAIN_CURE_PAIRS: readonly PainCurePair[] = [
  {
    // VERBATIM — Blueprint Doc Section 3
    pain: "Staff spending 10+ hours a week copying spreadsheet lines into QuickBooks or CRMs.",
    cure: "AI-assisted invoice parsing and instant, multi-platform data syncing.",
  },
  {
    // Derived — Master Blueprint Doc Section 1
    pain: "Missed client follow-ups causing lost deals.",
    cure: "Automated lead-to-booking systems that respond within 120 seconds.",
  },
  {
    // Derived — Master Blueprint Doc Section 1
    pain: "Disjointed software platforms creating data silos.",
    cure: "Custom middleware bridges linking all your tools into a single workflow.",
  },
  {
    // Derived — Master Blueprint Doc Section 1
    pain: "Human data entry mistakes corrupting bookkeeping logs.",
    cure: "Intelligent Document Processing with 99.8% structural precision.",
  },
] as const;

/* --------------------------------------------------------------------------
 * Homepage — FAQ
 * Questions derived from Master Blueprint Doc Section 1 (Customer Friction
 * Points). Answers map to the blueprint's stated objections/answers.
 * -------------------------------------------------------------------------- */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Will your system work with our unique workflows?",
    answer:
      "Yes. Every engine is purpose-built for your industry — Canadian Real Estate, Construction, or high-scale agencies — and mapped to your specific tools, cost codes, and routing rules before a single line of code touches production.",
  },
  {
    question: "What if the automation breaks our live data?",
    answer:
      "It can't reach your live data until Phase 3. All logic is built in isolated development sandboxes, then runs shadow loops alongside your staff for a full week before any production handoff. Live channels face zero downtime or exposure.",
  },
  {
    question: "Is this just another tech expense?",
    answer:
      "It's a capital recovery. Use the calculator on this page: enter your team size, average salary, and weekly hours lost to manual tasks to see your annual capital leak and Year 1 net recovery after the build.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "A deterministic 30-day phased rollout: Days 1–5 operational flow shadowing, 6–12 sandbox isolation, 13–20 background shadow runs, 21–30 SOP documentation and transition. You're never left guessing what happens next.",
  },
  {
    question: "What happens after launch?",
    answer:
      "A continuous optimization retainer guarantees 24-hour critical-error resolution, API updates when your external tools change endpoints, and ongoing data-flow optimization — your system stays insured, not abandoned.",
  },
] as const;

/* --------------------------------------------------------------------------
 * Ecosystems page — three vertical blocks
 * Real Estate + Construction are VERBATIM (Master Blueprint Doc Section 3).
 * Agency is VERBATIM (Blueprint Doc Section 3).
 * -------------------------------------------------------------------------- */
export const REAL_ESTATE_BLOCK = {
  /** VERBATIM — Master Blueprint Doc Section 3, Page 2. */
  body: "Your administrative coordinators shouldn't be chasing signatures and manually calculating commission splits. Our custom Real Estate Engines intercept incoming lead notifications from Realtor.ca instantly, auto-assign them to regional agents based on custom neighborhood maps, and fire a personalized calendar link via SMS within 120 seconds. Simultaneously, our compliance pipelines monitor transaction folders, automatically pinging buyers for missing IDs or late escrow deposits every 24 hours until the file is legally clear for payout.",
  features: [
    "Lead intercept in under 120 seconds",
    "Auto-assignment to regional agents",
    "Compliance monitoring of transaction folders",
    "Escrow & missing-document tracking",
  ],
} as const;

export const CONSTRUCTION_BLOCK = {
  /** VERBATIM — Master Blueprint Doc Section 3, Page 2. */
  body: "Paperwork delays cost field margins. We engineer Intelligent Document Processing (IDP) systems that read incoming subcontractor PDF estimates and material supply receipts automatically. Using advanced semantic parsing, the engine maps individual invoice line items directly to your specific project cost codes inside QuickBooks Online, highlighting overruns instantly. Additionally, our automated compliance system monitors safety certifications across your entire labor pool, texting field superintendents 30 days before mandatory field tickets or union credentials expire.",
  features: [
    "PDF estimate & receipt parsing (IDP)",
    "Line-item mapping to project cost codes",
    "Overrun highlighting in QuickBooks Online",
    "Safety-cert expiry alerts (30-day)",
  ],
} as const;

export const AGENCY_BLOCK = {
  /** VERBATIM — Blueprint Doc Section 3, Page 2. */
  body: "Focus on systemic client onboarding. Explain how your system instantly spawns Slack channels, maps client Google Drive folder sets, and assigns ClickUp/Asana templates when a contract drops clean.",
  features: [
    "Instant Slack channel spawning",
    "Client Google Drive folder mapping",
    "ClickUp / Asana template assignment",
    "Contract-triggered onboarding pipeline",
  ],
} as const;

/* --------------------------------------------------------------------------
 * Engineering Lab — 4-phase timeline
 * VERBATIM — Master Blueprint Doc Section 3 (phase titles + descriptions).
 * -------------------------------------------------------------------------- */
export interface LabPhase {
  number: number;
  title: string;
  window: string;
  /** VERBATIM from Master Blueprint Doc Section 3. */
  description: string;
}

export const LAB_PHASES: readonly LabPhase[] = [
  {
    number: 1,
    title: "Operational Flow Shadowing",
    window: "Days 1-5",
    description:
      "We analyze and map out all manual entry bottlenecks, tracking where data errors occur.",
  },
  {
    number: 2,
    title: "Sandbox Staging Isolation",
    window: "Days 6-12",
    description:
      "Workflows are built completely isolated within development sandboxes. Live operational business channels face zero downtime or exposure.",
  },
  {
    number: 3,
    title: "Background Shadow Runs",
    window: "Days 13-20",
    description:
      "Systems run background loops alongside staff, fine-tuning error alerts and handling edge cases with complete safety.",
  },
  {
    number: 4,
    title: "SOP Documentation & Transition",
    window: "Days 21-30",
    description:
      "Smooth handoff to production lanes, provisioning clean video standard operating procedures for your managers, and 30 days of active pipeline monitoring.",
  },
] as const;

/* --------------------------------------------------------------------------
 * Contact page — left column copy
 * VERBATIM — Blueprint Doc Section 3, Page 3.
 * -------------------------------------------------------------------------- */
export const CONTACT_COPY = {
  /** VERBATIM — Blueprint Doc Section 3, Page 3. */
  body: "Let's map out your operations. On this free 15-minute diagnostic call, we will identify at least 3 manual tasks in your business that can be completely automated this week.",
  meta: "Free 15-minute diagnostic call. No obligation.",
} as const;

/* --------------------------------------------------------------------------
 * Navbar links (Master Blueprint Doc Section 3)
 * -------------------------------------------------------------------------- */
export const NAV_LINKS = [
  { label: "Ecosystems", href: "/ecosystems" },
  { label: "The Lab", href: "/lab" },
  { label: "FAQ", href: "/#faq" },
] as const;
