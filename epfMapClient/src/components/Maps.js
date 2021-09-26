import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends Component {

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={7}
                style={mapStyles}
                initialCenter={{ lat: 38.6, lng: 24.2 }}
            >
                <Marker position={{ lat: this.props.markerLocation.split(',')[0].replace('[', ''), lng: this.props.markerLocation.split(',')[1].replace(']', '') }} />
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDWbxY8wOy9rYue9YsyJAVO9VpYFqkVSZ8'
})(Maps);