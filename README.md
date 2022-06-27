# Runforcause
## Install dependencies
```sh
npm i
```

## Run project
create a **config.ts** file like the one in the project

**config.example.ts**
```ts
const host = '';

export const config = {
    api_url: `${host}/`,
    img_url: `${host}/`,
};
```

Then, start expo
```sh
expo start
```