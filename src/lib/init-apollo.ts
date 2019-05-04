import { from } from "apollo-link";
import { ApolloClient } from "apollo-client";
import { onError } from "apollo-link-error";
// import { HttpLink } from "apollo-link-http";
import { RestLink } from "apollo-link-rest"; // for testing only
import { RetryLink } from "apollo-link-retry";
import { setContext } from "apollo-link-context";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { userGetToken } from "../services/UserService";
import "isomorphic-unfetch";

if (global.Headers == null) {
  const fetch = require("node-fetch");
  global.Headers = fetch.Headers;
}

export interface ApolloSettings {
  wss: string;
  http: string;
}

declare type CallbackFunctionType = () => void;

let apolloClient: ApolloClient<NormalizedCacheObject>;

function create(
  onLogout: CallbackFunctionType,
  settings: ApolloSettings,
  initialState?: NormalizedCacheObject
) {
  /*
  The auth link places the token into the authorization header if it exists
  and if it does not exist then it provides no authorization header.  This sets the
  context for other links down the chain and has a slightly different format than other
  links.

  https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-context
  */
  const authLink = setContext(async (_, { headers = {} }) => {
    const token = userGetToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

  /**
   * HTTP link selects the address that we connect to for graphql requests.  This
   * should be QA in staging, LOCAL on local, and prod otherwise.
   *
   * https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-http
   *
   * @param settings {ApolloSettings} settings to connect to
   */
  // const getHttpLink = (settings: ApolloSettings) => {
  //   return new HttpLink({
  //     uri: settings.http, // Server URL (must be absolute)
  //     credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
  //     // Use fetch() polyfill on the server
  //     fetch
  //   });
  // };

  const getRestLink = (settings: ApolloSettings) => {
    return new RestLink({
      uri: settings.http, // Server URL (must be absolute)
      credentials: "same-origin"
    });
  };

  /*
  Retry Link determines how many attempts we should make to retry a failed
  network call.  This only triggers on a network error and not on graphql errors.

  TODO: by the docuementation you can write a custom retryIf clause which determines
  if you should retry the call and I would want to retry only on certain HTTP error
  codes but I can't seem to get the error code out of the fields, some more time needs
  to be spent in it.

  https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-retry
  */
  const retryLink = new RetryLink({
    attempts: {
      max: 3
    }
  });

  /*
  Error Link is a handler of what errors, if any, come back through the
  graphql interface.  This is probably

  https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-error
  */
  const customErrorHandler = (
    onLogout: CallbackFunctionType,
    errorResp: any
  ) => {
    const { graphQLErrors, networkError } = errorResp;
    if (graphQLErrors) {
      console.log(`[GraphQL error]: ${JSON.stringify(graphQLErrors)}`);
      if (graphQLErrors && graphQLErrors[0] && graphQLErrors[0][0]) {
        const code = graphQLErrors[0][0].code;
        if (["1201", "1202"].indexOf(code) > -1) {
          onLogout();
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  };

  const cache = new InMemoryCache({
    dataIdFromObject: o => o.id
  }).restore(initialState || {});

  const errorLink = onError(errorResp =>
    customErrorHandler(onLogout, errorResp)
  );

  // const httpLink = getHttpLink(settings);
  const restLink = getRestLink(settings);

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: from([authLink, retryLink, errorLink, restLink]),
    cache,
    ssrForceFetchDelay: 100
  });
}

export default function initApollo(
  onLogout: CallbackFunctionType,
  settings: ApolloSettings,
  initialState?: NormalizedCacheObject
) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(onLogout, settings, initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(onLogout, settings, initialState);
  }

  return apolloClient;
}
