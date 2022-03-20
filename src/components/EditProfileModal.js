import React, { useContext, useEffect, useState } from "react";
import { create } from "ipfs-http-client";
import Textarea from "./common/Textarea";
import Input from "./common/Input";
import Profile from "../assets/images/default.png";
import { IoCloseCircleOutline, IoCropOutline, IoPencil } from "react-icons/io5";
import { updateProfileService } from "../services/user";
import UserContext from "../context/UserContext";
import Bounce from "../components/common/loaders/Bounce";
import CropModal from "./CropModal";

const EditProfileModal = (props) => {
  const client = create("https://ipfs.infura.io:5001/api/v0");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const currentUserInfo = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [image, setImage] = useState(null);
  const [cropModal, setCropModal] = useState(false);
  const visibleClass = props.show !== false ? "block" : "hidden";

  useEffect(() => {
    if (props.user) {
      setProfileImage(props.user?.profile_pic);
      setEmail(props.user?.email);
      setBio(props.user?.bio ? props.user.bio : "");
    }
  }, [props.user]);

  const selectProfileImg = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const submit = async () => {
    setIsLoading(true);

    if (image) {
      let file = await fetch(profileImage)
        .then((r) => r.blob())
        .then(
          (blobFile) =>
            new File([blobFile], props.user?.username + "profile_image", {
              type: "image/jpeg",
            })
        );
      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      if (url) {
        const res = await updateProfileService(
          email === "" ? props.user?.email : email,
          bio,
          url
        );
        if (res["status"] === true) {
          currentUserInfo.setUserData(res.result);
          props.setUser(res.result);
          setIsLoading(false);
          props.setShow(false);
        } else {
          setErrorText(res.result);
          setIsLoading(false);
        }
      }
    } else {
      const res = await updateProfileService(
        email === "" ? props.user?.email : email,
        bio,
        props.user?.profile_pic
      );
      if (res["status"] === true) {
        currentUserInfo.setUserData(res.result);
        props.setUser(res.result);
        props.setShow(false);
        setIsLoading(false);
      } else {
        setErrorText(res.result);
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={
        "w-screen h-screen fixed bottom-2 left-0 z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      {image && (
        <CropModal
          show={cropModal}
          setShow={setCropModal}
          cropping={image}
          path={profileImage.path}
          setImageFile={setProfileImage}
          aspect={9 / 9} // round=9/9
          cropShape="round" //round
        />
      )}
      <div className="mt-72 border border-dark-brightest w-3/4 sm:w-1/2 lg:w-1/3 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
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
              onChange={selectProfileImg}
              multiple={false}
            />
          </label>
          <button
            onClick={() => setCropModal(true)}
            className="bg-backgroundColor-mainColor cursor-pointer rounded-full p-2 hover:opacity-95 absolute mr-16"
          >
            <IoCropOutline className="w-4 h-4" />
          </button>
        </div>

        <label>
          <span className="text-textColor-lightGray text-sm">Email:</span>
          <Input
            type="text"
            className="mb-3 w-full text-sm"
            placeholder="Enter your new email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label>
          <span className="text-textColor-lightGray text-sm">Bio:</span>
          <Textarea
            type="text"
            className="mb-3 w-full text-sm overflow-x-scroll"
            placeholder="Describe about you"
            value={bio}
            rows={10}
            style={{
              scrollbarWidth: "none",
            }}
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />
        </label>
        <div className="flex justify-end items-end mt-5">
          <button
            type="button"
            onClick={isLoading ? null : submit}
            className="bg-backgroundColor-mainColor hover:animate-pulse text-white font-bold p-2 rounded-full w-28 outline-none"
          >
            {isLoading ? <Bounce /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;