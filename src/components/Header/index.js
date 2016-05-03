import React, { Component } from 'react';
import { Link } from 'react-router';

/* component styles */
import { styles } from './styles.scss';

export class Header extends Component {
  render() {
    return (
      <header className={`${styles}`}>
        <div className="container">
          <div className="row">
            <div className="col-xs-5 col-sm-3 col-md-3 col-lg-3 logo">
              <Link to="/">
                Urban Misery
              </Link>
            </div>

            <div className="col-xs-5 col-sm-5 col-md-5 col-lg-5">
              <nav>
                <Link to="/nerds" activeClassName="active">
                  Transit planners
                </Link>
                <Link to="/incoming" activeClassName="active">
                  Incoming residents
                </Link>
              </nav>
            </div>

            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 hidden-xs text-right">
              <nav>
                <a href="https://www.dropbox.com/sh/w6yxd2bjfv1lh1s/AAAQZ-RFJulFg8pT_7S9HEJOa?dl=0" target="_blank">
                  Data
                </a>
                <a href="https://docs.google.com/document/d/1bJkTGbH9HWG1FmzOGy-6Cx5pBuIyvOx1dSa1qoZxeRA" target="_blank">
                  Process book
                </a>
                <a href="https://github.com/urbanmiz/urbanmiz.github.io" target="_blank">
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
