import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Login.css";
import logo from "../navigation_page/assets/logo.svg";

// Defining the validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Username is required"),
  password: Yup.string()
    .required("Password is required"),
});

const Login = () => {

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/login/", {
          email: values.email,
          password: values.password,
        });
  
        // Handle success (e.g., store token)
        alert("Login successful!"); // for development purposes
        localStorage.setItem("token", response.data.token);
        console.log("User token:", response.data.token);
  
        // Optionally redirect to a different page (e.g., tasks)
        window.location.href = "/navigation";
      } catch (error) {
        // Handle errors
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
        <img src={logo} alt="Speech Assistant Logo" className="logo" />
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

        <div className="login-footer">{/*
          <a href="/forgot-password" className="forgot-password">
            {/* Placeholder for future 'Forgot password' link
            Forgot password?
          </a>*/}
          <p>
            Don't have an account?{" "}
            <a href="/register" className="sign-up">
              {/* Placeholder for 'Sign Up' link*/}
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
