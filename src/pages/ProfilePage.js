import React, { useEffect, useState } from "react";
import {
  IoCropOutline,
  IoPencil,
  IoPencilOutline,
  IoReload,
  IoSaveOutline,
} from "react-icons/io5";
import { create } from "ipfs-http-client";
import { useLocation, useNavigate } from "react-router-dom";
import Cover from "../assets/images/cover.jpg";
import Profile from "../assets/images/default.png";
import Button from "../components/common/Button";
import CropModal from "../components/CropModal";
import { getUserFromIdService, updateCoverPicService } from "../services/user";
import Spinner from "../components/common/loaders/Spinner";
import EditProfileModal from "../components/EditProfileModal";

const ProfilePage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const client = create("https://ipfs.infura.io:5001/api/v0");
  const [coverImage, setCoverImage] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cropModal, setCropModal] = useState(false);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const isLoggedUser = location?.state?.userId === props.user.userId;

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    } else {
      getUserDetails();
    }
    // eslint-disable-next-line
  }, []);

  const getUserDetails = async () => {
    const user = await getUserFromIdService(location?.state?.userId);
    if (user) {
      const userDataRes = user.result.user;
      setUserData(userDataRes);
      if (userDataRes.cover_pic) {
        setCoverImage(userDataRes.cover_pic);
      }
    }
  };

  const selectCoverImg = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(URL.createObjectURL(e.target.files[0]));
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const saveCoverImage = async () => {
    setIsLoading(true);
    if (image) {
      let file = await fetch(coverImage)
        .then((r) => r.blob())
        .then(
          (blobFile) =>
            new File([blobFile], coverImage.path, { type: "image/jpeg" })
        );

      const created = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      if (url) {
        const res = await updateCoverPicService(url);
        setCoverImage(res.result.cover_pic);
        setImage(null);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(true);
    }
  };

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      {image && (
        <CropModal
          show={cropModal}
          setShow={setCropModal}
          cropping={image}
          path={coverImage.path}
          setCoverImageFile={setCoverImage}
          aspect={10 / 3} // round=9/9
          cropShape="rect" //round
        />
      )}
      <EditProfileModal
        user={userData}
        show={editProfileModal}
        setShow={setEditProfileModal}
      />
      {isLoading ? (
        <div className="h-screen">
          <div
            className={
              "text-textColor-lightGray text-3xl mx-auto self-center text-center mt-52"
            }
          >
            Uploading...
            <Spinner />
          </div>
        </div>
      ) : userData ? (
        <div className="flex flex-col pb-5">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                className="w-full h-40 shadow-lg object-cover"
                src={coverImage ? coverImage : Cover}
                alt=""
              />
              <img
                className="rounded-full w-32 h-32 -mt-10 shadow-xl border-2 border-white p-1 m-1"
                src={Profile}
                alt=""
              />
            </div>
            <h1 className="font-bold text-textColor-lightGray text-3xl text-center mt-3">
              {userData && "@" + userData.username}
            </h1>
            {!image && (
              <div className="absolute top-0 z-2 right-0 p-2">
                {isLoggedUser ? (
                  <label className="cursor-pointer text-white font-bold">
                    <div className="bg-backgroundColor-mainColor rounded-full p-2 hover:opacity-70">
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
                ) : null}
              </div>
            )}

            {image && (
              <div className="absolute top-16 z-2 right-28">
                {isLoggedUser ? (
                  <div className="flex">
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 p-3 rounded-full bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => {
                        if (!userData.cover_pic) {
                          setCoverImage(null);
                        } else {
                          setCoverImage(userData.cover_pic);
                        }
                        setImage(null);
                      }}
                    >
                      <IoReload className="text-white" />
                    </button>
                    <button
                      type="button"
                      className="absolute bottom-3 left-3 p-3 rounded-full bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={() => setCropModal(true)}
                    >
                      <IoCropOutline className="text-white" />
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {image && (
              <div className="absolute top-32 z-2 right-28">
                {isLoggedUser ? (
                  <div className="flex">
                    <button
                      type="button"
                      className="absolute bottom-3 left-3 p-3 rounded-full bg-backgroundColor-mainColor 
                       text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                      onClick={saveCoverImage}
                    >
                      <IoSaveOutline className="text-white  hover:opacity-70" />
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="text-center mb-7">
            {isLoggedUser ? (
              <Button
                onClick={() => setEditProfileModal(true)}
                className="h-8 text-textColor-lightGray border border-gray-300 hover:border-white hover:border-2"
              >
                <div className="flex">
                  <IoPencilOutline className="w-4 h-4 mr-2" /> Edit Profile
                </div>
              </Button>
            ) : (
              <Button className="h-8 text-textColor-lightGray border border-gray-300 hover:border-white hover:border-2">
                <div className="flex">Follow</div>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default ProfilePage;
