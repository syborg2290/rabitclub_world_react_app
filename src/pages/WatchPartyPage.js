import React, { useRef, useState } from "react";
import {
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoFilmOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import InitialLoader from "../components/common/loaders/InitialLoader";
import WatchPartyLoader from "../components/common/loaders/WatchPartyLoader";
import Textarea from "../components/common/Textarea";
import VideoPlayer from "../components/common/VideoPlayer";
import { watchPartyCategories } from "../utils/categories";
import { getCurrentDateService } from "../services/utils";

const WatchPartyPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("Select a category");
  const [errorText, setErrorText] = useState("");
  const [watchVideoList, setWatchVideoList] = useState([]);
  const [displayVideo, setDisplayVideo] = useState(null);
  const videoRef = useRef(null);

  const selectVideos = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      for (var i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].size < 2147483648) {
          setDisplayVideo({ index: 0, file: e.target.files[0] });
          watchVideoList.push(e.target.files[i]);
          setWatchVideoList([...watchVideoList]);
        }
      }
    }
  };

  // function getVideoDuration(file) {
  //   let video = document.createElement("video");
  //   video.preload = "metadata";

  //   video.onloadedmetadata = function () {
  //     window.URL.revokeObjectURL(video.src);
  //     setVideoDuration(video.duration);
  //   };

  //   video.src = URL.createObjectURL(file);
  // }

  const startWatchParty = async () => {
    try {
      setIsLoading(true);
      if (title !== "") {
        if (category !== "Select a category") {
          if (watchVideoList.length > 0) {
            const watchpartyId = uuidv4();
            const serverDate = await getCurrentDateService();
            if (serverDate) {
              const createdAt = new Date(serverDate).toDateString();

              // const filename = watchVideo.name.split(".").slice(0, -1).join(".");

              var watchpartyObj = {
                _id: watchpartyId,
                status: "live",
                createdBy: props.user.userId,
                title: title,
                category: category,
                description: about,
                latitude: location.state.latitude,
                longitude: location.state.longitude,
                createdAt: createdAt,
              };

              setIsLoading(false);

              navigate("/watch-party-room/", {
                state: {
                  userId: props.user.userId,
                  watchpartyId: watchpartyId,
                  watchpartyObj: watchpartyObj,
                  videos: watchVideoList,
                },
              });
            }
          } else {
            setIsLoading(false);
            setErrorText("Oops, you have to select a video!");
          }
        } else {
          setIsLoading(false);
          setErrorText("Watch party category is required!");
        }
      } else {
        setIsLoading(false);
        setErrorText("Watch party title is required!");
      }
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <div className="flex p-10 bg-dark m-10 rounded-md justify-center align-middle">
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
        <div className="w-1/2">
          <span className="text-3xl font-bold break-words text-white mr-2 flex justify-center align-middle">
            Start Your Watch Party
          </span>
          <div className="flex justify-center align-middle mt-5">
            <span className="text-red-600 txt-sm font-bold">{errorText}</span>
          </div>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title *"
            className="outline-none text-sm border-b-2 p-2 text-white w-full mt-10"
          />
          <Textarea
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone about what you're going to watch"
            rows={4}
            style={{
              scrollbarWidth: "none",
            }}
            className="outline-none text-sm border-b-2 p-2 text-white overflow-x-scroll overflow-y-scroll w-full mt-5"
          />
          <select
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className="outline-none w-full p-3 text-sm bg-dark-brighter rounded-md cursor-pointer text-white mt-5"
          >
            <option value="others" className="bg-dark-brightest text-white">
              Select a category
            </option>
            {watchPartyCategories.map((item) => (
              <option
                key={item}
                className="text-base border-0 outline-none capitalize bg-dark-brightest text-textColor-lightGray "
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
          <div className="mt-5 w-full">
            {watchVideoList.length <= 0 ? (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label>
                <div className="flex h-max flex-col flex-grow-0 items-center justify-center bg-dark-brighter mt-3 rounded-md cursor-pointer">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <IoFilmOutline className="w-36 h-36" />
                    </p>
                    <p className="text-lg">
                      Click Here(Max size for each is 2GB)
                    </p>
                    <p className="mt-5 p-2 text-gray-400">
                      Let's watch together with others
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  name="watch-video"
                  onChange={selectVideos}
                  className="w-0 h-0"
                  accept="video/*"
                  multiple={true}
                />
              </label>
            ) : (
              <div>
                <div className="flex justify-center align-middle w-full">
                  {watchVideoList.length > 1 && (
                    <IoChevronBackOutline
                      className="text-white mt-5 justify-center self-center w-7 h-7 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (displayVideo.index > 0) {
                          videoRef.current.pause();

                          setDisplayVideo({
                            index: displayVideo.index - 1,
                            file: watchVideoList[displayVideo.index - 1],
                          });
                        }
                      }}
                    />
                  )}
                  <div className="relative h-full mt-3">
                    <VideoPlayer
                      src={URL.createObjectURL(displayVideo.file)}
                      className="object-cover w-full h-64 rounded-md"
                      videoRef={videoRef}
                    />

                    <div className="bg-black rounded-full px-2 py-1 absolute left-3 top-1 text-white">
                      {displayVideo.index + 1}/{watchVideoList.length}
                    </div>

                    <button
                      type="button"
                      className="absolute bottom-3 left-3 p-2 rounded-full opacity-75 bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => {
                        if (watchVideoList.length === 1) {
                          setDisplayVideo(null);
                          setWatchVideoList([]);
                        } else {
                          const current = displayVideo.index;
                          watchVideoList.splice(current, 1);
                          setWatchVideoList([...watchVideoList]);
                          const indexRe =
                            watchVideoList.length === current ? 0 : current;
                          setDisplayVideo({
                            index: indexRe,
                            file: watchVideoList[indexRe],
                          });
                        }
                      }}
                    >
                      <IoTrashBinOutline className="text-white" />
                    </button>
                  </div>
                  {watchVideoList.length > 1 && (
                    <IoChevronForwardOutline
                      className="text-white mt-5 justify-center self-center w-7 h-7 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (watchVideoList.length > displayVideo.index + 1) {
                          videoRef.current.pause();
                          setDisplayVideo({
                            index: displayVideo.index + 1,
                            file: watchVideoList[displayVideo.index + 1],
                          });
                        }
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-center align-middle mt-5">
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
              </div>
            )}
          </div>

          <button
            type="button"
            className="bg-backgroundColor-mainColor hover:opacity-75 w-full text-white font-semibold p-1 mt-5 rounded-md outline-none"
            onClick={isLoading ? null : startWatchParty}
          >
            {isLoading ? <WatchPartyLoader /> : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchPartyPage;
