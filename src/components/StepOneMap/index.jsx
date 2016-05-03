import React from 'react';
import Checkbox from 'material-ui/lib/checkbox';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import _ from 'lodash';
import {default as update} from 'react-addons-update';
import DistanceChart from '../DistanceChart';
//TODO re-query/render on map bounds change
const StepOneMap = React.createClass({

    getInitialState: function () {
        return ({
            amenitiesShown: [],
            userMarkers: [],
            workMarker: {},
            markers: {
                coffee: [],
                schools: [],
                groceries: [],
                bars: [],
                gyms: [],
                parks: []
            }
        })

    },


    markerIcons: {
        //TODO find better icons
        coffee: {
            url: require('./icons/coffee.png'),
            size: new google.maps.Size(10, 6)
        },
        bars: {
            url: require('./icons/bars.png'),
            size: new google.maps.Size(12, 20)
        },
        groceries: {
            url: require('./icons/groceries.png'),
            size: new google.maps.Size(16, 12)
        },
        schools: {
            url: require('./icons/schools.png'),
            size: new google.maps.Size(16, 15)
        },
        gyms: {
            url: require('./icons/gyms.png'),
            size: new google.maps.Size(16, 15)
        },
        parks: {
            url: require('./icons/parks.png'),
            size: new google.maps.Size(16, 15)
        }
    },
    render: function () {
        return (
            <div>
                <h1>Your public transit commute</h1>
                <h4>This tool will help you get an idea what a public transit commute might look like for different places in Boston.
                First, you'll show us where you want to live & work.  Then, we'll use Google to show you some commute times.
                After that, take a look at the data-story about Boston's transit that we've put together.</h4>
                <div style={{textAlign: 'left', paddingLeft: 25}}>
                    <h1>Step 1: Where might you live & work?</h1>
                    <h4>Left-click on the map to add a place you might want to live. You'll need at least 2.<br/>
                        Right-click to add a location for your workplace.</h4>
                </div>
                <div
                    style={{height: 350, width: '100%', display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center',  padding:0}}>


                    <br />
                    <GoogleMapLoader
                        containerElement={
          <div
            {...this.props}
            style={{
              height: "100%",
              flex: '0 1 70%',
              marginLeft: 0
            }}
          />
        }
                        googleMapElement={
          <GoogleMap
            onRightclick={this.handleMapRightClick}
            onClick={this.handleMapClick}
            ref="gmap"
            defaultZoom={12}
            defaultCenter={{lat: 42.349708, lng: -71.081329}}
            >
            {this.renderAmenityMarkers()}
             {this.state.userMarkers.map((marker, index) => {
              console.log(index);
              return (
                <Marker
                  {...marker}
                  label={String(index+1)}
                  onRightclick={this.handleMarkerRightclick.bind(this, index)}
                />
              );
            })}
            <Marker label="W" defaultAnimation={2} position={this.state.workMarker.position} />
          </GoogleMap>
        }

                    />

                    <div style={{
              height: "100%",
              flex: '0 1 250px',
              marginLeft: 0
            }}>

                        <h4>Show these amenities</h4>
                        <Checkbox data-amenity-label={'coffee'} label="Cofee Shops"
                                  checked={this.state.amenitiesShown.indexOf('coffee') > -1}
                                  onCheck={this.handleAmenityToggle}/>
                        <Checkbox data-amenity-label={'groceries'} label="Grocers"
                                  checked={this.state.amenitiesShown.indexOf('groceries') > -1}
                                  onCheck={this.handleAmenityToggle}/>
                        <Checkbox data-amenity-label={'bars'} label="Bars & Clubs"
                                  checked={this.state.amenitiesShown.indexOf('bars') > -1}
                                  onCheck={this.handleAmenityToggle}/>
                        <Checkbox data-amenity-label={'gyms'} label="Gyms"
                                  checked={this.state.amenitiesShown.indexOf('gyms') > -1}
                                  onCheck={this.handleAmenityToggle}/>
                        <Checkbox data-amenity-label={'parks'} label="Parks"
                                  checked={this.state.amenitiesShown.indexOf('parks') > -1}
                                  onCheck={this.handleAmenityToggle}/>
                        <Checkbox data-amenity-label={'schools'} label="Schools"
                                  checked={this.state.amenitiesShown.indexOf('schools') > -1}
                                  onCheck={this.handleAmenityToggle}/>
                    </div>

                </div>
                <section>

                    <div>

                        <DistanceChart
                            mapComponent={this.refs.gmap}
                            userMarkers={this.state.userMarkers}
                            workMarker={this.state.workMarker}/>
                    </div>
                </section>
                <section>
                    <h1>Step 3: Learn more about transit in Boston</h1>
                    <h4>Transit affects everyone!  Click the link in the header to examine the data surrounding Boston's public transit system.</h4>
                </section>
            </div>
        );
    },
    handleMapRightClick(event) {
        this.setState({workMarker: {position: event.latLng}});
    },
    handleMarkerRightclick(index, event) {

        let userMarkers = this.state.userMarkers;
        userMarkers = update(userMarkers, {
            $splice: [
                [index, 1],
            ],
        });
        this.setState({userMarkers});
    },
    handleMapClick: function (event) {
        let userMarkers = this.state.userMarkers;

        userMarkers = update(userMarkers, {
            $push: [
                {
                    position: event.latLng,
                    defaultAnimation: 2,
                    key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
                },
            ],
        });
        this.setState({userMarkers});

    },
    handleAmenityToggle: function (element, checked) {
        //each checkbox has an html attribute that contains the label of the amenity it represents
        //eg coffeshop data-amenity-label attr is 'coffee'.  this keyword is what we'll query Google Places
        //for, as well as handle local state updates.  in other words, it should be consistent with the
        //marker labels in getInitialState

        let amenityLabel = element.target.getAttribute('data-amenity-label'),
            placesService = new google.maps.places.PlacesService(this.refs.gmap.props.map);

        //add or remove amenity from our list based on whether the invoking event is a check or uncheck
        let newAmenitiesShownList = checked ? this.state.amenitiesShown.concat(amenityLabel)
            : _.without(this.state.amenitiesShown, amenityLabel);
        this.setState({amenitiesShown: newAmenitiesShownList});

        //if they unchecked, or if array is already populated,we're done.
        //we won't clear the array of markers so we don't have to
        //do another API call if they re-select
        console.log("markers obj", this.state.markers);
        if (checked === false || this.state.markers[amenityLabel].length > 0) return;

        //construct our request object.
        //TODO switch from radius-based to map bounds params; better ux
        var request = {
            location: this.refs.gmap.getCenter(),
            radius: 2000,
            keyword: amenityLabel
        };

        placesService.radarSearch(request, function (results, status) {
            let resultsArray = [];
            for (let obj of results) {
                let lat = obj.geometry.location.lat(),
                    lng = obj.geometry.location.lng();
                resultsArray.push({lat: lat, lng: lng})
            }
            let markerObj = {};
            markerObj[amenityLabel] = resultsArray;
            this.setState({markers: Object.assign({}, this.state.markers, markerObj)})

        }.bind(this));

    },

    renderAmenityMarkers: function () {
        console.log("rendering markers for: ", this.state.amenitiesShown);
        //nested loop:
        //for each label in array of markers labels to render:
        //    for each coordinate in marker array:
        //       push a marker onto the array of marker to render
        let markerComponents = [],
            labels = this.state.amenitiesShown;

        for (let i = 0; i < labels.length; i += 1) {
            this.state.markers[labels[i]].map(function (coordsObj, j) {

                markerComponents.push(
                    <Marker key={labels[i]+j} position={coordsObj}
                            icon={this.markerIcons[labels[i]]}
                    />
                )
            }.bind(this))

        }

        return markerComponents;
    }
});

export default StepOneMap;
