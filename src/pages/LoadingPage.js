import React from "react";
import InitialLoader from "../components/common/loaders/InitialLoader";

const LoadingPage = () => {
  return (
    <div
      className={
        "text-textColor-lightGray text-3xl mx-auto self-center text-center mt-52"
      }
    >
      <InitialLoader />
    </div>
  );
};

export default LoadingPage;
