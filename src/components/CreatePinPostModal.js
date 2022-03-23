import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const CreatePinPostModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";

  return (
    <div
      className={
        "w-screen h-screen fixed top-0 left-0 z-20 flex " + visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="border border-dark-brightest w-3/4 sm:w-1/2 lg:w-2/4 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex align-top justify-end">
          <IoCloseCircleOutline
            className="self-end text-white w-7 h-7 cursor-pointer"
            onClick={() => {
              props.setMediaList([]);
              props.setShow(false);
            }}
          />
        </div>
        <div className="flex justify-center align-middle text-white text-2xl">
          Create Your Post
        </div>
        <div
          className="mt-5 mb-2 flex overflow-x-scroll justify-center align-middle"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          {props?.mediaList.map((each, index) => (
            <img
              key={index}
              src={each}
              alt=""
              className="w-60 h-60 rounded-md ml-1 mr-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePinPostModal;
