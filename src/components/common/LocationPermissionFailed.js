import React from "react";
import EmptyBot from "../../assets/images/bot2.png";

const LocationPermissionFailed = (props) => {
  return (
    <div className="hero container max-w-screen-lg mx-auto pb-10 pt-10">
      <img
        src={EmptyBot}
        alt=""
        className={
          "w-52 h-52 animate-bounce-slow mx-auto " +
          props.opacity +
          props.extraClasses
        }
      />
      <div
        className={
          "text-textColor-lightGray text-3xl mx-auto self-center text-center " +
          props.opacity
        }
      >
        {props.text}
      </div>
      <div className="flex justify-center align-middle text-textColor-lightGray text-base mt-5">
        (Reload browser window to edit the permission)
      </div>
    </div>
  );
};

export default LocationPermissionFailed;
