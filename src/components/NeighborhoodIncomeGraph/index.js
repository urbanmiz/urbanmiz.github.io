import d3Wrap from 'react-d3-wrap';
import d3tip from 'd3-tip';
import { queue } from 'd3-queue';

import blockGroups from 'file!./blockGroups.csv';
import neighborhoods from 'file!./neighborhoods.csv';

import { styles } from './styles.scss';

const NeighborhoodIncomeGraph = d3Wrap({
  initialize (svg, data, options) {
    svg.classList.add(styles);
  },

  update (svg, data, options) {
    //TEST: selected BG

    // Block Groups to try:
    // Cambridge: G25001703533002
    // Boston North End: G25002500301002
    // No neighborhood data for Revere: G25002501704003, so should compare to city as a whole.

    var selected_BG = this.props.blockGroup;

    // SVG drawing area

    var margin = {top: 40, right: 40, bottom: 100, left: 60};

    var width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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

    //Axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


    // Initialize data
    loadData();


    var dataBG;
    var dataNeighborhoods;


    // Load CSV file
    function loadData() {
      console.log(queue);
      queue()
        .defer(d3.csv, blockGroups)
        .defer(d3.csv, neighborhoods)
        .await(function(error, csvdataBG, csvdataNeighborhoods){

        csvdataBG.forEach(function(d){
        //convert to numbers.
        d.GISJOIN = String(d.GISJOIN);
        d.ALAND =+d.ALAND;
        d.TOT_POP =+d.TOT_POP;
        d.COLL_AGE =+d.COLL_AGE;
        d.YNG_PROF =+d.YNG_PROF;
        d.SENIOR =+d.SENIOR;
        d.MED_AGE =+d.MED_AGE;
        d.R_WHITE =+d.R_WHITE;
        d.NON_WH =+d.NON_WH;
        d.R_BLACK =+d.R_BLACK;
        d.R_NAT_A =+d.R_NAT_A;
        d.R_ASIAN =+d.R_ASIAN;
        d.R_PACIF =+d.R_PACIF;
        d.R_OTHER =+d.R_OTHER;
        d.R_2 =+d.R_2;
        d.R_2INCO =+d.R_2INCO;
        d.R_2_EXCO =+d.R_2_EXCO;
        d.TOT_WKRS =+d.TOT_WKRS;
        d.T0_9 =+d.T0_9;
        d.T10_14 =+d.T10_14;
        d.T15_19 =+d.T15_19;
        d.T20_24 =+d.T20_24;
        d.T25_29 =+d.T25_29;
        d.T30_34 =+d.T30_34;
        d.T35_44 =+d.T35_44;
        d.T45_59 =+d.T45_59;
        d.T60 =+d.T60;
        d.DR_ALONE =+d.DR_ALONE;
        d.CARPOOL =+d.CARPOOL;
        d.TRANSIT =+d.TRANSIT;
        d.TR0_9 =+d.TR0_9;
        d.TR10_14 =+d.TR10_14;
        d.TR15_19 =+d.TR15_19;
        d.TR20_24 =+d.TR20_24;
        d.TR25_29 =+d.TR25_29;
        d.TR30_34 =+d.TR30_34;
        d.TR35_44 =+d.TR35_44;
        d.TR45_59 =+d.TR45_59;
        d.TR60 =+d.TR60;
        d.WALK =+d.WALK;
        d.TOT_HSHD =+d.TOT_HSHD;
        d.MED_INC =+d.MED_INC;
        d.TPOP18 =+d.TPOP18;
        d.TOT_DIS =+d.TOT_DIS;
        d.OC_UNITS =+d.OC_UNITS;
        d.ZERO_VEH =+d.ZERO_VEH;

        });

        // Store csv data in global variable
        dataBG = csvdataBG;

        // Then format neighborhood data
        csvdataNeighborhoods.forEach(function(d){
        d.Max_of_MED_INC =+d.Max_of_MED_INC;
        d.Min_of_MED_INC =+d.Min_of_MED_INC;
        d.Max_of_MED_AGE =+d.Max_of_MED_AGE;
        d.Min_of_MED_AGE =+d.Min_of_MED_AGE;
        d.ALAND =+d.ALAND;
        d.TOT_POP =+d.TOT_POP;
        d.COLL_AGE =+d.COLL_AGE;
        d.YNG_PROF =+d.YNG_PROF;
        d.SENIOR =+d.SENIOR;
        d.R_WHITE =+d.R_WHITE;
        d.NON_WH =+d.NON_WH;
        d.R_BLACK =+d.R_BLACK;
        d.R_NAT_A =+d.R_NAT_A;
        d.R_ASIAN =+d.R_ASIAN;
        d.R_PACIF =+d.R_PACIF;
        d.R_OTHER =+d.R_OTHER;
        d.R_2 =+d.R_2;
        d.R_2INCO =+d.R_2INCO;
        d.R_2_EXCO =+d.R_2_EXCO;
        d.TOT_WKRS =+d.TOT_WKRS;
        d.T0_9 =+d.T0_9;
        d.T10_14 =+d.T10_14;
        d.T15_19 =+d.T15_19;
        d.T20_24 =+d.T20_24;
        d.T25_29 =+d.T25_29;
        d.T30_34 =+d.T30_34;
        d.T35_44 =+d.T35_44;
        d.T45_59 =+d.T45_59;
        d.T60 =+d.T60;
        d.DR_ALONE =+d.DR_ALONE;
        d.CARPOOL =+d.CARPOOL;
        d.TRANSIT =+d.TRANSIT;
        d.TR0_9 =+d.TR0_9;
        d.TR10_14 =+d.TR10_14;
        d.TR15_19 =+d.TR15_19;
        d.TR20_24 =+d.TR20_24;
        d.TR25_29 =+d.TR25_29;
        d.TR30_34 =+d.TR30_34;
        d.TR35_44 =+d.TR35_44;
        d.TR45_59 =+d.TR45_59;
        d.TR60 =+d.TR60;
        d.WALK =+d.WALK;
        d.TOT_HSHD =+d.TOT_HSHD;
        d.TPOP18 =+d.TPOP18;
        d.TOT_DIS =+d.TOT_DIS;
        d.OC_UNITS =+d.OC_UNITS;
        d.ZERO_VEH =+d.ZERO_VEH;
        });

        //store in global for neighborhoods
        dataNeighborhoods = csvdataNeighborhoods;

        // Draw the visualization for the first time
            updateVisualization();
        });

    }



    // Render visualization
    function updateVisualization() {


      //Filter only only selected BG

      var selected_data = dataBG.filter(function(d){
        return d.GISJOIN === selected_BG;
      });
      console.log(selected_data);

      console.log(selected_data[0].Town);
      var selected_Town = selected_data[0].Town;
      console.log(selected_Town);

      // Select City based on selected block group city.
      var filter_dataNeighborhoods = dataNeighborhoods.filter(function(d){
        return d.TOWN === selected_Town;
      });

      console.log(filter_dataNeighborhoods);
      console.log(filter_dataNeighborhoods.length);
      //sort the neighborhood data first by town then by neighborhood.
      if(filter_dataNeighborhoods.length >1){
        var sort_dataNeighborhoods = filter_dataNeighborhoods.sort(function(a, b){
          if(a.TOWN > b.TOWN){
            return 1;
          }
          else if(a.TOWN < b.TOWN){
            return -1;
          }
        else{
            if(a.Place > b.Place){
            return 1;
            }
            else if(a.Place < b.Place){
            return -1;
            }
            else return 0;
          }

        });
      console.log("sorted by town and neighborhood");
      }
      else{
        var sort_dataNeighborhoods = filter_dataNeighborhoods;
        console.log("only 1 object");
      }
      selected_data = selected_data.concat(sort_dataNeighborhoods);
      console.log(selected_data);



      //create domains
      x.domain(selected_data.map(function(d) {
          if(d.hasOwnProperty('NAME_E')){
            return (d.NAME_E);
          }
          else {
            return (d.Place);
          }
        })
      );
        y.domain([0, d3.max(selected_data, function(d) { return d.Max_of_MED_INC; })]);

      svg.append("g")
        .attr("class", "x-axis")
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
        .text("Median Income");

    //MAX INCOME
      svg.selectAll(".bar")
        .data(selected_data)
      .enter().append("rect")
        .attr("class", function(d){
          if(d.GISJOIN === selected_BG){
            return "bar-highlighted";}
          else{
            return "bar";
          }

          })
        .attr("x", function(d) { return x(d.Place); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
          if(d.hasOwnProperty('MED_INC')){
            return y(d.MED_INC);
          }
          else {
            return y(d.Max_of_MED_INC);
          }
        })
        .attr("height", function(d) {
          if(d.hasOwnProperty('MED_INC')){
            return height- y(d.MED_INC);
          }
          else {
            return height - y(d.Max_of_MED_INC);
          }

        });

      // MIN INCOME:
        svg.selectAll(".bar-new")
        .data(selected_data)
      .enter().append("rect")
        .attr("class", function(d){
          if(d.GISJOIN === selected_BG){
            return "bar-highlighted";}
          else{
            return "bar-other";
          }

          })
        .attr("x", function(d) { return x(d.Place); })
        .attr("width", x.rangeBand())
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
});

export default NeighborhoodIncomeGraph;
