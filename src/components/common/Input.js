import React, { memo } from "react";

const Input = (props) => {
  return (
    <input
      {...props}
      className={
        "bg-dark-brighter text-text p-2 border border-dark-brightest rounded-md block focus:outline-none " +
        props.className
      }
    />
  );
};

export default memo(Input);
