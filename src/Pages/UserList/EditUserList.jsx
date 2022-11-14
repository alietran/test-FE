import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

export default function EditUserList({ user, userList, parentCallback }) {
  // const { parentCallback } = props; //khai báo với props
  const [image, setImage] = useState();
    console.log(image);
  const updateUser = async (values) => {
    try {
      const result = await axios.patch(
        `https://reqres.in/api/users/${user?.id}`,
        {
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          id: user?.id,
        //   avatar: image,
        }
      );
      const result1 = { ...result.data, avatar: image };
      console.log("result1", result1);
      if (result && result?.data?.updatedAt) parentCallback(result1); //thành công mới cho phép gửi sang cha

      //   setUpdateUserInfo(true);
      console.log("result", result);
      console.log("values", values);
      console.log("userList", userList);
    } catch (err) {
      console.log("err", err);
    }
  };

  const formik = useFormik({
    enableReinitialize: true, // phai co moi dung dc getFieldProps
    initialValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      avatar: user?.avatar,
    },
    // validationSchema: CreateSchema,
    onSubmit: (values) => {
      //   uploadImageUser();

      updateUser(values);
      console.log("values", values);
    },
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    /* and other goodies */
  } = formik;

  const handleChangeFileImage = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e){
        setImage(e.target.result)
    }


  };

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit}>
        <div
          class="modal fade "
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticBackdropLabel">
                  Edit User
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div>
                  <div className="row">
                    <div className="col-6">
                      <p>
                        First Name <span className="text-danger">(*)</span>
                      </p>
                      <input
                        className="px-4 py-2 rounded-pill border-0 bg-light"
                        name="first_name"
                        {...getFieldProps("first_name")}
                        type="text"
                        placeholder=" First Name"
                      />
                    </div>
                    <div className="col-6">
                      <p>
                        Last Name <span className="text-danger">(*)</span>
                      </p>
                      <input
                        className="px-4 py-2 rounded-pill border-0 bg-light "
                        name="last_name"
                        type="text"
                        placeholder=" Last Name"
                        {...getFieldProps("last_name")}
                      />
                    </div>
                    <div className="mb-3"></div>
                  </div>
                  <div className="">
                    <p>
                      Email <span className="text-danger">(*)</span>
                    </p>
                    <input
                      //   value={values.email}
                      style={{ width: "100%" }}
                      className="px-4 py-2 rounded-pill border-0 bg-light "
                      name="email"
                      type="email"
                      placeholder="Email"
                      {...getFieldProps("email")}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Avatar
                    </label>
                    <input
                      className="form-control"
                      name="avatar"
                      type="file"
                      id="formFile"
                      onChange={handleChangeFileImage}
                    //   {...getFieldProps("avatar")}
                    />
                    <div>
                      <img style={{ width: "300px" }} src={image} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">
                  Save Changed
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
