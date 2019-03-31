
# Secrets

Secrets managed with AWS Systems Manager Parameter Store.

## Quick Reference

Create the secret in EC2 Parameter Store:

```
aws ssm put-parameter \
  --name /time-api/dev/TEST_SECRET \
  --value "test-secret-value-123" \
  --type SecureString
aws ssm put-parameter \
  --name /time-api/prod/TEST_SECRET \
  --value "test-secret-value-123" \
  --type SecureString
```

Use secret in client code:

```javascript
const secrets = require('../secrets');
secrets.load(['TEST_SECRET']).then(values => {
  values.get('TEST_SECRET') // => 'test-secret-value-123'
});
```
