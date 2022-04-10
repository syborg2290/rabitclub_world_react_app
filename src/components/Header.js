import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/brand/logo.png";
import Profile from "../assets/images/default.png";
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineChat,
  HiOutlineChevronDown,
  HiOutlineUsers,
} from "react-icons/hi";
import ClickOutHandler from "react-clickout-handler";
import {
  IoGridOutline,
  IoLogOutOutline,
  IoPerson,
  IoPersonOutline,
} from "react-icons/io5";
import Button from "./common/Button";
import AuthModalContext from "../context/AuthModalContext";
import UserContext from "../context/UserContext";

const Header = () => {
  const navigate = useNavigate();
  const [userDropdownVisibilityClass, setUserDropdownVisibilityClass] =
    useState("hidden");
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line
  const [searchType, setSearchType] = useState("Pin");
  const authModalContext = useContext(AuthModalContext);
  const user = useContext(UserContext);

  const toggleUserDropdown = () => {
    if (userDropdownVisibilityClass === "hidden") {
      setUserDropdownVisibilityClass("block");
    } else {
      setUserDropdownVisibilityClass("hidden");
    }
  };

  const doSearch = (e) => {
    e.preventDefault();
  };

  const openLogin = (e) => {
    e.preventDefault();
    authModalContext.setShow("login");
  };

  return (
    <header className="w-full bg-dark p-2">
      <div className="flex mx-4 relative">
        <Link to="/">
          <img src={Logo} alt="header_logo" className="w-9 h-9 mr-4" />
        </Link>
        <form
          onSubmit={(e) => (user.user ? doSearch(e) : openLogin(e))}
          className="bg-dark-brighter px-3 mx-4 flex flex-grow rounded-md border border-border"
        >
          <HiOutlineSearch className="text-gray-300 w-4 h-4 mt-3" />
          <input
            type="text"
            className="bg-dark-brighter w-full text-sm p-1 pl-2 pr-0 block focus:outline-none text-white"
            placeholder={"search any #" + searchType}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </form>

        {user.user && (
          <>
            <button className="px-1 py-1">
              <HiOutlineUsers className="text-gray-500 w-6 h-6 mx-2 hover:text-gray-300" />
            </button>
            <button className="px-1 py-1">
              <HiOutlineChat className="text-gray-500 w-6 h-6 mx-2 hover:text-gray-300" />
            </button>
            <button className="px-1 py-1">
              <HiOutlineBell className="text-gray-500 w-6 h-6 mx-2 hover:text-gray-300" />
            </button>
            <button className="px-1 py-1">
              <IoGridOutline className="text-gray-500 w-6 h-6 mx-2 hover:text-gray-300" />
            </button>
          </>
        )}

        {!user.user && (
          <div className="mx-2 py-1 hidden sm:block">
            <Button
              className="mr-1 h-8 text-textColor-lightGray border border-gray-300"
              onClick={() =>
                setTimeout(() => authModalContext.setShow("login"), 500)
              }
            >
              Log In
            </Button>
            <Button
              className="h-8 text-textColor-lightGray border border-gray-300"
              onClick={() =>
                setTimeout(() => authModalContext.setShow("register"), 500)
              }
            >
              Sign Up
            </Button>
          </div>
        )}
        {user.user && (
          <ClickOutHandler
            onClickOut={() => setUserDropdownVisibilityClass("hidden")}
          >
            <button
              className="flex px-2 py-1 ml-4"
              onClick={() => toggleUserDropdown()}
            >
              {!user.user && (
                <div className="w-7 h-7 bg-gray-600 rounded-full hover:bg-gray-500">
                  <IoPerson
                    className="w-5 h-5 m-1 block"
                    style={{ filter: "invert(100%)" }}
                  />
                </div>
              )}

              {user.user && (
                <div className="border-2 border-white rounded-full">
                  <img
                    src={
                      user?.userData?.profile_pic_small
                        ? user?.userData?.profile_pic_small
                        : Profile
                    }
                    alt="user_profile"
                    className="w-7 h-7 block rounded-full"
                  />
                </div>
              )}

              <HiOutlineChevronDown className="text-gray-300 w-4 h-4 m-2" />
            </button>
            <div
              className={
                "absolute right-0 top-8 z-30 bg-dark border border-gray-700 rounded-md text-textColor-lightGray overflow-hidden " +
                userDropdownVisibilityClass
              }
            >
              {user.user && (
                <span className="w-50 py-2 px-3 text-sm">
                  Hello, @{user.user}
                </span>
              )}

              {user.user && (
                <>
                  <button
                    className="flex w-50 py-2 px-3  hover:text-white text-sm"
                    onClick={() => {
                      navigate("/account", {
                        state: {
                          userId: user.userId,
                        },
                      });
                    }}
                  >
                    <IoPersonOutline className="w-5 h-5 mr-2" />
                    Account
                  </button>
                  <button
                    className="flex w-50 py-2 px-3  hover:text-white text-sm"
                    onClick={() =>
                      setTimeout(() => {
                        user.logout();
                        navigate("/");
                      }, 500)
                    }
                  >
                    <IoLogOutOutline className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </ClickOutHandler>
        )}
      </div>
    </header>
  );
};

export default Header;
