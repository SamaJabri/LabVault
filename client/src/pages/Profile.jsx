import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Avatar from "../components/Avatar";

import { saveToCloudinary } from "../assets/utility-functions";
import Icon from "../components/Icon";
import usePatientsStore from "../store/patient/patients-store";
import { motion } from "framer-motion";

const Profile = () => {
  const { id } = useParams();
  const uploadImage = useRef();

  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isHoveringOnAvatar, setIsHoveringOnAvatar] = useState(false);

  const [userAvatar, setUserAvatar] = useState({ image: null, preview: "" });

  const currentPatient = usePatientsStore((state) => state.currentPatient);
  const UpdatePatientInfo = usePatientsStore(
    (state) => state.UpdatePatientInfo
  );
  const updatePatientAvatar = usePatientsStore(
    (state) => state.updatePatientAvatar
  );

  const toggleEdit = (e) => setIsBeingEdited((isBeingEdited) => !isBeingEdited);

  // User Image upload --> Preview it
  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];

    setUserAvatar({
      image: imageFile,
      preview: URL.createObjectURL(imageFile),
    });
  };

  // User Image save --> Upload to cloudinary
  const saveImage = async () => {
    alert("Please wait while we update your image");

    try {
      const imgSrc = await saveToCloudinary(
        userAvatar.image,
        "User Avatars",
        () => {}
      );

      updatePatientAvatar(imgSrc);
    } catch (error) {
      alert("We're sorry something went wrong, please try again!");
      console.error(error);
    }

    alert("Image uploaded successfully");
  };

  // Handle the update of data --> Update store
  const handleUserInfoUpdate = (e) => {
    e.preventDefault();

    const { name, surname, gender, birthday, weight, height } = e.currentTarget;

    const updatedUser = {
      name: name.value,
      surname: surname.value,
      gender: gender.value,
      birthday: birthday.value || null,
      weight: weight.value || null,
      height: height.value || null,
    };

    UpdatePatientInfo(updatedUser);
    toggleEdit(e);
  };

  console.log(currentPatient);

  return (
    <div className="profile">
      <div className="profile__image">
        {userAvatar.image ? (
          <img
            src={userAvatar.preview}
            alt={userAvatar.image.name}
            onMouseEnter={() => setIsHoveringOnAvatar(true)}
            onMouseLeave={() => setIsHoveringOnAvatar(false)}
          />
        ) : (
          <Avatar
            place="profile"
            onMouseEnter={() => setIsHoveringOnAvatar(true)}
            onMouseLeave={() => setIsHoveringOnAvatar(false)}
          />
        )}

        {/*         {isHoveringOnAvatar && (
          <motion.div
            className="profile__user-avatar__change"
            initial={{ opacity: 0, bottom: -50 }}
            animate={{ opacity: 1, bottom: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon iconName="AiOutlineCamera" />
          </motion.div>
        )} */}

        <div className="profile__image-options">
          <button onClick={() => uploadImage.current.click()}>
            Upload Image
          </button>
          <input type="file" ref={uploadImage} onChange={handleImageUpload} />
          <button onClick={saveImage}>Save</button>
        </div>
      </div>

      <div className="profile__info">
        <div className="profile__info-edit">
          <h2>Personal Info</h2>

          {isBeingEdited ? (
            <Icon iconName="AiOutlineClose" onClick={toggleEdit} />
          ) : (
            <Icon iconName="AiOutlineEdit" onClick={toggleEdit} />
          )}
        </div>

        {isBeingEdited ? (
          <form className="profile__edit" onSubmit={handleUserInfoUpdate}>
            <label htmlFor="name">First Name</label>{" "}
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={currentPatient.name}
            />
            <label htmlFor="surname">Last Name</label>{" "}
            <input
              type="text"
              name="surname"
              id="surname"
              defaultValue={currentPatient.surname}
            />
            <label htmlFor="gender">Gender</label>{" "}
            <select
              id="gender"
              name="gender"
              defaultValue={currentPatient.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <label htmlFor="birthday">Birthday</label>{" "}
            <input
              type="date"
              name="birthday"
              id="birthday"
              defaultValue={
                currentPatient.birthday &&
                new Date(currentPatient.birthday).toISOString().substr(0, 10)
              }
            />
            <label htmlFor="weight">Weight</label>{" "}
            <input
              type="number"
              name="weight"
              id="weight"
              defaultValue={currentPatient.weight}
            />
            <label htmlFor="height">Height</label>{" "}
            <input
              type="number"
              name="height"
              id="height"
              defaultValue={currentPatient.height}
            />
            <input type="submit" value="Save" />
          </form>
        ) : (
          <>
            <p title="Name & Surname">
              <Icon iconName="AiOutlineUser" />
              <span>
                {currentPatient.name} {currentPatient.surname}
              </span>
            </p>
            <p title="Gender">
              <Icon
                iconName={
                  currentPatient.gender === "Male"
                    ? "AiOutlineMan"
                    : "AiOutlineWoman"
                }
              />
              <span>{currentPatient.gender || "-"}</span>
            </p>
            <p title="Age">
              <Icon iconName="AiOutlineUsergroupAdd" />
              <span>{currentPatient.age || "-"} years old</span>
            </p>
            <p title="Weight">
              <Icon iconName="GiWeight" />
              <span>{currentPatient.weight || "-"} kg</span>
            </p>
            <p title="Height">
              <Icon iconName="AiOutlineColumnHeight" />
              <span>{currentPatient.height || "-"} cm</span>
            </p>
            <div className="bmi">
              <p>
                BMI:{" "}
                <span>
                  {(currentPatient.weight &&
                    currentPatient.height &&
                    currentPatient.weight /
                      Math.pow(currentPatient.height / 100, 2)) ||
                    "-"}
                </span>
              </p>
              <Icon
                iconName="AiOutlineInfoCircle"
                link="/bmi"
                title="What is BMI?"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
