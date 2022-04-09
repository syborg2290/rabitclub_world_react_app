import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import InitialLoader from "../components/common/loaders/InitialLoader";
import { gun } from "../config";
import VideoPlayer from "../components/common/VideoPlayer";
import {
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { getCurrentDateService } from "../services/utils";
import WatchPartyLoader from "../components/common/loaders/WatchPartyLoader";

const WatchPartyControlPage = () => {
  const scrollbar = useRef(null);
  const currentVideoPlay = useRef(null);
  const location = useLocation();
  const [isLoading, setSetIsLoading] = useState(true);
  const [isStartedWatchParty, setSetIsStartedWatchParty] = useState(false);
  const [watchpartyLoading, setSetWatchpartyLoading] = useState(false);
  const [isVideoPause, setIsVideoPause] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    setVideoFiles(location.state.videos);
    setCurrentVideo({ index: 0, file: location.state.videos[0] });
    setSetIsLoading(false);
  }, [location.state.videos]);

  const createWatchParty = async () => {
    setSetWatchpartyLoading(true);
    gun.get("watch_parties").set(location.state.watchpartyObj);
    currentVideoPlay.current.load();
    currentVideoPlay.current.play();
    setSetIsStartedWatchParty(true);
    setSetWatchpartyLoading(false);
  };

  const selectVideos = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      for (var i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].size < 2147483648) {
          videoFiles.push(e.target.files[i]);
          setVideoFiles([...videoFiles]);
        }
      }
    }
  };

  const streamingVideo = async () => {
    try {
      const currentVideoSize = currentVideo.file.size;
      const sizePerSecond =
        currentVideoSize / currentVideoPlay.current.duration;

      const currentSeconds = currentVideoPlay.current.currentTime;

      const start = sizePerSecond * currentSeconds;
      const end = sizePerSecond * (currentSeconds + 1);

      const reader = new FileReader();
      const chunk = currentVideo.file.slice(start, end, "video/mp4");
      reader.readAsDataURL(chunk);
      reader.onload = async (e) => {
        const dateRes = await getCurrentDateService();
        if (dateRes) {
          setTimeout(function () {
            gun
              .get("watch_party_segments")
              .get(location.state.watchpartyId)
              .put({
                lastUpdate: new Date(dateRes).toDateString(),
                isPause: isVideoPause,
                dataBs4: isVideoPause ? null : e.target.result.toString(),
              });
          }, 1000);
        }
      };
    } catch (error) {
      console.debug(error);
    }
  };

  const endWatchParty = async () => {
    setSetWatchpartyLoading(true);

    setSetIsStartedWatchParty(false);

    gun.get("watch_parties").get(location.state.watchpartyId).put(null);
    gun.get("watch_party_segments").get(location.state.watchpartyId).put(null);

    setSetWatchpartyLoading(false);
  };

  const onPlay = useCallback(() => setIsVideoPause(false), []);

  const onPause = useCallback(() => setIsVideoPause(true), []);

  return (
    <div
      className={`px-5 pt-5 bg-dark mx-5 my-5 rounded-md ${
        videoFiles.length > 1 ? "pb-16" : "pb-0"
      }`}
    >
      {isLoading ? (
        <div className="mx-auto self-center text-center my-20">
          <InitialLoader />
          <span className="text-white text-4xl justify-center opacity-50">
            Processing...
          </span>
          <div className="text-textColor-lightGray text-md justify-center mt-10 opacity-90">
            Please wait a moment, this will take some time.
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="w-2/3 h-screen">
            <span className="text-white font-bold text-sm my-1 flex justify-center align-middle">
              {currentVideo.file.name.replace(/\.[^/.]+$/, "")}
            </span>
            {
              <div className="relative rounded-md">
                <video
                  src={URL.createObjectURL(currentVideo.file)}
                  controls={true}
                  // autoPlay={true}
                  loop={true}
                  className="object-cover w-full h-96 rounded-md"
                  disablePictureInPicture={true}
                  ref={currentVideoPlay}
                  onPause={isStartedWatchParty ? onPause : null}
                  onPlay={isStartedWatchParty ? onPlay : null}
                  onTimeUpdate={
                    !isStartedWatchParty
                      ? () => null
                      : (e) => {
                          streamingVideo();
                        }
                  }
                />
              </div>
            }
            <div className="flex">
              {videoFiles.length > 2 && (
                <IoChevronBackOutline
                  className="text-white mt-5 justify-center self-center cursor-pointer w-5 h-5"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollbar.current.scrollLeft -= 20;
                  }}
                />
              )}
              {videoFiles.length >= 2 && (
                <div
                  className={`mt-3 flex overflow-x-scroll overflow-y-hidden w-full cursor-pointer ${
                    videoFiles.length >= 2 ? "" : "justify-center self-center"
                  }`}
                  style={{
                    scrollbarWidth: "none",
                  }}
                  ref={scrollbar}
                >
                  {videoFiles.map((each, index) => {
                    if (index === currentVideo.index) {
                      // eslint-disable-next-line
                      return;
                    } else {
                      return (
                        <div
                          className="relative ml-2 mr-2 w-36 h-36 max-w-xs"
                          key={index}
                        >
                          <div
                            onClick={
                              watchpartyLoading
                                ? () => null
                                : () => {
                                    setCurrentVideo({
                                      index: index,
                                      file: each,
                                    });
                                  }
                            }
                          >
                            <VideoPlayer
                              src={URL.createObjectURL(each)}
                              className="object-cover w-36 h-36 max-w-xs rounded-md self-center"
                            />
                          </div>
                          {!isStartedWatchParty && (
                            <button
                              type="button"
                              onClick={() => {
                                videoFiles.splice(index, 1);
                                setVideoFiles([...videoFiles]);
                              }}
                              className="absolute bottom-3 left-3 p-2 rounded-full opacity-75 bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                            >
                              <IoTrashBinOutline className="text-white" />
                            </button>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              )}
              {videoFiles.length > 2 && (
                <IoChevronForwardOutline
                  className="text-white mt-5 justify-center self-center cursor-pointer w-5 h-5"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollbar.current.scrollLeft += 20;
                  }}
                />
              )}
            </div>
            {!isStartedWatchParty && videoFiles.length >= 1 && (
              <div className="flex justify-center align-middle my-5">
                <label className="cursor-pointer text-white font-bold self-center">
                  <div className="bg-backgroundColor-mainColor rounded-md p-1 hover:opacity-95 w-8 h-8">
                    <IoAdd className="w-6 h-6 self-center" />
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    className="w-0 h-0"
                    accept="video/*"
                    onChange={selectVideos}
                    multiple={true}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="w-1/3 h-screen">
            <div className="flex justify-center align-middle">
              <button
                type="button"
                className="bg-backgroundColor-mainColor hover:opacity-75 w-2/3 text-white font-semibold p-2 rounded-md outline-none"
                onClick={
                  watchpartyLoading
                    ? () => null
                    : () => {
                        !isStartedWatchParty
                          ? createWatchParty()
                          : endWatchParty();
                      }
                }
              >
                {watchpartyLoading ? (
                  <WatchPartyLoader />
                ) : !isStartedWatchParty ? (
                  "Start the Watch party"
                ) : (
                  "End the watch party"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPartyControlPage;
