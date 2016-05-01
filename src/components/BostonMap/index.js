import { D3Chart } from 'components/D3Chart';
import d3tip from 'd3-tip';
import topojson from 'topojson';

import { styles } from './styles.scss';

let BANNED_FIDS = new Set([85 /* Charles river */]);

const LIGHT_COLORS = {
  RED: "#ff827f",
  BLUE: "#8280ff",
  ORANGE: "#ffd67f",
}

export class BostonMap extends D3Chart {
  constructor(props) {
    super(props)

    this.className = styles;
  }

  initialize (svg) {
    svg.classList.add(styles);

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

    this.when = "AM";
    this.setWhen = (when) => {
      this.when = when;
      this.updateLines();
    }

    this.whenTime = 360;
    this.setWhenTime = (whenTime) => {
      this.whenTime = whenTime;
      this.updateLines();
    }

    this.export = () =>
      Array.from(this.selected).map(d => ({
        "ID": d.TARGET_FID,
        "Population": d.TOT_POP,
        "Households": d.TOT_HSHD,
        "Transit mode share": d.TRANSIT,
        "Zero vehicle households": d.ZERO_VEH,
        "Median income": d.MED_INC,
        "City": d.TOWN,
        lat: +d.INTPTLAT,
        long: +d.INTPTLON,
        bid: d.GISJOIN,
      }));

    this.shouldComponentUpdate = () => false;
  }

  update (svg) {
    let vis = this;

    this.selected = new Set();

    let zoomed = () => {
      this.chart.attr("transform", "translate("+d3.event.translate+")" + " scale("+d3.event.scale+")");
    }

    this.reset = () => {
      this.svg.transition().duration(750).call(zoom.translate([0, 0]).scale(1).event);
      this.selected.forEach(s => this.selected.delete(s));
      this.chart.selectAll(".blocks path").style("fill", "");
      this.props.onSelectionChange(vis.export());
    };

    this.classed = (classes) => {
      d3.select(svg).classed(classes);
      this.updateLines();
    }

    let zoomClick = (direction) => {
      this.svg.call(zoom.event);

      let center0 = zoom.center(),
        translate0 = zoom.translate(),
        coordinates0 = coordinates(center0);

      zoom.scale(zoom.scale() * (direction === "in" ? 2 : 0.5));

      var center1 = point(coordinates0);
      zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);

      this.svg.transition().duration(750).call(zoom.event);
    }

    let coordinates = (point) => {
      let scale = zoom.scale(), translate = zoom.translate();
      return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
    };

    let point = (coordinates) => {
      var scale = zoom.scale(), translate = zoom.translate();
      return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
    };

    let double = function (d) {
      d3.event.stopPropagation();

      if (vis.selected.has(d.properties)) {
        vis.selected.delete(d.properties);
        d3.select(this).style("fill", "");
      } else {
        vis.selected.add(d.properties);
        d3.select(this).style("fill", "#444");
      }

      vis.props.onSelectionChange(vis.export());
    }

    var blockGroupTip = d3tip()
      .attr("class", "d3-tip")
      .html(d => `
${d.properties.TOWN}<br>
${d.properties.COUNTY}<br><br>
<div style="text-align: left">
Total population: ${d.properties.TOT_POP}<br>
Seniors: ${d.properties.SENIOR} (${d3.format(".1p")(d.properties.SENIOR / d.properties.TOT_POP)})<br>
Median age: ${d.properties.MED_AGE}<br>
Median income: ${d3.format("$,")(d.properties.MED_INC)}<br>
Total households: ${d.properties.TOT_HSHD}<br>
Zero vehicle households: ${d.properties.ZERO_VEH} (${d3.format(".1p")(d.properties.ZERO_VEH / d.properties.TOT_HSHD)})<br><br>
<small>Double click to select.</small>
</div>
`);

    let frequencyTip = d =>
`<table>
 <tr><td>Morning</td><td>${d.properties.AM} minutes</td></tr>
 <tr><td>Morning rush hour</td><td>${d.properties.AM_Peak} minutes</td></tr>
 <tr><td>Afternoon</td><td>${d.properties.PM} minutes</td></tr>
 ${d.properties.PM_Peak ? "<tr><td>Evening rush hour</td><td>" + d.properties.PM_Peak + " minutes</td></tr>" : ""}
 <tr><td>Night</td><td>${d.properties.Eve} minutes</td></tr>
 <tr><td>Saturday peak</td><td>${d.properties.Sat_Pk} minutes</td></tr>
 <tr><td>Sunday peak</td><td>${d.properties.Sun_Pk} minutes</td></tr>
 </table>`

    var subwayTip = d3tip()
      .attr("class", "d3-tip")
      .html(d => `${d.properties.LINE}<br>
${d.properties.STATIONS.replace(",", "–") || "Stations unknown"}<br><br>
${frequencyTip(d)}`)

    var busTip = d3tip()
      .attr("class", "d3-tip")
      .html(d => `${d.properties.Route} Bus<br><br>
${frequencyTip(d)}`)

    this.svg = d3.select(svg);

    const projection = d3.geo.conicEqualArea()
        .center([24.9, 42.36])
        .parallels([29.5, 45.5])
        .translate([480, 250])
        .rotate([96, 0])
        .scale(500000);

    const path = d3.geo.path()
        .projection(projection);

    var zoom = d3.behavior.zoom()
        .scaleExtent([.3, 5])
        .size([this.props.width, this.props.height])
        .center([this.props.width / 2, this.props.height / 2])
        .on("zoom", zoomed);

    var scale = d3.scale.quantize()
        .domain([0, 1])
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var lineScale = d3.scale.threshold()
        .domain([1, 6, 11, 16, 31, 60])
        .range(["#aaa", "#e64347", "#e65e43", "#e6a23c", "#edd351", "#badbaf", "#ebefc9"]);

    var congestionScale = d3.scale.sqrt()
        .domain([1, 100])
        .range([2, 20]);

    var line = d3.svg.line();

    var varline = function (sw, ew) {
      return function(d) {
        var p = path(d);
        if (!p) {
          return;
        }
        d = p.substring(1).split("L").map(p => p.split(",").map(v => +v));
        var top = [];
        var bottom = [];
        var dist = 0;
        var totalDist = 0;
        var distDiff = ew - sw;

        for (var i = 1; i < d.length; i++) {
          var dx = d[i][0] - d[i-1][0];
          var dy = d[i][1] - d[i-1][1];
          totalDist += Math.sqrt(dx * dx + dy * dy);
        }

        for (var i = 0; i < d.length; i++) {
          if (i == 0) {
            var dx = d[i+1][0] - d[i][0];
            var dy = d[i+1][1] - d[i][1];
          } else {
            var dx = d[i][0] - d[i-1][0];
            var dy = d[i][1] - d[i-1][1];
          }
          var slope = Math.atan2(dy, dx);
          var up = slope + Math.PI / 2;
          var down = slope - Math.PI / 2;
          if (i > 0) {
            dist += Math.sqrt(dx * dx + dy * dy);
          }
          var w = (dist / totalDist) * distDiff + sw;
          top.push([d[i][0] + w * Math.cos(up), d[i][1] + w * Math.sin(up)]);
          bottom.push([d[i][0] + w * Math.cos(down), d[i][1] + w * Math.sin(down)]);
        }

        return line(top) + line(bottom.reverse()).replace("M", "L") + "Z";
      }
    };

    this.chart = this.svg.append("g");

    this.chart
      .call(zoom)
      .call(blockGroupTip)
      .call(subwayTip)
      .call(busTip);

    // Fix broken zooming if mouse and g get translated at same time.
    this.chart = this.chart.append("g");

    this.chart.append("rect")
        .attr("class", "background")
        .attr("x", -this.props.width * 5)
        .attr("y", -this.props.height * 5)
        .attr("width", this.props.width * 10)
        .attr("height", this.props.height * 10);

    this.chart.append("rect")
        .attr("class", "glyphicon glyphicon-zoom-out")
        .append("text")
        .text("here!")

    require(["./blockGroups.json", "./subwayLines.json", "./busLines.json", "./congestion.json"], (blockGroups, subwayLines, busLines, congestion) => {
      const featureCollection = topojson.feature(blockGroups, blockGroups.objects.blockGroups);
      const subwayLinesCollection = topojson.feature(subwayLines, subwayLines.objects.subwayLines);
      const busLinesCollection = topojson.feature(busLines, busLines.objects.busLines);

      this.chart
        .append("g")
          .attr("class", "blocks")
        .selectAll("path")
          .data(featureCollection.features.filter(d => !BANNED_FIDS.has(d.properties.TARGET_FID)))
        .enter().append("path")
          .attr("d", path)
          .attr("class", d => this.how ? scale(this.currentMetric(d.properties)) : "")
          .on("mouseover", blockGroupTip.show)
          .on("mouseout", blockGroupTip.hide)
          .on("dblclick", double);

      let congestionPath = this.chart
        .append("g")
          .attr("class", "congestion-lines")
          .style("opacity", 0.8)
        .selectAll("path")
          .data(subwayLinesCollection.features.filter(d => d.properties.LINE !== "GREEN"))
        .enter().append("path")
        .on("mouseover", subwayTip.show)
        .on("mouseout", subwayTip.hide);

      let busPath = this.chart
        .append("g")
          .attr("class", "lines bus-lines")
        .selectAll("path")
          .data(busLinesCollection.features)
        .enter().append("path")
          .style("stroke-width", 2)
        .on("mouseover", d => {
            let m = d3.mouse(svg);
            let r = this.svg.append("rect")
              .attr("x", m[0])
              .attr("y", m[1])
            busTip.show(d, r.node());
            r.remove()
          })
        .on("mouseout", busTip.hide)

      let subwayPath = this.chart
        .append("g")
          .attr("class", "lines subway-lines")
        .selectAll("path")
          .data(subwayLinesCollection.features)
        .enter().append("path")
          .attr("d", path)
          .style("stroke-width", 5)
        .on("mouseover", subwayTip.show)
        .on("mouseout", subwayTip.hide);

      this.updateLines = () => {
        let busPath = this.chart.select(".bus-lines").selectAll("path")
          .data(busLinesCollection.features.sort(
            (a, b) => (b.properties[this.when] == 0 ? 1000 : b.properties[this.when]) - (a.properties[this.when] == 0 ? 1000 : a.properties[this.when])
          ))
          .attr("d", path);

        if (this.svg.classed("frequency")) {
          subwayPath.style("stroke", d => lineScale(d.properties[this.when]));
          busPath.style("stroke-dasharray", d => d.properties[this.when] === 0 ? "10,10" : "")
          busPath.style("stroke", d => lineScale(d.properties[this.when]));
        } else {
          subwayPath.style("stroke", d => d.properties.LINE.toLowerCase());
          congestionPath.style("fill", d => LIGHT_COLORS[d.properties.LINE]);
          congestionPath.style("stroke", d => LIGHT_COLORS[d.properties.LINE]);
          congestionPath.style("stroke-width", 2);
          congestionPath.style("stroke-alignment", "inner");
          congestionPath.attr("d", d => {
            let c = d3.range(this.whenTime, this.whenTime + 10).map(t => congestion[t]);
            let [b, e] = d.properties.STATIONS.split(",");
            if (!b) b = "";
            if (!e) e = "";
            b = b.replace("Assembly", "Sullivan Square");
            e = e.replace("Assembly", "Sullivan Square");
            let cb = congestionScale(d3.mean(c.map(t => t[b] || 1)));
            let ce = congestionScale(d3.mean(c.map(t => t[e] || 1)));
            return varline(cb, ce)(d);
          })
          busPath.style("stroke", "purple");
          busPath.style("stroke-dasharray", "")
        }
      };
      this.updateLines();

      this.updateScale = () => {
        scale.domain(d3.extent(featureCollection.features.map(d =>
          this.currentMetric(d.properties)
        )));

        this.chart.selectAll(".blocks path")
          .attr("class", d => this.how ? scale(this.currentMetric(d.properties)) : "");
      };

      this.svg.append("text")
          .attr("class", "zoom-button")
          .attr("x", this.props.width - 5)
          .attr("dy", "1.2em")
          .text("\uE015")
          .on("click", () => zoomClick("in"));

      this.svg.append("text")
          .attr("class", "zoom-button")
          .attr("x", this.props.width - 5)
          .attr("dy", "2.4em")
          .text("\uE016")
          .on("click", () => zoomClick("out"));
    })
  }
}
