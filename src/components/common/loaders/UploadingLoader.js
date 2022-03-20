import React from "react";
import { Watch } from "react-loader-spinner";

const UploadingLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Watch color="#F90716" height={50} width={200} className="m-5" />
    </div>
  );
};

export default UploadingLoader;
