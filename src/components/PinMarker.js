import React, { useState } from "react";
import { Marker } from "react-map-gl";
import { pinCategories } from "../utils/categories";
import MarkerPopUp from "./MarkerPopUp";

const PinMarker = (props) => {
  const [markerPopUp, setMarkerPopUp] = useState(false);

  return (
    <div>
      {markerPopUp ? (
        <MarkerPopUp
          show={markerPopUp}
          setShow={setMarkerPopUp}
          markerData={props.pinData}
        />
      ) : null}
      <Marker
        latitude={props.latitude}
        longitude={props.longitude}
        anchor="bottom"
        draggable={false}
        style={{
          cursor: "pointer",
        }}
      >
        <div
          onMouseOver={() => {
            setTimeout(() => {
              setMarkerPopUp(true);
            }, 500);
          }}
          // onMouseOut={() => {
          //   setTimeout(() => {
          //     setMarkerPopUp(false);
          //   }, 500);
          // }}
          style={{
            width: props.zoom * 4,
            height: props.zoom * 4,
          }}
          className="border-2 border-backgroundColor-mainColor bg-backgroundColor-mainColor rounded-full"
        >
          <img
            src={pinCategories.find((e) => e.name === props.category).icon}
            alt=""
            className="p-1"
            style={{
              filter: "invert(100%)",
            }}
          />
        </div>
      </Marker>
    </div>
  );
};

export default PinMarker;
