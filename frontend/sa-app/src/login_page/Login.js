import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";
import logo from "../navigation_page/assets/logo.svg";

// Defining the validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters") // Update min password length according to our reqs
    .required("Password is required"),
});

const Login = () => {
  const handleSubmit = (values) => {
    // Placeholder function for form submission
    console.log("Form submitted with:", values);
    alert("Login functionality not implemented yet.");
  };

  console.log("React:", React);
  console.log("Formik:", Formik);

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

        <div className="login-footer">
          <a href="/forgot-password" className="forgot-password">
            {/* Placeholder for future 'Forgot password' link*/}
            Forgot password?
          </a>
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
