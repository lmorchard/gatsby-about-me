import React from 'react';
import classnames from 'classnames';
import Card from '../Card';
import './index.scss';

import AvatarImage from './me.jpg';

export class Avatar extends React.Component {
  render() {
    const { title } = this.props;

    return (
      <Card {...this.props} className={classnames('avatar', this.props.className)}>
        {title && <h3>{title}</h3>}
        <section>
          <img className="avatar" src={AvatarImage} alt="avatar" />
        </section>
      </Card>
    );
  }
}

export default Avatar;
