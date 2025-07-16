import React, { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase.init";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // when user login succesfully then loading is false

  const provider = new GoogleAuthProvider();

  // Register user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // LogOut user
  const Logout = () => {
    return signOut(auth);
  };

  // Login User
  const Login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // userProfile Pic and name
  const updateuser = (updateData) => {
    return updateProfile(auth.currentUser, updateData);
  };

  // login with google
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        setLoading(false);
         toast.success("Account Login successfully!");
        return result;
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  // update user profile
  const updateUserProfiles = (name, PhotoURL) => {
    const updateData = {
      displayName: name,
      photoURL: PhotoURL,
    };
    return updateProfile(auth.currentUser, updateData)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // forget password
  const forgetPass = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // onAuthStateChanged just one time run and save user data
  useEffect(() => {
    const unScribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unScribe();
    };
  }, []);

  // share data
  const authData = {
    user,
    setUser,
    createUser,
    Logout,
    Login,
    loading,
    setLoading,
    updateuser,
    googleLogin,
    updateUserProfiles,
    forgetPass,
  };
  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
