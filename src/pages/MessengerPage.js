import React, { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import Empty from "../components/common/Empty";
import FindChatFriendsModal from "../components/FindChatFriendsModal";

const MessengerPage = (props) => {
  const [showFindFriendsModal, setFindFrinedsModal] = useState(false);

  return (
    <div className="bg-dark-brightest w-full h-screen">
      {showFindFriendsModal && (
        <FindChatFriendsModal
          show={showFindFriendsModal}
          setShow={setFindFrinedsModal}
          userId={props.user.userId}
        />
      )}
      <div className="flex flex-col justify-center items-center py-10">
        <div className="justify-center items-center rounded-md bg-dark lg:p-5 lg:w-4/5">
          <span className="text-2xl text-white font-bold opacity-50 flex justify-center align-middle">
            Connect with your friends
          </span>
          <div className="bg-dark-brighter my-2 px-3 py-1 mx-10 flex flex-grow justify-center align-middle rounded-md border border-border opacity-70">
            <HiOutlineSearch className="text-gray-300 w-4 h-4 self-center" />
            <input
              type="text"
              className="bg-dark-brighter w-full text-base p-1 pl-2 pr-0 block focus:outline-none text-white"
              placeholder={"search for friends"}
              readOnly={true}
              onClick={() => setFindFrinedsModal(true)}
            />
          </div>
          <div className="bg-dark-brighter m-auto left-0 right-0 top-0 bottom-0 rounded-md my-1 lg:w-11/12 opacity-40">
            <Empty
              text="Your chat history is empty"
              opacity="opacity-70 "
              extraClasses="mt-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessengerPage;
