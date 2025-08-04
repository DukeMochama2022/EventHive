import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

//create context
export const AuthContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const backendURL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://eventhive-backend.onrender.com";
    
  console.log("AuthContext - Backend URL:", backendURL);
  console.log("AuthContext - VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthStatus = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        // Set user data directly from the is-auth response
        setUserData(data.user);
      } else {
        setIsLoggedIn(false);
        setUserData(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(false);
      // Optionally suppress toast here
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/user/data");
      data.success ? setUserData(data.userData) : setUserData(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setUserData(false);
        setIsLoggedIn(false);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    getAuthStatus();
  }, []);

  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
