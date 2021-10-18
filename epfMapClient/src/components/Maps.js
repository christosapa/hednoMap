import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import styles from './mystyle.module.css';

const MapButton = ({ text }) => (
    <div className={styles.table}>
        {text}
    </div>
);

class Maps extends Component {

    state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {},          // Shows the InfoWindow to the selected place upon a marker
        showBlueMarkers: true,
        showRedMarkers: true
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
        if (coords.isLive && this.state.showRedMarkers) {
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
        else if(!coords.isLive && this.state.showBlueMarkers) {
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

    buttonClicked(type) {
        if (type === 'red') {
            if(this.state.showRedMarkers){
                this.setState({showRedMarkers: false})
            }
            else{
                this.setState({showRedMarkers: true})
            }
        }
        else {
            if(this.state.showBlueMarkers){
                this.setState({showBlueMarkers: false})
            }
            else{
                this.setState({showBlueMarkers: true})
            }
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

                <MapButton
                    text={
                        <button
                            className={styles.button}
                            onClick={this.buttonClicked.bind(this, 'red')}>
                            <img src="https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png" alt=""></img>
                            <p>Live</p>
                        </button>
                    }
                />

                <MapButton
                    text={
                        <button
                            className={styles.button}
                            onClick={this.buttonClicked.bind(this, 'blue')}>
                            <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt=""></img>
                            <p>Planned</p>
                        </button>
                    }
                />


            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDWbxY8wOy9rYue9YsyJAVO9VpYFqkVSZ8'
})(Maps);