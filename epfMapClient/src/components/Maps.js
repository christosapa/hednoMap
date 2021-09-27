import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends Component {

    constructor(props) {
        super(props);

        this.state = {
            stores: [{ lat: 47.49855629475769, lng: -122.14184416996333 },
            { latitude: 47.359423, longitude: -122.021071 },
            { latitude: 47.2052192687988, longitude: -121.988426208496 },
            { latitude: 47.6307081, longitude: -122.1434325 },
            { latitude: 47.3084488, longitude: -122.2140121 },
            { latitude: 47.5524695, longitude: -122.0425407 }]
        }
    }

    //   displayMarkers = () => {
    //     return this.state.stores.map((store, index) => {
    //       return <Marker key={index} id={index} position={{
    //        lat: store.latitude,
    //        lng: store.longitude
    //      }}
    //      onClick={() => console.log("You clicked me!")} />
    //     })
    //   }

    seperateCoords(Locations) {
        // let latitude = Locations.split('\n')[0].split(',')[0].replace('[', '')
        // let longitude = Locations.split('\n')[0].split(',')[1].replace(']', '')
        // return latitude, longitude
        return 10,11
    }

    displayMarkers(Locations) {
        // let latitude = Locations.split('\n')[0].split(',')[0].replace('[', '')
        // let longitude = Locations.split('\n')[0].split(',')[1].replace(']', '')
        let latitude = 10
        let longitude = 11
        return <Marker position={{
            lat: latitude,
            lng: longitude
        }} />

    }

    render() {
        return (
            // for debugging..
            // <div>
            //     <p>{this.props.markerLocation.split('\n')[0].split(',')[0].replace('[','')}</p>
            //     <p>{this.props.markerLocation.split('\n')[0].split(',')[1].replace(']','')}</p>
            // </div>
            <Map
                google={this.props.google}
                zoom={7}
                style={mapStyles}
                initialCenter={{ lat: 38.6, lng: 24.2 }}
            >
                {this.displayMarkers(this.props.markerLocation)}
                {/* {this.displayMarkers(10,11)} */}
                {/* <Marker position={{ lat: this.props.markerLocation.split('\n')[0].split(',')[0].replace('[',''), lng: this.props.markerLocation.split('\n')[0].split(',')[1].replace(']','')}} /> */}
            </Map>
        )

    }
}



export default GoogleApiWrapper({
    apiKey: 'AIzaSyDWbxY8wOy9rYue9YsyJAVO9VpYFqkVSZ8'
})(Maps);