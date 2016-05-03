import React from 'react';
import rd3 from 'rd3';
var BarChart = rd3.BarChart;
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';


const DistanceChart = React.createClass({

    getInitialState: function () {

        return ({
            chartRendered: false,
            snackbarOpen: false,
            waiting: false,

        })
    },
    render: function () {
        return (
            <div>
                <div style={{textAlign: 'left', paddingLeft: 25}}>
                    <h1>Step 2: Compare commute times</h1>
                    <h4>Once you've selected the places in which you're interested, click the "Chart" button to see a
                    comparison of commute times.</h4>
                    </div>
                {this.state.chartRendered ?
                    <frag><BarChart data={this.state.barData}
                              width={500} height={300}
                              title="Your Commute Options"
                              yAxisLabel="Commute Duration (minutes)"
                              xAxisLabel="Marker #"/>
                        <h4>Note that times assume a departure time of <i>right now</i>.</h4>
                    </frag>
                    : <RaisedButton ref="button" label={this.state.waiting? "Loading...": "Chart!"}
                                    onClick={this.handleClick}/>}

                <Snackbar open={this.state.snackbarOpen}
                          onRequestClose={this.handleRequestClose}
                          autoHideDuration={5000}
                          message="You need 1 work and 2 location pins. Please add more pins above & try again."

                />


            </div>
        )
    },
    handleRequestClose: function() {
      this.setState({snackbarOpen: false});
    },
    handleClick: function (e) {
        console.log(this.props)
        if (!(this.props.workMarker.hasOwnProperty("position")) || this.props.userMarkers.length < 2) {
            this.setState({snackbarOpen: true});
            return;
        }
        this.setState({waiting: true});

        let origins = [];

        this.props.userMarkers.forEach((marker, idx) => {
            origins.push(marker.position);
        });
        let service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
            {
                origins: origins,
                destinations: [this.props.workMarker.position],
                travelMode: google.maps.TravelMode.TRANSIT,


            },
            function (res, stat) {
                console.log(res);
                let distances = {
                    "name": "Distances",
                    "values": [

                    ]
                };
                for (let i =0;i<res.rows.length;i+=1) {
                    console.log(res.rows[i].elements[0].duration.value)
                    let d = res.rows[i].elements[0].duration.value;
                    let o = {};
                    o["x"] = String(i+1);
                    o["y"] = d/60;
                    distances.values.push(o);
                }

                this.setState({barData: [distances], chartRendered: true})
                console.log("RESULTS!", distances);
            }.bind(this)
        )
    }
});


export default DistanceChart;

/*
"name": "Distances",
    "values": [
    {"x": 1, "y": 91},
    {"x": 2, "y": 290},
    {"x": 3, "y": -25},
]*/
