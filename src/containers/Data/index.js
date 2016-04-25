import React, { Component } from 'react';

export class Data extends Component {
  render() {
    return (
      <section>
        <div className="container">
          <div className="row">
            <h1>Data</h1>
            <p>This is where our data came from:</p>
            <ul>
              <li>Source: http://www.mbta.com/uploadedfiles/About_the_T/Financials/SOREHistoryFY16Budget.pdf</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}
