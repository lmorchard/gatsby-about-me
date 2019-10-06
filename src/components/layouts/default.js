import React from "react";
import { MDXProvider } from "@mdx-js/react";
// import { YouTube, Twitter, TomatoBox } from "./ui"

const shortcodes = {
  /* YouTube, Twitter, TomatoBox */
};

export default ({ children }) => (
  <MDXProvider components={shortcodes}>{children}</MDXProvider>
);
