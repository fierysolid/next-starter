import React from "react";
import Page from "../components/Page";
import App, { Container } from "next/app";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import NextSeo from "next-seo";

import SEO from "../../next-seo.config";

export interface MyAppProps {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  apolloState: NormalizedCacheObject;
}

class MyApp extends App<MyAppProps, {}> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Page>
            <NextSeo config={SEO} />
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
