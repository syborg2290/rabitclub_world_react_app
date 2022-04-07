import React from "react";
import { Watch } from "react-loader-spinner";

const UploadingLoader = (props) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Watch color="#F90716" height={50} width={200} className="m-5" />
      {props?.text && (
        <span className="text-white text-4xl justify-center opacity-50">
          {props.text}
        </span>
      )}
    </div>
  );
};

export default UploadingLoader;
