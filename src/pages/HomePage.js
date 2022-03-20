import { useContext, useEffect, useState } from "react";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapMarker from "../components/Marker";
import NewPinModalContext from "../context/NewPinModalContext";
import UtilityBox from "../components/UtilityBox";
import { gun } from "../config";
import PinMarker from "../components/PinMarker";
import Empty from "../components/common/Empty";
import PlaneLoader from "../components/common/loaders/PlaneLoader";

const HomePage = () => {
  const modalContext = useContext(NewPinModalContext);
  const [isLoading, setIsLoading] = useState(true);
  const [blockLocation, setBlockLocation] = useState(false);
  const [allPins, setAllPins] = useState([]);

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

  const getCurrentPosition = () => {
    try {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          modalContext.setViewport({
            latitude: position ? position.coords.latitude : 20.5937,
            longitude: position ? position.coords.longitude : 78.9629,
            zoom: 12,
          });

          modalContext.setCoordinates({
            latitude: position ? position.coords.latitude : 20.5937,
            longitude: position ? position.coords.longitude : 78.9629,
          });
          setIsLoading(false);
        },
        function (error) {
          setBlockLocation(true);
          setIsLoading(false);
        }
      );
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
            text="Sorry, we need to get your current location!"
            opacity="opacity-50 "
            extraClasses="mt-10"
          />
        </>
      ) : (
        <>
          <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            {...modalContext.viewport}
            minZoom={8}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/kasunthaksala/cl0nobhzo001a15ofqt7b89mk"
            onMove={(evt) => modalContext.setViewport(evt.viewState)}
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
                  viewport={modalContext.viewport}
                />
              );
            })}
          </Map>
          <UtilityBox />
        </>
      )}
    </div>
  );
};

export default HomePage;
