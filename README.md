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

## Caching, Refresh, & Performance Optimizations

To deliver dynamic content instantly while running on a highly constrained backend hosting environment (AlwaysData free tier with 0.25 CPU and 256MB RAM), the platform utilizes an optimized caching and performance architecture:

### 1. Real-Time News Update Notifications (Version Polling)
- **Version Stamp Polling**: The frontend uses TanStack React Query to poll a lightweight `/api/news-version/` endpoint every 3 minutes. This endpoint returns a simple Unix timestamp of the last article save, served instantly from Redis.
- **Cross-Tab Synchronization**: When a version change is detected in one tab, it fires a message across the `BroadcastChannel` API to instantly notify all other open tabs of the same site, prompting them to show the **Refresh** banner immediately without waiting for their own poll interval.
- **Selective Query Invalidation**: Clicking "Refresh" selectively invalidates only article-related query keys (`articles`, `breaking`, `category-articles`). Static lists (like categories) remain cached to reduce redundant network requests.

### 2. Cache Pre-Warming (Done)
- **Problem**: When a new article ingestion is triggered (e.g. from n8n), Django's post-save signal flushes the Redis cache. The first subsequent user visit would experience a slow "cold start" database query.
- **Solution**: Immediately after clearing Redis, Django triggers a background task inside a single-worker `ThreadPoolExecutor`. This task uses Django's `RequestFactory` to run internal requests against:
  - `/api/articles/?page=1&page_size=100` (Home timeline)
  - `/api/articles/breaking/` (Breaking news ticker)
  - `/api/categories/` (Categories list)
  - `/api/categories/day-fact/articles/?page=1` (Today's fun fact)
- **Result**: The Redis cache is rebuilt in the background. Real users are *always* served warm cache hits ($< 5\text{ms}$ response times) and never experience database query latency.

### 3. Database JOIN Optimization (N+1 Query Fix)
- Querysets for all article-listing views in `views.py` utilize `.select_related('category')` to execute a single, joined SQL query when serializing articles. This reduces database queries from $N+1$ (e.g., 101 queries for 100 articles) to exactly **1 database query**, preventing thread-blocking bottlenecks on the remote database.

### 4. Future Edge Hydration (Cloudflare KV)
- **Proposed Scale Pattern**: For higher traffic volumes, the `/api/news-version/` check can be offloaded entirely to **Cloudflare KV** (Key-Value) and a Cloudflare Pages Function. When Django ingests new articles, it pushes the updated timestamp directly to Cloudflare KV. The 3-minute frontend version checks will be served instantly from Cloudflare Edge ($< 15\text{ms}$), shielding the AlwaysData Django server from 100% of the version checking traffic.

