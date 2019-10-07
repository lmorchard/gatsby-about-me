import React from 'react';

import { graphql } from "gatsby";

import Card from '../Card';
import './index.scss';

export class Goodreads extends React.Component {
  render() {
    const { username, link, reviews } = this.props;
    const maxItems = this.props.maxItems || 15;

    return (
      <Card className="goodreads" {...this.props}>
        <h3>
          Goodreads (<a href={link}>{username}</a>)
        </h3>
        <section>
          <ul>
            {reviews
              .slice(0, maxItems)
              .map((review, idx) => this.renderReview(review, idx))}
          </ul>
        </section>
      </Card>
    );
  }

  renderReview(review, idx) {
    const { title, image_url, link } = review;

    return (
      <li key={idx} className="review">
        <a href={link}>
          <img src={image_url} title={title} alt={title} />
        </a>
      </li>
    );
  }
}

export const fragmentQuery = graphql`
  fragment goodreadsActivity on Goodreads {
    username
    link
    reviews {
      image_url
      link
      title
    }
  }
`;

export default Goodreads;
