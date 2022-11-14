import React from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
export default function Login() {
  const navigate = useNavigate();

  const login = async () => {
    {
      try {
       
        const loginUser = await axios.post("https:reqres.in/api/login", {
          email: values.email,
          password: values.password,
        });
    
        localStorage.setItem("token", JSON.stringify(loginUser.data.token));

        navigate("/");
      } catch (err) {
       
      }
    }
  };

  const loginSchema = yup.object().shape({
    password: yup.string().required(),
    email: yup.string().email().required(),
  });
  const formik = useFormik({
    initialValues: {
      email: "eve.holt@reqres.in",
      password: "cityslicka",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login();
    },
  });
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    /* and other goodies */
  } = formik;
  return (
    <div class="container">
      <div class="row ">
        <div class="col-6">
          <div className="  ">
            <img
              src="./Login.jpg"
              height={550}
              width={650}
              style={{ marginTop: "50px" }}
            />
          </div>
        </div>

        <div class="col-6  d-flex flex-column  justify-content-center align-items-center">
          <h1 className="mb-4">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <h5>
                Email <span className="text-danger">(*)</span>
              </h5>
              <input
                className="px-5 py-2 rounded-pill border-0 bg-light mt-2"
                name="email"
                type="text"
                {...getFieldProps("email")}
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="mb-3">
              <h5>
                Password <span className="text-danger">(*)</span>
              </h5>
              {/* <i className="fa-solid fa-envelope absolute ml-4"></i> */}
              <input
                name="password"
                placeholder="Password"
                className="px-5 py-2 rounded-pill border-0 bg-light mt-2"
                type="password"
                {...getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="mt-4 text-center">
              {" "}
              <button
                type="submit"
                className="btn btn-success p-2 rounded-pill px-5 "
                style={{ width: "280px" }}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
