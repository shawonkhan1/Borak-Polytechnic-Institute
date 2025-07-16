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
import MakeUsertoAdmin from "../DashBord/MakeUsertoAdmin";
import AddEventForm from "../DashBord/AddEventForm";

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
        element: (
          <PrivateRoute>
            <AllClassDetails></AllClassDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/payments/:id",
        element: <Payment></Payment>,
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
    element: (
      <PrivateRoute>
        <DashBordLayouts />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <p>this is dashbord</p>,
      },
      {
        path: "teacher-requests",
        element: <TeacherRequestsTable />,
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <DashProfile></DashProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "my-class",
        Component: MyClass,
      },
      {
        path: "add-class",
        element: (
          <PrivateRoute>
            <AddClass></AddClass>
          </PrivateRoute>
        ),
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
      {
        path: "usertoadmin",
        Component: MakeUsertoAdmin,
      },
      {
        path: "addevent",
        element: (
          <PrivateRoute>
            {" "}
            <AddEventForm></AddEventForm>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
