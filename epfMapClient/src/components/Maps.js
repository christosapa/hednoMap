import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends Component {

    seperateCoords(Locations) {
        let coords = [];
        for (let i=0; i < Locations.split('\n').length - 1; i++) {
            coords[i] = [];
            coords[i][0] = [parseFloat(Locations.split('\n')[i].split(',')[0].replace('[', ''))]
            coords[i][1] = [parseFloat(Locations.split('\n')[i].split(',')[1].replace(']', ''))]
        }
        return coords
    }


    displayMarkers(coords) {
        console.log(coords)
        return <Marker position={{
            lat: coords[0],
            lng: coords[1]
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
                {this.seperateCoords(this.props.markerLocation).map((object, i) => this.displayMarkers(object))}
            </Map>
        )

    }
}



export default GoogleApiWrapper({
    apiKey: 'AIzaSyDWbxY8wOy9rYue9YsyJAVO9VpYFqkVSZ8'
})(Maps);