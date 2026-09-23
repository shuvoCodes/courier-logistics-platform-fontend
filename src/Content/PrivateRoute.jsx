import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({children}) => {
   const {loading,accessToken} = useContext(AuthContext);

   if(loading) return <div className="flex justify-center items-center h-screen">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
   if(!accessToken) {return <Navigate to='/login'></Navigate>}

   return children
};

export default PrivateRoute;