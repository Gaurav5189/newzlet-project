# Newzlet

Newzlet is a modern, fully automated daily news aggregation platform featuring a bold, "Grog-inspired" aesthetic. It leverages a decoupled architecture to deliver high-performance, categorized news updates fetched seamlessly from global RSS feeds.

## System Architecture

The platform is designed around a highly decoupled, modern web stack aimed at high availability and automated content ingestion.

- **Frontend:** React SPA built with Vite and React Router, styled with vibrant flat colors, thick borders, and playful typography (Boogaloo, Archivo Black, DM Sans) to match the distinct visual identity.
- **Backend:** Django REST Framework (DRF) serving a clean, stateless JSON API.
- **Database:** PostgreSQL for persistent storage of articles and categorizations.
- **Caching Layer:** Upstash Redis for high-speed delivery of trending and category-specific news feeds.
- **Data Ingestion:** Automated n8n workflows that periodically fetch, normalize, and push RSS feed data into the backend via secure Webhooks.

## Core Features

- **Automated Ingestion Pipeline:** n8n securely pushes new articles to the Django backend (`/api/ingest/articles/`). The system deduplicates content based on source URLs automatically.
- **Custom CRM/Admin Panel:** Django's built-in Admin panel acts as a powerful CRM, customized to easily toggle article visibility, mark breaking news, and manage categories.
- **Robust Caching Strategy:** Redis instantly serves the most recent articles and breaking news to minimize database hits. The cache is automatically invalidated when new content arrives.
- **Fully Responsive UI:** A playful and distinct interface featuring marquee breaking news tickers, horizontally scrolling category rails, and clean article grids.

## Project Structure

```text
newzlet/
├── frontend/               # React SPA Application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI elements (Navbar, ArticleCards, etc.)
│       ├── pages/          # View routes (Home, Category, Search)
│       ├── hooks/          # React Query data fetching hooks
│       ├── services/       # Axios API configurations
│       └── styles/         # Global CSS and typographic variables
│
└── backend/                # Django REST API & CRM
    ├── config/             # Environment-specific settings (base, dev, prod)
    ├── apps/
    │   ├── news/           # Core models (Category, Article), views, and CRM configs
    │   └── ingest/         # API Key authenticated webhook handlers for n8n
    └── manage.py           # Django command-line utility
```
