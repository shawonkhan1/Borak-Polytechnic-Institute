import {
  createBrowserRouter,
  
} from "react-router";
import HomeLayout from "../Home/HomeLayout";
import HomePage from "../Home/HomePage";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    errorElement: <p>this is error page</p>,
    children: [
        {
            path:'/',
            Component: HomePage
        },
        {
            path: '/allclass',
            element: <p>this is all class</p>
        }
    ]
    
  },
]);