# The Daily Newzlet

The Daily Newzlet is a modern, fully automated daily news aggregation platform featuring a bold, aesthetic design. It leverages a decoupled architecture to deliver high-performance, categorized news updates fetched seamlessly from global RSS feeds.

The web application is fully responsive and supports Progressive Web App (PWA) standards, allowing it to be natively installed on Android and iOS devices directly from the browser.

---

## System Architecture

The platform is designed around a highly decoupled, modern web stack aimed at high availability, strong SEO performance, automated content ingestion, and extreme responsiveness.

```text
User ──> Cloudflare CDN ──> Cloudflare Pages (React client)
                                  │
                          (API requests via HTTPS)
                                  │
                                  ▼
                            AlwaysData Host (Django REST API)
                                  │
                      ┌───────────┴───────────┐
                      ▼                       ▼
              Supabase (PostgreSQL)     Upstash (Redis Cache)

Data Ingestion:
[Global RSS Feeds] ──> n8n Workflows ──(Daily early morning push)──> Django Ingestion Endpoint
```

### Components
- **Frontend Client:** Built using React.js. Hosted on Cloudflare Pages and served via Cloudflare CDN for edge caching and global delivery.
- **Backend API & CRM:** Django REST Framework (DRF) serving a stateless, clean JSON API hosted on AlwaysData. Includes a customized Django Admin panel acting as a CRM for article moderation.
- **Data Stores:** 
  - **Supabase (PostgreSQL):** Persistent relational storage for articles, categories, and contact queries.
  - **Upstash (Redis):** Fast serverless caching layer for rapid content delivery, bypassing heavy database lookups.
- **Content Ingestion:** Fully automated n8n workflows that orchestrate early morning RSS ingestion, normalizing article metadata and pushing to the backend ingestion endpoint.

---

## Core Features

- **Native Android & iOS Installation (PWA):** Leveraging a custom `site.webmanifest` and optimized icons (`apple-touch-icon.png`, `favicon.png`), the application offers a standalone, app-like native installation experience on mobile devices.
- **Automated Ingestion & Deduplication:** Automates daily feed synchronization. Articles are normalized, categorized, and automatically deduplicated on the backend based on source URLs.
- **Aesthetic CSS-Driven UI:** A cohesive, dark-themed responsive bento-grid design. Features horizontally scrolling category rails, a breaking news marquee ticker, clean article cards, and modal detail views.
- **Unified Theme Styling:** Visual components like category pills are styled dynamically in CSS, decoupling theme details from the database schema.
- **SEO & Social Optimization:** Complete meta-tag coverage, dynamic XML sitemaps, structured JSON-LD data (`ItemList`, `CollectionPage`, `NewsMediaOrganization`), and canonical URL generation.
- **Agent-Friendly Context:** Includes static `/llms.txt` configurations for developer-agent onboarding and workspace alignment.

---

## Caching, Refresh, & Performance Optimizations

To deliver sub-50ms API responses under hardware constraints (AlwaysData free tier), the system uses an aggressive, layered caching and pre-warming architecture:

### 1. Server-Side Caching (Upstash Redis)
- **DRF Pickle Resolution:** Custom API caching decorator resolves a common DRF limitation where unrendered `Response` objects raise serialization errors. The decorator forces response rendering before caching.
- **Edge Cache Headers:** Responses cached in Upstash Redis are returned with `Cache-Control: public, max-age=0, s-maxage=X, stale-while-revalidate=86400`, allowing Cloudflare Edge nodes to serve stale content while resolving the latest data in the background.

### 2. Real-Time Client Version Synchronization
- **News Version Polling:** The client uses TanStack React Query to poll a lightweight endpoint (`/api/news-version/`) every 3 minutes. The endpoint returns a single Unix timestamp of the last article save, served instantly from Redis (~30 bytes, zero database queries).
- **Cross-Tab Broadcast Synchronization:** When a change is detected in one tab, it propagates a signal via the browser's `BroadcastChannel` API. This instantly synchronizes all open browser tabs, prompting the user with a non-disruptive refresh banner without awaiting individual poll intervals.
- **Selective Query Invalidation:** Triggering a refresh selectively invalidates article-related React Query keys (`articles`, `breaking`, `category-articles`) while preserving static configurations.

### 3. Automatic Background Cache Pre-Warming
- **Preventing Cold Starts:** Django model signals (`post_save`, `post_delete` on Articles or Categories) clear the Redis cache on updates and trigger a background task inside a single-worker `ThreadPoolExecutor`.
- **Request Factory Simulation:** The background thread simulates requests against core endpoints (home timeline, breaking news, categories list, and daily facts) using Django's `RequestFactory`. This rebuilds the Redis cache asynchronously before any user visits the site, eliminating cache stampede and slow cold-start queries.

### 4. Database Query (N+1) Optimizations
- All article feed queries in `views.py` utilize `.select_related('category')` to execute a single, joined SQL query when serializing, reducing query count from $N+1$ to exactly **1 database query** and avoiding thread blockage.

### 5. Lighthouse-Driven Performance Enhancements
- **Self-Hosted Web Fonts:** Removed all external, render-blocking Google Fonts and Material Symbols link tags. Core fonts are stored locally in compressed `.woff2` formats (~500KB total) inside `/public/assets/fonts/` for the client, reducing layout shifts (CLS) and optimizing page load speeds.
- **Custom Vector Icons:** External icon font libraries have been replaced entirely by custom inline vector icons (`Icons.jsx`), resolving rendering delays and rendering layout shifts.
- **GPU-Accelerated Animations:** Keyframe transitions and CSS animations have been optimized to run directly on the GPU (utilizing `transform` and `translate` instead of properties that trigger layout re-paints).

---

## Project Structure

```text
newzlet/
├── frontend/                 # React SPA Client (Cloudflare Pages)
│   ├── functions/            # Cloudflare Pages Functions
│   │   └── sitemap.xml.js    # Dynamic XML sitemap generator
│   ├── public/               # Static assets & Edge configurations
│   │   ├── assets/           # Client assets
│   │   │   └── fonts/        # Local compressed .woff2 font files and CSS definitions
│   │   ├── _headers          # Cloudflare security and cache-control headers
│   │   ├── _redirects        # Cloudflare client-side routing rules
│   │   ├── apple-touch-icon.png # Native app icon (PWA)
│   │   ├── favicon.png       # App favicon
│   │   ├── llms.txt          # LLM/AI-agent onboarding context file
│   │   ├── og-image.png      # Social sharing previews
│   │   ├── robots.txt        # Search crawler rules
│   │   └── site.webmanifest  # PWA manifest configuration for mobile install
│   └── src/
│       ├── components/       # Component library (Cards, Modals, Banners)
│       ├── hooks/            # Custom React hooks (Query data fetching, version polling)
│       ├── pages/            # View routes (Home, Category, Search)
│       ├── services/         # Axios client and API configurations
│       └── styles/           # Global typography, layout variables, and animations
│
└── backend/                  # Django REST API & CRM (AlwaysData)
    ├── apps/
    │   ├── ingest/           # Webhook ingestion handlers for n8n
    │   └── news/             # Models, views, serializers, signals, and filters
    └── config/               # Settings, routing, and custom middlewares
```
