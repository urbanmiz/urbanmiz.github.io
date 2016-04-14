import React, { Component } from 'react';

export class NotFound extends Component {
  render() {
    return (
      <section>
        <div className="container">
          <div className="row">
            <h1>404 Not Found</h1>
            <p>Sorry, this page doesn't exist.</p>
          </div>
        </div>
      </section>
    );
  }
}
