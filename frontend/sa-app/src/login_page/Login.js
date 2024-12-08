import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Login.css";
import logo from "../navigation_page/assets/logo.svg";
import { useNavigate } from "react-router-dom";

// Defining the validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Username is required"),
  password: Yup.string().required("Password is required"),
});

// Function to fetch CSRF token from cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Do not check for the token before the first request
      const csrfToken = getCookie("csrftoken"); // CSRF token will be available after the first request

      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
          headers: {
            "X-CSRFToken": csrfToken || "", // Only attach CSRF token if available
          },
        }
      );

      alert("Login successful!");
      navigate("/navigation"); // Redirect to navigation page after successful login
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ email: "Incorrect email or password" });
      } else {
        alert("An error occurred during login.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Speech Assistant Logo" className="logo-login" />
        <h2>Welcome to Speech Assistant!</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                Log In
              </button>
            </Form>
          )}
        </Formik>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="sign-up">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
