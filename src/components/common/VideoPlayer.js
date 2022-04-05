import React, { useState, useCallback } from "react";
import {
  IoPauseOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";

const VideoPlayer = (props) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isMute, setIsMute] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);

  const playOrPause = useCallback(() => {
    if (props.videoRef?.current.paused || props.videoRef?.current.ended) {
      props.videoRef?.current.play();
    } else {
      props.videoRef?.current.pause();
    }
  }, [props.videoRef]);

  // const onPlay = useCallback(() => {
  //   setIsPlaying(true);
  // }, []);

  // const onPause = useCallback(() => setIsPlaying(false), []);

  return (
    <div
      className="relative"
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      <video
        // onPlay={onPlay}
        // onPause={onPause}
        muted={isMute}
        ref={props.videoRef}
        src={props.src}
        className={props.className}
      />
      {props.videoRef.current !== null && (
        <div
          onClick={playOrPause}
          className="absolute w-10 h-10 top-1/2 left-0 right-0 m-auto cursor-pointer"
        >
          {!props.videoRef?.current.paused ? (
            <IoPauseOutline
              className={`text-white ${
                !props.videoRef?.current.paused
                  ? isMouseOver
                    ? "opacity-100 w-10 h-10 bg-black rounded-full p-1"
                    : "opacity-0"
                  : "opacity-100 w-10 h-10"
              }`}
            />
          ) : (
            <img
              src={require("../../assets/images/play.png")}
              alt=""
              className={`${
                !props.videoRef?.current.paused
                  ? isMouseOver
                    ? "opacity-100 w-10 h-10"
                    : "opacity-0"
                  : "opacity-100 w-10 h-10 bg-black rounded-full p-1"
              }`}
            />
          )}
        </div>
      )}
      <div
        className="absolute cursor-pointer p-1 right-3 bottom-3 bg-black opacity-75 rounded-full"
        onClick={() => setIsMute(!isMute)}
      >
        {isMute ? (
          <IoVolumeMuteOutline className="text-white w-5 h-5" />
        ) : (
          <IoVolumeHighOutline className="text-white w-5 h-5" />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
