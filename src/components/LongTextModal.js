import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const LongTextModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  return (
    <div
      className={
        "w-screen h-screen fixed bottom-2 left-0 z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      <div className="mt-10 border border-dark-brightest w-3/4 sm:w-1/2 lg:w-1/3 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex align-top justify-end">
          <IoCloseCircleOutline
            className="self-end text-white w-7 h-7 cursor-pointer"
            onClick={() => props.setShow(false)}
          />
        </div>
        <div className="mb-1 align-middle text-center text-2xl font-bold">
          Description
        </div>
        <p className="justify-center mt-3 text-sm">{props.text}</p>
      </div>
    </div>
  );
};

export default LongTextModal;
