import React, { useEffect, useState } from "react";
import {
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseCircleOutline,
  IoCloseOutline,
  IoCropOutline,
  IoCutOutline,
} from "react-icons/io5";
import Input from "./common/Input";
import Bounce from "./common/loaders/Bounce";
import ImgLoader from "./common/loaders/ImgLoader";
import Textarea from "./common/Textarea";
import VideoPlayer from "./common/VideoPlayer";

const CreatePinPostModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  const [isLoading, setIsLoading] = useState(false);
  const [cropModal, setCropModal] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setDisplayImage({ index: 0, image: props?.mediaList[0] });
    setInitialLoading(false);
  }, [props?.mediaList]);

  const submit = () => {};

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
                  if (props?.mediaList.length > displayImage.index + 1) {
                    setDisplayImage({
                      index: displayImage.index + 1,
                      image: props?.mediaList[displayImage.index + 1],
                    });
                  }
                }}
              />
            )}
            <div className="mt-5 mb-2">
              <div className="relative">
                {displayImage.image.type === "image" ? (
                  <img
                    src={displayImage.image.fileUrl}
                    alt=""
                    className="w-60 h-60 rounded-md"
                  />
                ) : (
                  <VideoPlayer
                    src={displayImage.image.fileUrl}
                    className="object-cover w-60 h-60 rounded-md"
                  />
                )}

                {props?.mediaList.length > 1 && (
                  <div className="bg-black rounded-md p-1 font-bold absolute left-3 bottom-1">
                    {displayImage.index + 1}/{props?.mediaList.length}
                  </div>
                )}

                <button
                  onClick={() => setCropModal(true)}
                  className="bg-backgroundColor-mainColor cursor-pointer rounded-full p-1 hover:opacity-95 absolute left-3 top-1"
                >
                  {displayImage.image.type === "image" ? (
                    <IoCropOutline className="w-6 h-6" />
                  ) : (
                    <IoCutOutline className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (props.mediaList.length === 1) {
                      props.mediaList.splice(displayImage.image.index, 1);
                      props.setMediaList([]);
                      props.setShow(false);
                    } else {
                      props.mediaList.splice(displayImage.image.index, 1);
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
                  if (displayImage.index > 0) {
                    setDisplayImage({
                      index: displayImage.index - 1,
                      image: props?.mediaList[displayImage.index - 1],
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
