import React, { useState, useContext } from "react";
import AuthModalContext from "../context/AuthModalContext";
import ClickOutHandler from "react-clickout-handler";
import { loginService, registerService } from "../services/user";
import Button from "./common/Button";
import Input from "./common/Input";
import Bounce from "./common/loaders/Bounce";
import UserContext from "../context/UserContext";
import { emailValidation } from "../utils/validations";
import { IoEye, IoEyeOff } from "react-icons/io5";

const AuthModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [modalType, setModalType] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);

  const modalContext = useContext(AuthModalContext);
  const user = useContext(UserContext);

  const visibleClass = modalContext.show !== false ? "block" : "hidden";
  if (modalContext.show && modalContext.show !== modalType) {
    setModalType(modalContext.show);
  }

  const register = async (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      if (username.trim() !== "") {
        if (password.trim() !== "") {
          if (emailValidation(email.trim())) {
            if (password.trim().length >= 8) {
              setIsLoading(true);
              const res = await registerService(
                email.trim(),
                password.trim(),
                username.trim()
              );
              if (res["status"] === true) {
                modalContext.setShow(false);
                user.setUser(username.trim());
                clearData();
                setIsLoading(false);
              } else {
                setIsLoading(false);
                setErrorText(res["result"]);
              }
            } else {
              setErrorText("The passwod must be 8 characters or longer.");
            }
          } else {
            setErrorText("Invalid email format!");
          }
        } else {
          setErrorText("Password is required!");
        }
      } else {
        setErrorText("Username is required!");
      }
    } else {
      setErrorText("E-mail is required!");
    }
  };

  const login = async (e) => {
    e.preventDefault();

    if (username.trim() !== "") {
      if (password.trim() !== "") {
        setIsLoading(true);
        const res = await loginService(username.trim(), password.trim());
        if (res["status"] === true) {
          modalContext.setShow(false);
          user.setUser(username.trim());
          clearData();
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setErrorText(res["result"]);
        }
      } else {
        setErrorText("Password is required!");
      }
    } else {
      setErrorText("Username is required!");
    }
  };

  const clearData = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setErrorText("");
  };

  return (
    <div
      className={
        "w-screen h-screen fixed top-0 left-0 z-20 flex " + visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <ClickOutHandler
        onClickOut={() => {
          modalContext.setShow(false);
          clearData();
        }}
      >
        <div className="border border-dark-brightest w-3/4 sm:w-1/2 lg:w-1/4 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
          {modalType === "login" && <h1 className="text-2xl mb-5">Log In</h1>}
          {modalType === "register" && (
            <h1 className="text-2xl mb-5">Sign Up</h1>
          )}
          <div className="text-red-500 text-center text-sm">{errorText}</div>
          {modalType === "register" && (
            <label>
              <span className="text-textColor-lightGray text-sm">E-mail:</span>
              <Input
                type="email"
                className="mb-3 w-full text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          )}
          <label>
            <span className="text-textColor-lightGray text-sm">Username:</span>
            <Input
              type="text"
              className="mb-3 w-full text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <span className="text-textColor-lightGray text-sm">Password:</span>
            <div className="flex">
              <Input
                type={passwordShow ? "text" : "password"}
                className="mb-3 w-full text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordShow && (
                <IoEyeOff
                  className="ml-1 w-9 h-9 bg-dark-brightest rounded-md p-1 cursor-pointer"
                  onClick={() => setPasswordShow(!passwordShow)}
                />
              )}
              {!passwordShow && (
                <IoEye
                  className="ml-1 w-9 h-9 bg-dark-brightest rounded-md p-1 cursor-pointer"
                  onClick={() => setPasswordShow(!passwordShow)}
                />
              )}
            </div>
          </label>

          <Button
            outline="false"
            className="w-full py-2 mb-3 bg-backgroundColor-mainColor text-textColor-lightGray"
            style={{ borderRadius: ".3rem" }}
            onClick={
              isLoading
                ? null
                : async (e) =>
                    modalType === "login" ? await login(e) : await register(e)
            }
          >
            {isLoading ? (
              <Bounce />
            ) : modalType === "login" ? (
              "Log In"
            ) : (
              "Sign Up"
            )}
          </Button>

          {modalType === "login" && (
            <div className="text-sm">
              New to Rabitclub?{" "}
              <button
                className="text-blue-600"
                onClick={
                  isLoading
                    ? null
                    : () => {
                        modalContext.setShow("register");
                        clearData();
                      }
                }
              >
                SIGN UP
              </button>
            </div>
          )}
          {modalType === "register" && (
            <div className="text-sm">
              Already have an account?{" "}
              <button
                className="text-blue-600 "
                onClick={
                  isLoading
                    ? null
                    : () => {
                        modalContext.setShow("login");
                        clearData();
                      }
                }
              >
                LOG IN
              </button>
            </div>
          )}
        </div>
      </ClickOutHandler>
    </div>
  );
};

export default AuthModal;
