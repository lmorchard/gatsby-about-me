import React from "react";
import classnames from "classnames";

import Card from "../Card";
import "./index.scss";

export class Project extends React.Component {
  render() {
    const {
      title,
      link,
      thumbnail,
      video,
      iframe,
      children
    } = this.props;

    return (
      <Card
        {...this.props}
        className={classnames("project", this.props.className)}
      >
        <h3>
          Project: <a href={link}>{title}</a>
        </h3>
        <section>
          {thumbnail && (
            <a className="thumbnail" href={link}>
              <img src={thumbnail} alt={`${title} thumbnail`} />
            </a>
          )}
          {video && (
            <div className="video">
              <video
                controls="true"
                loop="true"
                preload="metadata"
                src={video}
              />
            </div>
          )}
          {iframe && (
            <div className="iframe">
              <iframe
                title={`${title} embed`}
                frameBorder="0"
                scrolling="no"
                src={iframe}
              />
            </div>
          )}
          {children}
        </section>
      </Card>
    );
  }
}

export default Project;
