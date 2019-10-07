import React from 'react';

import './CardLayout.scss';

export default ({ children }) => (
  <div className="centered">
    <section className="cards">
      {children}
    </section>
  </div>
);
