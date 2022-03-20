import React from "react";
import { Plane } from "react-loader-spinner";

const PlaneLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Plane color="#F90716" height={50} width={200} className="m-5" />
    </div>
  );
};

export default PlaneLoader;
