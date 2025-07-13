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
import AddClass from "../DashBord/AddClass";
import RequstApporveClass from "../DashBord/RequstApporveClass";
import MyClass from "../DashBord/Myclass";
import UpdateMyClass from "../DashBord/UpdateMyClass";
import MyClassDetils from "../DashBord/MyClassDetils";
import DashProfile from "../DashBord/DashProfile";
import AllClass from "../Page/AllClass";
import AllClassDetails from "../Page/AllClassDetails";
import Payment from "../Page/Payment";
import MyEnrollClass from "../DashBord/MyEnrollClass";
import MyEnrollClassDetails from "../DashBord/MyEnrollClassDetails";

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
        Component: AllClass,
      },
      {
        path: "/class/:id",
        Component: AllClassDetails,
      },
      {
        path: "/payments/:id",
        element: <PrivateRoute><Payment></Payment></PrivateRoute>
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
        path: "profile",
        Component: DashProfile,
      },
      {
        path: "my-class",
        Component: MyClass,
      },
      {
        path: "add-class",
        Component: AddClass,
      },
      {
        path: "my-enroll-class-details",
        element: <p>my-enroll-class-details</p>,
      },
      {
        path: "my-enroll-class",
        Component: MyEnrollClass,
      },
      {
        path: "myenroll-class/:id",
        Component: MyEnrollClassDetails,
      },

      {
        path: "request-approve",
        Component: RequstApporveClass,
      },
      {
        path: "updateMyclass/:id",
        element: <UpdateMyClass />,
      },
      {
        path: "seeDetails/:id",
        Component: MyClassDetils,
      },
    ],
  },
]);
