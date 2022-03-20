import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import {
  IoCloseCircle,
  IoCloudUpload,
  IoTrashBinOutline,
  IoCropOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import TimePicker from "react-time-picker";
import { categories } from "../utils/categories";
import { gun } from "../config";
import PreviousActionContext from "../context/PreviousActionContext";
import AuthModalContext from "../context/AuthModalContext";
import Bounce from "../components/common/loaders/Bounce";
import Button from "../components/common/Button";
import CropModal from "../components/CropModal";
import { days } from "../utils/weekDays";

const NewLocationPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = props.user;
  const previousActionContext = useContext(PreviousActionContext);
  const authModalContext = useContext(AuthModalContext);
  const client = create("https://ipfs.infura.io:5001/api/v0");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("Select a category");
  const [allowToAnyone, setAllowToAnyone] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [cropModal, setCropModal] = useState(false);
  const [image, setImage] = useState(null);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [tagIndex, setTagIndex] = useState(null);
  const [openDays, setOpenDays] = useState([]);
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("23:00");
  const [errors, setErros] = useState("");

  const selectCoverImage = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const createNewPin = async () => {
    try {
      if (user.user) {
        setLoading(true);
        if (name !== "") {
          gun
            .get("pins")
            .map((pin) => pin.nameOfPin === name)
            .once(async (isExistingName, key) => {
              if (!isExistingName) {
                if (category !== "Select a category") {
                  if (openDays.length > 0) {
                    if (openTime && closeTime !== null) {
                      if (coverImage !== null) {
                        const created = await client.add(coverImage);
                        const url = `https://ipfs.infura.io/ipfs/${created.path}`;

                        if (user.userId !== null) {
                          const pinId = uuidv4();
                          var keywordsList = gun.get("list");
                          var votesList = gun.get("list");
                          var opendaysList = gun.get("list");
                          tags.forEach(function (item) {
                            keywordsList.set({ value: item });
                          });
                          openDays.forEach(function (item) {
                            opendaysList.set({ value: item });
                          });
                          var pinObj = {
                            _id: pinId,
                            owner: user.userId,
                            nameOfPin: name,
                            description: about,
                            website: website,
                            category: category,
                            pinImage: url,
                            allowToAnyone: allowToAnyone,
                            keywords: keywordsList,
                            latitude: location.state.latitude,
                            longitude: location.state.longitude,
                            openDays: opendaysList,
                            openTime: openTime,
                            closeTime: closeTime,
                            votes: votesList,
                            createdAt: new Date(),
                          };
                          gun.get("pins").set(pinObj);
                          setLoading(false);
                          navigate("/");
                        } else {
                          setLoading(false);
                        }
                      } else {
                        setLoading(false);
                        setErros("Pin image is required!");
                      }
                    } else {
                      setLoading(false);
                      setErros("Open & Close time is required!");
                    }
                  } else {
                    setLoading(false);
                    setErros("Available days is required!");
                  }
                } else {
                  setLoading(false);
                  setErros("Pin category is required!");
                }
              } else {
                setLoading(false);
                setErros("Pin name is already used!");
              }
            });
        } else {
          setLoading(false);
          setErros("Pin name is required!");
        }
      } else {
        previousActionContext.setPreviousAction({
          path: "/new-location",
          values: {
            latitude: location.state.latitude,
            longitude: location.state.longitude,
          },
        });
        authModalContext.setShow("login");
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const pressTag = () => {
    if (tag !== "") {
      if (!tags.includes(tag)) {
        setTags([...tags, tag.trim()]);
        setTag("");
      }
    }
  };

  return (
    <div className="bg-dark-brightest w-full h-screen">
      {image && (
        <CropModal
          show={cropModal}
          setShow={setCropModal}
          cropping={image}
          path={coverImage.path}
          setImageFile={setCoverImage}
          aspect={12 / 16} // round=9/9
          cropShape="rect" //round
        />
      )}
      <div className="flex flex-col justify-center items-center py-10">
        <div className="flex lg:flex-row flex-col justify-center items-center rounded-md bg-dark lg:p-5 lg:w-4/5">
          <div className="bg-dark-brighter p-3 flex flex-0.3 w-1/3 rounded-md">
            <div className=" flex justify-center items-center flex-col border-2 border-dotted rounded-md border-gray-300 p-3 w-full h-420">
              {errors && (
                <p className="text-red-600 mb-5 text-base font-bold transition-all duration-150 ease-in ">
                  {errors}
                </p>
              )}

              {!coverImage ? (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label>
                  <div className="flex flex-col flex-grow-0 items-center justify-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <IoCloudUpload className="w-36 h-36" />
                      </p>
                      <p className="text-lg">Click Here</p>
                    </div>

                    <p className="mt-32 text-gray-400">
                      Select first pin image for your pin *
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={selectCoverImage}
                    className="w-0 h-0"
                    accept="image/*"
                    multiple={false}
                  />
                </label>
              ) : (
                <div className="relative h-full">
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt=""
                    className="h-full w-full"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => {
                      setCoverImage(null);
                      setImage(null);
                    }}
                  >
                    <IoTrashBinOutline className="text-white" />
                  </button>
                  <button
                    type="button"
                    className="absolute bottom-3 left-3 p-3 rounded-full bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setCropModal(true)}
                  >
                    <IoCropOutline className="text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-1/2">
            <span className="text-3xl text-white font-bold">
              Create Your New Pin Here
            </span>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of the location *"
              className="outline-none text-sm border-b-2 p-2 text-white"
            />
            <Textarea
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell everyone what your Pin is about"
              rows={8}
              style={{
                scrollbarWidth: "none",
              }}
              className="outline-none text-sm border-b-2 p-2 text-white overflow-x-scroll"
            />
            <Input
              type="url"
              vlaue={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website"
              className="outline-none text-sm border-b-2 p-2 text-white"
            />

            <div className="flex justify-center">
              <span className="text-textColor-lightGray ml-2 mr-2">
                Is anyone can post on this pin ?
              </span>
              <Toggle
                defaultChecked={true}
                onChange={(e) => setAllowToAnyone(e.target.checked)}
              />
            </div>

            <div className="flex flex-col">
              <div>
                <p className="mb-2 text-textColor-lightGray font-semibold text:md">
                  Select Pin Category*
                </p>
                <select
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="outline-none w-full p-3 text-sm bg-dark-brighter rounded-md cursor-pointer text-white"
                >
                  <option
                    value="others"
                    className="bg-dark-brightest text-white"
                  >
                    Select a category
                  </option>
                  {categories.map((item) => (
                    <option
                      key={item.name}
                      className="text-base border-0 outline-none capitalize bg-dark-brightest text-textColor-lightGray "
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex mt-2">
                <Input
                  type="text"
                  onKeyPress={(e) => e.key === "Enter" && pressTag()}
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                  placeholder="Keywords"
                  className="outline-none text-sm border-b-2 p-2 text-white mt-2 w-4/6"
                />
                <Button
                  className="h-8 hover:animate-pulse text-textColor-lightGray border border-gray-300 ml-2 mr-2 mt-3"
                  onClick={() => {
                    pressTag();
                  }}
                >
                  Add({tags.length})
                </Button>
              </div>
              <div
                className="mt-4 mb-2 flex overflow-x-scroll"
                style={{
                  scrollbarWidth: "none",
                }}
              >
                {tags.map((each, index) => (
                  <span
                    key={index}
                    onMouseOver={() => {
                      setTagIndex(index);
                    }}
                    onMouseOut={() => setTagIndex(null)}
                    className="px-4 hover:animate-pulse py-2 mx-1 rounded-full border border-gray-300 text-gray-500 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
                  >
                    {index === tagIndex ? (
                      <IoCloseCircle
                        className="text-white w-6 h-6"
                        onClick={() => {
                          tags.splice(tagIndex, 1);
                        }}
                      />
                    ) : (
                      each
                    )}
                  </span>
                ))}
              </div>

              <div>
                <span className="text-base text-white">Available Days*</span>
                <div
                  className="mt-4 mb-2 flex overflow-x-scroll"
                  style={{
                    scrollbarWidth: "none",
                  }}
                >
                  {days.map((each, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        if (!openDays.includes(each)) {
                          setOpenDays([...openDays, each]);
                        } else {
                          let index = openDays.indexOf(each);
                          openDays.splice(index, 1);
                          setOpenDays([...openDays]);
                        }
                      }}
                      className={
                        openDays.includes(each)
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
                <span className="text-base text-white">
                  Available Time (Open/Close)*
                </span>
                <div className="mt-2">
                  <TimePicker
                    className="mx-2 text-textColor-lightGray p-1 text-base bg-dark-brighter rounded-md outline-none"
                    clearIcon={
                      <IoCloseCircleOutline className="text-white w-6 h-6" />
                    }
                    clockIcon={<IoTimeOutline className="text-white w-6 h-6" />}
                    onChange={setOpenTime}
                    value={openTime}
                    hourAriaLabel="Hour"
                    minuteAriaLabel="Minute"
                    secondAriaLabel="Seconds"
                    amPmAriaLabel="AM/PM"
                    hourPlaceholder="hh"
                    minutePlaceholder="mm"
                    secondPlaceholder="ss"
                  />
                  <TimePicker
                    className="mx-2 text-textColor-lightGray p-1 text-base bg-dark-brighter rounded-md outline-none"
                    clearIcon={
                      <IoCloseCircleOutline className="text-white w-6 h-6" />
                    }
                    clockIcon={<IoTimeOutline className="text-white w-6 h-6" />}
                    onChange={setCloseTime}
                    value={closeTime}
                    hourAriaLabel="Hour"
                    minuteAriaLabel="Minute"
                    secondAriaLabel="Seconds"
                    amPmAriaLabel="AM/PM"
                    hourPlaceholder="hh"
                    minutePlaceholder="mm"
                    secondPlaceholder="ss"
                  />
                </div>
              </div>

              <div className="flex justify-end items-end mt-5">
                <button
                  type="button"
                  onClick={loading ? null : createNewPin}
                  className="bg-backgroundColor-mainColor hover:animate-pulse text-white font-bold p-2 rounded-full w-28 outline-none"
                >
                  {loading ? <Bounce /> : "Save Pin"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLocationPage;
