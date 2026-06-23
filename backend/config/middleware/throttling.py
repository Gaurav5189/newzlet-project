"""
Custom throttle classes that are Cloudflare- and Alwaysdata-aware.

Problem
-------
The frontend is served via Cloudflare Pages (SSR).  All requests that arrive
at the Django/Alwaysdata origin appear to come from a single Cloudflare edge
IP address (or, worse, a single internal Alwaysdata load-balancer IP).
Using the default DRF AnonRateThrottle, which keys on REMOTE_ADDR, would
count ALL users as the same client and block the entire site after one
person's request quota is exhausted.

Solution
--------
We resolve the real visitor IP using a three-tier priority chain:

  1. CF-Connecting-IP   – injected by Cloudflare; most authoritative when
                          Cloudflare is in front of the origin.
  2. X-Forwarded-For    – injected by Alwaysdata's shared-hosting reverse
                          proxies.  The *first* (leftmost) IP in the
                          comma-separated list is the real visitor address.
  3. REMOTE_ADDR        – raw socket peer; used only in local development
                          where no proxy sits in front of Django.
"""

from rest_framework.throttling import SimpleRateThrottle


class CloudflareAnonThrottle(SimpleRateThrottle):
    """
    Rate-limit anonymous requests by real client IP.
    Supports Cloudflare proxies and standard reverse proxies (e.g. Alwaysdata).

    Priority:
      1. CF-Connecting-IP   – real visitor IP set by Cloudflare (when API is proxied through CF)
      2. X-Real-IP          – real visitor IP set by Alwaysdata's proxy (when API is hit directly)
      3. X-Forwarded-For    – standard reverse proxy IP list (leftmost is client)
      4. REMOTE_ADDR        – fallback for local dev (no proxy in front)
    """

    scope = "anon"

    def get_cache_key(self, request, view):
        # 1. Cloudflare sets this header if the request goes through Cloudflare.
        real_ip = request.META.get("HTTP_CF_CONNECTING_IP")

        # 2. Alwaysdata sets X-Real-IP for direct requests hitting the origin.
        if not real_ip:
            real_ip = request.META.get("HTTP_X_REAL_IP")

        # 3. Alwaysdata's shared-hosting reverse proxies or other load balancers.
        if not real_ip:
            x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            if x_forwarded_for:
                real_ip = x_forwarded_for.split(",")[0].strip()

        # 4. Last resort: raw socket address (only valid in local dev).
        if not real_ip:
            real_ip = request.META.get("REMOTE_ADDR")

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
