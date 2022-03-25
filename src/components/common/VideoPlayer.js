import React, { useRef, useState, useCallback } from "react";
import { IoPauseOutline } from "react-icons/io5";

const VideoPlayer = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
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
        ref={videoRef}
        src={props.src}
        className={props.className}
      />
      <div
        className="absolute flex top-24 bottom-0 left-0 right-0 justify-center self-center cursor-pointer"
        onClick={playOrPause}
      >
        {isPlaying ? (
          <IoPauseOutline
            className={`${
              isPlaying
                ? isMouseOver
                  ? "opacity-100 w-10 h-10"
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
                : "opacity-100 w-10 h-10"
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
