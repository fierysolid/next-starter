// import * as cacheableResponse from "cacheable-response";
import * as express from "express";
import * as next from "next";
import { sitemapAndRobots } from "./sitemapAndRobots";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 8000;
const ROOT_URL = dev
  ? `http://localhost:${port}`
  : "https://sitemap-robots-typescript.now.sh";

const app = next({ dev });
const handle = app.getRequestHandler();

// Cache responses for an hour
// const ssrCache = cacheableResponse({
//   ttl: 1000 * 60 * 60, // 1hour
//   get: async ({ req, res, pagePath, queryParams }) => ({
//     data: await app.renderToHTML(req, res, pagePath, queryParams)
//   }),
//   send: ({ data, res }) => res.send(data)
// });

// Nextjs's server prepared
app.prepare().then(async () => {
  const server = express();

  // generate site and robots routes
  await sitemapAndRobots({ server });

  // server.get("/", (req, res) => ssrCache({ req, res, pagePath: "/" }));

  // custom route for posts
  server.get("/post/:id", (req, res) => {
    return app.render(req, res, "/post", {
      id: req.params.id
    });
  });

  server.get("*", (req, res) => {
    handle(req, res);
  });

  // starting express server
  server.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on ${ROOT_URL}`);
  });
});
