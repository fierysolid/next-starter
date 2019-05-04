import React, { Component } from "react";
import NextSeo from "next-seo";
import { Query } from "react-apollo";
import { withAmp } from "next/amp";

import Main from "../components/Main";
import { RobotsLink } from "../components/RobotsLink";
import { SitemapLink } from "../components/SitemapLink";
import { ALL_POSTS_QUERY } from "../gql/queries";
import Post from "../components/post";

class Index extends Component<any> {
  render() {
    return (
      <Main>
        <NextSeo
          config={{
            title: "Next Starter",
            description: "This will be the page meta description",
            canonical: "https://www.betql.co/",
            openGraph: {
              url: "https://www.betql.co/",
              title: "Next Starter",
              description: "This will be the og description",
              images: [
                {
                  url: "https://static.rotoql.com/logos/app_icon.png",
                  width: 1400,
                  height: 886,
                  alt: "BetQL"
                }
              ]
            }
          }}
        />
        <Query query={ALL_POSTS_QUERY} fetchPolicy="cache-and-network">
          {({ data: { allPosts } }) => {
            return allPosts && allPosts.length ? (
              allPosts.map(post => <Post {...post} key={post.id} />)
            ) : (
              <p>No Posts</p>
            );
          }}
        </Query>
        <p>
          <RobotsLink />
          <br />
          <SitemapLink />
        </p>
      </Main>
    );
  }
}

export default withAmp(Index, { hybrid: true });
