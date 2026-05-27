from rest_framework import authentication
from rest_framework import exceptions
from django.conf import settings

class ApiKeyAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        api_key = request.headers.get('X-API-KEY')
        if not api_key:
            # For views with this auth class, if no header is provided it raises AuthenticationFailed
            # but returning None means authentication was not attempted, so DRF might try other classes
            # or fail with NotAuthenticated. Better to raise AuthenticationFailed.
            raise exceptions.AuthenticationFailed('API Key missing')
        
        expected_key = getattr(settings, 'N8N_INGEST_API_KEY', None)
        if not expected_key:
            raise exceptions.AuthenticationFailed('API Key not configured on server')

        if api_key != expected_key:
            raise exceptions.AuthenticationFailed('Invalid API Key')

        # Since it's a webhook, there's no user, but DRF expects a tuple
        return (None, None)
