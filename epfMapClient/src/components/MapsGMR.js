import React, { useState, /*useRef*/ } from 'react';
import useSwr from 'swr';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
//import useSupercluster from 'use-supercluster';
import './MapsGMR.css';
import liveMarkerImg from '../assets/live.png'
import plannedMarkerImg from '../assets/planned.png'

const fetcher = (...args) => fetch(...args).then(response => response.json());

//const MarkerCluster = ({ children }) => children;

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const MapButton = ({ text }) => (
  <div className='table'>
    {text}
  </div>
);

export default function Maps() {
  // setup map
  // const mapRef = useRef();
  // const [bounds, setBounds] = useState(null);
  // const [zoom, setZoom] = useState(6.7);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showLiveMarkers, setLiveMarkers] = useState(true);
  const [showPlannedMarkers, setPlannedMarkers] = useState(true);

  // load and format data
  const url = 'http://localhost:9000/locationsAPI';
  const { data, error } = useSwr(url, { fetcher });
  const locations = data && !error ? data : [];

  // //get clusters
  // const points = locations.map(location => ({
  //   type: 'Feature',
  //   properties: { cluster: false, locationId: location.id, isLive: location.isLive },
  //   geometry: {
  //     type: 'Point',
  //     coordinates: [
  //       parseFloat(location.longitude),
  //       parseFloat(location.latitude)
  //     ]
  //   }
  // }));

  // const { clusters, supercluster } = useSupercluster({
  //   points,
  //   bounds,
  //   zoom,
  //   options: { radius: 75, maxZoom: 20 }
  // });

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
      // yesIWantToUseGoogleMapApiInternals
      // onGoogleApiLoaded={({ map }) => {
      //   mapRef.current = map;
      // }}
      // onChange={({ zoom, bounds }) => {
      //   setZoom(zoom);
      //   setBounds([
      //     bounds.nw.lng,
      //     bounds.se.lat,
      //     bounds.se.lng,
      //     bounds.nw.lat
      //   ]);
      // }}
      >
        {/* {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
            isLive: liveMarker
          } = cluster.properties;

          if (isCluster) {
            return (
              <MarkerCluster
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 50}px`,
                    height: `${10 + (pointCount / points.length) * 50}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 40);
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </MarkerCluster>
            );
          }
          if (liveMarker) {
            return (
              <Marker
                key={`location-${cluster.properties.locationId}`}
                position={{ lat: latitude, lng: longitude }}
                icon={liveMarkerImg}
                animation={2}
                onClick={() => {
                  setSelectedMarker(cluster);
                }}
              />
            );
          }
          else {
            return (
              <Marker
                key={`location-${cluster.properties.locationId}`}
                position={{ lat: latitude, lng: longitude }}
                icon={plannedMarkerImg}
                animation={2}
                onClick={() => {
                  setSelectedMarker(cluster);
                }}
              />
            );
          }
        })} */}
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
              />
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
              />
            );
          }
        })}
         {/* TODO: map recenters after every click on info window */}
        {selectedMarker &&
          <InfoWindow
            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
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

        <MapButton
          text={
            <button
              className='button'
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
              className='button'
              onClick={() => {
                setLiveMarkers(false);
                setPlannedMarkers(true);
              }}>
              <img src={plannedMarkerImg} alt=''></img>
              <p>Planned</p>
            </button>
          }
        />
        {/* TODO: align 'all' button */}
        <MapButton
          text={
            <button
              className='button'
              onClick={() => {
                setLiveMarkers(true);
                setPlannedMarkers(true);
              }}>
              <img src='http://maps.google.com/mapfiles/kml/pal4/icon57.png' alt=''></img>
              <p>All</p>
            </button>
          }
        />
      </GoogleMap>
    </LoadScript>
  );
}