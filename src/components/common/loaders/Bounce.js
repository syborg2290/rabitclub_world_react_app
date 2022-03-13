import React from "react";

const Bounce = (props) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="spinner-grow inline-block w-5 h-5 bg-current rounded-full animate-bounce"
        role="status"
      >
        <span className="visually-hidden"></span>
      </div>
    </div>
  );
};

export default Bounce;
