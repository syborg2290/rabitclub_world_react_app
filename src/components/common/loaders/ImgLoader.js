import React from "react";
import { Triangle } from "react-loader-spinner";

const ImgLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Triangle color="#F90716" height={50} width={200} className="m-5" />
    </div>
  );
};

export default ImgLoader;
