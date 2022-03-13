import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewPinModalContext from "../context/NewPinModalContext";
import Input from "./common/Input";

const UtilityBox = (props) => {
  const navigate = useNavigate();
  const modalContext = useContext(NewPinModalContext);
  const [currentLat, setLatitude] = useState(0);
  const [currentLng, setLongitude] = useState(0);
  useEffect(() => {
    setLatitude(modalContext.coordinates.latitude);
    setLongitude(modalContext.coordinates.longitude);
  }, [modalContext.coordinates.latitude, modalContext.coordinates.longitude]);

  return (
    <div className="bg-dark mx-4 absolute z-1 top-10 right-0 w-2/7 h-2/3 rounded-md">
      <div className="border border-dark-brightest p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <h1 className="text-xl mb-5">Current coordinates</h1>
        <label>
          <span className="text-textColor-lightGray text-sm">Latitude:</span>
          <Input
            type="text"
            className="mb-3 w-full text-sm border-none"
            value={currentLat}
            readOnly={true}
          />
        </label>
        <label>
          <span className="text-textColor-lightGray text-sm">Longitude:</span>
          <Input
            type="text"
            className="mb-3 w-full text-sm border-none"
            value={currentLng}
            readOnly={true}
          />
        </label>
        <div className="flex">
          <button
            type="button"
            className="bg-backgroundColor-mainColor text-white font-bold p-1 rounded-full w-28 outline-none mr-2"
            onClick={(e) => {
              navigator.geolocation.getCurrentPosition(function (position) {
                modalContext.setCoordinates({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              });
            }}
          >
            Reset
          </button>
          <button
            type="button"
            className="bg-backgroundColor-mainColor text-white font-bold p-1 rounded-full w-28 outline-none"
            onClick={(e) => {
              e.preventDefault();
              navigate("/new-location/", {
                state: {
                  latitude: currentLat,
                  longitude: currentLng,
                },
              });
            }}
          >
            Create Pin
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilityBox;
