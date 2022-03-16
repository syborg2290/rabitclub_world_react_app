import React from "react";
import Empty from "../components/common/Empty";

const NoInternetConnectionPage = () => {
  return (
    <div className="bg-dark h-screen">
      <Empty
        text="Oops.., Check your internet connection!"
        opacity="opacity-30 "
        extraClasses="mt-10"
      />
    </div>
  );
};

export default NoInternetConnectionPage;
