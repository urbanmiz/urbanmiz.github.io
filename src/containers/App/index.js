import React, { Component } from 'react';

/* global styles for app */
import './styles/app.scss';

/* application components */
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';


//this is a workaround for a bug in React that sometimes affects UI clicking
//will be unnecessary when React 1.0 arrives
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  render() {
    return (
      <section>
        <Header />
        {this.props.children}
        <Footer />
      </section>
    );
  }
}
