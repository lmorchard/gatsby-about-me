import React from 'react';
import classnames from 'classnames';

import { graphql } from "gatsby";

import Card from '../Card';
import './index.scss';

export class ActivityPub extends React.Component {
  render() {
    const { name, username, profileUrl, outbox } = this.props;
    const maxItems = this.props.maxItems || 12;
    const items = outbox.orderedItems;

    return (
      <Card {...this.props} className={classnames('activitypub', name)}>
        <h3>
          {name} (<a href={profileUrl} rel="me" title={username}>@{username}</a>)
        </h3>
        <section>
          <ul>
            {items
              .slice(0, maxItems)
              .map((item, idx) => this.renderItem(item, idx))}
          </ul>
        </section>
      </Card>
    );
  }

  renderItem(item, idx) {
    const { type, object } = item;
    const { published, url } = object;
    const methodName = `render${type}Item`;
    if (methodName in this) {
      return (
        <li key={idx} className={classnames('item', type)}>
          <a className="createdAt" href={url} title={published} dateTime={published}>
            {published}
          </a>
          {this[methodName](item, idx)}
        </li>
      );
    }
  }

  renderCreateItem(item, idx) {
    const { object } = item;
    const { content } = object;
    const createMarkup = () => ({ __html: content });
    return (
      <div className="content" dangerouslySetInnerHTML={createMarkup()} />
    );
  }

  renderAnnounceItem(item, idx) {
    const { object } = item;
    const { content, attributedTo } = object;
    const createMarkup = () => ({ __html: content });
    return [
      <span key="0" className="retooted">retooted <a href={attributedTo}>{attributedTo}</a></span>,
      <div key="1" className="content" dangerouslySetInnerHTML={createMarkup()} />
    ];
  }
}

export const fragmentQuery = graphql`
  fragment activityPubOutbox on ActivityPub {
    outbox {
      orderedItems {
        type
        object {
          content
          published
          url
          attributedTo
        }
      }
    }
    baseUrl
    name
    profileUrl
  }
`;

export default ActivityPub;
