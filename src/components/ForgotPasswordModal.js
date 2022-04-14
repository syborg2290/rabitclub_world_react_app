import React, { useState } from "react";
import { IoCloseCircleOutline, IoEye, IoEyeOff } from "react-icons/io5";
import {
  changeForgotPasswordCodeService,
  sendForgotPasswordCodeService,
} from "../services/user";
import Button from "./common/Button";
import Input from "./common/Input";
import Bounce from "./common/loaders/Bounce";

const ForgotPasswordModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  const [username, setUsername] = useState("");
  const [usernameSubmit, setUsernameSubmit] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const usernameSubmitFunc = async () => {
    try {
      setIsLoading(true);
      if (username !== "") {
        setErrorText("");
        const res = await sendForgotPasswordCodeService(username);
        if (res.status) {
          setIsLoading(false);
          setErrorText("");
          setUsernameSubmit(true);
        } else {
          setIsLoading(false);
          setErrorText(res.result);
        }
      } else {
        setIsLoading(false);
        setErrorText("Username is required!");
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const resendCode = async () => {
    try {
      if (username !== "") {
        setErrorText("");
        setIsLoading(true);
        const res = await sendForgotPasswordCodeService(username);
        if (!res.status) {
          setIsLoading(false);
          setErrorText(res.result);
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const passwordSubmit = async () => {
    try {
      if (confirmationCode !== "") {
        if (newPassword !== "") {
          if (newPassword.trim().length >= 8) {
            setErrorText("");
            setIsLoading(true);
            const res = await changeForgotPasswordCodeService(
              username,
              newPassword,
              confirmationCode
            );
            if (!res.status) {
              setIsLoading(false);
              setErrorText(res.result);
            } else {
              setIsLoading(false);
              setErrorText("");
              setUsername("");
              setConfirmationCode("");
              setNewPassword("");
              setNewPasswordShow(false);
              setUsernameSubmit(false);
              props.setShowAuth("login");
              props.setShow(false);
            }
          } else {
            setErrorText("New password must be 8 characters or longer.");
          }
        } else {
          setErrorText("New password is required!");
        }
      } else {
        setErrorText("Confirmation code is required!");
      }
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <div
      className={
        "w-screen h-screen fixed top-0 left-0 z-20 flex " + visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="mt-auto mb-auto self-center border border-dark-brightest lg:w-1/4 bg-dark p-5 text-textColor-lightGray mx-auto rounded-md">
        <div className="flex align-top justify-end">
          <IoCloseCircleOutline
            className="self-end text-white w-7 h-7 cursor-pointer"
            onClick={() => {
              setErrorText("");
              setUsername("");
              setConfirmationCode("");
              setNewPassword("");
              setNewPasswordShow(false);
              setUsernameSubmit(false);
              props.setShow(false);
            }}
          />
        </div>
        <div className="flex justify-center">
          <h1 className="text-lg mb-5">Forgot Password</h1>
        </div>
        <div className="flex justify-center">
          <div className="text-red-500 text-center text-sm my-1">
            {errorText}
          </div>
        </div>

        {!usernameSubmit && (
          <>
            <label>
              <Input
                type="text"
                className="mb-3 w-full text-sm"
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <Button
              outline="false"
              className="w-full py-2 mb-3 bg-backgroundColor-mainColor text-textColor-lightGray"
              style={{ borderRadius: ".3rem" }}
              onClick={isLoading ? () => null : () => usernameSubmitFunc()}
            >
              {isLoading ? <Bounce /> : "Send Confirmation Code"}
            </Button>
          </>
        )}
        {usernameSubmit && (
          <>
            <span className="justify-center text-sm text-red-400">
              Check your email address for confirmation code
            </span>
            <label>
              <Input
                type="text"
                pattern="[0-9]*"
                className="w-full text-sm"
                value={confirmationCode}
                placeholder="Enter Confirmation Code"
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setConfirmationCode(e.target.value);
                  }
                }}
              />
            </label>
            <div
              className="text-right mb-3 opacity-60 hover:opacity-100"
              onClick={
                isLoading
                  ? () => null
                  : () => {
                      resendCode();
                    }
              }
            >
              <span className="text-sm cursor-pointer">
                {isLoading ? "Sending..." : "Resend Code"}
              </span>
            </div>
            <div>
              <div className="flex">
                <Input
                  type={newPasswordShow ? "text" : "password"}
                  className="mb-3 w-full text-sm"
                  value={newPassword}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPasswordShow && (
                  <IoEyeOff
                    className="ml-1 w-9 h-9 bg-dark-brightest rounded-md p-1 cursor-pointer"
                    onClick={() => setNewPasswordShow(!newPasswordShow)}
                  />
                )}
                {!newPasswordShow && (
                  <IoEye
                    className="ml-1 w-9 h-9 bg-dark-brightest rounded-md p-1 cursor-pointer"
                    onClick={() => setNewPasswordShow(!newPasswordShow)}
                  />
                )}
              </div>
            </div>
            <Button
              outline="false"
              className="w-full py-2 mb-3 bg-backgroundColor-mainColor text-textColor-lightGray"
              style={{ borderRadius: ".3rem" }}
              onClick={isLoading ? () => null : () => passwordSubmit()}
            >
              {isLoading ? <Bounce /> : "Submit"}
            </Button>
          </>
        )}
        <div className="flex justify-center cursor-pointer">
          <div
            className="text-center mb-1 opacity-60 hover:opacity-100 border rounded-md w-1/2"
            onClick={() => {
              setErrorText("");
              setUsername("");
              setConfirmationCode("");
              setNewPassword("");
              setNewPasswordShow(false);
              setUsernameSubmit(false);
              props.setShowAuth("login");
              props.setShow(false);
            }}
          >
            <span className="text-sm cursor-pointer">LOGIN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
