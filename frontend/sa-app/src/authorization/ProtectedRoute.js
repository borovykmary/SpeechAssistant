import React, {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";

const isAuthenticated = async () => {
  const response = await fetch("http://localhost:8000/api/check_login/", 
    {credentials: "include"});
    if (response.ok) {
      return true;
    } else {
      return false;
    }
};

const ProtectedRoute = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
      const checkAuth = async () => {
        const loggedIn = await isAuthenticated();
        setAuth(loggedIn);
        setLoading(false);
      };
      checkAuth();
  }, []);

  if (loading) {
    return <div>Loading... </div>;
  }
  
  if (!auth) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;