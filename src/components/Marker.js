import React, { useContext, useEffect, useState } from "react";
import { IoLocation } from "react-icons/io5";
import { Marker } from "react-map-gl";
import NewPinModalContext from "../context/NewPinModalContext";

const MapMarker = (props) => {
  const modalContext = useContext(NewPinModalContext);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    setLatitude(modalContext.coordinates.latitude);
    setLongitude(modalContext.coordinates.longitude);
  }, [modalContext.coordinates.latitude, modalContext.coordinates.longitude]);

  return (
    <div>
      <Marker
        latitude={latitude}
        longitude={longitude}
        anchor="bottom"
        draggable={true}
        onDragEnd={(e) => {
          modalContext.setCoordinates({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
          });
          modalContext.setViewport({
            latitude: e.lngLat.lat,
            longitude: e.lngLat.lng,
            zoom: 3,
          });
        }}
      >
        <IoLocation
          color="#F90716"
          style={{ fontSize: props.viewport.zoom * 10 }}
        />
      </Marker>
    </div>
  );
};

export default MapMarker;
