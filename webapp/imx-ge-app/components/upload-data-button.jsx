import React, { useContext } from "react";
import { writeUserData } from "../pages/api/firebase";
import FirebaseContext from "../pages/api/firebaseContext";

//  can be extended to upload data given input props
export const UploadDataButton = () => {
  const {app} = useContext(FirebaseContext);
  const handleClick = () => {
    writeUserData(app, "userId", "name", "email", "imageUrl");
  };
  return (
      <div>
        <button onClick={handleClick}> Upload fresh data </button>
      </div>
  )
};
