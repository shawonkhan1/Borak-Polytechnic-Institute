import {
  createBrowserRouter,
  
} from "react-router";
import HomeLayout from "../Home/HomeLayout";
import HomePage from "../Home/HomePage";
import Register from "../Authnection/Register";
import Login from "../Authnection/Login";
import UserProfile from "../Page/UserProfile";
import UpdateProfile from "../Page/UpdateProfile";
import PrivateRoute from "../Private/PrivateRoute";


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
        },
        {
            path:'/register',
            Component: Register
        },
        {
            path:'/login',
            Component: Login
        },
        {
            path:'/profile',
            element: <PrivateRoute>
                <UserProfile></UserProfile>
            </PrivateRoute>
        },
        {
            path:'updateProfile',
            element: <PrivateRoute>
                <UpdateProfile></UpdateProfile>
            </PrivateRoute>
        }
    ]
    
  },
]);