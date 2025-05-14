import React, {createContext, useContext, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {ADMIN} from "../../utils/Roles.js";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isRefresh, setIsRefresh] = useState(true);
    const [isWasRefreshed , setIsWasRefreshed ] = useState(false);
    const [userRoles, setUserRoles] = useState(new Set());

    const setToken = (token) => {
        setAccessToken(token);
        if(token !== null) {
            const roles = new Set();
            const decodedToken = jwtDecode(token);
            if (decodedToken.realm_access && decodedToken.realm_access.roles) {
                decodedToken.realm_access.roles.forEach(role => roles.add(role));
            }
            setUserRoles(roles);
        }else {
            setUserRoles(new Set());
        }
    };

    const getToken = () => {
        return accessToken;
    };

    const setWasRefreshed = () => {
        if(!isWasRefreshed){
            setIsWasRefreshed(true);
        }

    }

    const setRefresh = (isRefresh) => {
        setIsRefresh(isRefresh);
    };

    const setAuth = (auth) => {
        setIsAuth(auth);
    };

    const openModal = () => {
        if (!isAuth) {
            setIsModalOpen(true)
        }
    };
    const closeModal = () => setIsModalOpen(false);

    const checkRoles = (roles) => {
        roles.push(ADMIN)
        return roles.some(role => userRoles.has(role))
    }
    return (
        <AuthContext.Provider
            value={{accessToken, setToken, isModalOpen, openModal, closeModal, setAuth, isAuth, setRefresh, isRefresh,
                userRoles, checkRoles, getToken, setWasRefreshed, isWasRefreshed}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
