import React from "react";
import EmptyBot from "../assets/images/bot2.png";
import InitialLoader from "../components/common/loaders/InitialLoader";

const LoadingPage = () => {
  return (
    <div
      className={
        "text-textColor-lightGray text-3xl mx-auto self-center text-center mt-52"
      }
    >
      <img
        src={EmptyBot}
        alt=""
        className={"w-52 h-52 animate-bounce-slow mx-auto opacity-60"}
      />
      <div
        className={
          "text-textColor-lightGray text-3xl mx-auto self-center text-center opacity-60 mb-2"
        }
      >
        Fetching data...
      </div>
      <InitialLoader />
    </div>
  );
};

export default LoadingPage;
