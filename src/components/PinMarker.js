import React from "react";
import { Marker } from "react-map-gl";
import { categories } from "../utils/categories";

const PinMarker = (props) => {
  return (
    <div>
      <Marker
        latitude={props.latitude}
        longitude={props.longitude}
        anchor="bottom"
        draggable={false}
      >
        <div
          style={{
            width: props.viewport.zoom * 5,
            height: props.viewport.zoom * 5,
          }}
          className="border-2 border-backgroundColor-mainColor bg-backgroundColor-mainColor rounded-full hover:cursor-pointer"
        >
          <img
            src={categories.find((e) => e.name === props.category).icon}
            alt="pin_maker"
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
