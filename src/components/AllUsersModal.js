import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  followingUserService,
  getAllUserService,
  searchUsersService,
} from "../services/user";
import Profile from "../assets/images/default.png";
import Button from "./common/Button";
import Spinner from "./common/loaders/Spinner";
import Bounce from "./common/loaders/Bounce";
import { useNavigate } from "react-router-dom";

const AllUsersModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [clickedId, setClickedId] = useState(null);
  const [users, setUsers] = useState([]);
  const [initialUsers, setInitialUsers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    getAllUsers(1);
    // eslint-disable-next-line
  }, []);

  const getAllUsers = async (pageParam) => {
    try {
      const usersRes = await getAllUserService(pageParam);
      if (usersRes.status) {
        const newArr = users.concat(usersRes.result);
        setUsers(newArr);
        setInitialLoading(false);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const followUser = async (id) => {
    try {
      setClickedId(id);
      setIsFollowLoading(true);
      const res = await followingUserService(id);

      if (res.status) {
        const index = users.findIndex((val) => val._id === id);
        users[index].amIFollowing = !users[index].amIFollowing;
        setUsers([...users]);
        setIsFollowLoading(false);
      } else {
        setIsFollowLoading(false);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const searchUsers = async (text) => {
    try {
      if (initialUsers.length === 0) {
        setInitialUsers(users);
      }
      if (text === "") {
        setUsers(initialUsers);
      } else {
        const res = await searchUsersService(text);
        if (res.status) {
          if (res.result.length > 0) {
            setUsers(res.result);
          }
        }
      }
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <div
      className={
        "w-screen h-screen bottom-0 fixed z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      <div className="mt-auto mb-auto self-center border border-dark-brightest lg:w-2/5 bg-dark p-5 text-textColor-lightGray mx-auto rounded-md">
        {initialLoading ? (
          <div className="m-auto left-0 right-0 top-0 bottom-0">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex align-top justify-end">
              <IoCloseCircleOutline
                className="self-end text-white w-7 h-7 cursor-pointer"
                onClick={() => props.setShow(false)}
              />
            </div>
            <div className="flex align-top justify-center">
              <span className="text-2xl mb-1 align-middle text-center">
                Find friends
              </span>
            </div>
            <form className="bg-dark-brighter px-1 mx-1 flex flex-grow rounded-md border border-border">
              <input
                type="text"
                className="bg-dark-brighter w-full text-sm p-1 pl-2 pr-0 block focus:outline-none text-white"
                placeholder="Search any friend"
                onKeyUp={
                  users.length > 1
                    ? () => null
                    : (e) => {
                        searchUsers(e.target.value.trim());
                      }
                }
              />
            </form>
            {users.length === 1 ? (
              <div className="my-5 text-white opacity-50 flex self-center">
                <span className="m-auto text-lg">
                  Not avialable any friends yet
                </span>
              </div>
            ) : (
              <div
                className="my-5 overflow-y-scroll"
                style={{ scrollbarWidth: "none" }}
                onWheel={(e) => {
                  if (e.nativeEvent.wheelDelta > 0) {
                    // console.debug("scroll up");
                  } else {
                    const pagepa = page + 1;
                    setPage(pagepa);
                    getAllUsers(pagepa);
                  }
                }}
              >
                {users.length > 0 &&
                  users.map((each, index) => {
                    if (each._id === props.user.userId) {
                      // eslint-disable-next-line
                      return;
                    }
                    return (
                      <div
                        key={index}
                        className="flex mt-2 justify-between cursor-pointer"
                      >
                        {each && (
                          <div
                            className="flex"
                            onClick={() => {
                              props.setShow(false);
                              navigate("/account", {
                                state: {
                                  userId: each._id,
                                },
                              });
                            }}
                          >
                            <div className="border-2 border-white rounded-full">
                              <img
                                src={
                                  each.profile_pic_small
                                    ? each.profile_pic_small
                                    : Profile
                                }
                                alt="user_profile"
                                className="w-8 h-8 block rounded-full"
                              />
                            </div>
                            <span className="text-textColor-lightGray text-base opacity-70 ml-2">
                              @{each.username}
                            </span>
                          </div>
                        )}
                        <Button
                          onClick={
                            isFollowLoading ? null : () => followUser(each._id)
                          }
                          className="h-8 text-textColor-lightGray border border-gray-300 hover:border-white hover:border-2"
                        >
                          {isFollowLoading && each._id === clickedId ? (
                            <Bounce />
                          ) : (
                            <div className="flex">
                              {each.amIFollowing ? "Following" : "Follow"}
                            </div>
                          )}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsersModal;
