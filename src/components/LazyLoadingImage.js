import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ImgLoader from "./common/loaders/ImgLoader";

const LazyLoadingImage = (props) => {
  return (
    <LazyLoadImage
      alt=""
      effect="blur"
      src={props.image}
      className={props.className}
      placeholder={<ImgLoader />}
    />
  );
};

export default LazyLoadingImage;
