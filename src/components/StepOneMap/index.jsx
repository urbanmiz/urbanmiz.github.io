import React from 'react';
import Checkbox from 'material-ui/lib/checkbox';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import _ from 'lodash';


//TODO re-query/render on map bounds change
const StepOneMap = React.createClass({

    getInitialState: function () {
        return ({
            amenitiesShown: [],
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
        }
    },
    render: function () {
        return (<div style={{width: '100%', display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center',  padding:0}}>


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
            ref="gmap"
            defaultZoom={12}
            defaultCenter={{lat: 42.349708, lng: -71.081329}}
            >
            {this.renderAmenityMarkers()}

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
                              onCheck={this.handleClick}/>
                    <Checkbox data-amenity-label={'groceries'} label="Grocers"
                              checked={this.state.amenitiesShown.indexOf('groceries') > -1}
                              onCheck={this.handleClick}/>
                    <Checkbox data-amenity-label={'bars'} label="Bars & Clubs"
                              checked={this.state.amenitiesShown.indexOf('bars') > -1}
                              onCheck={this.handleClick}/>
                    <Checkbox data-amenity-label={'gyms'} label="Gyms"
                              checked={this.state.amenitiesShown.indexOf('gyms') > -1}
                              onCheck={this.handleClick}/>
                    <Checkbox data-amenity-label={'parks'} label="Parks"
                              checked={this.state.amenitiesShown.indexOf('parks') > -1}
                              onCheck={this.handleClick}/>
                </div>
            </div>
        );
    },


    handleClick: function (element, checked) {
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
                            icon={this.markerIcons.coffee}
                    />
                )
            }.bind(this))

        }

        return markerComponents;
    }
});

export default StepOneMap;