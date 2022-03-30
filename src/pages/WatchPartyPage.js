import React, { useState } from "react";
import {
  IoFilmOutline,
  IoImageOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import InitialLoader from "../components/common/loaders/InitialLoader";
import WatchPartyLoader from "../components/common/loaders/WatchPartyLoader";
import Textarea from "../components/common/Textarea";
import VideoPlayer from "../components/common/VideoPlayer";
import { client, gun } from "../config";
import { watchPartyCategories } from "../utils/categories";

const WatchPartyPage = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("Select a category");
  const [errorText, setErrorText] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [watchVideo, setWatchVideo] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  // eslint-disable-next-line
  const [chunks, setChunks] = useState([]);

  const selectVideo = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setWatchVideo(e.target.files[0]);
      getVideoDuration(e.target.files[0]);
    }
  };

  const selectThumbnail = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  };

  function getVideoDuration(file) {
    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      setVideoDuration(video.duration);
    };

    video.src = URL.createObjectURL(file);
  }

  const startWatchParty = async () => {
    try {
      setIsLoading(true);
      if (title !== "") {
        if (category !== "Select a category") {
          if (thumbnail !== null) {
            if (watchVideo !== null) {
              navigator.geolocation.getCurrentPosition(
                async function (position) {
                  const watchpartyId = uuidv4();
                  const createdAt = new Date().toDateString();
                  const thumbnailCreated = await client.add(thumbnail);
                  const thumbnailUrl = `https://ipfs.infura.io/ipfs/${thumbnailCreated.path}`;

                  var watchpartyObj = {
                    _id: watchpartyId,
                    createdBy: props.user.userId,
                    title: title,
                    category: category,
                    description: about,
                    thumbnail: thumbnailUrl,
                    chunksCount: chunks.length,
                    blobArr: null,
                    videoDuration: videoDuration,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    createdAt: createdAt,
                  };

                  gun
                    .get("watch_parties")
                    .get("pending")
                    .get(props.user.userId)
                    .get(watchpartyId)
                    .set(watchpartyObj);

                  // const filename = watchVideo.name
                  //   .split(".")
                  //   .slice(0, -1)
                  //   .join(".");

                  const chunkSize = 60000; // In bytes
                  (function (next) {
                    var start = 0;
                    var numberofChunks = Math.ceil(watchVideo.size / chunkSize);
                    const chunkEnd = Math.min(
                      start + chunkSize,
                      watchVideo.size
                    );
                    for (var i = 0; i < numberofChunks; i++) {
                      const chunk = watchVideo.slice(start, chunkEnd);
                      chunks.push(chunk);
                      start = chunkEnd;

                      if (chunks.length === numberofChunks) next();
                    }
                  })(async function () {
                    // const file = new File([newBlob], filename, {
                    //   type: newBlob.type,
                    // });

                    navigate("/watch-party-room/", {
                      state: {
                        id: watchpartyId,
                        chunksArr: chunks,
                      },
                    });
                    setIsLoading(false);
                  });
                },
                function (error) {
                  setIsLoading(false);
                  setErrorText(
                    "Oops, you have to allow current location permission!"
                  );
                }
              );
            } else {
              setIsLoading(false);
              setErrorText("Oops, you have to select a video!");
            }
          } else {
            setIsLoading(false);
            setErrorText("Thumbnail is required!");
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
    <div className="flex p-10 bg-dark m-10 rounded-md">
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
        <div className="mx-auto self-center">
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
            className="outline-none text-sm border-b-2 p-2 text-white overflow-x-scroll w-full mt-5"
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

          {!thumbnail ? (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label>
              <div className="flex flex-col flex-grow-0 items-center justify-center h-full bg-dark-brighter mt-5 rounded-md cursor-pointer">
                <div className="flex flex-col justify-center items-center">
                  <p className="font-bold text-2xl">
                    <IoImageOutline className="w-36 h-36" />
                  </p>
                  <p className="text-lg">Click Here</p>
                  <p className="mt-5 p-2 text-gray-400">
                    Select a thumbnail for your watch party
                  </p>
                </div>
              </div>
              <input
                type="file"
                name="thumbnail"
                onChange={selectThumbnail}
                className="w-0 h-0"
                accept="image/*"
                multiple={false}
              />
            </label>
          ) : (
            <div className="relative h-full mt-5">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt=""
                className="object-cover w-full h-64 rounded-md"
              />
              <button
                type="button"
                className="absolute bottom-3 left-3 p-2 rounded-full opacity-75 bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                onClick={() => {
                  setThumbnail(null);
                }}
              >
                <IoTrashBinOutline className="text-white" />
              </button>
            </div>
          )}

          {!watchVideo ? (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label>
              <div className="flex flex-col flex-grow-0 items-center justify-center h-full bg-dark-brighter mt-3 rounded-md cursor-pointer">
                <div className="flex flex-col justify-center items-center">
                  <p className="font-bold text-2xl">
                    <IoFilmOutline className="w-36 h-36" />
                  </p>
                  <p className="text-lg">Click Here</p>
                  <p className="mt-5 p-2 text-gray-400">
                    Let's watch together with others
                  </p>
                </div>
              </div>
              <input
                type="file"
                name="watch-video"
                onChange={selectVideo}
                className="w-0 h-0"
                accept="video/*"
                multiple={false}
              />
            </label>
          ) : (
            <div className="relative h-full mt-3">
              <VideoPlayer
                src={URL.createObjectURL(watchVideo)}
                className="object-cover w-full h-64 rounded-md"
              />
              <button
                type="button"
                className="absolute bottom-3 left-3 p-2 rounded-full opacity-75 bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                onClick={() => {
                  setWatchVideo(null);
                }}
              >
                <IoTrashBinOutline className="text-white" />
              </button>
            </div>
          )}

          <button
            type="button"
            className="bg-backgroundColor-mainColor hover:opacity-75 w-full text-white font-semibold p-1 mt-5 rounded-md outline-none"
            onClick={isLoading ? null : startWatchParty}
          >
            {isLoading ? <WatchPartyLoader /> : "Start the watch party"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchPartyPage;
