/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AuthContext = createContext();

const getInitialAuthState = () => {
    const token = localStorage.getItem("lm_token");

    if (!token) {
        return { authUser: null, accessToken: null };
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return { authUser: payload, accessToken: token };
    } catch (error) {
        console.log("Invalid token:", error);
        localStorage.removeItem("lm_token");
        return { authUser: null, accessToken: null };
    }
};

const AuthProvider = ({ children }) => {
    const [{ authUser, accessToken }, setAuthState] = useState(
        getInitialAuthState
    );
    const loading = false;

    const setAuthUser = (user) => {
        setAuthState((state) => ({ ...state, authUser: user }));
    };

    const setAccessToken = (token) => {
        setAuthState((state) => ({ ...state, accessToken: token }));
    };

    const logout = () => {
        localStorage.removeItem("lm_token");
        setAuthState({ authUser: null, accessToken: null });
    }

    return (
        <AuthContext.Provider
            value={{
                authUser,
                setAuthUser,
                accessToken,
                setAccessToken,
                loading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;