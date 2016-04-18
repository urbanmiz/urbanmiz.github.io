import React, { Component } from 'react';

import DemandGraph from 'components/DemandGraph';
import BudgetGraph from 'components/BudgetGraph';
import bostonPopulation from './bostonPopulation.json';
import mbtaBudget from './mbtaBudget.json';

export class Nerds extends Component {
  render() {
    return (
      <section>
        <div className="container">
          <div className="row">
            <h1>Why should I care about transit?</h1>
            <p>MBTA ridership is quickly becoming more important to residents of the Greater Boston area.</p>
            <DemandGraph data={bostonPopulation} width={960} height={500} />

            <BudgetGraph data={mbtaBudget} width={960} height={500} />
            <p>
              Population is the sum of Boston, Cambridge, Newton, and Somerville population estimates from the US Census.
            </p>
            <p>
              Ridership is the average weekday ridership of the Red, Blue, Green, and Orange lines, originally from the MBTA annual report but collated by Wikipedia. 
            </p>
            <p>
              Source: http://www.mbta.com/uploadedfiles/About_the_T/Financials/SOREHistoryFY16Budget.pdf
            </p>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <h1>Sobering facts about transit</h1>
            <ol>
              <li>40% of the MBTA's vehicles were built before 1980.</li>
              <li>More facts go here.</li>
              <li>More facts go here.</li>
              <li>More facts go here.</li>
            </ol>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <h1>Transit need by neighborhoods</h1>
            <p>TODO: Dot density choropleth with transit routes</p>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <h1>Compare neighborhoods</h1>
            <p>Choose up to five neighborhoods from above.</p>
            <p>TODO: Parallel coordinates chart, a bunch of bar charts.</p>
          </div>
        </div>
      </section>
    );
  }
}
