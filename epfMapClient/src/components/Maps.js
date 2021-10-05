import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends Component {

    // TODO is this function needed?
    seperateCoords(Locations) {
        let coords = Locations;
        return coords
    }

    displayMarkers(coords) {
        return <Marker position={{
            lat: coords.latitude,
            lng: coords.longitude
        }} />
    }

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={7}
                style={mapStyles}
                initialCenter={{ lat: 38.6, lng: 24.2 }}
            >
                {this.seperateCoords(JSON.parse(this.props.markerLocation)).map((object, i) => this.displayMarkers(object))}
            </Map>
        )

    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDWbxY8wOy9rYue9YsyJAVO9VpYFqkVSZ8'
})(Maps);