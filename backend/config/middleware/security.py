"""
Production security middleware for headers not natively supported by Django's
SecurityMiddleware.

Adds:
  - Referrer-Policy
  - Permissions-Policy
  - Cross-Origin-Opener-Policy
"""


class SecurityHeadersMiddleware:
    """Append extra security headers to every response."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Control how much referrer information is sent with requests
        response.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")

        # Restrict access to browser features the backend does not need
        response.setdefault(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=()",
        )

        # Isolate browsing context to prevent cross-origin attacks (Spectre etc.)
        response.setdefault("Cross-Origin-Opener-Policy", "same-origin")

        return response
