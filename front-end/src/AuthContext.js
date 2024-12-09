import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        
        const loggedIn = localStorage.getItem("isAuthenticated");
        if (loggedIn === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("isAuthenticated");
        setIsAuthenticated(false);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
  };