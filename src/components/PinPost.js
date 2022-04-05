import React, { useEffect, useRef, useState } from "react";
import ImgLoader from "./common/loaders/ImgLoader";
import VideoPlayer from "./common/VideoPlayer";
import LazyLoadingImage from "./LazyLoadingImage";

const PinPost = (props) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [displayMedia, setDisplayMedia] = useState(null);
  // eslint-disable-next-line
  const [mediaList, setMediaList] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    var arrayOfMedia = props?.post.urlsList.split(",");
    var urls = [];
    var types = [];
    (function (next) {
      for (var i = 0; i < arrayOfMedia.length; i++) {
        if (i % 2 === 0) {
          urls.push("https:" + arrayOfMedia[i].replace("{", "").split(":")[2]);
        } else {
          types.push(arrayOfMedia[i].replace("}", "").split(":")[1]);
        }
        if (types.length === arrayOfMedia.length / 2) next();
      }
    })(function () {
      for (var j = 0; j < urls.length; j++) {
        mediaList.push({
          url: urls[j].split('"')[0],
          type: types[j].split('"')[1],
        });
        if (types.length === mediaList.length) {
          setDisplayMedia({ index: 0, media: mediaList[0] });
          setIsInitialLoading(false);
        }
      }
    });

    // eslint-disable-next-line
  }, []);

  return (
    <div className="mx-1 my-1 rounded-md">
      {isInitialLoading ? (
        <div className={"mx-auto self-center text-center"}>
          <ImgLoader />
        </div>
      ) : (
        <div className="relative">
          {displayMedia.media.type === "image" ? (
            <LazyLoadingImage
              image={displayMedia.media.url}
              className="w-60 h-64 rounded-md cursor-pointer"
            />
          ) : (
            <VideoPlayer
              src={displayMedia.media.url}
              className="object-cover w-60 h-64 rounded-md"
              videoRef={videoRef}
            />
          )}
          {mediaList.length > 1 && (
            <div className="bg-black text-white text-sm rounded-md mx-auto self-center text-center w-10 absolute left-3 top-1">
              1/{mediaList.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PinPost;
