import React from "react";
import { Puff } from "react-loader-spinner";

const InitialLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Puff color="#F90716" height={50} width={200} className="m-5" />
    </div>
  );
};

export default InitialLoader;
