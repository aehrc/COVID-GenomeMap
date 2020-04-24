import json

STATIC_SECURITY_HEADERS = {
    'Content-Security-Policy': '; '.join([
        "base-uri 'none'",
        "connect-src 'self'",
        "default-src 'none'",
        "font-src 'self'",
        "form-action https://gmail.us3.list-manage.com/subscribe/post",
        "frame-ancestors 'self'",
        "frame-src 'self'",
        "img-src 'self'",
        "object-src 'self'",
        "script-src " + " ".join([
            "'self'",
            "'unsafe-eval'",
        ]),
        "style-src-elem 'self'",
    ]),
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'SAMEORIGIN',
    'Expect-CT': 'Expect-CT: max-age=604800, enforce',
    'X-Content-Type-Options': 'nosniff',
    'Feature-Policy': "autoplay 'none'; camera 'none'; microphone 'none'",
}


def add_security_headers(headers):
    for header, value in STATIC_SECURITY_HEADERS.items():
        headers[header] = [{
            'key': header,
            'value': value,
        }]


def lambda_handler(event, context):
    print(f'Event Received: {json.dumps(event)}')
    response = event['Records'][0]['cf']['response']
    add_security_headers(response['headers'])
    print(f'Returning Response: {json.dumps(response)}')
    return response
