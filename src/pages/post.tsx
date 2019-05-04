import React, { Component } from "react";
import NextSeo, { ArticleJsonLd } from "next-seo";
import Link from "next/link";
import { Query } from "react-apollo";
import { withAmp } from "next/amp";

import Main from "../components/Main";
import { POST_QUERY } from "../gql/queries";

class Post extends Component<any, any> {
  static async getInitialProps({ query }) {
    return { postId: query.id };
  }

  render() {
    const { postId } = this.props;
    return (
      <Main>
        <Query
          query={POST_QUERY}
          fetchPolicy="cache-and-network"
          variables={{ id: postId }}
        >
          {({ data }) => {
            let post: any = {};
            if (data && data.post) {
              post = data.post;
            }
            return (
              <React.Fragment>
                <NextSeo
                  config={{
                    title: "Post - " + post.id || "Post",
                    description: "This will be the page meta description",
                    canonical: "https://www.betql.co/",
                    openGraph: {
                      type: "article",
                      article: {
                        publishedTime: "2019-05-05T02:04:13Z",
                        modifiedTime: "2019-05-05T03:04:43Z",
                        authors: [
                          "https://www.example.com/authors/@firstnameA-lastnameA"
                        ],
                        tags: ["Post"]
                      }
                    }
                  }}
                />
                <h1>{post.title || ""}</h1>
                <p>{post.body || ""}</p>
                <Link href="/">
                  <a>Go back to home</a>
                </Link>
                <ArticleJsonLd
                  url="https://example.com/article"
                  title={"Post - " + post.id || "Post"}
                  images={["https://static.rotoql.com/logos/app_icon.png"]}
                  datePublished="2019-05-05T02:00:00+08:00"
                  dateModified="2019-05-05T03:00:00+08:00"
                  authorName="Jordan Schoen"
                  publisherName="BetQL"
                  publisherLogo="https://static.rotoql.com/logos/app_icon.png"
                  description="This is a mighty good description of this article."
                />
              </React.Fragment>
            );
          }}
        </Query>
      </Main>
    );
  }
}

export default withAmp(Post, { hybrid: true });
