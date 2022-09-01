## Starting

### Changing environment from devevelopment to production

Change from "development", to "production" to emit css files instead of loading them in DOM. Set it in package.json:
```
cross-env NODE_ENV=development
```

Modify `config/env/envType.env` from `ENV=dev` to `ENV=prod` and vice versa