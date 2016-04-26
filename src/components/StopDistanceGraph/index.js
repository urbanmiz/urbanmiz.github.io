import d3Wrap from 'react-d3-wrap';
import d3tip from 'd3-tip';

import { styles } from './styles.scss';

const StopDistanceGraph = d3Wrap({
  initialize (svg, data, options) {
    svg.classList.add(styles);
  },

  update (svg, data, options) {
    var margin = {top: 20, right: 20, bottom: 160, left: 40},
        width = this.props.width - margin.left - margin.right,
        height = this.props.height - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select(svg)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    while (data.length < 15) {
      data.push({ name: " ".repeat(data.length), distance: 0 });
    }

    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, 1]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Distance (miles)");

    console.log(data, data.filter(d => d.name[0] !== "_"));

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.distance); })
        .attr("height", function(d) { return height - y(d.distance); });
  }
})

export default StopDistanceGraph;
