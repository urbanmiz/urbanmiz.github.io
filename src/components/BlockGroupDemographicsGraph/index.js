import { D3Chart } from 'components/D3Chart';
import d3tip from 'd3-tip';
import { queue } from 'd3-queue';

import blockGroups from 'file!./blockGroups.csv';
import neighborhoods from 'file!./neighborhoods.csv';

import { styles } from './styles.scss';

const NUMERIC_FIELDS = [
  'Max_of_MED_INC', 'Min_of_MED_INC', 'Max_of_MED_AGE', 'Min_of_MED_AGE',
  'ALAND', 'CARPOOL', 'COLL_AGE', 'DR_ALONE', 'MED_AGE', 'MED_INC', 'NON_WH',
  'OC_UNITS', 'R_2', 'R_2_EXCO', 'R_2INCO', 'R_ASIAN', 'R_BLACK', 'R_NAT_A',
  'R_OTHER', 'R_PACIF', 'R_WHITE', 'SENIOR', 'T0_9', 'T10_14', 'T15_19',
  'T20_24', 'T25_29', 'T30_34', 'T35_44', 'T45_59', 'T60', 'TOT_DIS',
  'TOT_HSHD', 'TOT_POP', 'TOT_WKRS', 'TPOP18', 'TR0_9', 'TR10_14', 'TR15_19',
  'TR20_24', 'TR25_29', 'TR30_34', 'TR35_44', 'TR45_59', 'TR60', 'TRANSIT',
  'WALK', 'YNG_PROF', 'ZERO_VEH'
]

function coerceDatum(d) {
  Object.keys(d).forEach(function (key) {
    if (NUMERIC_FIELDS.indexOf(key) !== -1) {
      d[key] = +d[key];
    }
  });
}

export class NeighborhoodIncomeGraph extends D3Chart {
  initialize (svg, data, options) {
    svg.classList.add(styles);

    //TEST: selected BG

    var selected_BG = this.props.blockGroup;

    var formatPercent = d3.format(",%");
    var formatNumber = d3.format(',.0f');

    var tickFormatsByMetric = {
      med_inc: function (d) { return "$" + formatNumber(d) },
      zero_veh: formatPercent,
      transit_commute: formatPercent,
      pop_density: formatNumber,
      college: formatPercent,
      seniors: formatPercent,
    }

    // SVG drawing area

    var margin = {top: 40, right: 40, bottom: 120, left: 60};

    var width = this.props.width - margin.left - margin.right,
        height = this.props.height - margin.top - margin.bottom;

    var svg = d3.select(svg)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scales
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    // Axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d => {
          return tickFormatsByMetric[this.props.metric](d);
        });

    this.updateVisualization = () => {};

    queue()
      .defer(d3.csv, blockGroups)
      .defer(d3.csv, neighborhoods)
      .await((error, dataBG, dataNeighborhoods) => {
        dataBG.forEach(coerceDatum);
        dataNeighborhoods.forEach(coerceDatum);

        this.updateVisualization = () => {
          // Extract selected BG.
          var selectedBlockGroup = dataBG.find(function(d) {
            return d.GISJOIN === selected_BG;
          });

          // Select City based on selected block group city.
          var neighborhoods = dataNeighborhoods.filter(function(d) {
            return d.TOWN === selectedBlockGroup.Town;
          }).sort(function(a, b){
            if (a.TOWN > b.TOWN) {
              return 1;
            } else if (a.TOWN < b.TOWN) {
              return -1;
            } else if(a.Place > b.Place) {
              return 1;
            } else if (a.Place < b.Place) {
              return -1;
            }
            return 0;
          });

          var data = [selectedBlockGroup].concat(neighborhoods);

          // Create domains.
          x.domain(data.map(function(d) {
            return d.NAME_E ? "Selected block group" : d.Place;
          }));

          y.domain([0, d3.max(data, d => {
            if(this.props.metric === "med_inc"){
              return d.Max_of_MED_INC;
            }
            else if(this.props.metric === "zero_veh"){
              return 1;
            }
            else if(this.props.metric === "transit_commute"){
              return 1;
            }
            else if(this.props.metric === "pop_density"){
              //convert to acres
              return d.TOT_POP / (d.ALAND * 0.00002295684);
            }
            else if(this.props.metric === "college"){
              return 1;
            }
            else if(this.props.metric === "seniors"){
              return 1;
            }

          })]);

          var xAxisGroup = svg.append("g")
              .attr("class", "x-axis axis")
              .attr("transform", "translate(0," + height + ")")

          svg.select(".x-axis")
            .call(xAxis)
            .selectAll("text")
              .attr("y", 0)
              .attr("x", -9)
              .attr("dy", ".35em")
              .attr("transform", "rotate(-90)")
              .style("text-anchor", "end");

        var yAxisGroup = svg.append("g")
            .attr("class", "y-axis axis");

          svg.select(".y-axis")
          .transition()
          .call(yAxis)
        //    .append("text")
        //    .attr("transform", "rotate(-90)")
        //    .attr("y", 6)
        //    .attr("dy", ".71em")
        //    .style("text-anchor", "end")
        //    .text("Median Income");


          //remove the min bars if exist.
          d3.selectAll("rect.bar-other").transition().attr("height", 0).attr("y", height).remove();
          //DEMOGRAPHICS charts

          //enter
          var bars = svg.selectAll(".bar")
            .data(data, d => d.NAME_E ? "Selected block group" : d.Place);

          bars.enter().append("rect")
            .attr("width", x.rangeBand());

          //update

          bars
          .transition()

          .attr("class", function(d){
              if(d.GISJOIN === selected_BG){
                return "bar bar-highlighted";}
              else{
                return "bar";
              }

            })
            .attr("x", function(d) { return x(d.NAME_E ? "Selected block group" : d.Place); })
            .attr("y", d => {
              if(this.props.metric === "med_inc"){
                if(d.hasOwnProperty('MED_INC')){
                  return y(d.MED_INC);
                }
                else {
                  return y(d.Max_of_MED_INC);
                }
              }

                else if(this.props.metric === "zero_veh"){
                  return y(d.ZERO_VEH/d.TOT_HSHD);
                }
                else if(this.props.metric === "transit_commute"){
                  return y(d.TRANSIT/d.TOT_WKRS);
                }
                else if(this.props.metric === "pop_density"){
                  return y(d.TOT_POP / (d.ALAND * 0.00002295684));
                }
                else if(this.props.metric === "college"){
                  return y(d.COLL_AGE / d.TOT_POP);
                }
                else if(this.props.metric === "seniors"){
                  return y(d.SENIOR/d.TOT_POP);
                }
            })
            .attr("height", d => {
              if(this.props.metric === "med_inc"){
                if(d.hasOwnProperty('MED_INC')){
                  return height- y(d.MED_INC);
                }
                else {
                  return height - y(d.Max_of_MED_INC);
                }
              }
                else if(this.props.metric === "zero_veh"){
                  return height - y(d.ZERO_VEH/d.TOT_HSHD);
                }
                else if(this.props.metric === "transit_commute"){
                  return height - y(d.TRANSIT/d.TOT_WKRS);
                }
                else if(this.props.metric === "pop_density"){
                  return height - y(d.TOT_POP / (d.ALAND * 0.00002295684));
                }
                else if(this.props.metric === "college"){
                  return height - y(d.COLL_AGE / d.TOT_POP);
                }
                else if(this.props.metric === "seniors"){
                  return height - y(d.SENIOR/d.TOT_POP);
                }
            });

          //add minimum incomes to the chart if this.props.metric was median incomes.
          if (this.props.metric === "med_inc") {
          var bar_new = svg.selectAll(".bar_new")
            .data(data, function (d) { return d.NAME_E ? "Selected block group" : d.Place });

            bar_new.enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("x", function(d) { return x(d.NAME_E ? "Selected block group" : d.Place); })
              .attr("y", height)
              .attr("height", 0);

            bar_new
              .transition()
              .attr("class", function(d){
                if(d.GISJOIN === selected_BG){
                  return "bar-other bar-highlighted";}
                else{
                  return "bar-other";
                }

                })
              .attr("x", function(d) { return x(d.NAME_E ? "Selected block group" : d.Place); })
              .attr("y", function(d) {
                if(d.hasOwnProperty('MED_INC')){
                  return y(d.MED_INC);
                }
                else {
                  return y(d.Min_of_MED_INC);
                }
              })
              .attr("height", function(d) {
                if(d.hasOwnProperty('MED_INC')){
                  return height- y(d.MED_INC);
                }
                else {
                  return height - y(d.Min_of_MED_INC);
                }
              });

          }
        }
        this.updateVisualization();
      });
  }

  update (svg, data, options) {
    this.updateVisualization();
  }
}
