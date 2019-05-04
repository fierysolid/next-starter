import gql from "graphql-tag";

export const REFRESH_TOKEN_MUTATION = gql`
  mutation refreshToken($token: String!, $longitude: Float, $latitude: Float) {
    token(token: $token, longitude: $longitude, latitude: $latitude) {
      token
      expiration
      userId
      state
      affiliate
      sports {
        updatedTime
        sport
      }
      books {
        id
        name
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation createPost($title: String!, $url: String!) {
    createPost(title: $title, url: $url) {
      id
      title
      votes
      url
      createdAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $votes: Int) {
    updatePost(id: $id, votes: $votes) {
      id
      __typename
      votes
    }
  }
`;
