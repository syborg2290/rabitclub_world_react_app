import React, { useContext, useEffect, useState } from "react";
import { IoCloseCircleOutline, IoFilmOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AuthModalContext from "../context/AuthModalContext";
import NewPinModalContext from "../context/NewPinModalContext";
import PreviousActionContext from "../context/PreviousActionContext";
import UserContext from "../context/UserContext";
import Input from "./common/Input";

const UtilityBox = (props) => {
  const navigate = useNavigate();
  const modalContext = useContext(NewPinModalContext);
  const previousActionContext = useContext(PreviousActionContext);
  const authModalContext = useContext(AuthModalContext);
  const user = useContext(UserContext);
  // const alertContext = useContext(AlertModalContext);
  const [currentLat, setLatitude] = useState(0);
  const [currentLng, setLongitude] = useState(0);

  useEffect(() => {
    setLatitude(modalContext?.coordinates?.latitude);
    setLongitude(modalContext?.coordinates?.longitude);

    // eslint-disable-next-line
  }, [
    modalContext?.coordinates?.latitude,
    modalContext?.coordinates?.longitude,
  ]);

  // const checkIsWatchPartiesExist = () => {
  //   gun
  //     .get("watch_parties")
  //     .map()
  //     .once((data, key) => {
  //       if (data) {
  //         setIsWatchPartiesEmpty(false);
  //         return;
  //       }
  //     });
  // };

  // const createWatchParty = () => {
  //   try {
  //     navigator.geolocation.getCurrentPosition(
  //       function (position) {
  //         if (isWatchPartiesEmpty) {
  //           if (user.user) {
  //             navigate("/watch-party/", {
  //               state: {
  //                 latitude: position?.coords?.latitude,
  //                 longitude: position?.coords?.longitude,
  //               },
  //             });
  //           } else {
  //             previousActionContext.setPreviousAction({
  //               path: "/watch-party",
  //               values: {
  //                 latitude: position?.coords?.latitude,
  //                 longitude: position?.coords?.longitude,
  //               },
  //             });
  //             authModalContext.setShow("login");
  //           }
  //         } else {

  //           gun
  //             .get("watch_parties")
  //             .map()
  //             .once((data, key) => {
  //               if (data.status !== "live" && data.createdBy !== user.userId) {
  //                 if (user.user) {
  //                   navigate("/watch-party/", {
  //                     state: {
  //                       latitude: currentLat,
  //                       longitude: currentLng,
  //                     },
  //                   });
  //                 } else {
  //                   previousActionContext.setPreviousAction({
  //                     path: "/watch-party",
  //                     values: {
  //                       latitude: currentLat,
  //                       longitude: currentLng,
  //                     },
  //                   });
  //                   authModalContext.setShow("login");
  //                 }
  //               }
  //             });
  //         }
  //       },
  //       function (error) {
  //         alertContext.setAlertText(
  //           "Sorry, you have to allow your current location permission!"
  //         );
  //         alertContext.setShowAlertModal(true);
  //       }
  //     );
  //   } catch (error) {
  //     console.debug(error);
  //   }
  // };

  return (
    <div className="bg-dark mx-4 absolute z-1 top-10 right-0 w-2/7 h-3/4 rounded-md">
      <div className="p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div className="flex justify-between">
          <h1 className="text-xl mb-5">Current Coordinates</h1>
          <IoCloseCircleOutline
            className="self-end mb-5 text-white w-7 h-7 cursor-pointer"
            onClick={() => props.setShow(false)}
          />
        </div>
        <label>
          <span className="text-textColor-lightGray text-sm">Latitude:</span>
          <Input
            type="text"
            className="mb-3 w-full text-sm border-none"
            value={currentLat}
            readOnly={true}
          />
        </label>
        <label>
          <span className="text-textColor-lightGray text-sm">Longitude:</span>
          <Input
            type="text"
            className="mb-3 w-full text-sm border-none"
            value={currentLng}
            readOnly={true}
          />
        </label>
        <div className="flex">
          <button
            type="button"
            className="bg-backgroundColor-mainColor hover:opacity-75 text-white font-semibold p-1 rounded-md w-28 outline-none mr-2"
            onClick={(e) => {
              navigator.geolocation.getCurrentPosition(function (position) {
                modalContext.setCoordinates({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              });
            }}
          >
            Home
          </button>
          <button
            type="button"
            className="bg-backgroundColor-mainColor hover:opacity-75 text-white font-semibold p-1 rounded-md w-28 outline-none"
            onClick={(e) => {
              e.preventDefault();
              if (user.user) {
                navigate("/new-location/", {
                  state: {
                    latitude: currentLat,
                    longitude: currentLng,
                  },
                });
              } else {
                previousActionContext.setPreviousAction({
                  path: "/new-location",
                  values: {
                    latitude: currentLat,
                    longitude: currentLng,
                  },
                });
                authModalContext.setShow("login");
              }
            }}
          >
            Create Pin
          </button>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="border border-white text-white p-1 rounded-md w-full outline-none hover:opacity-75"
          >
            <div className="flex justify-center align-middle">
              <IoFilmOutline className="text-white w-5 h-5 mr-2 self-center" />
              Create Video Space
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UtilityBox;
