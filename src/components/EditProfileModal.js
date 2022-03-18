import React, { useEffect, useState } from "react";
import Textarea from "./common/Textarea";
import Input from "./common/Input";
import Profile from "../assets/images/default.png";
import { IoCloseCircleOutline, IoPencil } from "react-icons/io5";

const EditProfileModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [image, setImage] = useState(null);
  const visibleClass = props.show !== false ? "block" : "hidden";

  useEffect(() => {
    if (props.user) {
      setProfileImage(props.user?.profile_pic);
    }
  }, [props.user]);

  const selectCoverImg = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div
      className={
        "w-screen h-screen fixed top-0 left-0 z-20 flex " + visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="border border-dark-brightest w-3/4 sm:w-1/2 lg:w-1/4 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex align-top justify-end">
          <IoCloseCircleOutline
            className="self-end text-white w-7 h-7 cursor-pointer"
            onClick={() => props.setShow(false)}
          />
        </div>
        <h1 className="text-2xl mb-5 align-middle text-center">
          Edit your profile
        </h1>
        <div className="text-red-500 text-center text-sm mb-5">{errorText}</div>
        <div className="flex align-middle justify-center relative">
          <img
            className="rounded-full w-32 h-32 shadow-xl border-2 border-white p-1 mb-5"
            src={profileImage ? profileImage : Profile}
            alt=""
          />
          <label className="cursor-pointer text-white font-bold absolute ml-16">
            <div className="bg-backgroundColor-mainColor rounded-full p-2 hover:opacity-95">
              <IoPencil className="w-4 h-4" />
            </div>
            <input
              type="file"
              name="upload-image"
              className="w-0 h-0"
              accept="image/*"
              onChange={selectCoverImg}
              multiple={false}
            />
          </label>
        </div>

        <label>
          <span className="text-textColor-lightGray text-sm">Email:</span>
          <Input
            type="text"
            className="mb-3 w-full text-sm"
            placeholder="Enter your new email"
          />
        </label>
        <label>
          <span className="text-textColor-lightGray text-sm">Bio:</span>
          <Textarea
            type="text"
            className="mb-3 w-full text-sm"
            placeholder="Describe about you"
          />
        </label>
      </div>
    </div>
  );
};

export default EditProfileModal;
