import d3tip from 'd3-tip';
import { D3Chart } from 'components/D3Chart';

import { styles } from './styles.scss';

const margin = { top: 20, right: 20, bottom: 160, left: 40 };

export class StopDistanceGraph extends D3Chart {
  constructor(props) {
    super(props);

    this.className = styles;
  }

  initialize (svg) {
    this.width = this.props.width - margin.left - margin.right;
    this.height = this.props.height - margin.top - margin.bottom;

    this.x = d3.scale.ordinal()
        .rangeRoundBands([0, this.width], .1);

    this.y = d3.scale.linear()
        .range([this.height, 0])
        .domain([0, 1]);

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left");

    this.chart = d3.select(svg)
        .attr("width", this.width + margin.left + margin.right)
        .attr("height", this.height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + this.height + ")");

    this.chart.append("g")
        .attr("class", "y axis")
        .call(this.yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Distance (miles)");

    this.chart.selectAll(".bar")
        .data(this.props.data)
      .enter().append("rect")
        .attr("class", "bar")
  }

  update (svg) {
    while (this.props.data.length < 15) {
      this.props.data.push({ name: " ".repeat(this.props.data.length), distance: 0 });
    }

    this.x.domain(this.props.data.map(d => d.name));

    this.chart.select(".x.axis")
        .call(this.xAxis)
      .selectAll("text")
        .attr("y", 0)
        .attr("x", -9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end");

    this.chart.selectAll(".bar")
        .data(this.props.data)
        .attr("x", d => this.x(d.name))
        .attr("width", this.x.rangeBand())
        .attr("y", d => this.y(d.distance))
        .attr("height", d => this.height - this.y(d.distance));
  }
}
