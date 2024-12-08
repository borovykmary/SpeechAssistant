import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./Register.css";
import logo from "../navigation_page/assets/logo.svg";

// Define the validation schema using Yup
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters") // Update min password length according to our reqs
    .matches(/[A-Z]/, "Password must contain at least capital letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please re-enter your password"),
});

const Register = () => {
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        email: values.email,
        password: values.password,
        password2: values.repeatPassword,
      });

      // Handle success
      alert("Registration successful!"); // for development purposes
      console.log("User registered:", response.data.user);

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("An error occurred during registration.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={logo} alt="Speech Assistant Logo" className="logo-register" />
        <h2>Welcome to Speech Assistant!</h2>

        <Formik
          initialValues={{ email: "", password: "", repeatPassword: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="register-form">
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

              <div className="form-field">
                <label htmlFor="repeatPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="repeatPassword"
                  placeholder="Re-enter your password"
                />
                <ErrorMessage
                  name="repeatPassword"
                  component="div"
                  className="error"
                />
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={isSubmitting}
              >
                Register
              </button>
            </Form>
          )}
        </Formik>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <a href="/login" className="log-in">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;