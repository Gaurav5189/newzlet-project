# The Daily Newzlet

The Daily Newzlet is a modern, fully automated daily news aggregation platform featuring a bold, aesthetic design. It leverages a decoupled architecture to deliver high-performance, categorized news updates fetched seamlessly from global RSS feeds.

## System Architecture

The platform is designed around a highly decoupled, modern web stack aimed at high availability, strong SEO performance, and automated content ingestion.

- **Frontend Edge (Cloudflare Pages):** React SPA built with Vite and React Router. It includes an edge configuration layer (`_redirects`, `_headers`) for secure caching and API proxying.
- **Frontend SEO Layer:** Dynamic meta tag injection via `react-helmet-async`, structured JSON-LD data generation per route, and a Cloudflare Pages Function (`functions/sitemap.xml.js`) for dynamic XML sitemap generation.
- **Backend:** Django REST Framework (DRF) serving a clean, stateless JSON API, hosted on AlwaysData.
- **Database (Supabase):** PostgreSQL for persistent storage of articles and categorizations.
- **Caching Layer (Upstash):** Serverless Redis for high-speed delivery of trending and category-specific news feeds.
- **Data Ingestion:** Automated n8n workflows that periodically fetch, normalize, and push RSS feed data into the backend.

## Core Features

- **Automated Ingestion Pipeline:** n8n securely pushes new articles to the Django backend every morning. The system deduplicates content based on source URLs automatically.
- **Robust SEO Infrastructure:** Site-wide and per-route meta tags, canonical URLs, lazy-loaded optimized images for Core Web Vitals, and JSON-LD structured data (`ItemList`, `CollectionPage`, `NewsMediaOrganization`) injected dynamically.
- **Custom CRM/Admin Panel:** Django's built-in Admin panel acts as a powerful CRM, customized to easily toggle article visibility, mark breaking news, and manage categories.
- **Robust Caching Strategy:** Redis instantly serves the most recent articles and breaking news to minimize database hits.
- **Fully Responsive UI:** A playful and distinct interface featuring marquee breaking news tickers, horizontally scrolling category rails, bento-grid layouts, and clean article cards.

## Project Structure

```text
newzlet/
├── frontend/                 # React SPA Application
│   ├── functions/            # Cloudflare Pages Functions
│   │   └── sitemap.xml.js    # Dynamic XML Sitemap generator
│   ├── public/               # Static assets & Edge Configs
│   │   ├── _redirects        # Cloudflare routing rules
│   │   ├── _headers          # Cloudflare caching & security headers
│   │   ├── robots.txt        # SEO crawler instructions
│   │   └── site.webmanifest  # PWA Manifest
│   └── src/
│       ├── components/       # Reusable UI elements (ArticleCards, Modals)
│       ├── pages/            # View routes (Home, Category, Search)
│       ├── hooks/            # React Query data fetching hooks
│       ├── services/         # Axios API configurations
│       └── styles/           # Global CSS and typographic variables
│
└── backend/                  # Django REST API & CRM
    ├── config/               # Environment-specific settings
    └── apps/
        ├── news/             # Core models, views, and CRM configs
        └── ingest/           # API Key authenticated webhook handlers for n8n
```
