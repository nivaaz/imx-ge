import { initializeApp } from "firebase/app";
import "../styles/globals.css";
import FirebaseContext  from "./api/firebaseContext.js";
import { firebaseConfig } from "./api/firebaseConfig";

const MyApp = ({ Component, pageProps }) => {
  const appIntialized = initializeApp(firebaseConfig);
  return (
    <FirebaseContext.Provider value={{ app: appIntialized }}>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
}

export default MyApp;
