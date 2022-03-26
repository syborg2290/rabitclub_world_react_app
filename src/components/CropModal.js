import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import { dataURLtoFile } from "../utils/dataURLtoFile";
import Button from "./common/Button";
import { IoCheckmarkCircleOutline, IoCloseCircle } from "react-icons/io5";

const CropModal = (props) => {
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(
    props?.aspect - props?.aspect / 2
  );

  const visibleClass = props.show !== false ? "block" : "hidden";

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onSubmit = async () => {
    const canvas = await getCroppedImg(props.cropping, croppedArea);
    const canvasDataUrl = canvas.toDataURL("image/jpeg");
    const convertedUrlToFile = dataURLtoFile(
      canvasDataUrl,
      new Date().toUTCString() + props.path + ".jpeg"
    );
    props.setImageFile(URL.createObjectURL(convertedUrlToFile));
    props.setShow(false);
  };

  return (
    <div
      className={
        "w-screen h-screen fixed top-0 left-0 z-20 flex " + visibleClass
      }
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="border border-dark-brightest lg:w-1/4 bg-dark p-5 text-textColor-lightGray self-center mx-auto rounded-md">
        <div>
          {props.cropping && (
            <Cropper
              image={props.cropping}
              showGrid={true}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={(value) => setCrop({ x: value.x, y: value.y })}
              onZoomChange={(value) => setZoom(value)}
              onCropComplete={onCropComplete}
              cropShape={props.cropShape}
              zoomWithScroll={true}
            />
          )}
        </div>
        <div className="flex relative top-56 align-middle justify-center">
          <Button
            outline="false"
            className="w-5/6 py-2 mr-2 mb-3 bg-black text-white font-bold"
            style={{ borderRadius: ".3rem" }}
            onClick={() => {
              setAspectRatio(props?.aspect);
            }}
          >
            Start Croping
          </Button>
        </div>
        <div className="flex relative top-60 align-middle justify-center">
          <Button
            outline="false"
            className="w-2/6 py-2 mr-2 mb-3 bg-backgroundColor-mainColor text-textColor-lightGray"
            style={{ borderRadius: ".3rem" }}
            onClick={onSubmit}
          >
            <div className="flex">
              <IoCheckmarkCircleOutline className="text-white w-6 h-6 mx-1" />
              Done
            </div>
          </Button>
          <Button
            outline="false"
            className="w-2/6 py-2 ml-2 mb-3 bg-backgroundColor-mainColor text-textColor-lightGray"
            style={{ borderRadius: ".3rem" }}
            onClick={() => {
              props.setShow(false);
            }}
          >
            <div className="flex">
              <IoCloseCircle className="text-white w-6 h-6 mx-1" />
              Cancel
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
