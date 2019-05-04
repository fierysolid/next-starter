import gql from "graphql-tag";

export const POST_QUERY = gql`
  query post($id: String) {
    post(id: $id) @rest(type: "Post", path: "posts/:id") {
      id
      userId
      title
      body
    }
  }
`;

export const ALL_POSTS_QUERY = gql`
  query allPosts {
    allPosts @rest(type: "Post", path: "posts?_page=1") {
      id
      userId
      title
      body
    }
  }
`;
