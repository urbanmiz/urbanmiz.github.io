import React, { Component } from 'react';
import { Link } from 'react-router';

import { styles } from './styles.scss';

export class Springboard extends Component {
  render() {
    return (
      <section className={styles}>
        <div className="container">
          <div className="row">
            <Link to="/incoming" className="col-sm-6 col-sm-offset-3 button">
              <h3>Incoming residents</h3>
              <p>Decide where to live.</p>
            </Link>
          </div>

          <div className="row">
            <Link to="/nerds" className="col-sm-6 col-sm-offset-3 button">
              <h3>Transit planners and existing residents</h3>
              <p>See where Boston transit is weak.</p>
            </Link>
          </div>
        </div>
      </section>
    );
  }
}
