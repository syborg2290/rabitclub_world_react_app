import React from "react";
import { InfinitySpin } from "react-loader-spinner";

function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <InfinitySpin color="#F90716" height={50} width={200} className="m-5" />
    </div>
  );
}

export default Spinner;
