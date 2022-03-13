import React, { memo } from "react";

const Button = (props) => {
  let classNames =
    "rounded-full px-3 text-sm font-bold ";

  return <button {...props} className={classNames + props.className} />;
};

export default memo(Button);
