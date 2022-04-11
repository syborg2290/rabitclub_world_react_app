import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { followingUserService, getAllUserService } from "../services/user";
import Profile from "../assets/images/default.png";
import Button from "./common/Button";
import Spinner from "./common/loaders/Spinner";
import Bounce from "./common/loaders/Bounce";

const AllUsersModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  const getAllUsers = async () => {
    try {
      const usersRes = await getAllUserService(page);
      if (usersRes.status) {
        setUsers(usersRes.result);
        setInitialLoading(false);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const followUser = async (id) => {
    try {
      setIsFollowLoading(true);
      const res = await followingUserService(id);
      if (res.status) {
        const index = users.indexOf((val) => val._id === id.toString());
        if (index !== -1) {
          users[index].amIFollowing = true;
          setUsers([...users]);
        }

        setIsFollowLoading(false);
      } else {
        setIsFollowLoading(false);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <div
      className={
        "w-screen h-screen fixed bottom-0 left-0 z-20 flex overflow-y-scroll " +
        visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", scrollbarWidth: "none" }}
    >
      <div className="mt-1 border border-dark-brightest lg:w-2/5 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
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
                onChange={(e) => {}}
              />
            </form>
            <div className="my-5">
              {users &&
                users.map((each, index) => {
                  if (each._id === props.user.userId) {
                    // eslint-disable-next-line
                    return;
                  }
                  return (
                    <div key={index} className="flex mt-2 justify-between">
                      {each && (
                        <div className="flex">
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
                        {isFollowLoading ? (
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
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsersModal;
