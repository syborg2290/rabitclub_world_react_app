import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Buffer } from "buffer";
import { gun } from "../config";

const MarkerWatchPartyPopup = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  // const [isPaused, setIsPaused] = useState(false);
  const [bufferData, setBufferData] = useState(null);

  useEffect(() => {
    gun
      .get("watch_party_segments")
      .map()
      .on((data, key) => {
        if (data) {
          if (!data.isPause) {
            const dataRe = data.dataBs4.split(",")[1];
            if (dataRe) {
              const buffer = Buffer.from(dataRe, "base64");
              if (bufferData === null) {
                setBufferData(buffer);
              } else {
                const newBuffer = Buffer.concat([bufferData, buffer]);
                setBufferData(newBuffer);
              }
            }
          } else {
            // setIsPaused(true);
          }
        }
      });
    // eslint-disable-next-line
  }, [props.markerData]);

  return (
    <div
      className={
        "w-screen h-screen fixed bottom-0 left-0 z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      <div className="mt-14 border border-dark-brightest w-3/4 sm:w-1/2 lg:w-1/4 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex align-top justify-end">
          <IoCloseCircleOutline
            className="self-end text-white w-7 h-7 cursor-pointer"
            onClick={() => props.setShow(false)}
          />
        </div>
        <div className="flex justify-center align-middle mt-5">
          <video
            src={URL.createObjectURL(new Blob([bufferData]))}
            autoPlay={true}
            className="w-full h-32"
          />
        </div>
      </div>
    </div>
  );
};

export default MarkerWatchPartyPopup;
