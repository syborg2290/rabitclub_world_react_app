import { useContext, useEffect, useState } from "react";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapMarker from "../components/Marker";
import NewPinModalContext from "../context/NewPinModalContext";
import UtilityBox from "../components/UtilityBox";
import { gun } from "../config";
import PinMarker from "../components/PinMarker";
import PlaneLoader from "../components/common/loaders/PlaneLoader";
import LocationPermissionFailed from "../components/common/LocationPermissionFailed";
import { IoAppsOutline } from "react-icons/io5";

const HomePage = () => {
  const modalContext = useContext(NewPinModalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [blockLocation, setBlockLocation] = useState(false);
  const [utilityBoxShow, setUtilityBoxShow] = useState(true);
  const [allPins, setAllPins] = useState([]);
  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    getAllPins();
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

  // const getAllWatchParties = () => {
  //   try {
  //     gun
  //       .get("watch_parties")
  //       .map()
  //       .on((data, key) => {

  //           if (
  //             allWatchParties.filter((e) => e.data._id === data._id).length <= 0 && data!==null
  //           ) {
  //             allWatchParties.push({
  //               key: key,
  //               data: data,
  //             });
  //             setAllWatchParties([...allWatchParties]);
  //           }

  //       });
  //   } catch (error) {
  //     console.debug(error);
  //   }
  // };

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
          <LocationPermissionFailed
            text="Sorry, you have to allow your current location permission!"
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
            </Map>
          )}
          {!utilityBoxShow && (
            <div
              className="bg-dark rounded-full p-2 hover:opacity-70 absolute z-1 top-10 right-0 mr-2"
              onClick={() => setUtilityBoxShow(true)}
            >
              <IoAppsOutline className="w-8 h-8 text-white" />
            </div>
          )}
          {utilityBoxShow && modalContext.viewport && (
            <UtilityBox setShow={setUtilityBoxShow} show={utilityBoxShow} />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
