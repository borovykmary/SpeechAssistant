import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Register.css";
import logo from "../navigation_page/assets/logo.svg";

// Define the validation schema using Yup
const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters") // Update min password length according to our reqs
    .required("Password is required"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const handleSubmit = (values) => {
    // Placeholder function for form submission
    console.log("Form submitted with:", values);
    alert("Register functionality not implemented yet.");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={logo} alt="Speech Assistant Logo" className="logo" />
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