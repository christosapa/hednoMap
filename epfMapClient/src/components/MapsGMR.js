import React, { useState, useRef } from 'react';
import useSwr from 'swr';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './MapsGMR.css';
import liveMarkerImg from '../assets/live.png'
import plannedMarkerImg from '../assets/planned.png'
import showAllImg from '../assets/showAll.png'

const fetcher = (...args) => fetch(...args).then(response => response.json());

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const mapCenter = {
  lat: 38,
  lng: 24.4
}

const MapButton = ({ text }) => (
  <div className='table'>
    {text}
  </div>
);

export default function Maps() {
  // setup map
  const mapRef = useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  })
  const [mapZoom, setZoom] = useState(6.7);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showLiveMarkers, setLiveMarkers] = useState(true);
  const [showPlannedMarkers, setPlannedMarkers] = useState(true);

  // load and format data
  const url = 'http://localhost:9000/locationsAPI';
  const { data, error } = useSwr(url, { fetcher });
  const locations = data && !error ? data : [];

  // render map
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={{ scrollwheel: true }}
        onLoad={onMapLoad}
      >
        {locations.map((location) => {
          if (location.isLive && showLiveMarkers) {
            return (
              <Marker
                key={location.id}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={liveMarkerImg}
                animation={2}
                onClick={() => {
                  setSelectedMarker(location);
                }}
              >
                {selectedMarker === location &&
                  <InfoWindow
                    onCloseClick={() => {
                      setSelectedMarker(null);
                    }}
                  >
                    <div>
                      <h1>{selectedMarker.faultLocation}</h1>
                      <p>From: {selectedMarker.fromDateTime}</p>
                      <p>To: {selectedMarker.toDateTime}</p>
                      <p>Location: {selectedMarker.faultLocation}</p>
                      <p>Details: {selectedMarker.locationDetails}</p>
                    </div>
                  </InfoWindow>
                }
              </Marker>
            );
          }
          else if (showPlannedMarkers) {
            return (
              <Marker
                key={location.id}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={plannedMarkerImg}
                animation={2}
                onClick={() => {
                  setSelectedMarker(location);
                }}
              >
                {selectedMarker === location &&
                  <InfoWindow
                    onCloseClick={() => {
                      setSelectedMarker(null);
                    }}
                  >
                    <div>
                      <h1>{selectedMarker.faultLocation}</h1>
                      <p>From: {selectedMarker.fromDateTime}</p>
                      <p>To: {selectedMarker.toDateTime}</p>
                      <p>Location: {selectedMarker.faultLocation}</p>
                      <p>Details: {selectedMarker.locationDetails}</p>
                    </div>
                  </InfoWindow>
                }
              </Marker>
            );
          }
          else {
            return null;
          }
        })}

        <MapButton
          text={
            <button
              className='plannedButton'
              onClick={() => {
                setLiveMarkers(false);
                setPlannedMarkers(true);
              }}>
              <img src={plannedMarkerImg} alt=''></img>
              <p>Planned</p>
            </button>
          }
        />

        <MapButton
          text={
            <button
              className='liveButton'
              onClick={() => {
                setLiveMarkers(true);
                setPlannedMarkers(false);
              }}>
              <img src={liveMarkerImg} alt=''></img>
              <p>Live</p>
            </button>
          }
        />

        <MapButton
          text={
            <button
              className='showAllButton'
              onClick={() => {
                setLiveMarkers(true);
                setPlannedMarkers(true);
              }}>
              <img src={showAllImg} alt=''></img>
            </button>
          }
        />
      </GoogleMap>
    </LoadScript>
  );
}