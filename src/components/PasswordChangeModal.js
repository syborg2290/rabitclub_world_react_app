import React, { useContext, useState } from "react";
import { IoCloseCircleOutline, IoEye, IoEyeOff } from "react-icons/io5";
import Input from "./common/Input";
import Button from "./common/Button";
import Bounce from "./common/loaders/Bounce";
import { changePasswordService } from "../services/user";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import AuthModalContext from "../context/AuthModalContext";

const PasswordChangeModal = (props) => {
  const visibleClass = props.show !== false ? "block" : "hidden";
  const user = useContext(UserContext);
  const authModalContext = useContext(AuthModalContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    try {
      if (password !== "" && newPassword !== "") {
        if (newPassword.trim().length >= 8) {
          setIsLoading(true);
          const res = await changePasswordService(password, newPassword);
          if (res.status) {
            user.logout();
            props.setShow(false);
            setTimeout(() => authModalContext.setShow("login"), 500);
            navigate("/");
          } else {
            setErrorText(res.result);
            setIsLoading(false);
          }
        } else {
          setErrorText("New password must be 8 characters or longer.");
        }
      } else {
        setErrorText("Both fields are required!");
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
            onClick={() => props.setShow(false)}
          />
        </div>
        <div className="self-center">
          <span className="text-lg mb-5 flex align-middle justify-center">
            Change your password
          </span>
          <div className="text-red-500 text-center text-sm my-1">
            {errorText}
          </div>
          <div>
            <div className="flex">
              <Input
                type={passwordShow ? "text" : "password"}
                className="mb-3 w-full text-sm"
                value={password}
                placeholder="Password"
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
            onClick={isLoading ? () => null : () => submit()}
          >
            {isLoading ? <Bounce /> : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
