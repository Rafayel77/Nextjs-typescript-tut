/* eslint-disable no-console */
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import app from "../firebase";
import { ROUTES } from "../configRoutes";
import { setShowAlert } from "../store/slices/showAlertSlice";
//import { NavigateFunction } from "react-router-dom";
import { setLogin, setLogout, setUser, setUserId, setUsername } from "../store/slices/userSlice";
import store from "../store/store";
import { NextRouter } from "next/router";

const auth = getAuth(app);
const db = getFirestore(app);

export const signUp = async (email: string, password: string, username: string) => {
  try {
    const authResult = await createUserWithEmailAndPassword(auth, email, password);
    const user = authResult.user;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { username, cardIds: [] });
    store.dispatch(setUserId(user.uid));
    store.dispatch(setUsername(username));
    return true;
  }catch (error) {
    const errorCode = (error as { code: string }).code;
    return errorCode.slice(5);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    const username = userData ? userData.username : "";
    store.dispatch(setUserId(user.uid));
    store.dispatch(setUser(user.email));
    store.dispatch(setUsername(username));
    store.dispatch(setLogin(true));
    store.dispatch(setShowAlert(true));

    return true;
  } catch(error) {
    alert(error);
    return;
  }
};

export const logOut = async (router: NextRouter) => {
  try {
    signOut(auth);
    store.dispatch(setLogout(false));
    store.dispatch(setUser(""));
    store.dispatch(setUsername(""));
    router.push(ROUTES.LOGIN);
  } catch (error) {
    alert(error);
  }
};
