import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../components/common/loaders/Spinner";
import NewPinModalContext from "../context/NewPinModalContext";

const PinPage = () => {
  const location = useLocation();
  const modalContext = useContext(NewPinModalContext);
  const [pinDetails, setPinDetails] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (location.state?.pin) {
      setPinDetails(location.state?.pin);
      setNewPinViewPort(location.state?.pin);
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

  return (
    <>
      {isInitialLoading ? (
        <div className={"mx-auto self-center text-center mt-52"}>
          <Spinner />
        </div>
      ) : (
        <div
          className="flex xl:flex-row flex-col m-auto p-10"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial w-1/3">
            <img
              className="rounded-md h-80 w-80"
              src={pinDetails?.defaultPinImage}
              alt=""
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div>
              <h1 className="text-4xl font-bold break-words mt-3 text-white">
                {pinDetails?.nameOfPin}
              </h1>
              <p className="mt-3">{pinDetails?.description}</p>
            </div>
            {/* <Link
              to={`/user-profile/${pinDetail?.postedBy._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg "
            >
              <img
                src={pinDetail?.postedBy.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{pinDetail?.postedBy.userName}</p>
            </Link> */}
            <h2 className="mt-5 text-2xl">Comments</h2>
            {/* <div className="max-h-370 overflow-y-auto"> */}
            {/* {pinDetail?.comments?.map((item) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                  key={item.comment}
                >
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))} */}
            {/* </div> */}
            {/* <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>
              <input
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? "Doing..." : "Done"}
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default PinPage;
