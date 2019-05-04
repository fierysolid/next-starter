import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";
import * as snippet from "@segment/snippet";

const {
  // This write key is associated with https://segment.com/nextjs-example/sources/nextjs.
  ANALYTICS_WRITE_KEY = "NPsk1GimHq09s7egCUlv7D0tqtUAU5wa",
  NODE_ENV = "development"
} = process.env;

export default class extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  renderSnippet() {
    const opts = {
      apiKey: ANALYTICS_WRITE_KEY,
      // note: the page option only covers SSR tracking.
      // Page.js is used to track other events using `window.analytics.page()`
      page: true
    };

    if (NODE_ENV === "development") {
      return snippet.max(opts);
    }

    return snippet.min(opts);
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
          <link rel="manifest" href="/static/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
