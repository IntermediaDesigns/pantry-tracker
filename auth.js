import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "./firebase"; // Make sure this path is correct

const auth = getAuth(app);
const db = getFirestore(app);

// Helper function to generate a fake email
const generateEmail = (username) =>
  `${username.replace(/\s+/g, "")}@example.com`;

export const signUp = async (username, password) => {
  try {
    const email = generateEmail(username);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store the username in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
    });

    return user;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const signIn = async (username, password) => {
  try {
    const email = generateEmail(username);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const getUsername = async (userId) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data().username;
  }
  return null;
};
