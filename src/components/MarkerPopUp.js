import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { categories } from "../utils/categories";
import LazyLoadingImage from "./LazyLoadingImage";

const MarkerPopUp = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";

  return (
    <div
      className={
        "w-screen h-screen fixed left-0 z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      <div className="border border-dark-brightest w-3/4 sm:w-1/2 lg:w-1/4 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex align-top justify-end">
          <IoCloseCircleOutline
            className="self-end text-white w-7 h-7 cursor-pointer"
            onClick={() => props.setShow(false)}
          />
        </div>
        <h1 className="text-2xl mb-1 align-middle text-center">
          {props.markerData?.nameOfPin}
        </h1>
        <div className="flex justify-center align-middle">
          <img
            src={
              categories.find((e) => e.name === props.markerData?.category).icon
            }
            alt=""
            className="w-6 h-6 mr-2 mb-1"
            style={{
              filter: "invert(100%)",
            }}
          />
          <span className="mt-1">{props.markerData?.category}</span>
        </div>
        <div className="flex justify-center align-middle mt-5">
          <LazyLoadingImage
            image={props.markerData?.pinImage}
            className="h-full w-full rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default MarkerPopUp;
