import json
import os

import boto3


DISTRIBUTION_ID = os.environ['DISTRIBUTION_ID']


cloudfront = boto3.resource('cloudfront')


def refresh_cloudfront(key, etag):
    kwargs = {
        'DistributionId': DISTRIBUTION_ID,
        'InvalidationBatch': {
            'Paths': {
                'Quantity': 1,
                'Items': [
                    key,
                ],
            },
        'CallerReference': etag,
        },
    }
    print('Calling cloudfront.create_invalidation with the following kwargs: '
          f'{json.dumps(kwargs)}')
    cloudfront.create_invalidation(**kwargs)


def lambda_handler(event, context):
    print(f'Event Received: {json.dumps(event)}')
    s3_object = event['Records'][0]['object']
    refresh_cloudfront(s3_object['key'], s3_object['eTag'])
