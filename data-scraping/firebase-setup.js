const { initializeApp } = require("firebase/app");

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
} = require("firebase/firestore/lite");

// TODO: MOVE CONFIG
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1Cq8PUV6Nvdb69UvoaJfsqvqG5SoB-hw",
  authDomain: "imx-growth-eng.firebaseapp.com",
  projectId: "imx-growth-eng",
  storageBucket: "imx-growth-eng.appspot.com",
  messagingSenderId: "830653434300",
  appId: "1:830653434300:web:9a9f9017f85975483a83b9",
};

const readCollectionByName = async (db, collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  console.log("readCollectionByName")
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
  });
};

const uploadTestData = async (db) => {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      blockchain: "Ethereum",
      sales: 12391928,
      change: 19.36,
      buyers: 12524,
      transactions: 30697,
      source: "test-cs",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

/* this is working as expected.*/
const uploadDataArray = (db, collectionName, dataArray) => {
  const len = dataArray.length;
  const arr = [];

  // generate promises
  let tempArray = [];

  console.log(dataArray.length, "length")
  
  dataArray.forEach((data, index) => {
    tempArray.push(
      addDoc(collection(db, collectionName), {
        ...data,
      })
    );

    if ((index !==0  && index % 5 === 0) || (index === (len - 1))) {
      // console.log({tempArray})
      arr.push(tempArray);
      tempArray = [];
    }
  });

  // batch req
  console.log(
  "arr.forEach((value, index)"
  )
  arr.forEach((value, index) => {
    Promise.all(value)
      .then((item) => {
        console.log(index, "promise is done");
      })
      .catch(() => {
        console.log("failed at", index);
      });
  });
};

const main = async () => {
  const collectionName = "test";
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // await uploadTestData(db);
  await uploadDataArray(db, collectionName, [
    { b: "aaaaa", a: "1aaaa" },
    { b: "bbbbb", a: "1bbbb" },
    { b: "ccccc", a: "1cccc" },
    { b: "ddddd", a: "1dddd" },
    { b: "eeeee", a: "1eeee" },

  ]);
  await readCollectionByName(db, collectionName);
};

main();
