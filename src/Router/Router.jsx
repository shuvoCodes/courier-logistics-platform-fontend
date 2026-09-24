import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import HomePage from '../Pages/HomePage'
// import AdminDashboard from "../Pages/AdminDashboard";
import Registration from "../Pages/Registration";
import Login from "../Pages/Login";
import AdminLayout from "../Layout/AdminLayout";
import UserLayout from "../Layout/UserLayout";
import AdminUsers from "../Pages/Admin/AdminUsers";
import UpdateUser from "../Pages/Admin/UpdateUser";
import CreateParcel from "../Pages/Admin/CreateParcel";
import AllParcels from "../Pages/Admin/AllParcels";
import UpdateParcel from "../Pages/Admin/UpdateParcel";
import Tracking from "../Pages/Admin/Tracking";
import TrackingById from "../Pages/Admin/TrackingById";
import Profile from "../Pages/Admin/Profile";
import PrivateRoute from "../Content/PrivateRoute";
import CreateParcelUsers from "../Pages/User/CreateParcelUsers";
import AllParcelsUsers from "../Pages/User/AllParcelsUsers";
import UpdateParcelUsers from "../Pages/User/UpdateParcelUsers";
import TrackingUsers from "../Pages/User/ProfileUsers";
import TrackingByIdUsers from "../Pages/User/TrackingByIdUsers";
import ProfileUsers from "../Pages/User/ProfileUsers";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/registration',
        element: <Registration />
      },
      {
        path: '/login',
        element: <Login />
      },

    ],
  },
  {
    path: '/admin',
    element: <PrivateRoute><AdminLayout /></PrivateRoute>,
    children: [
      {
        path: '/admin',
        element: <PrivateRoute><AdminUsers /></PrivateRoute>
      },
      {
        path: 'users/:users_id/update',
        element: <PrivateRoute><UpdateUser /></PrivateRoute>
      },
      {
        path: '/admin/createparcel',
        element: <PrivateRoute><CreateParcel /></PrivateRoute>
      },
      {
        path: '/admin/allparcels',
        element: <PrivateRoute><AllParcels /></PrivateRoute>
      },
      {
        path: 'allparcels/parcels/update/:parcelId',
        element: <PrivateRoute> <UpdateParcel /></PrivateRoute>
      },
      {
        path: 'allparcels/tracking/:parcelId',
        element: <PrivateRoute> <Tracking /></PrivateRoute>
      }
      ,
      {
        path: '/admin/tracking',
        element: <PrivateRoute> <TrackingById /></PrivateRoute>
      },
      {
        path: '/admin/profile',
        element: <PrivateRoute><Profile /></PrivateRoute>
      }
    ]
  },
  {
    path: '/user',
    element: <PrivateRoute><UserLayout /></PrivateRoute>,
    children: [
      {
        path: '/user/createparcel',
        element: <PrivateRoute><CreateParcelUsers /></PrivateRoute>
      },
      {
        path: '/user',
        element: <PrivateRoute><AllParcelsUsers /></PrivateRoute>
      },
      {
        path: 'parcels/update/:parcelId',
        element: <PrivateRoute> <UpdateParcelUsers /></PrivateRoute>
      },
      {
        path: 'allparcels/tracking/:parcelId',
        element: <PrivateRoute> <TrackingUsers /></PrivateRoute>
      }
      ,
      {
        path: '/user/tracking',
        element: <PrivateRoute> <TrackingByIdUsers /></PrivateRoute>
      },
      {
        path: '/user/profile',
        element: <PrivateRoute><ProfileUsers /></PrivateRoute>
      }
    ]
  },
]);
