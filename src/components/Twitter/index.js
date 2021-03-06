import React from 'react';
import twitterText from 'twitter-text';

import { graphql } from "gatsby";

import Card from '../Card';
import './index.scss';

const BASE_URL = 'https://twitter.com';

export class Twitter extends React.Component {
  render() {
    const { username, statuses, theme } = this.props;
    const maxItems = this.props.maxItems || 12;
    const displayName = statuses[0].user.name;
    return (
      <Card className="twitter" theme={theme}>
        <h3>
          Twitter (<a rel="me" href={`${BASE_URL}/${username}`} title={username}>
            {displayName}
          </a>)
        </h3>
        <section>
          <ul>
            {statuses
              .slice(0, maxItems)
              .map((status, idx) => this.renderStatus(status, idx))}
          </ul>
        </section>
      </Card>
    );
  }

  renderStatus(status, idx) {
    return (
      <li key={idx} className="status">
        {this.renderCreatedAt(status)}
        {this.renderText(status)}
      </li>
    );
  }

  renderText(status) {
    const { text, entities } = status;
    const createMarkup = () => ({
      __html: twitterText.autoLink(text, { urlEntities: entities.urls })
    });
    return <span dangerouslySetInnerHTML={createMarkup()} />;
  }

  renderCreatedAt(status) {
    const { username } = this.props;
    const { id_str, created_at } = status;
    return (
      <a
        className="createdAt"
        href={`${BASE_URL}/${username}/status/${id_str}`}
        title={created_at}
        dateTime={created_at}
      >
        {created_at}
      </a>
    );
  }
}

export const fragmentQuery = graphql`
  fragment twitterTimeline on Twitter {
    username
    statuses {
      user {
        name
      }
      text
      entities {
        urls {
          url
          indices
          display_url
          expanded_url
        }
      }
    }
  }
`;

export default Twitter;
