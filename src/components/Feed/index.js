import React from "react";
import classnames from "classnames";
import url from "url";

import { graphql } from "gatsby";

import Card from "../Card";
import "./index.scss";

// import FeedIcon from './icon.svg';

export class Feed extends React.Component {
  render() {
    const { name, title, link, items } = this.props;
    const maxItems = this.props.maxItems || 12;

    return (
      <Card {...this.props} className={classnames("feed", name)}>
        <h3>
          <a href={link}>{title}</a>
        </h3>
        <section>
          <ul>
            {items
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, maxItems)
              .map((item, idx) => this.renderItem(item, idx))}
          </ul>
        </section>
      </Card>
    );
  }

  renderItem(item, idx) {
    const { title, summary, link, date } = item;
    const createMarkup = () => ({ __html: summary });
    const absLink = url.resolve(this.props.link, link);
    return (
      <li key={idx} className="item">
        <a className="createdAt" href={link} title={date} dateTime={date}>
          {date}
        </a>
        <a className="link" href={absLink}>
          <span className="title">{title}</span>
        </a>
        {summary && (
          <div className="content" dangerouslySetInnerHTML={createMarkup()} />
        )}
      </li>
    );
  }
}

export const fragmentQuery = graphql`
  fragment feedItem on Feedparser {
    id
    title
    summary
    link
    date
  }
`;

export default Feed;
