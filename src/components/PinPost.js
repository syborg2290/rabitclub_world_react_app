import React, { useEffect, useState } from "react";

const PinPost = (props) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [displayMedia, setDisplayMedia] = useState(null);
  const [mediaList, setMediaList] = useState([]);

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
  }, [props?.post]);

  return <div className="relative"></div>;
};

export default PinPost;
