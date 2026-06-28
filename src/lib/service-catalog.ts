/**
 * Service catalog data — adapted from service-menu-2.jsx (the differentiator).
 * 5 verticals with Engineering Moat flags. Total count is computed at the foot
 * of this file (TOTAL_SERVICES) so copy can never drift. The /services page
 * consumes this; the homepage EcosystemPreview consumes the vertical summaries.
 *
 * Sourced verbatim from the attached service-menu spec.
 */

export type ServiceCategory = "Integration" | "Automation" | "AI-Powered" | "Dashboards" | "Compliance" | "Portal";
export type Complexity = "Quick" | "Mid" | "Complex" | "Enterprise";
export type EngagementType = "Build" | "Retainer" | "Both";

export interface Service {
  name: string;
  category: ServiceCategory;
  complexity: Complexity;
  type: EngagementType;
  moat: boolean;
  problem: string;
}

export interface Vertical {
  id: string;
  name: string;
  emoji: string;
  phase: 1 | 2;
  color: string;
  lightColor: string;
  borderColor: string;
  blurb: string;
  services: Service[];
}

export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  Integration: "#3B82F6",
  Automation: "#10B981",
  "AI-Powered": "#8B5CF6",
  Dashboards: "#F59E0B",
  Compliance: "#EF4444",
  Portal: "#06B6D4",
};

export const COMPLEXITY_META: Record<Complexity, { desc: string }> = {
  Quick: { desc: "1–3 days, templatable" },
  Mid: { desc: "1–2 weeks, some custom work" },
  Complex: { desc: "3–6 weeks, custom engineering" },
  Enterprise: { desc: "6+ weeks, full system build" },
};

export const VERTICALS: Vertical[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    emoji: "🏠",
    phase: 1,
    color: "#0F766E",
    lightColor: "#022c22",
    borderColor: "#0d9488",
    blurb: "Lead-to-booking systems, transaction coordination, AI document extraction, FINTRAC/PIPEDA compliance — for Canadian brokerages and property managers.",
    services: [
      { name: "Unified Lead Aggregation", category: "Integration", complexity: "Mid", type: "Build", moat: false, problem: "Leads from Realtor.ca, Facebook, and Google fall through cracks — no single pipeline exists" },
      { name: "MLS API Sync", category: "Integration", complexity: "Complex", type: "Build", moat: true, problem: "New and updated listings manually re-entered into CRM and marketing tools — hours wasted per agent weekly" },
      { name: "Property Management Software Integration", category: "Integration", complexity: "Complex", type: "Both", moat: true, problem: "AppFolio, Buildium, Yardi and QuickBooks/Sage speak different languages — reconciliation is a manual job" },
      { name: "Lead-to-Agent Auto-Routing", category: "Automation", complexity: "Mid", type: "Build", moat: false, problem: "Leads sit unassigned for hours while agents check email — speed to contact drops below conversion threshold" },
      { name: "Automated Follow-Up Sequences (Email + SMS)", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Cold leads go stale with no structured nurture — money spent on lead generation is abandoned after first contact" },
      { name: "Transaction Coordination Workflow", category: "Automation", complexity: "Complex", type: "Build", moat: false, problem: "Offer accepted → compliance checklist → document collection → closing is a manual process every single time" },
      { name: "Lease Renewal Automation", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Lease expiries managed in spreadsheets — renewals missed, vacancies not anticipated, revenue at risk" },
      { name: "Maintenance Request System", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Maintenance tickets arrive via text, email, and phone — no audit trail, no SLAs, vendors not tracked" },
      { name: "Rent Collection & Arrears Follow-Up", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Late rent identified days after due date — follow-up is inconsistent, escalation steps undocumented" },
      { name: "Agent Commission Calculator & Disbursement Report", category: "Automation", complexity: "Mid", type: "Build", moat: false, problem: "Commission calculations done in spreadsheets — disputes arise regularly, disbursements delayed" },
      { name: "AI Contract Data Extraction", category: "AI-Powered", complexity: "Complex", type: "Build", moat: true, problem: "Staff manually read purchase agreements to extract parties, price, conditions, and dates into the system" },
      { name: "AI Inquiry Triage & Routing", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "High email volume — staff spend 2+ hours daily classifying and routing inquiries before any actual work begins" },
      { name: "AI Tenant Self-Service Portal", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "40–60% of tenant inquiries are answerable without staff intervention — all handled manually today" },
      { name: "AI Lead Scoring Engine", category: "AI-Powered", complexity: "Enterprise", type: "Both", moat: true, problem: "Agents spend equal time on low and high-intent leads — no signal to prioritize outreach" },
      { name: "Brokerage KPI Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Broker has no real-time view of pipeline value, conversion rates, or agent performance — decisions made on gut feel" },
      { name: "Property Manager Operations Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Vacancy rate, rent roll, and maintenance backlog tracked in separate spreadsheets — no single operational view" },
      { name: "Investor Reporting Portal", category: "Dashboards", complexity: "Complex", type: "Both", moat: true, problem: "Investment property reports compiled manually monthly — takes days, often delayed, investors frustrated" },
      { name: "FINTRAC AML Compliance Automation", category: "Compliance", complexity: "Complex", type: "Build", moat: true, problem: "Identity verification and AML records completed manually — legal liability exposure and significant time cost per transaction" },
      { name: "PIPEDA-Compliant Document Retention System", category: "Compliance", complexity: "Complex", type: "Build", moat: true, problem: "Personal data flows undocumented, retention periods unenforced — provincial regulatory risk" },
    ],
  },
  {
    id: "construction",
    name: "Construction",
    emoji: "🏗️",
    phase: 1,
    color: "#B45309",
    lightColor: "#1c1917",
    borderColor: "#d97706",
    blurb: "Intelligent Document Processing, 3-way invoice matching, WSIB/CRA/T4A compliance, real-time job-cost dashboards — for Canadian contractors and builders.",
    services: [
      { name: "Procore / Buildertrend → Accounting Sync", category: "Integration", complexity: "Complex", type: "Build", moat: true, problem: "Project management and accounting data entered twice — errors compound, job costs always 2 weeks behind reality" },
      { name: "Supplier Portal Integration", category: "Integration", complexity: "Complex", type: "Build", moat: true, problem: "POs sent by email, delivery confirmations verbal, invoices arrive separately — no matching system exists" },
      { name: "Equipment Tracking Integration", category: "Integration", complexity: "Mid", type: "Both", moat: false, problem: "Equipment location, utilization, and maintenance scheduled in disconnected systems or not at all" },
      { name: "Subcontractor Onboarding Portal", category: "Portal", complexity: "Complex", type: "Build", moat: true, problem: "New subtrade onboarding takes 3–5 days: COI collection, WSIB clearance, T4A setup, banking, e-sign — all manual" },
      { name: "Digital Change Order System", category: "Automation", complexity: "Complex", type: "Build", moat: false, problem: "Change orders on paper or email — approval status disputed, pricing disagreements frequent, billing delayed" },
      { name: "3-Way Invoice Matching", category: "Automation", complexity: "Complex", type: "Build", moat: true, problem: "Suppliers paid without confirmed delivery — disputes over amounts and delivery status are constant" },
      { name: "Timesheet → Payroll → Job Cost Automation", category: "Automation", complexity: "Complex", type: "Build", moat: false, problem: "Timesheet data re-entered manually into payroll and job cost codes — double entry, errors, hours of admin weekly" },
      { name: "Material Procurement Automation", category: "Automation", complexity: "Complex", type: "Both", moat: false, problem: "Reorders triggered reactively after shortages — no threshold system, stockouts delay crews on site" },
      { name: "Lien Holdback Tracker", category: "Compliance", complexity: "Mid", type: "Both", moat: true, problem: "Provincial holdback calculations done manually — release dates missed, creating legal exposure and payment disputes" },
      { name: "Daily Site Report Workflow", category: "Automation", complexity: "Quick", type: "Both", moat: false, problem: "Site reports emailed or texted in inconsistent formats — PM spends time consolidating rather than managing" },
      { name: "Deficiency List to Close-Out Workflow", category: "Automation", complexity: "Mid", type: "Build", moat: false, problem: "Punch list items tracked informally — subtrades not formally notified, completion unconfirmed, handover delayed" },
      { name: "Project Closeout Automation", category: "Automation", complexity: "Mid", type: "Build", moat: false, problem: "Warranty docs, O&M manuals, and as-built drawings assembled manually for every handover — always late" },
      { name: "AI Bid Document Extraction", category: "AI-Powered", complexity: "Complex", type: "Build", moat: true, problem: "Estimators read subcontractor bids line by line to extract scope, exclusions, and pricing into comparison sheets" },
      { name: "AI RFI Response Drafting", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "RFI responses require PM to locate spec sections and write structured replies — time-consuming, delays field work" },
      { name: "AI Change Order Impact Analysis", category: "AI-Powered", complexity: "Enterprise", type: "Both", moat: true, problem: "Cost of change orders analyzed manually — schedule impacts frequently miscalculated, margin erodes silently" },
      { name: "Safety Incident Classification & Reporting", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "Incident reports categorized manually, regulatory notification timeline tracked in email — compliance risk" },
      { name: "Real-Time Job Cost Dashboard", category: "Dashboards", complexity: "Complex", type: "Both", moat: false, problem: "Job profitability unknown until month-end — overruns identified too late to correct on active projects" },
      { name: "Project Portfolio Health Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Owner has no real-time view across all active jobs — milestone slippage and budget risk invisible until it's a problem" },
      { name: "Subcontractor Performance Scorecard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "No historical data on subtrade on-time performance, quality, or dispute rate — vendor selection based on gut feel" },
      { name: "WSIB clearance Batch Automation", category: "Compliance", complexity: "Mid", type: "Both", moat: true, problem: "WSIB clearance certificates requested manually per project — expired certificates missed, liability exposure on site" },
      { name: "CRA T4A Automation for Subcontractors", category: "Compliance", complexity: "Mid", type: "Both", moat: true, problem: "T4A filing prepared manually at year-end — incomplete records, CRA audit exposure, late filing penalties" },
      { name: "HST Construction Rule Compliance", category: "Compliance", complexity: "Complex", type: "Build", moat: true, problem: "New housing rebates, self-supply rules, and holdback HST handled inconsistently — CRA assessment risk" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Agencies",
    emoji: "📊",
    phase: 2,
    color: "#4F46E5",
    lightColor: "#1e1b4b",
    borderColor: "#6366f1",
    blurb: "White-label client reporting, time-to-invoice automation, AI campaign anomaly detection, utilization dashboards — for digital and creative agencies.",
    services: [
      { name: "Ad Platform Data Aggregation", category: "Integration", complexity: "Mid", type: "Both", moat: false, problem: "Staff pull numbers from Google, Meta, LinkedIn, TikTok separately — monthly reporting takes 8–15 hours per client" },
      { name: "CRM → Project Management Bridge", category: "Integration", complexity: "Mid", type: "Build", moat: false, problem: "Closed deal in HubSpot requires manual project creation in Asana/ClickUp — tasks missed, kickoffs delayed" },
      { name: "Time Tracking → Accounting Integration", category: "Integration", complexity: "Quick", type: "Build", moat: false, problem: "Harvest/Toggl hours not automatically pushed to QuickBooks/Xero — invoices require manual matching and entry" },
      { name: "Analytics Platform Consolidation", category: "Integration", complexity: "Complex", type: "Both", moat: true, problem: "GA4, Adobe Analytics, Hotjar, and heatmap data siloed — no unified view of site performance for clients" },
      { name: "White-Label Automated Client Reporting", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Monthly reports assembled manually from ad platforms — time-consuming, error-prone, and always late" },
      { name: "Time Entry → Invoice → Delivery Automation", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Approved hours manually transferred to invoices — billable hours leaked, invoices delayed, cash flow suffers" },
      { name: "Client Onboarding Workflow", category: "Portal", complexity: "Mid", type: "Build", moat: false, problem: "New client onboarding is a chaotic email thread — assets, logins, and briefs routinely go missing" },
      { name: "Budget Pacing Alerts", category: "Automation", complexity: "Quick", type: "Both", moat: false, problem: "AM discovers client overspent or underspent after the fact — adjustments too late to save the month" },
      { name: "Content Approval Workflow", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Creative approvals via email threads — version confusion, missed feedback, delayed launches" },
      { name: "Retainer Hour Tracker with Alerts", category: "Automation", complexity: "Quick", type: "Both", moat: false, problem: "Hours against retainer tracked manually — overages discovered at invoice time, clients dispute them" },
      { name: "Contract Renewal Automation", category: "Automation", complexity: "Quick", type: "Both", moat: false, problem: "Retainer renewal dates managed in spreadsheets — renewals missed, clients lapse without notice" },
      { name: "AI Campaign Performance Anomaly Detection", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "Budget burning on underperforming campaigns discovered days later — spend wasted before human review catches it" },
      { name: "AI Campaign Brief Generator", category: "AI-Powered", complexity: "Mid", type: "Both", moat: true, problem: "AM spends 2–3 hours writing campaign briefs from client intake answers — repeatable, should not require senior time" },
      { name: "AI Competitor Monitoring", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "No systematic tracking of client competitors' ads, messaging changes, or new product launches" },
      { name: "AI Content Repurposing Pipeline", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "Long-form content cut into social, email, and ad formats manually — team bottleneck for high-volume clients" },
      { name: "Client Portfolio Performance Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "No real-time view of ROAS, spend, and performance across all client accounts — agency principals flying blind" },
      { name: "Agency Ops & Utilization Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Staff overload stays invisible until deadlines are missed — no utilization view across projects and team members" },
      { name: "New Business Pipeline Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Revenue forecast built manually from CRM — close rate and deal velocity tracked inconsistently" },
      { name: "Client Profitability Report", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Revenue per client known; hours and costs per client not tracked — profitable vs. money-losing accounts indistinguishable" },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    emoji: "🛒",
    phase: 2,
    color: "#0369A1",
    lightColor: "#082f49",
    borderColor: "#0ea5e9",
    blurb: "Multichannel inventory sync, WISMO AI agents, fraud scoring, demand forecasting, CASL/Bill 96 compliance — for Canadian DTC and multichannel retailers.",
    services: [
      { name: "Multichannel Inventory Sync", category: "Integration", complexity: "Complex", type: "Build", moat: true, problem: "Shopify, Amazon, and wholesale inventory tracked separately — overselling is a recurring operational failure" },
      { name: "Marketplace Order Consolidation", category: "Integration", complexity: "Complex", type: "Build", moat: true, problem: "Orders from Shopify, Amazon, TikTok Shop, and wholesale managed in different dashboards — fulfilment errors common" },
      { name: "Supplier Portal Integration", category: "Integration", complexity: "Complex", type: "Both", moat: true, problem: "POs emailed in PDF format — no automated receiving, tracking, or payment matching against delivery" },
      { name: "Product Feed Management", category: "Integration", complexity: "Mid", type: "Both", moat: false, problem: "Product feeds to Google Shopping, Meta Catalog, and Amazon maintained manually — pricing and inventory lag behind Shopify" },
      { name: "Returns & RMA Automation", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Returns processed manually: RMA creation, label generation, refund issuance, and restocking all separate steps" },
      { name: "Fulfillment Exception Triage", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Failed orders, address failures, and out-of-stock holds caught manually — customer complaints arrive before fixes" },
      { name: "Shopify → Accounting Reconciliation", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Shopify payouts reconciled to bank and QuickBooks manually — bookkeeper spends days on it monthly" },
      { name: "Threshold-Based Reorder System", category: "Automation", complexity: "Complex", type: "Both", moat: false, problem: "Reorders triggered after stockouts — no proactive system, supplier lead times not factored in" },
      { name: "Abandoned Cart Recovery Sequences", category: "Automation", complexity: "Quick", type: "Both", moat: false, problem: "Abandoned cart emails sent by default Klaviyo flows — no custom logic for AOV, product category, or customer tier" },
      { name: "Post-Purchase Review Automation", category: "Automation", complexity: "Quick", type: "Both", moat: false, problem: "Review requests sent inconsistently — timing suboptimal, platform routing (Google vs Shopify vs TrustPilot) manual" },
      { name: "Subscription Management & Dunning", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Failed subscription payments handled manually — churn from payment failures preventable with automated dunning" },
      { name: "Flash Sale Operations Automation", category: "Automation", complexity: "Mid", type: "Build", moat: false, problem: "Price and inventory changes for sale events done manually — errors during peak traffic are costly" },
      { name: "WISMO AI Agent (Email + Chat)", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "30–40% of support volume is order status questions answered by a human — fully automatable" },
      { name: "AI Fraud Scoring", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "Fraudulent orders identified only after chargebacks — manual review of flagged orders inconsistent and slow" },
      { name: "AI Demand Forecasting", category: "AI-Powered", complexity: "Enterprise", type: "Both", moat: true, problem: "Reorder points set manually based on intuition — stockouts and overstock driven by inaccurate demand assumptions" },
      { name: "AI Product Description Generation", category: "AI-Powered", complexity: "Mid", type: "Build", moat: true, problem: "Catalog expansions bottlenecked by copywriting capacity — new SKUs sit unlisted for weeks" },
      { name: "Customer Segmentation & Personalization Engine", category: "AI-Powered", complexity: "Enterprise", type: "Both", moat: true, problem: "Same email sent to all customers — revenue per email suppressed by one-size-fits-all messaging" },
      { name: "Operations Command Centre", category: "Dashboards", complexity: "Complex", type: "Both", moat: false, problem: "No single view of inventory health, order velocity, return rate, and fulfillment accuracy — ops runs on instinct" },
      { name: "SKU-Level P&L Dashboard", category: "Dashboards", complexity: "Complex", type: "Both", moat: true, problem: "Margin per product unknown in real time — promotions run on loss-making SKUs without knowing it" },
      { name: "Customer LTV & Cohort Dashboard", category: "Dashboards", complexity: "Complex", type: "Both", moat: true, problem: "CAC known; LTV by channel and cohort not tracked — customer acquisition strategy lacks profitability signal" },
      { name: "Provincial Tax Compliance Automation", category: "Compliance", complexity: "Mid", type: "Both", moat: true, problem: "GST/HST/PST calculated inconsistently across provinces — CRA filing exposure and potential customer disputes" },
      { name: "CASL Email Consent Management", category: "Compliance", complexity: "Mid", type: "Build", moat: true, problem: "Email consent records not maintained to CASL standard — regulatory risk, fines up to $10M for organizations" },
      { name: "Quebec Bill 96 Product Content Compliance", category: "Compliance", complexity: "Mid", type: "Build", moat: true, problem: "French-language product content legally required for Quebec sales — not enforced puts Francophone market at legal risk" },
    ],
  },
  {
    id: "professional",
    name: "Professional Services",
    emoji: "⚖️",
    phase: 1,
    color: "#7C3AED",
    lightColor: "#2e1065",
    borderColor: "#8b5cf6",
    blurb: "Practice-management integration, matter automation, AI document extraction, Law Society trust accounting, FINTRAC — for law, accounting, and advisory firms.",
    services: [
      { name: "Practice Management Software Integration", category: "Integration", complexity: "Complex", type: "Build", moat: true, problem: "Clio, Karbon, or Sage Practice Manager siloed from CRM and billing — data re-entered across platforms daily" },
      { name: "CRM → Matter → Billing Integration", category: "Integration", complexity: "Complex", type: "Build", moat: true, problem: "Closing a client in CRM requires manually opening a matter and activating billing — steps frequently missed" },
      { name: "Document Management System Integration", category: "Integration", complexity: "Complex", type: "Both", moat: true, problem: "NetDocs, iManage, or SharePoint disconnected from practice management — document location and filing inconsistent" },
      { name: "Trust Account Banking API Integration", category: "Integration", complexity: "Enterprise", type: "Both", moat: true, problem: "Trust account transactions manually reconciled to bank statements — Law Society compliance obligation done by hand" },
      { name: "Digital Client Onboarding Portal", category: "Portal", complexity: "Complex", type: "Build", moat: false, problem: "New client onboarding by email thread — ID collection, engagement letter signing, and document intake take days" },
      { name: "Matter Status & Deadline Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Active files and deadlines tracked in spreadsheets or memory — critical dates missed, follow-up reactive not proactive" },
      { name: "Billing Automation (Time → Invoice → AR)", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Billing is three separate manual jobs: time entry, invoice generation, and accounts receivable follow-up" },
      { name: "Document Collection Workflow", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Tax, audit, and closing documents chased by email — no tracking system, collection status invisible to the team" },
      { name: "Conflict of Interest Check Automation", category: "Automation", complexity: "Complex", type: "Build", moat: true, problem: "New client intake manually cross-referenced against existing client list — error-prone, potential professional liability" },
      { name: "Engagement Letter Renewal Automation", category: "Automation", complexity: "Quick", type: "Both", moat: false, problem: "Annual engagement letter renewals tracked in calendar reminders — delays create unauthorized work exposure" },
      { name: "Referral Source Attribution", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Referrals tracked informally — no closed-loop system connecting source to billed revenue" },
      { name: "Staff Productivity & WIP Reporting", category: "Automation", complexity: "Mid", type: "Both", moat: false, problem: "Billable vs non-billable hours manually compiled — utilization and WIP reporting delayed by days" },
      { name: "AI Contract & Document Extraction", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "Staff read contracts, leases, and agreements to extract key terms into the file — fully automatable with AI extraction" },
      { name: "AI Email Triage & Matter Routing", category: "AI-Powered", complexity: "Complex", type: "Both", moat: true, problem: "High email volume — staff spend significant time classifying client inquiries and routing to the correct team member and file" },
      { name: "AI Meeting Summarization & Action Item Extraction", category: "AI-Powered", complexity: "Mid", type: "Both", moat: true, problem: "Meeting notes taken manually, action items informally captured — commitments missed, follow-up inconsistent" },
      { name: "AI Due Diligence Document Scanner", category: "AI-Powered", complexity: "Enterprise", type: "Both", moat: true, problem: "M&A and real estate due diligence document review is manual — risk terms and missing clauses identified inconsistently" },
      { name: "Firm Health Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Utilization, WIP, AR aging, and realization rate pulled manually from practice management — always delayed" },
      { name: "Client Profitability Dashboard", category: "Dashboards", complexity: "Complex", type: "Both", moat: true, problem: "Revenue per client known; hours and cost per matter not tracked — unprofitable client relationships not identified" },
      { name: "Partner & Associate Performance Dashboard", category: "Dashboards", complexity: "Mid", type: "Both", moat: false, problem: "Billing, originations, and utilization per fee-earner tracked in spreadsheets — performance conversations lack data" },
      { name: "PIPEDA-Compliant Data Architecture", category: "Compliance", complexity: "Complex", type: "Build", moat: true, problem: "Personal data flows undocumented, retention periods unenforced, consent records absent — regulatory exposure" },
      { name: "Law Society Trust Accounting Automation", category: "Compliance", complexity: "Enterprise", type: "Both", moat: true, problem: "Trust account three-way reconciliation done manually — Law Society compliance obligation, audit risk if incorrect" },
      { name: "CRA Document Retention & Audit Trail", category: "Compliance", complexity: "Mid", type: "Build", moat: true, problem: "Document retention policies undocumented and inconsistently applied — CRA audit vulnerability" },
      { name: "FINTRAC AML for Financial Advisors & Mortgage Brokers", category: "Compliance", complexity: "Complex", type: "Build", moat: true, problem: "AML obligations met manually — ID verification and record-keeping non-compliant with FINTRAC current rules" },
    ],
  },
];

export const ALL_CATEGORIES: ServiceCategory[] = ["Integration", "Automation", "AI-Powered", "Dashboards", "Compliance", "Portal"];
export const ALL_COMPLEXITY: Complexity[] = ["Quick", "Mid", "Complex", "Enterprise"];
export const ALL_TYPES: EngagementType[] = ["Build", "Retainer", "Both"];

/**
 * Total service + moat counts, computed from the catalog so copy can never
 * drift. Replaces the previous hardcoded "120+" (which was wrong). Import this
 * wherever a service count appears in copy/metadata.
 */
export const TOTAL_SERVICES = VERTICALS.reduce((sum, v) => sum + v.services.length, 0);
export const TOTAL_MOAT = VERTICALS.reduce(
  (sum, v) => sum + v.services.filter((s) => s.moat).length,
  0,
);
