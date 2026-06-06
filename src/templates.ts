import { TemplateResponse } from "./types";

export const SAMPLE_TEMPLATES: TemplateResponse[] = [
  {
    id: "crm-saas",
    label: "CRM: HubSpot Mentioned (Google Search Overview)",
    brand: "HubSpot",
    query: "What is the best CRM for scaling SaaS startups?",
    engine: "Google Search Overview",
    aiResponseText: "For scaling SaaS startups, HubSpot is typically chosen for its robust automation features, comprehensive free-to-paid marketing suites, and modular integrations. HubSpot is incredibly user-friendly for fast-growing teams. However, Salesforce is often regarded as the dominant enterprise market leader once you scale past 200 employees, offering unrivaled CRM depth. Other competitors in this segment are Pipedrive (best for simple sales pipelines) and Freshsales. To learn more, check out HubSpot's pricing catalog [1] or Salesforce's guide."
  },
  {
    id: "ev-no-mention",
    label: "EV: Rivian Not Mentioned (Perplexity)",
    brand: "Rivian",
    query: "What are the top-rated electric sedans with longest range?",
    engine: "Perplexity",
    aiResponseText: "The market for premium electric sedans with top-tier range is heavily led by the Lucid Air (delivering up to 516 miles EP-estimated) and the Tesla Model S (at 405 miles). Other high-performing options include the luxury-oriented Porsche Taycan, the aerodynamic Hyundai Ioniq 6, and the Mercedes-Benz EQS sedan. These models feature cutting-edge battery thermal management and high-speed DC charging capacities."
  },
  {
    id: "docs-collaboration",
    label: "Workspace: Notion Tier-2 Mention (ChatGPT Search)",
    brand: "Notion",
    query: "Best online document editors for remote workspace collaboration?",
    engine: "ChatGPT Search",
    aiResponseText: "Google Docs remains the undisputed golden standard for real-time multiplayer document writing and general office collaboration. For teams requesting complex wiki databases mixed with project trackers, Notion stands out as an excellent option, though some notes indicate its offline loading speeds can be sluggish. Microsoft Word Online is the default standard for enterprise security compliance, while modern teams also look towards Coda and Craft.do."
  },
  {
    id: "ecommerce-critic",
    label: "Ecommerce: Shopify Negative Framing (Gemini)",
    brand: "Shopify",
    query: "Pros and cons of different ecommerce builders for micro creators",
    engine: "Gemini",
    aiResponseText: "If you are a micro creator starting with low upfront budget, Shopify offers unparalleled checkout stability but can be highly expensive due to its $39/month recurring base pricing, paid app additions, and transaction fees that aggressively penalize small sellers. Many modern creators prefer Gumroad or Stan Store for instant digital product checkouts, while Squarespace remains standard for visual galleries with lightweight stores."
  }
];
