/**
 * This holds the apollo configuration settings and the logic surrounding which settings are used.
 */

// const LOCAL_SETTINGS = {
//   wss: "wss://localhost:8040/subscriptions",
//   http: "http://localhost:8040/graphql"
// };

// const QA_SETTINGS = {
//   wss: "wss://api-qa.betql.co/subscriptions",
//   http: "https://api-qa.betql.co/graphql"
// };

const PROD_SETTINGS = {
  wss: "wss://api.betql.co/subscriptions",
  http: "https://jsonplaceholder.typicode.com/" // "https://api.betql.co/graphql"
};

/**
 * Get the settings that bet is using for the apollo client
 * This returns the entire settings dictionary, so http or wss must be pulled out from it.
 */
const apolloBetSettings = () => {
  /* If a REACT_APP_ENV variable is set use it to override apollo settings */
  // if (process.env.REACT_APP_ENV === "PROD") {
  //   return PROD_SETTINGS;
  // } else if (process.env.REACT_APP_ENV === "QA") {
  //   return QA_SETTINGS;
  // }

  // if (window.location.hostname === "localhost") {
  //   return LOCAL_SETTINGS;
  // } else if (window.location.hostname.includes("-qa")) {
  //   return QA_SETTINGS;
  // }
  return PROD_SETTINGS;
};

export default apolloBetSettings;
