import React, { useState, useRef, useCallback } from 'react';
import useSwr from 'swr';
import { GoogleMap, LoadScriptNext, Marker, InfoWindow } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import './MapsGMR.css';
import liveMarkerImg from '../assets/live.png'
import plannedMarkerImg from '../assets/planned.png'
import showAllImg from '../assets/showAll.png'
import myLocationImg from '../assets/myLocation.png'

const fetcher = (...args) => fetch(...args).then(response => response.json());

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const mapCenter = {
  lat: 38,
  lng: 24.4
};

const MapButton = ({ text }) => (
  <div>
    {text}
  </div>
);

const libraries = ['places'];

export default function Maps() {
  // setup map
  const mapRef = useRef();
  const [mapZoom, setZoom] = useState(6.8);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, [])
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, [])
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showLiveMarkers, setLiveMarkers] = useState(true);
  const [showPlannedMarkers, setPlannedMarkers] = useState(true);

  // load and format data
  const url = 'http://localhost:9000/locationsAPI';
  const { data, error } = useSwr(url, { fetcher });
  const locations = data && !error ? data : [];

  // render map
  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      libraries={libraries}
    >
      <Search panTo={panTo} />
      <Locate panTo={panTo} />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        options={{
          scrollwheel: true,
          disableDefaultUI: true
        }}
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
                      <h2>{selectedMarker.faultLocation}</h2>
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
    </LoadScriptNext>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="myLocation"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src={myLocationImg} alt="Find me" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 38, lng: () => 24.4 },
      radius: 500 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="searchBox">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search location and report event..."
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
