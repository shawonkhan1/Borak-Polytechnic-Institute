import { createBrowserRouter } from "react-router";
import HomeLayout from "../Home/HomeLayout";
import HomePage from "../Home/HomePage";
import Register from "../Authnection/Register";
import Login from "../Authnection/Login";
import UserProfile from "../Page/UserProfile";
import UpdateProfile from "../Page/UpdateProfile";
import PrivateRoute from "../Private/PrivateRoute";
import ApplyTeacher from "../Page/ApplyTeacher";

import DashBordLayouts from "../DashBord/DashBordLayouts";
import TeacherRequestsTable from "../Page/TeacherRequestsTable";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    errorElement: <p>this is error page</p>,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/allclass",
        element: <p>this is all class</p>,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <UserProfile></UserProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "updateProfile",
        element: (
          <PrivateRoute>
            <UpdateProfile></UpdateProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/apply_Teacher",
        element: (
          <PrivateRoute>
            <ApplyTeacher></ApplyTeacher>
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "dashboard",
    element: <DashBordLayouts />,
    children: [
      {
        index: true,
        element: <p>oi kire</p>,
      },
      {
        path: "teacher-requests",
        element: <TeacherRequestsTable />,
      },
      {
        path:'profile',
        element: <p>profile</p>
      },
      {
        path:'my-class',
        element: <p className="text-4xl">my class</p>
      },
      {
        path:'add-class',
        element: <p>add class</p>
      },
      {
        path:'my-enroll-class-details',
        element: <p>my-enroll-class-details</p>
      },
      {
        path:'my-enroll-class',
        element: <p>my enroll class</p>
      }
      
    ],
  },
]);
