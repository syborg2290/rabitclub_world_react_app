import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserFromIdService } from "../services/user";
import Profile from "../assets/images/default.png";
import LazyLoadingImage from "../components/LazyLoadingImage";
import InitialLoader from "../components/common/loaders/InitialLoader";
import {
  IoAttachOutline,
  IoChatbox,
  IoFilmOutline,
  IoImageOutline,
  IoLocateOutline,
  IoLocationOutline,
  IoMusicalNoteOutline,
  IoPinOutline,
  IoSendOutline,
} from "react-icons/io5";
import { gun } from "../config";
import { getCurrentDateService } from "../services/utils";
import { encrypt } from "../utils/encryptDecryptText";

const ChatPage = (props) => {
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loggedUserData, setLoggedUserData] = useState(null);
  const [guestUserData, setGuestUserData] = useState(null);
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);

  useEffect(() => {
    getLoggedUser();
    // eslint-disable-next-line
  }, [location.state.userId]);

  const getLoggedUser = async () => {
    const user = await getUserFromIdService(props.user.userId);
    if (user.status) {
      setLoggedUserData(user.result.user);
      getGuestUser();
    }
  };
  const getGuestUser = async () => {
    const user = await getUserFromIdService(location.state.userId);
    if (user.status) {
      setGuestUserData(user.result.user);
      setInitialLoading(false);
    }
  };

  const sendMessage = async () => {
    if (text !== "" || media.length > 0) {
      const serverDate = await getCurrentDateService();
      const createdAt = new Date(serverDate).toDateString();
      if (serverDate) {
        const encText = encrypt(text);
        const msgObj = {
          sender: props.user.userId,
          receiver: location.state.userId,
          text: text !== "" ? encText : null,
          media: media.length > 0 ? media : null,
          createdAt: createdAt,
        };
        gun.get("chats").get(location.state.userId).set(msgObj);
      }
    }
  };

  return (
    <div className="bg-dark-brightest w-full h-screen">
      {initialLoading ? (
        <div className={"mx-auto self-center text-center mt-52"}>
          <InitialLoader />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center py-10">
          <div className="justify-center items-center rounded-md bg-dark lg:p-5 lg:w-4/5">
            <div className="flex justify-center align-middle mt-10">
              <LazyLoadingImage
                image={
                  guestUserData.profile_pic_medium
                    ? guestUserData.profile_pic_medium
                    : Profile
                }
                className="rounded-full w-32 h-32 -mt-20 shadow-xl border-2 border-white p-1 m-1"
              />
            </div>
            <h1 className="font-bold text-white text-3xl text-center mt-1">
              {guestUserData && "@" + guestUserData?.username}
            </h1>
            <div className="w-full h-screen border-2 border-gray-800 border-dotted my-2 rounded-md">
              <div
                className="h-4/6 w-full overflow-y-scroll"
                style={{
                  scrollbarWidth: "none",
                }}
              ></div>
              <div
                className="bg-dark-brighter my-2 px-3 py-1 mx-10 flex flex-grow 
                            rounded-md border border-border opacity-70"
              >
                <IoChatbox className="text-border" />
                <input
                  type="text"
                  className="bg-dark-brighter w-full text-base p-1 pl-2 pr-0 block focus:outline-none text-white"
                  placeholder="Type your message here"
                  onChange={(e) => {
                    setText(e.target.value.trim());
                  }}
                />
                <div
                  onClick={() => sendMessage()}
                  className="bg-backgroundColor-mainColor rounded-full w-10 h-10 cursor-pointer opacity-70 hover:opacity-100"
                >
                  <IoSendOutline className="w-10 h-10 text-white p-2" />
                </div>
              </div>
              <div
                className="flex w-full overflow-x-scroll overflow-y-hidden justify-center self-center mt-5"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                <div className="w-20 h-20 border border-border rounded-md mx-2 opacity-50 cursor-pointer hover:opacity-100 max-w-xs">
                  <div className="flex justify-center align-middle">
                    <IoImageOutline className="text-white w-16 h-12" />
                  </div>
                  <div className="flex justify-center align-middle">
                    <span className="text-white">Images</span>
                  </div>
                </div>
                <div className="w-20 h-20 border border-border rounded-md mx-2 opacity-50 cursor-pointer hover:opacity-100 max-w-xs">
                  <div className="flex justify-center align-middle">
                    <IoFilmOutline className="text-white w-16 h-12" />
                  </div>
                  <div className="flex justify-center align-middle">
                    <span className="text-white">Videos</span>
                  </div>
                </div>
                <div className="w-20 h-20 border border-border rounded-md mx-2 opacity-50 cursor-pointer hover:opacity-100 max-w-xs">
                  <div className="flex justify-center align-middle">
                    <IoMusicalNoteOutline className="text-white w-16 h-12" />
                  </div>
                  <div className="flex justify-center align-middle">
                    <span className="text-white">Audios</span>
                  </div>
                </div>
                <div className="w-20 h-20 border border-border rounded-md mx-2 opacity-50 cursor-pointer hover:opacity-100 max-w-xs">
                  <div className="flex justify-center align-middle">
                    <IoAttachOutline className="text-white w-16 h-12" />
                  </div>
                  <div className="flex justify-center align-middle">
                    <span className="text-white">Files</span>
                  </div>
                </div>
                <div className="w-20 h-20 border border-border rounded-md mx-2 opacity-50 cursor-pointer hover:opacity-100 max-w-xs">
                  <div className="flex justify-center align-middle">
                    <IoLocationOutline className="text-white w-16 h-12" />
                  </div>
                  <div className="flex justify-center align-middle">
                    <span className="text-white">Locations</span>
                  </div>
                </div>
                <div className="w-20 h-20 border border-border rounded-md mx-2 opacity-50 cursor-pointer hover:opacity-100 max-w-xs">
                  <div className="flex justify-center align-middle">
                    <IoPinOutline className="text-white w-16 h-12" />
                  </div>
                  <div className="flex justify-center align-middle">
                    <span className="text-white">Pins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
