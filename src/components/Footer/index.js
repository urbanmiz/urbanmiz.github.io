import React, { Component } from 'react';

/* component styles */
import { styles } from './styles.scss';

export class Footer extends Component {

  render() {
    return (
      <footer className={`${styles}`}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              A final project from <a href="http://cs171.org">CS171</a> at Harvard University.
              <br />
              Built by Brandon M. Paquette, Alexander C. Lew, and Nikhil L. Benesch.
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
