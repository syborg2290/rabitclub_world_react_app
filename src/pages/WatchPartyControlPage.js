import React, { useEffect, useRef, useState } from "react";
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
import {
  getVideoChunkAccTimestamp,
  watchPartyVideoUpload,
} from "../services/flask_server";
import UploadingLoader from "../components/common/loaders/UploadingLoader";

const WatchPartyControlPage = () => {
  const scrollbar = useRef(null);
  const location = useLocation();
  const [isLoading, setSetIsLoading] = useState(true);
  const [isUploadingVideo, setSetIsUploadingVideo] = useState(false);
  const [isStartedWatchParty, setSetIsStartedWatchParty] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoFiles(location.state.videos);
    uploadVideoToServer(location.state.videos[0], location.state.watchpartyId);
    setCurrentVideo({ index: 0, file: location.state.videos[0] });
    setSetIsLoading(false);
  }, [location.state.videos]);

  const uploadVideoToServer = async (file, id) => {
    try {
      setSetIsUploadingVideo(true);
      const res = await watchPartyVideoUpload(file, id);
      if (res === "done") {
        setSetIsUploadingVideo(false);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const getCurrentServerDate = async () => {
    const dateRes = await getCurrentDateService();
  };

  const createWatchParty = async () => {
    gun.get("watch_parties").set(location.state.watchpartyObj);
    setSetIsStartedWatchParty(true);
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

  const streamingVideo = async (timestamp) => {
    try {
      const currentTimestamp = timestamp;
      var seconds = ((currentTimestamp % 60000) / 1000).toFixed(0);

      const startTime = seconds;
      const endTime = seconds + 20;
      const res = await getVideoChunkAccTimestamp(
        location.state.watchpartyId,
        startTime,
        endTime
      );
      if (res) {
        console.log(res);
      }
    } catch (error) {
      console.debug(error);
    }

    // gun
    //   .get("watch_party_segments")
    //   .get(location.state.watchpartyId)
    //   .put({lastUpdate:,isLoading:isUploadingVideo,isPause,data:data:chunks[i]});
  };

  const endWatchParty = () => {
    gun
      .get("watch_parties")
      .map()
      .once((data, key) => {
        console.log(key);
        if (
          data.status === "live" &&
          data.createdBy === location.state.userId
        ) {
          gun.get(key).put({ status: "end" });
        }
      });
  };

  return (
    <div
      className={`px-5 pt-5 bg-dark mx-5 my-5 rounded-md ${
        videoFiles.length > 1 ? "pb-16" : "pb-0"
      }`}
    >
      {isLoading ? (
        <div className="mx-auto self-center text-center my-20">
          <InitialLoader />
        </div>
      ) : (
        <div className="flex">
          <div className="w-2/3 h-screen">
            <span className="text-white font-bold text-sm my-1 flex justify-center align-middle">
              {currentVideo.file.name}
            </span>
            {isUploadingVideo ? (
              <div className="w-full h-96 object-cover top-0 bottom-0 left-0 right-0 m-auto">
                <UploadingLoader text="Processing..." />
              </div>
            ) : (
              <div className="relative rounded-md">
                <video
                  src={URL.createObjectURL(currentVideo.file)}
                  controls={true}
                  autoPlay={true}
                  className="object-cover w-full h-96 rounded-md"
                  disablePictureInPicture={true}
                  onTimeUpdate={
                    isStartedWatchParty
                      ? () => null
                      : (e) => {
                          streamingVideo(e.timeStamp);
                        }
                  }
                />
              </div>
            )}
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
                            onClick={() =>
                              setCurrentVideo({ index: index, file: each })
                            }
                          >
                            <VideoPlayer
                              src={URL.createObjectURL(each)}
                              className="object-cover w-36 h-36 max-w-xs rounded-md self-center"
                              videoRef={videoRef}
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
                onClick={createWatchParty}
              >
                {"Start the Watch party"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPartyControlPage;
