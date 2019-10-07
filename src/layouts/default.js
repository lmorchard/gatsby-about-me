import React, { useEffect } from "react";
import { MDXProvider } from "@mdx-js/react";

import { resetTheme } from '../lib/theme';

import ErrorBoundary from "../components/ErrorBoundary";

import Header from "../components/Header";
import CardLayout from "../components/CardLayout";
import Card from "../components/Card";

import Avatar from "../components/Avatar";
import ActivityPub from "../components/ActivityPub";
import Bio from "../components/Bio";
import YouTube from "../components/YouTube";
import Glitch from "../components/Glitch";
import Github from "../components/Github";
import Project from "../components/Project";
import Feed from "../components/Feed";
import Twitter from "../components/Twitter";
import Spotify from "../components/Spotify";
import Steam from "../components/Steam";
import Goodreads from "../components/Goodreads";

const components = {
  ErrorBoundary,
  Header,
  Card,
  CardLayout,
  Avatar,
  ActivityPub,
  Bio,
  YouTube,
  Glitch,
  Github,
  Project,
  Feed,
  Twitter,
  Spotify,
  Steam,
  Goodreads,
};

export default ({ children }) => {
  useEffect(resetTheme);
  return (
    <ErrorBoundary>
      <article>
        <MDXProvider components={components}>{children}</MDXProvider>
      </article>
    </ErrorBoundary>
  );
}