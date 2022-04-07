import React from "react";

const AlertBox = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  return (
    <div
      className={
        "w-screen h-screen fixed top-0 bottom-2 left-0 z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      <div className="mt-10 flex flex-col border border-dark-brightest w-2/5 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex justify-center align-middle text-white text-md">
          {props.alertText}
        </div>
        <div className="flex justify-center align-middle text-textColor-lightGray text-sm">
          (Reload browser window to edit the permission)
        </div>
        <button
          type="button"
          className="bg-backgroundColor-mainColor hover:opacity-75 w-full text-white font-semibold p-1 mt-5 rounded-md outline-none"
          onClick={() => {
            props.setShow(false);
          }}
        >
          {"Okay"}
        </button>
      </div>
    </div>
  );
};

export default AlertBox;
