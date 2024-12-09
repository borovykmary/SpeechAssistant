import React, {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const isAuthenticated = async () => {
  try {
    const csrfToken = getCookie("csrftoken");  // Get CSRF token from cookies

    if (!csrfToken) {
      console.log("CSRF token is missing");  // You can also debug here
      return false;  // Early exit if CSRF token is not found
    }

    const response = await fetch("http://localhost:8000/api/check_login/", {
      method: "GET",
      credentials: "include",  // Ensure cookies (sessionid, csrftoken) are sent
      headers: {
        "X-CSRFToken": csrfToken,  // Add CSRF token in headers
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.log("Authentication failed");
      return false;
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
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
    return <div>Loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/" />; // Redirect to landing page if not authenticated
  }

  return children;
};


export default ProtectedRoute;