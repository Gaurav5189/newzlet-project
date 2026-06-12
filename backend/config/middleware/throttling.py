"""
Custom throttle classes that are Cloudflare-aware.

Problem
-------
The frontend is served via Cloudflare Pages (SSR).  All requests that arrive
at the Django/Alwaysdata origin appear to come from a single Cloudflare edge
IP address.  Using the default DRF AnonRateThrottle, which keys on
REMOTE_ADDR, would count ALL users as the same client and block the entire
site after one person's request quota is exhausted.

Solution
--------
Cloudflare injects the real visitor's IP via the `CF-Connecting-IP` HTTP
header.  We key the throttle on that header when present, and fall back to
REMOTE_ADDR when running locally (no Cloudflare in front).
"""

from rest_framework.throttling import SimpleRateThrottle


class CloudflareAnonThrottle(SimpleRateThrottle):
    """
    Rate-limit anonymous requests by real client IP.

    Priority:
      1. CF-Connecting-IP   – the visitor's real IP as set by Cloudflare
      2. REMOTE_ADDR        – fallback for local dev / non-Cloudflare traffic
    """

    scope = "anon"

    def get_cache_key(self, request, view):
        # Cloudflare passes the real visitor IP in this header.
        real_ip = (
            request.META.get("HTTP_CF_CONNECTING_IP")
            or request.META.get("REMOTE_ADDR")
        )
        return self.cache_format % {
            "scope": self.scope,
            "ident": real_ip,
        }


class CloudflareContactThrottle(CloudflareAnonThrottle):
    """
    Stricter throttle for the contact form — 3 submissions per hour per real
    visitor IP.  Uses a separate scope ('contact') so its counter is completely
    independent from the global API throttle ('anon').

    Without this, the old ContactFormThrottle (which extended AnonRateThrottle)
    would key on REMOTE_ADDR — the shared Cloudflare edge IP — meaning the
    3/hour limit would be shared across ALL visitors, not per person.
    """

    scope = "contact"
