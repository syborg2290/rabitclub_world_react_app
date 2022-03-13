import { useContext, useEffect, useState } from "react";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapMarker from "../components/Marker";
import NewPinModalContext from "../context/NewPinModalContext";
import UtilityBox from "../components/UtilityBox";
import Spinner from "../components/common/loaders/Spinner";

const HomePage = () => {
  const modalContext = useContext(NewPinModalContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      modalContext.setViewport({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 3,
      });

      modalContext.setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-dark-brightest relative">
      {isLoading ? (
        <div className="h-screen">
          {" "}
          <Spinner />
        </div>
      ) : (
        <>
          <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            {...modalContext.viewport}
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
                zoom: 3,
              });
              // setTimeout(() => modalContext.setShow(true), 500);
            }}
          >
            {modalContext?.coordinates?.latitude &&
              modalContext?.coordinates?.longitude && (
                <MapMarker viewport={modalContext.viewport} />
              )}
          </Map>
          <UtilityBox />
        </>
      )}
    </div>
  );
};

export default HomePage;
