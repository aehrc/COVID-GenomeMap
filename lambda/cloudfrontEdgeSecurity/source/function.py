import json

STATIC_SECURITY_HEADERS = {
    'Content-Security-Policy': '; '.join([
        "default-src https: 'unsafe-eval' 'unsafe-inline'",
        "frame-ancestors 'self'",
        "img-src 'self' data:",
        "object-src 'self'",
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
