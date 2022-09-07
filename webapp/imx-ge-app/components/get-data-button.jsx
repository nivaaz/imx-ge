import React, { useContext } from "react";
import { getUserData } from "../pages/api/firebase";
import FirebaseContext from "../pages/api/firebaseContext";

//  can be extended to fetch data from firebase given input props
export const GetDataButton = () => {
  const {app} = useContext(FirebaseContext);
  
  const handleClick = async () => {
    const val = await getUserData(app, "userId");
    console.log(val);
  };
  return (
        <div>
          <button onClick={handleClick}> Get fresh data </button>
        </div>
      )
};
