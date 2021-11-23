import React, { useState, useRef } from 'react';
import useSwr from 'swr';
import { GoogleMap, LoadScript, Marker, InfoWindow, InfoBox } from '@react-google-maps/api';
import useSupercluster from 'use-supercluster';
import './MapsGMR.css';
import liveMarkerImg from '../assets/live.png'
import plannedMarkerImg from '../assets/planned.png'
import { drop } from 'lodash';

const fetcher = (...args) => fetch(...args).then(response => response.json());

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

export default function Maps() {
  // setup map
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(6.7);
  const [selectedMarker, setSelectedMarker] = useState(null);

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
        center={{ lat: 38, lng: 24.4 }}
        zoom={6.7}
        options={{ scrollwheel: true }}
      >
        {locations.map((location) => {
          console.log(location)
          if (location.isLive) {
            return (
              <Marker
                key={location.id}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={liveMarkerImg}
                animation={2}
                onClick={() => {
                  setSelectedMarker(location);
                }}
              />
            );
          }
          else {
            return (
              <Marker
                key={location.id}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={plannedMarkerImg}
                animation={2}
                onClick={() => {
                  setSelectedMarker(location);
                }}
              />
            );
          }
        })}

        {selectedMarker &&
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div>
              <h1>InfoWindow</h1>
            </div>
          </InfoWindow>}
      </GoogleMap>
    </LoadScript>
  );
}