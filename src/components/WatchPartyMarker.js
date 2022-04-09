import React, { useState } from "react";
import { Marker } from "react-map-gl";
import MarkerWatchPartyPopup from "./MarkerWatchPartyPopup";

const WatchPartyMarker = (props) => {
  const [markerPopUp, setMarkerPopUp] = useState(false);

  return (
    <>
      {markerPopUp && (
        <MarkerWatchPartyPopup
          show={markerPopUp}
          setShow={setMarkerPopUp}
          markerData={props.data}
        />
      )}
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
          style={{
            width: props.zoom * 4,
            height: props.zoom * 4,
          }}
          className="border-2 border-backgroundColor-mainColor bg-backgroundColor-mainColor rounded-full"
        >
          <img
            src="https://img.icons8.com/ios/344/cinema-film-play.png"
            alt=""
            className="p-1 animate-spin-slow-2"
            style={{
              filter: "invert(100%)",
            }}
          />
        </div>
      </Marker>
    </>
  );
};

export default WatchPartyMarker;
