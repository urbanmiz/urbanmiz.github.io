import React, { Component } from 'react';

import DemandGraph from 'components/DemandGraph';
import BudgetGraph from 'components/BudgetGraph';
import BostonMap from 'components/BostonMap';
import BlockGroupComparison from 'components/BlockGroupComparison';
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
            <h1>Why should I care about public transit?</h1>

            <p>
              The Massachusetts Bay Transportation Authority (MBTA) is quickly
              becoming more important to residents of the Greater Boston area.
              In the last two decades, the increase in MBTA ridership has far
              outpaced the increase in population in the Boston area.
            </p>

            <div className="chart-title">MBTA ridership and Boston area population over time</div>
            <DemandGraph data={bostonPopulation} width={960} height={500} />

            <p>
              In the graph above, the population line is the sum of the
              population estimates for Boston, Somerville, and Newton, as
              compiled by the US Census Bureau. These are the three
              municipalities served by the MBTA's rapid transit lines for which
              data is readily available. The ridership line is the average
              weekday ridership of these rapid transit lines (the Red, Green,
              Blue, and Orange Lines), as published annually in the MBTA's
              "Blue Book".
            </p>

            <p>
              Despite growing ridership, the MBTA is increasingly plagued by
              monetary problems. In the past two decades especially, operating
              revenue has failed to keep pace with operating expenses. Displayed
              below are the total operating revenues and expenses as reported by
              the MBTA since 1990.
            </p>

            <div className="chart-title">MBTA revenue and expenses over time</div>
            <BudgetGraph data={mbtaBudget} width={960} height={500} />

            <p>
              These chronic budget deficits have caused the MBTA to drastically
              underinvest in necessary equipment maintenance and upgrades,
              leading to catastrophic service failures that caused the <a href="https://www.bostonglobe.com/metro/2015/02/11/mbta-general-manager-scott-given-vote-confidence-state-transportation-board/mqyFwO3DdME8NqkRU72ZlI/story.html">general manager to step down in 2015.</a>
            </p>

            <div className="callout">
              <h2>Sobering facts about the MBTA</h2>
              <ol className="callout-list">
                <li>40% of the MBTA's vehicles were built before 1980.</li>
                <li>The MBTA has a $7.3 billion backlog in deferred maintenance, causing poor performance and reliability across the network as a whole.</li>
                <li>Over 400 million rides are taken in 2015. In many places, the system is over capacity.</li>
                <li>On the MBTA bus, you have only a 65% chance that the bus will arrive on time.</li>
              </ol>
            </div>

            <p>
              <a href="http://www.nctr.usf.edu/pdf/77607.pdf">Research suggests</a> that
              improving service relability and coverage is necessary to
              increase ridership. When public transit ridership increases, <a href="http://www.apta.com/mediacenter/ptbenefits/Pages/default.aspx">the cities they serve flourish.</a>
              Improving the MBTA would decrease traffic congestion,
              improve air quality while decreasing pollution, provide
              thousands of well-paying government jobs, and stimulate economic
              growth along new transit corridors.
            </p>

            <p>
              We present below an interactive visualization of the Greater
              Boston area and the MBTA transit network that serves its
              residents. We've designed this visualization to highlight both
              regions of high transit need (typically low-income neighborhoods
              where most households do not own cars) devoid of any rapid
              transit options, as well as regions with transit options but
              low transit-need where residents opt to drive due to poor transit
              conditions, like infrequent service or congested trains.
            </p>

            <p>
              We hope this project proves useful to transit planners and
              curious Bostonians alike.
            </p>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <h1>Transit need by neighborhoods</h1>
            <div className="map-container">
              <div className="map-visualize">
                <h4>Visualize</h4>
                <input onChange={(e) => this.refs.map.classed({subway: e.currentTarget.checked})} type="checkbox" /> Subway lines<br />
                <input onChange={(e) => this.refs.map.classed({bus: e.currentTarget.checked})} type="checkbox" /> Bus lines<br />
                <input onChange={(e) => this.refs.map.classed({frequency: e.currentTarget.checked})} type="checkbox" /> Frequency<br />
                <input onChange={(e) => this.refs.map.classed({congestion: e.currentTarget.checked})} type="checkbox" /> Congestion (RBO only)
              </div>
              <BostonMap data={[]} width={960} height={720}
                onHover={(blockGroup) => this.setState({blockGroup: blockGroup})}
                onSelectionChange={(selection) => this.setState({selection: selection})}
                ref="map" />
            </div>
            <div className="filters">
              <div>
                Visualize block groups by:&nbsp;
                <select onChange={() => this.refs.map.quantize(this.refs.metric.value)} ref="metric">
                  <option value="">None</option>
                  <option value="pop">Population</option>
                  <option value="transmod">Transit mode share</option>
                  <option value="zero">Zero vehicle households</option>
                  <option value="income">Median income</option>
                </select>
              </div>

              <div>
                Display frequency and congestion during:&nbsp;
                <select onChange={(e) => this.refs.map.setWhen(e.currentTarget.value)}>
                  <option value="AM">Morning</option>
                  <option value="AM_Peak">Morning rush hour</option>
                  <option value="PM">Afternoon</option>
                  <option value="Eve">Night</option>
                  <option value="Sat_Pk">Saturday peak</option>
                  <option value="Sun_Pk">Sunday peak</option>
                </select>
              </div>

              <button onClick={this.handleMapReset}>Reset map</button>
            </div>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <h1>Compare neighborhoods</h1>
            <p>Choose up to ten neighborhoods from above.</p>
            <BlockGroupComparison data={this.state.selection} width={960} height={500} />
            <p>Hint: try brushing regions of interest on the axes, or reordering axes by dragging.</p>
          </div>
        </div>
      </section>
    );
  }
}
