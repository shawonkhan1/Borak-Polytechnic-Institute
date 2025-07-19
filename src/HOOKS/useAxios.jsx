import axios from "axios";

const axiosInstance = axios.create({

     baseURL: `https://assigment-12-server.vercel.app`, 
    
})


const useAxios = () => {
    
    return axiosInstance;

};

export default useAxios;



