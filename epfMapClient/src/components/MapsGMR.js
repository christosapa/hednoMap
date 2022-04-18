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
import findLocationImg from '../assets/findLocation.png'
import myLocationImg from '../assets/myLocation.svg'
import searchImg from '../assets/search.png'
import searchedLocationImg from '../assets/searchedLocation.png'
import locationImg from '../assets/location.png'
import startEndTime from '../assets/start-end-time.png'
import detailsImg from '../assets/details.png'
import Login from './Login';
import { useNavigate } from 'react-router-dom';

// fetch and format data from API
const fetcher = (...args) => fetch(...args).then(response => response.json());

// map style
const containerStyle = {
  width: '100vw',
  height: '100vh'
};

const mapCenter = {
  lat: 38,
  lng: 24.4
};

const libraries = ['places'];

export default function Maps() {
  // setup map
  const mapRef = useRef();
  const [mapZoom, setZoom] = useState(6.8);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, [])
  const [myLocationMarker, setMyLocationMarker] = useState(null)
  const panTo = useCallback(({ lat, lng, isMyLocation }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
    setMyLocationMarker({ lat, lng, isMyLocation })
  }, [])
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showLiveMarkers, setLiveMarkers] = useState(true);
  const [showPlannedMarkers, setPlannedMarkers] = useState(true);


  // load and format data
  const url = 'http://localhost:9000/locationsAPI';
  const { data, error } = useSwr(url, { fetcher });
  const locations = data && !error ? data : [];

  const navigate = useNavigate()
  const login = () => {
    navigate('/hednoMap/login')
  }
  const signup = () => {
    navigate('/hednoMap/signup')
  }

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
                    <div className='info-window'>
                      <h1>Live Power Outage</h1>
                      <div className='img-txt'>
                        <img src={startEndTime} alt='time' />
                        {selectedMarker.fromDateTime} - {selectedMarker.toDateTime}
                      </div>
                      <div className='img-txt'><img src={locationImg} alt='location' />{selectedMarker.faultLocation}</div>
                      <div className='img-txt'><img src={detailsImg} alt='details' />{selectedMarker.locationDetails}</div>
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
                    <div className='info-window'>
                      <h1>Planned Power Outage</h1>
                      <div className='img-txt'>
                        <img src={startEndTime} alt='time' />
                        {selectedMarker.fromDateTime} - {selectedMarker.toDateTime}
                      </div>
                      <div className='img-txt'><img src={locationImg} alt='location' />{selectedMarker.faultLocation}</div>
                      <div className='img-txt'><img src={detailsImg} alt='details' />{selectedMarker.locationDetails}</div>
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

        <div className='filter-container'>
          <button
            className='liveButton'
            onClick={() => {
              setLiveMarkers(true);
              setPlannedMarkers(false);
            }}>
            <img src={liveMarkerImg} alt=''></img>
            Live
          </button>

          <button
            className='plannedButton'
            onClick={() => {
              setLiveMarkers(false);
              setPlannedMarkers(true);
            }}>
            <img src={plannedMarkerImg} alt=''></img>
            Planned
          </button>

          <button
            className='showAllButton'
            onClick={() => {
              setLiveMarkers(true);
              setPlannedMarkers(true);
            }}>
            <img src={showAllImg} alt=''></img>
          </button>
        </div>

        <div className='LogIn-container'>
          <button
            className='LogIn'
            onClick={login}>
            Log in
          </button>

          <button
            className='SignUp'
            onClick={signup}>
            Sign up
          </button>
        </div>

        {myLocationMarker && <Marker
          key={0}
          position={{ lat: myLocationMarker.lat, lng: myLocationMarker.lng }}
          onClick={() => {
            setSelectedMarker(myLocationMarker)
          }}
          icon={myLocationMarker.isMyLocation ? myLocationImg : searchedLocationImg}
          animation={2}
        >
          {selectedMarker === myLocationMarker &&
            <InfoWindow
              onCloseClick={() => {
                setSelectedMarker(null);
              }}
            >
              <div className='report-container'>
                <h2>Report Power Outage</h2>
                <button className='reportPowerOutage'
                  onClick={() => {
                    window.open("https://apps.deddie.gr/PowerCutReportWebapp/powercutreport.html", "_blank");
                  }}>
                  <p>Report a power outage</p>
                </button>
                <button className='reportNetworkHazard'
                  onClick={() => {
                    window.open("https://apps.deddie.gr/PowerCutReportWebapp/networkhazardreport.html", "_blank");
                  }}>
                  <p>Report a network hazard</p>
                </button>
                <button className='cancelReport'
                  onClick={() => {
                    window.open("https://apps.deddie.gr/PowerCutReportWebapp/powercutrecall.html", "_blank");
                  }}>
                  <p>Cancel report</p>
                </button>
              </div>
            </InfoWindow>
          }
        </Marker>}
      </GoogleMap>
    </LoadScriptNext >
  );
}

function Locate({ panTo }) {

  const handleInput = (position) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isMyLocation: true,
        });
      },
      () => null
    );
  }

  return (
    <button
      className="findLocationButton"
      onClick={handleInput}
    >
      <img src={findLocationImg} alt="Find me" />
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
    <div className='searchBox'>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search location.."
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
      <span className='searchImgButton'>
        <img src={searchImg} alt='search' />
      </span>
    </div>
  );
}
