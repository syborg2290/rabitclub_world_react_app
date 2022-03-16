import React from "react";
import { useLocation } from "react-router-dom";
import Cover from "../assets/images/cover.jpg";
import Profile from "../assets/images/default.png";
import Button from "../components/common/Button";

const ProfilePage = (props) => {
  const location = useLocation();

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-full h-40 shadow-lg object-cover"
              src={Cover}
              alt="user-cover"
            />
            <img
              className="rounded-full w-32 h-32 -mt-10 shadow-xl border-2 border-white p-1 m-1"
              src={Profile}
              alt="user-pic"
            />
          </div>
          <h1 className="font-bold text-textColor-lightGray text-3xl text-center mt-3">
            @{props.user.user}
          </h1>
          <div className="absolute top-0 z-1 right-0 p-2">
            {location.state.userId === props.user.userId ? (
              <button
                type="button"
                className="bg-backgroundColor-mainColor hover:animate-pulse text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Edit Cover
              </button>
            ) : null}
          </div>
        </div>
        <div className="text-center mb-7">
          <Button className="h-8 text-textColor-lightGray border border-gray-300">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
