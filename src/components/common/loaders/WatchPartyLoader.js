import React from "react";
import { Puff } from "react-loader-spinner";

const WatchPartyLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Puff color="white" height={50} width={50} className="m-5" />
    </div>
  );
};

export default WatchPartyLoader;
