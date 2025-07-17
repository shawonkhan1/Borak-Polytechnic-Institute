// useAxiosSecure.jsx
import { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthProvider/AuthProvider";
import Loading from "../Share/Loading";

const axiosSecure = axios.create({
  baseURL: "https://assigment-12-server.vercel.app",
});

const useAxiosSecure = () => {

  const { user } = useContext(AuthContext);
 const token = user?.accessToken;

{!user && <Loading></Loading>}
  useEffect(() => {

    const requestInterceptor = axiosSecure.interceptors.request.use(
     async (config) => {
       

       



        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };

  }, [user,token]);

  return axiosSecure;
};

export default useAxiosSecure;




