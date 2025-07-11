import {
  createBrowserRouter,
  
} from "react-router";
import HomeLayout from "../Home/HomeLayout";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout
  },
]);