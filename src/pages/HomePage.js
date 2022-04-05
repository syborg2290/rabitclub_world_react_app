import { useContext, useEffect, useState } from "react";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapMarker from "../components/Marker";
import NewPinModalContext from "../context/NewPinModalContext";
import UtilityBox from "../components/UtilityBox";
import { gun } from "../config";
import PinMarker from "../components/PinMarker";
import WatchPartyMarker from "../components/WatchPartyMarker";
import Empty from "../components/common/Empty";
import PlaneLoader from "../components/common/loaders/PlaneLoader";

const HomePage = () => {
  const modalContext = useContext(NewPinModalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [blockLocation, setBlockLocation] = useState(false);
  const [allPins, setAllPins] = useState([]);
  const [allWatchParties, setAllWatchParties] = useState([]);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    getAllPins();
    getAllWatchParties();
    getCurrentPosition();
    // eslint-disable-next-line
  }, []);

  const getAllPins = () => {
    try {
      gun
        .get("pins")
        .map()
        .on((data, key) => {
          if (allPins.filter((e) => e.key === key).length <= 0) {
            allPins.push({
              key: key,
              data: data,
            });
            setAllPins([...allPins]);
          }
        });
    } catch (error) {
      console.debug(error);
    }
  };

  const getAllWatchParties = () => {
    try {
      gun
        .get("watch_parties")
        .map()
        .on((data, key) => {
          if (data.status === "live") {
            if (
              allWatchParties.filter((e) => e.data._id === data._id).length <= 0
            ) {
              allWatchParties.push({
                key: key,
                data: data,
              });
              setAllWatchParties([...allWatchParties]);
            }
          }
        });
    } catch (error) {
      console.debug(error);
    }
  };

  const getCurrentPosition = () => {
    try {
      if (
        modalContext?.coordinates?.latitude &&
        modalContext?.coordinates?.longitude
      ) {
        setIsLoading(false);
      } else {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            modalContext.setViewport({
              latitude: position ? position?.coords?.latitude : 20.5937,
              longitude: position ? position?.coords?.longitude : 78.9629,
              zoom: 12,
            });

            modalContext.setCoordinates({
              latitude: position ? position?.coords?.latitude : 20.5937,
              longitude: position ? position?.coords?.longitude : 78.9629,
            });
            setIsLoading(false);
          },
          function (error) {
            setBlockLocation(true);
            setIsLoading(false);
          }
        );
      }
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <div className="bg-dark-brightest relative">
      {isLoading ? (
        <div className="h-screen">
          {" "}
          <PlaneLoader />
        </div>
      ) : blockLocation ? (
        <>
          <Empty
            text="Sorry, you have to allow current location permission!"
            opacity="opacity-50 "
            extraClasses="mt-10"
          />
        </>
      ) : (
        <>
          {modalContext.viewport && (
            <Map
              mapboxAccessToken={process.env.REACT_APP_MAPBOX}
              {...modalContext.viewport}
              minZoom={8}
              style={{ width: "100vw", height: "100vh" }}
              mapStyle="mapbox://styles/kasunthaksala/cl0nobhzo001a15ofqt7b89mk"
              onMove={(evt) => modalContext.setViewport(evt.viewState)}
              onZoom={(e) => {
                setZoom(e.viewState.zoom);
              }}
              onClick={(e) => {
                e.preventDefault();
                modalContext.setCoordinates({
                  latitude: e.lngLat.lat,
                  longitude: e.lngLat.lng,
                });
                modalContext.setViewport({
                  latitude: e.lngLat.lat,
                  longitude: e.lngLat.lng,
                  // zoom: 12,
                });
                // setTimeout(() => modalContext.setShow(true), 500);
              }}
            >
              {modalContext?.coordinates?.latitude &&
                modalContext?.coordinates?.longitude && (
                  <MapMarker viewport={modalContext.viewport} />
                )}
              {allPins.map((each) => {
                return (
                  <PinMarker
                    key={each.data._id}
                    category={each.data.category}
                    pinData={each.data}
                    latitude={each.data.latitude}
                    longitude={each.data.longitude}
                    zoom={zoom}
                  />
                );
              })}
              {allWatchParties.map((each) => {
                return (
                  <WatchPartyMarker
                    key={each.data._id}
                    latitude={each.data.latitude}
                    longitude={each.data.longitude}
                    zoom={zoom}
                  />
                );
              })}
            </Map>
          )}
          {modalContext.viewport && <UtilityBox />}
        </>
      )}
    </div>
  );
};

export default HomePage;
