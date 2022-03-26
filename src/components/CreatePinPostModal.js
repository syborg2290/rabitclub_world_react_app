import React, { useEffect, useState } from "react";
import {
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { client, gun } from "../config";
import { v4 as uuidv4 } from "uuid";
import Input from "./common/Input";
import Bounce from "./common/loaders/Bounce";
import ImgLoader from "./common/loaders/ImgLoader";
import Textarea from "./common/Textarea";
import VideoPlayer from "./common/VideoPlayer";

const CreatePinPostModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  const [isLoading, setIsLoading] = useState(false);
  const [displayMedia, setDisplayMedia] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorText, setErrorText] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setDisplayMedia({ index: 0, media: props?.mediaList[0] });
    setInitialLoading(false);
  }, [props?.mediaList]);

  const submit = async () => {
    try {
      setIsLoading(true);
      if (props?.mediaList.length > 0) {
        if (title !== "") {
          let uploadedUrls = [];
          (function (next) {
            props.mediaList.forEach(async (each) => {
              let file = await fetch(each.fileUrl)
                .then((r) => r.blob())
                .then(
                  (blobFile) =>
                    new File([blobFile], each.path, {
                      type: each.type === "image" ? "image/jpeg" : "video/mp4",
                    })
                );
              const created = await client.add(file);
              const url = `https://ipfs.infura.io/ipfs/${created.path}`;
              let obj = { url: url, type: each.type };
              uploadedUrls.push(JSON.stringify(obj));
              if (uploadedUrls.length === props.mediaList.length) next();
            });
          })(function () {
            const pinPostId = uuidv4();
            const createdAt = new Date().toDateString();
            var pinPostObj = {
              _id: pinPostId,
              pinId: props.pinId,
              owner: props.currentUser,
              title: title,
              description: description,
              urlsList: uploadedUrls.toString(),
              createdAt: createdAt,
            };
            gun.get("pin_posts").get(props.pinId).set(pinPostObj);
            setIsLoading(false);
            props.setMediaList([]);
            props.setShow(false);
          });
        } else {
          setIsLoading(false);
          setErrorText("Post title is required!");
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const selectMedia = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      for (var i = 0; i < e.target.files.length; i++) {
        props?.mediaList.push({
          index: props?.mediaList.length,
          type: e.target.files[i].type.includes("video") ? "video" : "image",
          fileUrl: URL.createObjectURL(e.target.files[i]),
        });
        props?.setMediaList([...props?.mediaList]);
      }
    }
  };

  return (
    <div
      className={
        "w-screen h-screen fixed top-0 bottom-2 left-0 z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      <div className="mt-10 flex flex-col border border-dark-brightest w-2/5 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex align-top justify-end">
          <IoCloseCircleOutline
            className="self-end text-white w-7 h-7 cursor-pointer"
            onClick={() => {
              props.setMediaList([]);
              props.setShow(false);
            }}
          />
        </div>
        <div className="flex justify-center align-middle text-white text-2xl">
          Create Your Post
        </div>
        <div className="flex justify-center align-middle mt-5">
          <span className="text-red-600 txt-sm font-bold">{errorText}</span>
        </div>
        {initialLoading ? (
          <div className={"mx-auto self-center text-center mt-52"}>
            <ImgLoader />
          </div>
        ) : (
          <div className="flex justify-center align-middle">
            {props?.mediaList.length > 1 && (
              <IoChevronForwardOutline
                className="text-white mt-5 justify-center self-center w-7 h-7 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (props?.mediaList.length > displayMedia.index + 1) {
                    setDisplayMedia({
                      index: displayMedia.index + 1,
                      media: props?.mediaList[displayMedia.index + 1],
                    });
                  }
                }}
              />
            )}
            <div className="mt-5 mb-2">
              <div className="relative">
                {displayMedia.media.type === "image" ? (
                  <img
                    src={displayMedia.media.fileUrl}
                    alt=""
                    className="w-60 h-60 rounded-md"
                  />
                ) : (
                  <VideoPlayer
                    src={displayMedia.media.fileUrl}
                    className="object-cover w-60 h-60 rounded-md"
                  />
                )}

                {props?.mediaList.length > 1 && (
                  <div className="bg-black rounded-full px-2 py-1 absolute left-3 top-1">
                    {displayMedia.index + 1}/{props?.mediaList.length}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (props.mediaList.length === 1) {
                      props.mediaList.splice(displayMedia.media.index, 1);
                      props.setMediaList([]);
                      props.setShow(false);
                    } else {
                      props.mediaList.splice(displayMedia.media.index, 1);
                      props.setMediaList([...props.mediaList]);
                    }
                  }}
                  className="bg-backgroundColor-mainColor cursor-pointer rounded-full p-1 hover:opacity-95 absolute right-3 top-1"
                >
                  <IoCloseOutline className="w-6 h-6" />
                </button>
              </div>
            </div>

            {props?.mediaList.length > 1 && (
              <IoChevronBackOutline
                className="text-white mt-5 justify-center self-center w-7 h-7 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (displayMedia.index > 0) {
                    setDisplayMedia({
                      index: displayMedia.index - 1,
                      media: props?.mediaList[displayMedia.index - 1],
                    });
                  }
                }}
              />
            )}
          </div>
        )}
        <label className="cursor-pointer text-white font-bold self-center">
          <div className="bg-backgroundColor-mainColor rounded-full p-1 hover:opacity-95 w-8 h-8">
            <IoAdd className="w-6 h-6 self-center" />
          </div>
          <input
            type="file"
            name="upload-image"
            className="w-0 h-0"
            accept="image/*,video/*"
            onChange={selectMedia}
            multiple={true}
          />
        </label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title *"
          className="outline-none text-sm border-b-2 p-2  w-full text-white"
        />
        <Textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          style={{
            scrollbarWidth: "none",
          }}
          className="outline-none text-sm border-b-2 p-2 mt-5 w-full text-white overflow-x-scroll"
        />
        <div className="flex justify-end items-end mt-5">
          <button
            type="button"
            onClick={isLoading ? null : submit}
            className="bg-backgroundColor-mainColor hover:animate-pulse text-white font-bold p-2 rounded-full w-28 outline-none"
          >
            {isLoading ? <Bounce /> : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePinPostModal;
