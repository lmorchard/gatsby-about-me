import React from 'react';

import { graphql } from "gatsby";

import Card from '../Card';
import './index.scss';

const CDN_URL = "https://cdn.glitch.com";
const userUrl = ({ login }) => `https://glitch.com/@${login}`;
const projectAvatar = ({ id }) => `${CDN_URL}/project-avatar/${id}.png`;
const projectUrl = ({ domain }) => `https://glitch.com/~${domain}`;

export class Glitch extends React.Component {
  render() {
    const { login, projects } = this.props;
    return (
      <Card className="glitch" {...this.props}>
        <h3>
          Glitch Projects (<a rel="me" href={userUrl(this.props)}>{login}</a>)
        </h3>
        <section>
          <ul>
            {projects
              .filter(project => !project.private)
              .map((project, idx) => this.renderProject(project, idx))}
          </ul>
        </section>
      </Card>
    );
  }

  renderProject(project, idx) {
    const { description, domain } = project;
    return (
      <li key={idx} className="post">
        <a href={projectUrl(project)}>
          <img className="thumbnail" title={domain} src={projectAvatar(project)} alt={domain} />
          <span className="title">{domain}</span>
          <p className="description"><span>{description}</span></p>
        </a>
      </li>
    );
  }
}

export const fragmentQuery = graphql`
  fragment glitchUser on GlitchUser {
    login
    projects {
      id
      domain
      description
    }
  }
`;

export default Glitch;
