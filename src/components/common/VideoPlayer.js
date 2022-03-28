import React, { useRef, useState, useCallback } from "react";
import {
  IoPauseOutline,
  IoVolumeHighOutline,
  IoVolumeMuteOutline,
} from "react-icons/io5";

const VideoPlayer = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const videoRef = useRef(null);

  const playOrPause = useCallback(() => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  const onPlay = useCallback(() => setIsPlaying(true), []);

  const onPause = useCallback(() => setIsPlaying(false), []);

  return (
    <div
      className="relative"
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      <video
        onPlay={onPlay}
        onPause={onPause}
        muted={isMute}
        ref={videoRef}
        src={props.src}
        className={props.className}
      />
      <div
        onClick={playOrPause}
        className="absolute w-10 h-10 top-24 bottom-0 left-0 right-0 mx-auto self-center text-center cursor-pointer"
      >
        {isPlaying ? (
          <IoPauseOutline
            className={`text-white ${
              isPlaying
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
              isPlaying
                ? isMouseOver
                  ? "opacity-100 w-10 h-10"
                  : "opacity-0"
                : "opacity-100 w-10 h-10 bg-black rounded-full p-1"
            }`}
          />
        )}
      </div>
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
