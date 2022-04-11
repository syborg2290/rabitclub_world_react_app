import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "../assets/images/default.png";
import TimeAgo from "timeago-react";
import LazyLoadingImage from "../components/LazyLoadingImage";
import LongTextModal from "../components/LongTextModal";
import NewPinModalContext from "../context/NewPinModalContext";
import { getUserFromIdService } from "../services/user";
import { IoGlobeOutline } from "react-icons/io5";
import { days } from "../utils/weekDays";
import Empty from "../components/common/Empty";
import UserContext from "../context/UserContext";
import CreatePinPostModal from "../components/CreatePinPostModal";
import Button from "../components/common/Button";
import { gun } from "../config";
import PinPost from "../components/PinPost";
import InitialLoader from "../components/common/loaders/InitialLoader";

const PinPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserInfo = useContext(UserContext);
  const modalContext = useContext(NewPinModalContext);
  const [pinDetails, setPinDetails] = useState(null);
  const [owner, setOwner] = useState(null);
  const [viewDescModal, setViewDescModal] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [mediaList, setMediaList] = useState([]);
  const [pinPosts, setPinPosts] = useState([]);
  const [openPostModal, setOpenPostModal] = useState(false);

  useEffect(() => {
    if (location.state?.pin) {
      setPinDetails(location.state?.pin);
      setNewPinViewPort(location.state?.pin);
      getOwnerDetails(location.state?.pin);
      getAllThePosts(location.state?.pin._id, 0);
      setIsInitialLoading(false);
    }
    // eslint-disable-next-line
  }, [location.state?.pin]);

  const setNewPinViewPort = (pinCoordinates) => {
    modalContext.setCoordinates({
      latitude: pinCoordinates.latitude,
      longitude: pinCoordinates.longitude,
    });
    modalContext.setViewport({
      latitude: pinCoordinates.latitude,
      longitude: pinCoordinates.longitude,
      zoom: 10,
    });
  };

  const getOwnerDetails = async (pin) => {
    const user = await getUserFromIdService(pin?.owner);
    if (user.status === true) {
      setOwner(user.result["user"]);
    }
  };

  const getAllThePosts = (pinId, length) => {
    try {
      gun
        .get("pin_posts")
        .get(pinId)
        .map()
        .once((data, key) => {
          pinPosts.push({
            key: key,
            data: data,
          });
          setPinPosts([...pinPosts]);
        });
    } catch (error) {
      console.debug(error);
    }
  };

  const selectMedia = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      for (var i = 0; i < e.target.files.length; i++) {
        mediaList.push({
          index: mediaList.length,
          type: e.target.files[i].type.includes("video") ? "video" : "image",
          fileUrl: URL.createObjectURL(e.target.files[i]),
        });
      }
      setOpenPostModal(true);
    }
  };

  return (
    <>
      {isInitialLoading ? (
        <div className={"mx-auto self-center text-center mt-52"}>
          <InitialLoader />
        </div>
      ) : (
        <>
          <div className="flex p-10 bg-dark m-10 rounded-md">
            {viewDescModal && pinDetails?.description && (
              <LongTextModal
                show={viewDescModal}
                setShow={setViewDescModal}
                text={pinDetails?.description}
              />
            )}
            {mediaList.length > 0 && (
              <CreatePinPostModal
                show={openPostModal}
                setShow={setOpenPostModal}
                setMediaList={setMediaList}
                mediaList={mediaList}
                currentUser={currentUserInfo.userId}
                pinId={pinDetails._id}
              />
            )}
            <div className="flex justify-center items-center rounded-md p-1">
              <LazyLoadingImage
                image={pinDetails?.defaultPinImage}
                className="rounded-md h-80 w-80"
              />
            </div>
            <div className="w-full p-5 flex-1 xl:min-w-620">
              <div>
                <div className="flex justify-between">
                  <div className="flex">
                    <h1 className="text-4xl font-bold break-words text-white mr-2">
                      {pinDetails?.nameOfPin}
                    </h1>
                    <Button className="h-8 mt-2 text-textColor-lightGray border border-gray-300 hover:border-white hover:border-2">
                      <div className="flex">Subscribe</div>
                    </Button>
                  </div>

                  {pinDetails?.allowToAnyone === true ? (
                    <label className="cursor-pointer text-white font-bold">
                      <div className="bg-backgroundColor-mainColor rounded-md p-2 hover:opacity-95">
                        Create New Post
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
                  ) : owner._id === currentUserInfo.userId ? (
                    <label className="cursor-pointer text-white font-bold">
                      <div className="bg-backgroundColor-mainColor rounded-md p-2 hover:opacity-95">
                        Create New Post
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
                  ) : null}
                </div>

                <div className="flex mt-1">
                  <h5 className="text-textColor-lightGray text-sm opacity-50">
                    Created at <TimeAgo datetime={pinDetails?.createdAt} /> /
                  </h5>

                  <h5 className="text-textColor-lightGray text-sm opacity-50 ml-1">
                    {pinDetails?.category}
                  </h5>
                </div>
                {pinDetails?.website && (
                  <div className="flex mt-1 opacity-50">
                    <IoGlobeOutline className="text-textColor-lightGray w-4 h-4 mt-1" />
                    <span className="text-textColor-lightGray text-sm ml-1">
                      {pinDetails?.website}
                    </span>
                  </div>
                )}
                {owner && (
                  <div className="flex mt-1 text-textColor-lightGray text-sm">
                    <span className="opacity-50">Created by </span>
                    <div
                      className="flex ml-2 opacity-80 cursor-pointer"
                      onClick={() => {
                        navigate("/account", {
                          state: {
                            userId: pinDetails?.owner,
                          },
                        });
                      }}
                    >
                      <div className="border-2 border-white rounded-full">
                        <img
                          src={
                            owner?.profile_pic_small
                              ? owner?.profile_pic_small
                              : Profile
                          }
                          alt="user_profile"
                          className="w-7 h-7 block rounded-full"
                        />
                      </div>
                      <span className="text-base ml-1 text-white">
                        @{owner?.username}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-sm text-white opacity-50">
                    Available Days,
                  </span>
                  <div
                    className="mt-1 mb-2 flex overflow-x-scroll"
                    style={{
                      scrollbarWidth: "none",
                    }}
                  >
                    {days.map((each, index) => (
                      <span
                        key={index}
                        className={
                          pinDetails?.openDays.includes(each)
                            ? "px-4 hover:animate-pulse py-2 mx-1 rounded-full border bg-white border-gray-300 text-black font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                            : "px-4 hover:animate-pulse py-2 mx-1 rounded-full border border-gray-300 text-gray-500 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                        }
                      >
                        {each}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-white opacity-50">
                    Available Time,
                  </span>
                  <div className="flex text-sm text-textColor-lightGray opacity-80">
                    <span className="mr-1">From</span>
                    <span className="mr-1">{pinDetails?.openTime}</span>
                    <span className="mr-1">To</span>
                    <span className="mr-1">{pinDetails?.closeTime}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-white text-sm opacity-50">
                    About pin,
                  </span>
                  <p
                    className="line-clamp-3 text-textColor-lightGray text-sm cursor-pointer opacity-75"
                    onClick={() => setViewDescModal(true)}
                  >
                    {pinDetails?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-dark m-10 rounded-md">
            {pinPosts.length > 0 ? (
              <div className="flex flex-wrap justify-center align-middle">
                {pinPosts.map((each) => {
                  return <PinPost key={each.key} post={each.data} />;
                })}
              </div>
            ) : (
              <Empty opacity="opacity-20 " text="Not available any media yet" />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default PinPage;
