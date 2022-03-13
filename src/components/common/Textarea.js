import React, { memo } from "react";

const Textarea = (props) => {
  return (
    <textarea
      {...props}
      className={
        "bg-dark-brighter text-text p-2 border border-dark-brightest rounded-md block " +
        props.className
      }
    />
  );
};

export default memo(Textarea);
