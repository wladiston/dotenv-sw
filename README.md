# dotenv-sw

Load environment variables from a .env file into process.env.

### Differences from original dotenv

- ✅ Comes with CLI `dotenv`
- ✅ Load `.env.${NODE_ENV}` files
- ✅ Print loaded files in the console

## Installation

```sh
npm install dotenv-sw
```

## Usage

As early as possible in your application, require and configure dotenv-sw.

```javascript
require("dotenv-sw").config({
  // cwd: '../..'
  // silent: true
});
```

or

```ts
import "dotenv-sw/config";
```
