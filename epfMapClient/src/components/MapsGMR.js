import React, { useState, useRef } from 'react';
import useSwr from 'swr';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import './MapsGMR.css';
import liveMarkerImg from '../assets/live.png'
import plannedMarkerImg from '../assets/planned.png'

const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({ children }) => children;

export default function Maps() {
  // setup map
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(6.7);

  // load and format data
  const url = 'http://localhost:9000/locationsAPI';
  const { data, error } = useSwr(url, { fetcher });
  const locations = data && !error ? data : [];
  //liveLocations=...
  //plannedLocations=...

  //get clusters
  const points = locations.map(location => ({
    type: 'Feature',
    properties: { cluster: false, locationId: location.id, isLive: location.isLive },
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(location.longitude),
        parseFloat(location.latitude)
      ]
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  // render map
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
        defaultCenter={{ lat: 38, lng: 24.4 }}
        defaultZoom={6.7}
        options={{ scrollwheel: true }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);
        }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
            isLive: liveMarker
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
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
              </Marker>
            );
          }
          if (liveMarker) {
            return (
              <Marker
                key={`location-${cluster.properties.locationId}`}
                lat={latitude}
                lng={longitude}
              >
                <button className="marker">
                  <img src={liveMarkerImg} alt="liveMarker" />
                </button>
              </Marker>
            );
          }
          else {
            return (
              <Marker
                key={`location-${cluster.properties.locationId}`}
                lat={latitude}
                lng={longitude}
              >
                <button className="marker">
                  <img src={plannedMarkerImg} alt="plannedMarker" />
                </button>
              </Marker>
            );
          }
        })}
      </GoogleMapReact>
    </div>
  );
}