import d3 from 'd3';
import React, { Component } from 'react';
import Slider from 'rc-slider';

import mbtaAPI from 'utils/mbtaAPI';

import { DemandGraph } from 'components/DemandGraph';
import { BudgetGraph } from 'components/BudgetGraph';
import { BostonMap } from 'components/BostonMap';
import { StopDistanceGraph } from 'components/StopDistanceGraph';
import { BlockGroupDemographicsGraph } from 'components/BlockGroupDemographicsGraph';
import { BlockGroupComparison } from 'components/BlockGroupComparison';

const CONGESTION_SLIDER_DEFAULT = 360; /* 6am */

const formatCongestionSlider = (v) => {
  return d3.time.format("%-I:%M %p")(new Date(1970, 1, 1, v / 60, v % 60));
}

const congestionSliderMarks = {
   360: formatCongestionSlider(360),  /* 6am */
   540: formatCongestionSlider(540),  /* 9am */
   720: formatCongestionSlider(720),  /* 12pm */
   900: formatCongestionSlider(900),  /* 3pm */
  1080: formatCongestionSlider(1080), /* 6pm */
  1260: formatCongestionSlider(1260), /* 9pm */
  1440: formatCongestionSlider(1440), /* 12am */
}

export class Nerds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      demographicsMetric: "med_inc",
      selection: [],
      when: 600
    }
  }

  resetMap = () => {
    this.congestionSliderReset();
    this.refs.map.reset();
  }

  setWhat = (what) => {
    this.refs.map.classed({ frequency: what === "frequency", congestion: what === "congestion"})
    this.setState({ what: what });
  }

  setSelection = (selection) => {
    this.setState({selection: selection, nearbyStops: null})
    if (selection.length === 1) {
      this.getNearbyStops(selection[0]);
    }
  }

  getNearbyStops = (blockGroup) => {
    mbtaAPI.getNearbyStops(blockGroup.lat, blockGroup.long).then(nearbyStops => {
      this.setState({ nearbyStops: nearbyStops });
    }).catch(error => {
      console.log("Error loading nearby stops", blockGroup, error);
    });
  }

  congestionSliderChange = (v) => {
    this.setState({ congestionTime: v });
    this.refs.map.setWhenTime(v);
  }

  congestionSliderReset = () => {
    this.congestionSliderChange(CONGESTION_SLIDER_DEFAULT);
  }

  stopCongestionAnimation = () => {
    clearInterval(this.state.congestionAnimationInterval);
    this.setState({ congestionAnimationInterval: null });
  }

  startCongestionAnimation = () => {
    this.congestionSliderReset();

    let interval = setInterval(() => {
      this.congestionSliderChange(this.state.congestionTime + 5);

      if (this.state.congestionTime >= 1440) {
        this.stopCongestionAnimation();
      }
    }, 10);

    this.setState({ congestionAnimationInterval: interval });
  }

  toggleCongestionAnimation = () => {
    if (this.state.congestionAnimationInterval) {
      this.stopCongestionAnimation();
    }
    else {
      this.startCongestionAnimation();
    }
  }

  renderFrequency = () => (
    <div>
      Display frequency during:&nbsp;
      <select onChange={(e) => this.refs.map.setWhen(e.currentTarget.value)}>
        <option value="AM">Morning</option>
        <option value="AM_Peak">Morning rush hour</option>
        <option value="PM">Afternoon</option>
        <option value="Eve">Night</option>
        <option value="Sat_Pk">Saturday peak</option>
        <option value="Sun_Pk">Sunday peak</option>
      </select>
    </div>
  )

  renderCongestionAnimationButton = () => (
    <a onClick={this.toggleCongestionAnimation} style={{cursor: "pointer"}}>
      ({this.state.congestionAnimationInterval ? "stop" : "play"})
    </a>
  )

  renderCongestion = () => (
    <div style={{width: 400}}>
      Display average weekday congestion at: {this.renderCongestionAnimationButton()}
      <Slider
        min={300}
        max={1440}
        tipFormatter={formatCongestionSlider}
        marks={congestionSliderMarks}
        value={this.state.congestionTime}
        defaultValue={CONGESTION_SLIDER_DEFAULT}
        onChange={this.congestionSliderChange} />
    </div>
  )


  // Nearby stops chart.

  showNearbyStops = () => !!this.state.nearbyStops

  renderNearbyStops = () => {
    if (this.showNearbyStops()) {
      return <StopDistanceGraph data={this.state.nearbyStops} width={700} height={500} />
    }
    return <p>Loading...</p>;
  }


  // Block group drilldown.

  showDrilldown = () => this.state.selection.length === 1

  renderDrilldown = () => (
    <div>
      <p>
        Residents and visitors of this block group have these transit
        stops within one mile.
      </p>
      <div className="chart-title">Stops within one mile</div>
      {this.renderNearbyStops()}

      <p>
        Particularly useful is comparing this block group to other block
        groups in the neighborhood. The standard definition of "neighborhood"
        is used for Cambridge and Boston; for other municipalities, the city
        average is used instead.
      </p>
      <div className="chart-title">
        Neighborhood demographic comparison
      </div>
      <div className="filters-simple">
        <label>Visualize block groups by:&nbsp;
          <select onChange={(e) => this.setState({ demographicsMetric: e.currentTarget.value })}>
            <option value="med_inc">Median income</option>
            <option value="zero_veh">Zero vehicle households (%)</option>
            <option value="transit_commute">Transit commuters (%)</option>
            <option value="pop_density">Population density (per acre)</option>
            <option value="college">College-aged population (%)</option>
            <option value="seniors">Senior population (%)</option>
          </select>
        </label>
      </div>
      <BlockGroupDemographicsGraph
        width={700} height={500}
        data={[]}
        blockGroup={this.state.selection[0].bid}
        metric={this.state.demographicsMetric} />
    </div>
  );

  renderNoDrilldown = () => (
    <p>
      What transit options are available to residents and visitors of a given
      block group? Select exactly one block group above to see the nearest
      transit stops.
    </p>
  )


  // Block group comparison.

  showComparison = () => this.state.selection.length >= 3

  renderComparison = () => (
    <div>
      <BlockGroupComparison data={this.state.selection} width={960} height={500} />
      <p>
        Try brushing regions of interest on the axes, or reordering axes by
        dragging. Patterns in the lines between adjacent dimensions indicate
        correlations in the data.
      </p>
    </div>
  )

  renderNoComparison = () => {
    let r = this.state.selection.length;
    let remaining = (r === 0 ? "at least three block groups" : r === 1 ? "two more block groups" : "one more block group")
    return (
    <p>
      To get started, select {remaining} to compare by double-clicking
      on the map above.
    </p>
  )}


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
            <DemandGraph width={960} height={500} />

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
            <BudgetGraph width={960} height={500} />

            <p>
              These chronic budget deficits have caused the MBTA to drastically
              underinvest in necessary equipment maintenance and upgrades,
              leading to catastrophic service failures that caused the&nbsp;
              <a href="https://www.bostonglobe.com/metro/2015/02/11/mbta-general-manager-scott-given-vote-confidence-state-transportation-board/mqyFwO3DdME8NqkRU72ZlI/story.html">
              general manager to step down in 2015.</a>
            </p>

            <div className="callout">
              <h2>Sobering facts about the MBTA</h2>
              <ol className="callout-list">
                <li>
                  40% of the MBTA's vehicles were built before 1980.
                </li>
                <li>
                  The MBTA has a $7.3 billion backlog in deferred maintenance,
                  causing poor performance and reliability across the network
                  as a whole.
                </li>
                <li>
                  Over 400 million rides are taken in 2015. In many places,
                  the system is over capacity.
                </li>
                <li>
                  On the MBTA bus, you have only a 65% chance that the bus
                  will arrive on time.
                </li>
              </ol>
            </div>

            <p>
              <a href="http://www.nctr.usf.edu/pdf/77607.pdf">Research suggests</a>
              that improving service relability and coverage is necessary to
              increase ridership. When public transit ridership increases,&nbsp;
              <a href="http://www.apta.com/mediacenter/ptbenefits/Pages/default.aspx">
              the cities they serve flourish.</a> Improving the MBTA would
              decrease traffic congestion, improve air quality while decreasing
              pollution, provide thousands of well-paying government jobs, and
              stimulate economic growth along new transit corridors.
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
                <label><input ref="subwayToggle" onChange={(e) => this.refs.map.classed({subway: e.currentTarget.checked})} type="checkbox" name="subway-lines" /> Subway lines</label><br />
                <label><input onChange={(e) => this.refs.map.classed({bus: e.currentTarget.checked})} type="checkbox" /> Bus lines</label><br /><br />
                <label><input defaultChecked name="what" onChange={(e) => this.setWhat("none")} type="radio" /> Line color</label><br />
                <label><input name="what" onChange={(e) => this.setWhat("frequency")} type="radio" /> Frequency</label><br />
                <label><input name="what" onChange={(e) => this.setWhat("congestion")} type="radio" /> Congestion (RBO only)</label>
              </div>
              <BostonMap data={[]} width={960} height={620}
                onSelectionChange={this.setSelection}
                ref="map" />
            </div>
            <div className="filters">
              <div>
                Visualize block groups by:&nbsp;
                <select onChange={() => this.refs.map.quantize(this.refs.metric.value)} ref="metric">
                  <option value="">None</option>
                  <option value="income">Median income</option>
                  <option value="zero">Zero vehicle households (%)</option>
                  <option value="transmod">Transit commuters (%)</option>
                  <option value="pop">Population density (per acre)</option>
                </select>
              </div>

              <div>
                {this.state.what === "frequency" ? this.renderFrequency() : this.state.what === "congestion" ? this.renderCongestion() : ""}
              </div>

              <button onClick={this.resetMap}>Reset map</button>
            </div>
          </div>
        </div>


        <div className="container">
          <div className="row">
            <h1>Block group drilldown</h1>
            {this.showDrilldown() ? this.renderDrilldown() : this.renderNoDrilldown()}

            <h1>Compare block groups</h1>
            <p>
              How do different block groups stack up? What factors are high
              transit need associated with? Low income? A high number of
              zero-vehicle households? A parallel coordinates chart can
              efficiently unlock some of these correlations.
            </p>
            {this.showComparison() ? this.renderComparison() : this.renderNoComparison()}
          </div>
        </div>
      </section>
    );
  }
}
