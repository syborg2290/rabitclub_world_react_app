import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "../components/common/loaders/Spinner";
import Input from "../components/common/Input";
import Textarea from "../components/common/Textarea";
import { IoCloudUpload, IoRemove } from "react-icons/io5";
import { categories } from "../utils/categories";

const NewLocationPage = (props) => {
  const location = useLocation();
  console.log(location.state);

  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const uploadCoverImage = () => {};

  return (
    <div className="bg-dark-brightest w-full h-screen">
      <div className="flex flex-col justify-center items-center py-10">
        {fields && (
          <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">
            Please add all fields.
          </p>
        )}

        <div className="flex lg:flex-row flex-col justify-center items-center rounded-md bg-dark lg:p-5 p-3 lg:w-4/5 w-full">
          <div className="bg-dark-brighter p-3 flex flex-0.3 w-1/3 rounded-md">
            <div className=" flex justify-center items-center flex-col border-2 border-dotted rounded-md border-gray-300 p-3 w-full h-420">
              {loading && <Spinner />}
              {wrongImageType && <p>It&apos;s wrong file type.</p>}
              {!imageAsset ? (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <IoCloudUpload className="w-36 h-36" />
                      </p>
                      <p className="text-lg">Click Here</p>
                    </div>

                    <p className="mt-32 text-gray-400">
                      Select a cover image for your pin *
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={uploadCoverImage}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <div className="relative h-full">
                  <img
                    src={imageAsset?.url}
                    alt="uploaded-pic"
                    className="h-full w-full"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-dark text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAsset(null)}
                  >
                    <IoRemove />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
            <span className="text-3xl text-white font-bold">
              Create Your New Pin Here
            </span>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of the location *"
              className="outline-none text-sm border-b-2 p-2"
            />
            <Textarea
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell everyone what your Pin is about"
              className="outline-none text-sm border-b-2 p-2"
            />
            <Input
              type="url"
              vlaue={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Website"
              className="outline-none text-sm border-b-2 p-2"
            />

            <div className="flex flex-col">
              <div>
                <p className="mb-2 text-textColor-lightGray font-semibold text:md">
                  Choose Pin Category
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
                      className="text-base border-0 outline-none capitalize bg-dark-brightest text-textColor-lightGray "
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end items-end mt-5">
                <button
                  type="button"
                  className="bg-backgroundColor-mainColor text-white font-bold p-2 rounded-full w-28 outline-none"
                >
                  Save Pin
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
