# Node.js OAuth2 Google Client

Using this client you can get a refresh and access tokens for using Google APIs. The client is specifically designed to be used in node.js, as an "Installed Application".

## Usage

```ts
import { auth } from 'google-oauth2';

const clientId = '...';
const clientSecret = '...';
const ccope = 'https://www.googleapis.com/auth/analytics.readonly';

auth({ clientId, clientSecret, scope }).then(res => console.log(res), err => console.error(err));
```

## License

MIT
