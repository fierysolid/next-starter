import React, { Component } from "react";
import NextSeo from "next-seo";
import Main from "../components/Main";
import { withAmp } from "next/amp";

class Contact extends Component {
  state = { message: "" };

  render() {
    return (
      <Main>
        <NextSeo
          config={{
            title: "Contact - Next Starter",
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
        <article>
          <h1>This is the Contact page</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              <span>Message:</span>
              <textarea
                onChange={this.handleInput}
                value={this.state.message}
              />
            </label>
            <button type="submit">submit</button>
          </form>
        </article>
        <style jsx>{`
          label span {
            display: block;
            margin-bottom: 12px;
          }
          textarea {
            min-width: 300px;
            min-height: 120px;
          }
          button {
            margin-top: 12px;
            display: block;
          }
        `}</style>
      </Main>
    );
  }

  handleInput = (e: any) => {
    this.setState({ message: e.target.value });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    global.analytics.track("Form Submitted", {
      message: this.state.message
    });
    this.setState({ message: "" });
  };
}

export default withAmp(Contact, { hybrid: true });
