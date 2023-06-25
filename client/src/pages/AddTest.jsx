import React, { useEffect, useRef, useState } from "react";

import { saveToCloudinary } from "../assets/utility-functions";
import useLaboratoryStore from "../store/laboratory/laboratory-store";

import Icon from "../components/Icon";
import PopUp from "../components/PopUp";

const AddTest = () => {
  const uploadImage = useRef();
  const photoRef = useRef();

  const [imagesData, setImagesData] = useState([]);
  const [imageSrc, setImagesSrc] = useState("");

  const [isItemInDragArea, setIsItemInDragArea] = useState(false);

  const uploadExtraInfoPopUp = useLaboratoryStore(
    (state) => state.uploadExtraInfoPopUp
  );
  const togglePopUp = useLaboratoryStore((state) => state.togglePopUp);

  // Helping function that sets imagesData data
  const handleImage = (imageFile) => {
    const previewURLObject = URL.createObjectURL(imageFile);

    const doesImageExist = imagesData.find(
      (imageData) => imageData.image.name === imageFile.name
    );

    doesImageExist && alert("File already uploaded");

    setImagesData((imagesData) =>
      doesImageExist
        ? imagesData
        : [...imagesData, { image: imageFile, previewURL: previewURLObject }]
    );
  };

  /*   const handlePhoto = () =>
    console.log(
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: { exact: "environment" },
          },
        })
        .then((stream) => {
          let image = photoRef.current;
          image.srcObject = stream;
          image.play();
        })
        .catch((err) => console.log("Error: ", err))
    ); */

  // Handle the upload from button
  const handleUpload = (e) => {
    let imageFile = e.target.files[0];

    handleImage(imageFile);

    setIsItemInDragArea(false);
  };

  // Functions to handle drag and drop
  const handleOnDragOver = (e) => {
    e.preventDefault();

    setIsItemInDragArea(true);
  };

  const handleOnDragLeave = (e) => {
    e.preventDefault();

    setIsItemInDragArea(false);
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let imageFile = e.dataTransfer.files;

    imageFile.length > 1
      ? Array.from(imageFile).map((file) => handleImage(file))
      : handleImage(imageFile[0]);

    setIsItemInDragArea(false);
  };

  // When choosing to delete an image from the uploaded
  const handleDiscard = (e, name) => {
    e.preventDefault();

    setImagesData(
      imagesData.filter((imageData) => imageData.image.name !== name)
    );
  };

  // When choosing to save the image as a lab test result
  // Upload to Cloudinary database
  const saveImage = async (e, image) => {
    e.preventDefault();

    try {
      const imgSrc = await saveToCloudinary(image, "Lab Test Results", () =>
        setImagesData(
          imagesData.filter((imageData) => imageData.image.name !== image.name)
        )
      );

      togglePopUp();
      setImagesSrc(imgSrc);
    } catch (error) {
      alert("We're sorry something went wrong, please try again!");
      console.error(error);
    }

    /*     saveToCloudinary(image, "Lab Test Results", () =>
      setImagesData(
        imagesData.filter((imageData) => imageData.image.name !== image.name)
      )
    ); */
  };

  return (
    <div className="add-test">
      <div className="add-test__image">
        {imagesData.length > 0 &&
          imagesData.map((imageData, index) => (
            <div key={index} className="add-test__image-info">
              <img src={imageData.previewURL} />

              <h5>{imageData.image.name}</h5>
              <div className="add-test__image-options">
                <Icon
                  iconName="AiOutlineCheck"
                  onClick={(e) => saveImage(e, imageData.image)}
                />
                <Icon
                  iconName="AiOutlineClose"
                  onClick={(e) => handleDiscard(e, imageData.image.name)}
                />
              </div>
            </div>
          ))}
      </div>

      <div className="add-test__right">
        <p className="add-test__description">
          Upload your test and let us take care of the rest
          <span>
            You can drag and drop multiple images/files at a time or one by one
          </span>
        </p>

        <div
          className={`add-test__space ${
            isItemInDragArea ? "add-test__space--drag" : ""
          }`}
          onDragOver={handleOnDragOver}
          onDragLeave={handleOnDragLeave}
          onDrop={handleOnDrop}
        >
          Drop Image Here
        </div>

        <div className="add-test__options">
          {/*         <button onClick={handlePhoto}>Take Photo</button>
           */}{" "}
          <button onClick={() => uploadImage.current.click()}>
            Upload Image / File
          </button>
          <input type="file" ref={uploadImage} onChange={handleUpload} />
        </div>

        <p>Pdf extensions are supported</p>
      </div>

      <div
        className="pop-up"
        style={{ display: `${uploadExtraInfoPopUp ? "flex" : "none"}` }}
      >
        <PopUp img={imageSrc} />
      </div>
    </div>
  );
};

export default AddTest;
