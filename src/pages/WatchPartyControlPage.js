import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import InitialLoader from "../components/common/loaders/InitialLoader";
import { gun } from "../config";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import VideoPlayer from "../components/common/VideoPlayer";
import {
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { getCurrentDateService } from "../services/utils";

const WatchPartyControlPage = () => {
  const scrollbar = useRef(null);
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const location = useLocation();
  const [isLoading, setSetIsLoading] = useState(true);
  const [videoFiles, setVideoFiles] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoFiles(location.state.videos);
    setCurrentVideo(location.state.videos[0]);
    setSetIsLoading(false);
  }, [location.state.videos]);

  const getCurrentServerDate = async () => {
    const dateRes = await getCurrentDateService();
  };

  const createWatchParty = async () => {
    gun.get("watch_parties").set(location.state.watchpartyObj);

    // gun
    //   .get("watch_party_segments")
    //   .get(location.state.watchpartyId)
    //   .put({lastUpdate:,data:chunks[i]});
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
    console.log(timestamp);
    ffmpeg.FS("writeFile", "test.avi", await fetchFile("/flame.avi"));
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
    <div className="px-5 pt-5 pb-16 bg-dark mx-5 my-5 rounded-md">
      {isLoading ? (
        <div className="mx-auto self-center text-center my-20">
          <InitialLoader />
        </div>
      ) : (
        <div className="flex">
          <div className="w-2/3 h-screen">
            <span className="text-white font-bold text-md my-1 flex justify-center align-middle">
              {currentVideo.name}
            </span>
            <div className="relative">
              <video
                src={URL.createObjectURL(currentVideo)}
                autoPlay={true}
                className="w-full h-96 rounded-md"
                disablePictureInPicture={true}
                // onTimeUpdate={async (e) => {
                //   await streamingVideo(e.timeStamp);
                // }}
              />
            </div>
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
                  className="mt-3 flex overflow-x-scroll overflow-y-hidden w-full justify-center self-center cursor-pointer"
                  style={{
                    scrollbarWidth: "none",
                  }}
                  ref={scrollbar}
                >
                  {videoFiles.map((each, index) => {
                    return (
                      <div
                        className="relative ml-2 mr-2"
                        key={index}
                        onClick={() => setCurrentVideo(each)}
                      >
                        <VideoPlayer
                          src={URL.createObjectURL(each)}
                          className="object-cover w-44 h-44 rounded-md self-center"
                          videoRef={videoRef}
                        />
                      </div>
                    );
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
            {videoFiles.length >= 1 && (
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
