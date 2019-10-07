import React from 'react';
import classnames from 'classnames';

import Card from '../Card';
import './index.scss';

export default ({ title, children, ...props }) => (
  <Card {...props} className={classnames('bio', props.className)}>
    <h3>{title}</h3>
    <section>
      <div className="text">{children}</div>
    </section>
  </Card>
);
