import d3Wrap from 'react-d3-wrap';
import d3tip from 'd3-tip';

import { styles } from './styles.scss';

const DemandGraph = d3Wrap({
  initialize (svg, data, options) {
    svg.classList.add(styles);
  },

  update (svg, data, options) {
    var margin = {top: 20, right: 60, bottom: 30, left: 70},
        width = this.props.width - margin.left - margin.right,
        height = this.props.height - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.ridership); })
        .y1(function(d) { return y(d.population); })

    var ridershipLine = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.ridership); });

    var populationLine = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.population); });

    var ridershipTip = d3tip().attr('class', 'd3-tip').html(function(d) { return d.year.getFullYear() + ": " + d.ridership; });
    var populationTip = d3tip().attr('class', 'd3-tip').html(function(d) { return d.year.getFullYear() + ": " + d.population; });

    const chart = d3.select(svg)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (this.chart) {
      this.chart.remove();
    }
    this.chart = chart;

    data = data.map(d => ({
      year: parseDate(d.year.toString()),
      ridership: +d.ridership,
      population: +d.population
    }));

    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.population; })]);

    chart.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    chart.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", ridershipLine);

    chart.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", populationLine);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var dots = chart.selectAll(".dot")
        .data(data)
      .enter()

    dots
      .append("circle")
        .attr("class", "dot")
        .attr("cx", populationLine.x())
        .attr("cy", populationLine.y())
        .attr("r", 3.5)
        .on('mouseover', populationTip.show)
        .on('mouseout', populationTip.hide);;

    dots
      .append("circle")
        .attr("class", "dot")
        .attr("cx", ridershipLine.x())
        .attr("cy", ridershipLine.y())
        .attr("r", 3.5)
        .on('mouseover', ridershipTip.show)
        .on('mouseout', ridershipTip.hide);

    chart.call(ridershipTip);
    chart.call(populationTip);

    chart.append("text")
      .attr("transform", "translate(" + (width+8) + "," + y(data[data.length-1].ridership) + ")")
      .attr("dy", ".35em")
      .attr("class", "line-label")
      .text("Ridership");

    chart.append("text")
      .attr("transform", "translate(" + (width+8) + "," + y(data[data.length-1].population) + ")")
      .attr("dy", ".35em")
      .attr("class", "line-label")
      .text("Population");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("People");
  },

  destroy () {

  }
})

export default DemandGraph;
