import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ImgLoader from "./common/loaders/ImgLoader";
import Shimmer from "../assets/images/shimmer.png";

const LazyLoadingImage = (props) => {
  return (
    <LazyLoadImage
      alt=""
      effect="blur"
      src={props.image}
      className={props.className}
      placeholderSrc={Shimmer}
      placeholder={<ImgLoader />}
    />
  );
};

export default LazyLoadingImage;
