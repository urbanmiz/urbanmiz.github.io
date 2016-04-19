import d3Wrap from 'react-d3-wrap';
import topojson from 'topojson';

import { styles } from './styles.scss';

const BostonMap = d3Wrap({
  initialize (svg, data, options) {
    svg.classList.add(styles);

    this.reset = () => {
      this.chart.attr("transform", "translate(0,0) scale(1)");
    };

    this.quantize = (how) => {
        this.how = how;

        this.currentMetric = (d) => {
          if (how === "pop") {
            return d.TOT_POP / d.ALAND;
          } else if (how === "transmod") {
            return d.TRANSIT / d.TOT_WKRS;
          } else if (how === "zero") {
            return d.ZERO_VEH / d.TOT_HSHD;
          } else if (how === "income") {
            return d.MED_INC;
          }
        };

        this.updateScale();
    }

    this.export = () =>
      Array.from(this.selected).map(d => ({
        "ID": d.TARGET_FID,
        "Population": d.TOT_POP,
        "Households": d.TOT_HSHD,
        "Transit mode share": d.TRANSIT,
        "Zero vehicle households": d.ZERO_VEH,
        "Median income": d.MED_INC
      }));

    this.shouldComponentUpdate = () => false;
  },

  update (svg, data, options) {
    let vis = this;

    this.selected = new Set();

    let zoomed = () => {
      this.chart.attr("transform", "translate("+d3.event.translate+")" + " scale("+d3.event.scale+")");
    }

    let over = function (d) {
      vis.props.onHover(d.properties);
    }

    let out = function (d) {
      vis.props.onHover(null);
    }

    let double = function (d) {
      d3.event.stopPropagation();

      console.log(vis.selected);

      if (vis.selected.has(d.properties)) {
        vis.selected.delete(d.properties);
        d3.select(this).style("fill", "");
        return;
      }

      if (vis.selected.size >= 10) {
        alert("Sorry, too many block groups already selected. Remove one.");
        return;
      }

      vis.selected.add(d.properties);
      d3.select(this).style("fill", "darkred");

      vis.props.onSelectionChange(vis.export());
    }

    this.chart = d3.select(svg).append("g");

    const projection = d3.geo.conicEqualArea()
        .center([24.9, 42.36])
        .parallels([29.5, 45.5])
        .translate([480, 250])
        .rotate([96, 0])
        .scale(500000);

    const path = d3.geo.path()
        .projection(projection);

    var zoom = d3.behavior.zoom()
        .scaleExtent([.7, 5])
        .on("zoom", zoomed);

    var scale = d3.scale.quantize()
        .domain([0, 1])
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    this.chart.call(zoom);

    this.chart.append("rect")
        .attr("class", "background")
        .attr("width", this.props.width)
        .attr("height", this.props.height);

    require(["./blockGroups.json"], blockGroups => {
      const featureCollection = topojson.feature(blockGroups, blockGroups.objects.blockGroups);

      this.chart
        .append("g")
          .attr("class", "blocks")
        .selectAll("path")
          .data(featureCollection.features)
        .enter().append("path")
          .attr("d", path)
          .attr("class", d => this.how ? scale(this.currentMetric(d.properties)) : "")
          .on("mouseenter", over)
          .on("mouseleave", out)
          .on("dblclick", double);

      this.updateScale = () => {
        scale.domain(d3.extent(featureCollection.features.map(d =>
          this.currentMetric(d.properties)
        )));

        this.chart.selectAll(".blocks path")
          .attr("class", d => this.how ? scale(this.currentMetric(d.properties)) : "");
      };
    })
  },

  destroy () {

  }
})

export default BostonMap;
