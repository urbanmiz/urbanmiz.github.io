import React, { Component } from 'react';

import DemandGraph from 'components/DemandGraph';
import BudgetGraph from 'components/BudgetGraph';
import BostonMap from 'components/BostonMap';
import BlockGroupComparison from 'components/BlockGroupComparison';
import { BlockGroupInfo } from 'components/BlockGroupInfo';
import bostonPopulation from './bostonPopulation.json';
import mbtaBudget from './mbtaBudget.json';

export class Nerds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      blockGroup: null,
      selection: []
    }
  }

  handleMapReset = () => {
    this.refs.map.reset();
  }

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
              <li>The MBTA has a $7.3 billion backlog in deferred maintenance, causing poor performance and reliability across the network as a whole.</li>
              <li>Over 400 million rides are taken in 2015. In many places, the system is over capacity.</li>
              <li>On the MBTA bus, you have only a 65% chance that the bus will arrive on time.</li>
            </ol>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <h1>Transit need by neighborhoods</h1>
              <BostonMap data={[]} width={960} height={500}
                onHover={(blockGroup) => this.setState({blockGroup: blockGroup})}
                onSelectionChange={(selection) => this.setState({selection: selection})}
                ref="map" />
              <p>Hover to display info; double click to permanently select.</p>
              <BlockGroupInfo blockGroup={this.state.blockGroup} />
              <br />
              <h3>Choose metric</h3>
              <select onChange={() => this.refs.map.quantize(this.refs.metric.value)} ref="metric">
                <option value="">None</option>
                <option value="pop">Population</option>
                <option value="transmod">Transit mode share</option>
                <option value="zero">Zero vehicle households</option>
                <option value="income">Median income</option>
              </select>
              <button onClick={this.handleMapReset}>Reset map</button>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <h1>Compare neighborhoods</h1>
            <p>Choose up to ten neighborhoods from above.</p>
            <BlockGroupComparison data={this.state.selection} width={960} height={500} />
          </div>
        </div>
      </section>
    );
  }
}
