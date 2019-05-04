# Next Starter

This project is a boilerplate that is made up of
- [with-sitemap-and-robots-express-server-typescript](https://github.com/zeit/next.js/tree/canary/examples/with-sitemap-and-robots-express-server-typescript)
- [with-styled-jsx-scss](https://github.com/zeit/next.js/tree/canary/examples/with-styled-jsx-scss)
- [with-static-export-app](https://github.com/zeit/next.js/tree/canary/examples/with-static-export)
- [with-segment-analytics](https://github.com/zeit/next.js/tree/canary/examples/with-segment-analytics)
- [with-apollo](https://github.com/zeit/next.js/tree/canary/examples/with-apollo)
- [ssr-caching](https://github.com/zeit/next.js/tree/canary/examples/ssr-caching)
- [with-componentdidcatch](https://github.com/zeit/next.js/tree/canary/examples/with-componentdidcatch)
- [with-asset-imports](https://github.com/zeit/next.js/tree/canary/examples/with-asset-imports)
- [amp](https://github.com/zeit/next.js/tree/canary/examples/amp)
- [svg-components](https://github.com/zeit/next.js/tree/canary/examples/svg-components)
- [with-next-seo](https://github.com/zeit/next.js/tree/canary/examples/with-next-seo)

## How to use

### Install it and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

## The idea behind the example

This example app shows you how to set up sitemap.xml and robots.txt files for proper indexing by search engine bots.

The app is deployed at: https://sitemap-robots.now.sh. Open the page and click the links to see sitemap.xml and robots.txt. Here is a snapshot of these files, with sitemap.xml on the left and robots.txt on the right:
![sitemap-robots](https://user-images.githubusercontent.com/26158226/38786210-4d0c3f70-40db-11e8-8e44-b2c90cfd1b74.png)

Notes:
- routes `/a` and `/b` are added to sitemap manually
- routes that start with `/posts` are added automatically to sitemap; in a real application, you will get post slugs from a database

When you start this example locally:
- your app with run at https://localhost:8000
- sitemap.xml will be located at http://localhost:8000/sitemap.xml
- robots.txt will be located at http://localhost:8000/robots.txt

In case you want to deploy this example, replace the URL in the following locations with your own domain:
- `hostname` in `src/server/sitemapAndRobots.ts`
- `ROOT_URL` in `src/server/app.ts`
- `Sitemap` at the bottom of `src/server/robots.txt`
- `alias` in `now.json`

Deploy with `now` or with `yarn now` if you specified `alias` in `now.json`

## Typescript notes

express.js and next.js require slighty different forms of javascript (es5 vs. es6, es6 modules vs commonjs modules, that sort of thing) so there are two tsconfig files that are used to generate the appropriate *.js and *.jsx files in dist from the *.ts and *.tsx files in src (`tsconfig.next.json` and `tsconfig.server.json`). Any files under /src/server are assumed to be for express, any other files under /src are assumed to be for next. To keep things simple the two typescript transpiles using these two config files are run directly from npm commands in package.json so all you need to run the example are simple commands like

`npm run start`
or
`npm run dev`

This example has most of the hot module reload plumbing setup for both express- and next-related source files when you use `npm run dev` but it's currently only watching the *.js and *.jsx files in /dist for changes. You will need to manually `npm run build-ts` in another window to transpile your modified typescript files in `src` into the watched javascript files in `dist` (it should be possible to have tsc watch the src folder and auto compile on save but that isn't wired up yet in this example). This example does also have tslint support though `npm run tslint`.