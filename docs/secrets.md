
# Secrets

Secrets managed with https://github.com/trek10inc/serverless-secrets.

## Quick Reference

Create the secret in EC2 Parameter Store:

```
./node_modules/.bin/sls secrets set -n /time-api/dev/MY_SUPER_SECRET -t DEV_SUPER_SECRET_VALUE
./node_modules/.bin/sls secrets set -n /time-api/prod/MY_SUPER_SECRET -t PROD_SUPER_SECRET_VALUE
```

Update `serverless.yml`:

```yaml
provider:
  ...
  environmentSecrets:
    ...
    MY_SUPER_SECRET: /time-api/${self:custom.stage}/MY_SUPER_SECRET
```

Use secret in client code:

```javascript
const secretsClient = require('serverless-secrets/client');
return secretsClient.load().then(() => {
  console.log('MY_SUPER_SECRET:', process.env.MY_SUPER_SECRET);
}).catch(err => {
  console.log(err);
});
```
