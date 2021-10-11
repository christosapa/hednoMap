import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const MapLegend = ({ text }) => (
    <div style={{
        color: 'black',
        background: 'white',
        padding: '0px 10px',
        display: 'inline-flex',
        textAlign: 'left',
        // borderRadius: '10%',
        position: 'fixed',
        left: '5px',
        top: '590px',
        border: '0.1px solid gray'
    }}>
        {text}
    </div>
);

class Maps extends Component {

    state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    // TODO is this function needed?
    seperateCoords(Locations) {
        let coords = Locations;
        return coords
    }

    displayMarkers(coords, i) {
        console.log(coords)
        if (coords.isLive) {
            return <Marker
                key={i}
                position={{
                    lat: coords.latitude,
                    lng: coords.longitude,
                }}
                onClick={this.onMarkerClick}
                name={
                    <div>
                        <p>From: {coords.fromDateTime}</p>
                        <p>To: {coords.toDateTime}</p>
                        <p>Location: {coords.faultLocation}</p>
                        <p>Details: {coords.locationDetails}</p>
                    </div>
                }
                animation={2}
            />
        }
        else {
            return <Marker
                key={i}
                position={{
                    lat: coords.latitude,
                    lng: coords.longitude,
                }}
                onClick={this.onMarkerClick}
                name={
                    <div>
                        <p>From: {coords.fromDateTime}</p>
                        <p>To: {coords.toDateTime}</p>
                        <p>Location: {coords.faultLocation}</p>
                        <p>Details: {coords.locationDetails}</p>
                    </div>}
                icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                animation={2}
            />
        }
    }

    render() {
        if (!this.props.loaded) {
            return <div>Loading...</div>
        }
        return (
            <Map
                google={this.props.google}
                zoom={7}
                initialCenter={{ lat: 38.6, lng: 24.2 }}
            >
                {this.seperateCoords(JSON.parse(this.props.markerLocation)).map((object, i) => this.displayMarkers(object, i))}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h4>{this.state.selectedPlace.name}</h4>
                    </div>
                </InfoWindow>
                <MapLegend
                    text={<div>
                        <p>Red Markers: Live</p>
                        <p>Blue Markers: Planned</p>
                    </div>}
                />
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDWbxY8wOy9rYue9YsyJAVO9VpYFqkVSZ8'
})(Maps);