import React from "react";
import Router from "next/router";
import Header from "./Header";

declare global {
  interface Window {
    analytics: any;
  }
}

// Track client-side page views with Segment
Router.events.on("routeChangeComplete", url => {
  window.analytics.page(url);
});

const Page = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);

export default Page;
