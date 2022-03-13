import React, { useContext, useEffect, useState } from "react";
import ClickOutHandler from "react-clickout-handler";
import NewPinModalContext from "../context/NewPinModalContext";
import Input from "./common/Input";

const NewPinModal = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const modalContext = useContext(NewPinModalContext);
  const visibleClass = modalContext.show !== false ? "block" : "hidden";

  useEffect(() => {
    setLatitude(modalContext.coordinates.latitude);
    setLongitude(modalContext.coordinates.longitude);
  }, [modalContext.coordinates.latitude, modalContext.coordinates.longitude]);

  return (
    <div
      className={
        "w-screen h-screen fixed top-0 left-0 z-20 flex " + visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <ClickOutHandler
        onClickOut={() => {
          modalContext.setShow(false);
        }}
      >
        <div className="border border-dark-brightest w-3/4 sm:w-1/2 lg:w-1/4 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
          <h1 className="text-xl mb-5">Selected coordinates</h1>

          <label>
            <span className="text-textColor-lightGray text-sm">Latitude:</span>
            <Input
              type="text"
              className="mb-3 w-full text-sm"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </label>
          <label>
            <span className="text-textColor-lightGray text-sm">Longitude:</span>
            <Input
              type="text"
              className="mb-3 w-full text-sm"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </label>
        </div>
      </ClickOutHandler>
    </div>
  );
};

export default NewPinModal;
