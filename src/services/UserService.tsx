/*
The User service deals with the token and any data contained
within.  It can access, set, or delete the token.  All token
reading, decoding, validation, or other access should go though
this service.
*/
import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import JWTDecode from "jwt-decode";
import moment from "moment";

import { REFRESH_TOKEN_MUTATION } from "../gql/mutations";

// Defines the object to save in the cache
export interface UserUiSetting {
  __typename: string;
  id: string;
  settingValue: string;
}

// Defines reponses from the cache
export interface CacheUserUiSetting {
  auth: {
    __typename: string;
    userUiSetting: UserUiSetting;
  };
}

export const LOCAL_STORAGE_TOKEN_KEY = "auth_token";

/**
A helper function to get the claims from a token.
  * @param token {string} an authentication token that can optionally be passed in to avoid a call to local storage, will call local storage if token is not passed.
*/
const getClaims = (token?: string) => {
  if (!token) {
    token = userGetToken();
  }
  let claims: any = {};
  if (token) {
    try {
      claims = JWTDecode(token);
    } catch {
      if (process.browser) {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      }
    }
  }
  return claims;
};

declare type CallbackFunctionType = (success?: boolean) => void;

/**
 * A setter function to set the token in local storage.
 * This call currently does not rerender or update the app and this must be done within the logic that calls this token set.
 * @param token {string} Set the new token in local storage.
 */
export const userSetToken = (token: string) => {
  if (process.browser) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  }
};

/**
 * A getter function to get what the user's display name is from the token's claims in local storage.
 * We prefer their actual display name but if that is not set we return their email
 * @param token {string} Set the new token in local storage.
 */
export const userGetDisplayName = (token?: string) => {
  const claims = getClaims(token);
  return claims.preferred_username || claims.email || "";
};
/**
  A wrapper around getting a token from local storage.
  */

export const userGetToken = () => {
  if (process.browser) {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || "";
  }
};

/**
  Check if a token is still valid.
  * @param token {string} An authentication token that can be optionally passed in to avoid another call to local storage, will call local storage if token is not passed.
  */
export const userTokenValidBefore = (
  token?: string,
  expirationCutoff?: moment.Moment
) => {
  const claims = getClaims(token);
  if (!expirationCutoff) {
    expirationCutoff = moment();
  }
  if (claims && claims.exp) {
    return expirationCutoff.isBefore(moment.unix(claims.exp));
  }
  return false;
};

/**
  A removal function to clean the token from local storage.
  This call currently does not rerender or update the app and this must
  be done within the logic that calls this token set.
  */
export const userDeleteToken = () => {
  if (process.browser) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }
};

/**
 * Refresh a currently valid token.  If there is a token in local storage
 * that is currently valid and gets a new token, saves the token to local storage,
 * and then executes any callback that is passed in. This is handy for things like
 * the constructor in App.tsx because it allows it to be fired off while the constructor
 * loads and then a state update can be fired off when this comes back to rerender the
 * application.
 *
 * Also no callback need be passed in for example in the auth link the token is checked for
 * expiration soon and it will asyncronously request a new token so a user can keep their tab
 * open for a very long time and even without refresh we will continue to fetch valid tokens
 * without interrupting the user experience.
 *
 * @param client {ApolloClient<NormalizedCacheObject>} client to use to execute graphql mutations
 * @param callback? {CallbackFunctionType} optional callback to execute when token refresh has completed, may accept an optional success boolean and should return void
 *
 * @returns {boolean} True if token refresh will be attempted (current token is not expired), False if no token refresh will be attempted as token is currently expired.
 */
export const userRefreshToken = (
  client: ApolloClient<NormalizedCacheObject>,
  callback?: CallbackFunctionType
) => {
  const token = userGetToken();
  if (!userTokenValidBefore(token)) {
    return false;
  }
  client
    .mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { token }
    })
    .then(({ data, errors }) => {
      if (errors) {
        if (callback) {
          callback(false);
        }
      } else {
        if (data && data.token && data.token.token) {
          userSetToken(data.token.token);
          window.analytics.identify(data.token.userId, {});
          if (callback) {
            callback(true);
          }
        } else if (callback) {
          callback(false);
        }
      }
    })
    .catch(() => {
      if (callback) {
        callback(false);
      }
    });
  return true;
};
