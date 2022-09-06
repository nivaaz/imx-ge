// Import the functions you need from the SDKs you need
import { getDatabase, set, ref, get, child } from "firebase/database";

export function writeUserData(app, userId, name, email, imageUrl) {
  // Initialize Realtime Database and get a reference to the service
  const dbRef = getDatabase(app);

  set(ref(dbRef, "users/" + userId), {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
  console.log("wrote new user to database");
}

export async function  getUserData (app, userId) {
  const dbRef = ref(getDatabase(app));
  await get(child(dbRef, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("snapshot.val()", snapshot.val())
        return snapshot.val();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
