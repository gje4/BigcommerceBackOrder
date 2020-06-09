## What

Boilerplate serverless function to enable backorder functionality for products with 0 inventory.

## What does this application do?

The application is using BigCommerce webhooks to send product data whenever a product is created, updated or deleted to a serverless function that send the data to Algolia

## Contributing

George FitzGibbons, Amir Hessabi

### Running the project

To get started you will need to have a BigCommerce Store.

You will need to have +v10 node.

You will need Serverless

```https://serverless.com/

In this example the serverless.yml is configured for AWS.
https://serverless.com/framework/docs/providers/aws/guide/installation/

You can easily update the yml for your desired FAAS providers
```

You will need to generate BigCommerce API keys, these keys need to have read permissions for products.

In the serverless.yml file update the environment with your site API Keys

```
environment:
  STORE_HASH: {YOUR STORE HASH}
  BC_CLIENT: {YOUR CLIENT ID}
  BC_TOKEN: {YOUR TOKEN ID}

```

Now run to set up

```bash
npm install
```

Now you're ready to deploy

```bash
cd inventoryManager
sls deploy
```

You will get an API endpoint back, you will use this when you set up your webhook.

```
endpoints:
  POST - https://{XXXXXX}.execute-api.us-east-1.amazonaws.com/dev/algolia
```

Now in postman create the webhook to send order created to endpoints
https://developer.bigcommerce.com/api-docs/getting-started/webhooks/webhook-events#orders

```
curl --location --request POST 'https://api.bigcommerce.com/stores/{STORE HASH}/v2/hooks' \
--header 'X-Auth-Client: XXXXX' \
--header 'X-Auth-Token: YYYYYY' \
--data-raw '{
 "scope": "store/product/*",
 "destination": "https://ZZZZZ.execute-api.us-east-1.amazonaws.com/dev/invetoryManager",
 "is_active": true
}'
```
