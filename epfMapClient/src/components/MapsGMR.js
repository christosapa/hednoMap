import React, { useState, useRef, useCallback, useContext } from 'react';
import useSwr from 'swr';
import { GoogleMap, LoadScriptNext, Marker, InfoWindow } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
import '@reach/combobox/styles.css';
import './MapsGMR.css';
import liveMarkerImg from '../assets/live.png';
import plannedMarkerImg from '../assets/planned.png';
import findLocationImg from '../assets/findLocation.png';
import myLocationImg from '../assets/myLocation.svg';
import searchImg from '../assets/search.png';
import searchedLocationImg from '../assets/searchedLocation.png';
import locationImg from '../assets/location.png';
import startEndTime from '../assets/start-end-time.png';
import detailsImg from '../assets/details.png';
import Login from './Login';
import Signup from './Signup';
import DataContext from '../context/DataContext';
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import axios from '../api/axios';

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

const LOCATION_URL = '/location';
const SHOW_LOCATIONS_URL = '/showLocations'
const DELETE_LOCATION_URL = '/deleteLocation'

export default function Maps() {
  // setup map
  const mapRef = useRef();
  const [mapZoom] = useState(6.8);
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

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const { successfulLogin, setSuccessfulLogin } = useContext(DataContext)

  const navigate = useNavigate();

  const login = () => {
    setShowLogin(showLogin => !showLogin)
  }

  const signup = () => {
    setShowSignup(showSignup => !showSignup)
  }

  const logOut = useLogout()

  const signOut = async () => {
    await logOut();
    navigate('/hednoMap');
    setShowLogin(true)
    setShowSignup(true)
    setSuccessfulLogin(false)
    setMyLocationMarker(null)
  }

  const [showLocations, setShowLocations] = useState(false)
  const [savedLocation, setSavedLocation] = useState('')
  const [closeButton, setCloseButton] = useState(false)

  const showLocationsTable = async () => {
    setShowLocations(showLocations => !showLocations)
    if (!showLocations) {
      try {
        const response = await axios.get(SHOW_LOCATIONS_URL, {
          withCredentials: true
        });
        setSavedLocation(response?.data.locations)
        setCloseButton(true)
      } catch (err) {
        console.log(err)
        if (!err?.response) {
          console.log('No Server Response');
        }
      }
    }
  }

  const [showMenu, setShowMenu] = useState(false)

  const showMenuState = () => {
    setShowMenu(showMenu => !showMenu)
  }

  const { menuUser } = useContext(DataContext)
  const [saveSuccessful, setSaveSuccessful] = useState(null)
  const [saveUnsuccessful, setSaveUnsuccessful] = useState(null)

  const saveLocation = async () => {
    try {
      const response = await axios.post(
        LOCATION_URL,
        JSON.stringify(myLocationMarker),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      response?.data ? setSaveSuccessful(response) : setSaveSuccessful(false)
    } catch (err) {
      setSaveSuccessful(false)
      setSaveUnsuccessful(true)
      console.log(err)
      if (!err?.response) {
        console.log('No Server Response');
      }
    }
  }

  const deleteLocation = async () => {
    try {
      const response = await axios.post(
        DELETE_LOCATION_URL,
        JSON.stringify({savedLocation}),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      // response?.data ? setSaveSuccessful(response) : setSaveSuccessful(false)
      setSavedLocation('')
      setCloseButton(false)
      setShowLocations(false)
    } catch (err) {
      // setSaveSuccessful(false)
      // setSaveUnsuccessful(true)
      console.log(err)
      if (!err?.response) {
        console.log('No Server Response');
      }
    }
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
        onClick={(event) => {
          setMyLocationMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })
        }
        }
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
            All
          </button>
        </div>

        {!successfulLogin && <div className='LogIn-container'>
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
        </div>}

        {successfulLogin && <div className='menu-container'>
          <button
            className='menu'
            onClick={showMenuState}>
            {menuUser.split('@')[0]}
          </button>
          {showMenu &&
            <button
              className='showLocations'
              onClick={showLocationsTable}>
              Locations
            </button>}
          {showMenu &&
            <button
              className='LogOut'
              onClick={signOut}>
              Log out
            </button>}
        </div>}

        {showLocations &&
          <table className='locationsTable'>
            <tbody>
              <tr>
                <td>{savedLocation}</td>
                <td>
                  {closeButton && <button
                    className='deleteLocation'
                    title='Delete location'
                    onClick={deleteLocation}>
                    x
                  </button>}
                </td>
              </tr>
            </tbody>
          </table>
        }

        {showLogin && <Login />}
        {showSignup && <Signup />}

        {myLocationMarker && <Marker
          key={0}
          position={{ lat: myLocationMarker.lat, lng: myLocationMarker.lng }}
          onClick={() => {
            setSelectedMarker(myLocationMarker)
            setSaveSuccessful(false)
            setSaveUnsuccessful(false)
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

                {successfulLogin &&
                  <button className='savePrefferedLocation'
                    title='Activate email notifications for this location'
                    onClick={saveLocation}>
                    <p>Save location</p>
                  </button>
                }

                {saveSuccessful &&
                  <span className='locationSaved'>
                    {saveSuccessful.data.success}
                    {console.log(saveSuccessful.data.success)}
                  </span>
                }

                {saveUnsuccessful &&
                  <span className='locationNotSaved'>
                    Location was not saved!
                    {console.log('not saved')}
                  </span>
                }
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
