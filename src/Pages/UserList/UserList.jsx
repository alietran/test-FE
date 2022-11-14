import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import styles from './UserList.module.css'; 
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import EditUserList from "./EditUserList";
import { CSVLink } from "react-csv";
export default function UserList() {
  const [userList, setUserList] = useState();
  const [search, setSearch] = useState([]);
  const [userListData, setUserListData] = useState();
  const [sorted, setSorted] = useState("ASC");
  const [userItem, setUserItem] = useState();
  const [csvFile, setCsvFile] = useState();
  let result = []
  if (userList) {

     result = Object.values(userList);
    console.log("arrUerList235", result);
  }
  console.log("csvFile", csvFile);
  // ASC la tang dan, dsc la giam dan
  const sorting = (name) => {
    console.log("name", name);
    if (sorted === "ASC") {
      const sorted = [...userList].sort((a, b) =>
        a[name].toLowerCase() > b[name].toLowerCase() ? 1 : -1
      );
      setUserList(sorted);
      setSorted("DSC");
    }
    if (sorted === "DSC") {
      const sorted = [...userList].sort((a, b) =>
        a[name].toLowerCase() < b[name].toLowerCase() ? 1 : -1
      );
      setUserList(sorted);
      setSorted("ASC");
    }
  };

  const headers = [
    { label: "first_name", key: "first_name" },
    { label: "last_name", key: "last_name" },
    { label: "email", key: "email" },
  ];

  console.log("userListData", userListData);
  const [image, setImage] = useState();
  console.log("image", image);

  const createNewUser = async (values) => {
    try {
      console.log("values add", values);
      const newUser = await axios.post("https://reqres.in/api/users", values);
      //   const
      setUserList([
        ...userList,
        {
          avatar: image,
          id: Number(newUser.data.id),
          first_name: newUser.data.name,
          last_name: newUser.data.job,
        },
      ]);
      console.log("newUser", newUser);
    } catch (err) {
      console.log("err", err);
    }
  };

  // form
  const CreateSchema = yup.object().shape({
    email: yup.string().email().required(),
  });

  const handleChangeFileImage = (e) => {
    const file = e.target.files[0];
    console.log("file", file);
    console.log(" e.target", e.target);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      console.log("e.target.result", e.target.result);
      setImage(e.target.result);
      //   formik.setFieldValue("avatar", e.target.result);
    };
  };

  const uploadImageUser = async () => {
    const formData = new FormData();
    // console.log("values", values);
    try {
      formData.append("file", image);
      formData.append("upload_preset", "dz60uf9y");
      const imageUser = await axios
        .post(
          "https://api.cloudinary.com/v1_1/bookstoremern/image/upload",
          formData
        )
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log("err", err);
        });
    } catch (err) {}
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      avatar: "",
      name: "",
      job: "",
    },
    // validationSchema: CreateSchema,
    onSubmit: async (values) => {
      //   uploadImageUser();
      createNewUser(values);
      // console.log("values", values);
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

  const handleImportCSV = (e) => {
    setCsvFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      processCSV(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const processCSV = (str, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    console.log("rows", rows);
    const newArr = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });
    // console.log("newArr", newArr.pop());
    const cusNewArr = newArr.pop();
    const newArrCopy = newArr;
    console.log("newArrửe", newArr);
    // const a= ["24","2"]
    if (newArr.length > 0) setUserList([...userList, ...newArrCopy]);
    // console.log("userList array", a);
  };
  const callbackFunction = (childData) => {
    const index = userList.findIndex((item) => item.id === childData.id);
    console.log("index", index);
    if (index !== -1) {
      console.log("childData", childData);
      userList[index] = childData;
      setUserList([...userList]);
    }

    console.log("userList", typeof userList);
  };
  console.log("userList124", typeof userList);
  console.log("userList125", userList);
  const getUserList = async (id) => {
    try {
      if (!userList || userList === "") {
        const result = await axios.get("https://reqres.in/api/users?page=1");
        setUserList(result?.data?.data);
        setUserListData(result.data);
        console.log("result32432", result);
      } else {
        const result = await axios.get(
          `https://reqres.in/api/users?page=${id}`
        );
        setUserList(result?.data?.data);
        setUserListData(result.data);
        console.log("result32432", result);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!userList) {
      getUserList();
      console.log("userList123", userList);
    }
  }, [userList]);

  const deleteUser = (id) => {
    const user = userList?.filter((item) => item.id !== id);
    setUserList(user);
    console.log("userList24", userList);
  };

  const handleEditUser = () => {
    console.log("userItem", userItem);
    const index = userList?.find((item) => item.id === userItem);
    console.log("index", index);
    // if(index){
    //   const updateUser = [...index]
    // }
  };
  const handleOpenEdit = (user) => {
    // console.log("id", id);
    setUserItem(user);
  };

  const handleDelete = (id) => {
    console.log("id", id);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteUser(id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleChangeSearch = (e) => {
    console.log("e.", e.target.value);
    const searchText = userList.filter(
      (item) => item.id === Number(e.target.value)
    );
    if (search !== " ") {
      setSearch(searchText);
      // setUserList(search);
      console.log("12", searchText);
    } else {
      console.log("1235", searchText);

      const result = axios.get("https://reqres.in/api/users?page=1");
      console.log("result24", result);
      setTimeout(() => {
        setUserList(result);
      }, 1000);

      // getUserList();
    }
  };

  useEffect(() => {
    if (search !== "") {
      console.log("see", search);

      setUserList(search);
    } else if (search === " ") {
      console.log("123634");
      const result = axios.get("https://reqres.in/api/users?page=1");
      console.log("result24", result);

      setUserList(result);
    }
  }, [search]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    console.log(event);
    const newOffset = event.selected + 1;
    getUserList(newOffset);
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <div className="container px-4">
      <div
        className="d-flex justify-content-center "
        style={{ position: "relative" }}
      >
        <div
          className={`${styles.iconSearch} d-flex justify-content-center align-items-center `}
          style={{ position: "absolute", left: "15px", top: "38%" }}
        >
          {" "}
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div
          onClick={() => sorting("first_name")}
          className="d-flex justify-content-center align-items-center  "
          style={{ position: "absolute", right: "25px", top: "38%" }}
        >
          <i class="fa-solid fa-arrow-down-a-z"></i>
        </div>

        <input
          className={`relative ${styles.search}`}
          type="text"
          style={{
            border: "none",
            margin: "10px 0",
            width: "100%",
            padding: "10px 10px 10px 50px",
          }}
          placeholder="Keyword"
          onChange={handleChangeSearch}
        />
      </div>
      <div
        className="d-flex justify-content-end"

        // onClick={handleNewUser}
      >
        <label
          className={`${styles.btnOption} btn btn-success p-2 text-right `}
        >
          <input
            type="file"
            name="csvFile"
            id="csvFile"
            style={{ display: "none" }}
            accept=".csv"
            onChange={(e) => {
              handleImportCSV(e);
            }}
          />
          <span className={`${styles.optionText}`}>
            <i class="fa fa-cloud-upload"></i> Upload Files
          </span>
        </label>

        {/* <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          className="btn btn-success p-2 text-right ms-1"
        > */}
        <CSVLink
          className={`${styles.btnOption} btn btn-success p-2 text-right ms-1 `}
          data={result}
          filename="user.csv"
          target="_blank"
          headers={headers}
        >
          <span className={`${styles.optionText}`}>
            <i class="fa-solid fa-file-export"></i> Export File
          </span>
        </CSVLink>
        {/* </button> */}
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          className={`${styles.btnOption} btn btn-success p-2 text-right ms-1`}
        >
          <span className={`${styles.optionText}`}>
            {" "}
            <i class="fa-solid fa-plus"></i> Add
          </span>
        </button>
      </div>

      <div className="row">
        {userList?.map((user, index) => {
          return (
            <div className="col-12 col-sm-12 col-md-2 my-2 col-lg-3 d-flex justify-content-center">
              {" "}
              <div className="d-flex jusitfy-content-center">
                <div
                  className="card mt-3 position-relative"
                  style={{ width: "15rem" }}
                >
                  <span
                    class="position-absolute  translate-middle badge bg-danger"
                    style={{
                      left: "30px",
                      top: "30px",
                      borderRadius: "50%",
                      height: "30px",
                      width: "30px",
                      lineHeight: "20px",
                    }}
                  >
                    {user.id}
                  </span>
                  <img
                    src={user.avatar}
                    className="card-img-top"
                    alt="..."
                    height={200}
                    width={150}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center">
                      {user.first_name + " " + user.last_name}
                    </h5>
                    <p className="card-text  text-center">{user?.email}</p>
                    <div className="d-flex justify-content-around  ">
                      <button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        onClick={() => handleOpenEdit(user)}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <EditUserList
                  user={userItem}
                  userList={userList}
                  parentCallback={callbackFunction}
                />
                <form onSubmit={handleSubmit}>
                  <div
                    class="modal  fade "
                    id="addModal"
                    data-bs-backdrop="addModal"
                    data-bs-keyboard="false"
                    tabindex="-1"
                    aria-labelledby="addModal"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="addModal">
                            Add new user
                          </h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body">
                          {/* <form onSubmit={handleSubmit}> */}
                          <div className="row">
                            <div className="col-6">
                              <p>
                                First Name{" "}
                                <span className="text-danger">(*)</span>
                              </p>
                              <input
                                className="px-4 py-2 rounded-pill border-0 bg-light"
                                name="name"
                                {...getFieldProps("name")}
                                type="text"
                                placeholder=" First Name"
                              />
                            </div>
                            <div className="col-6">
                              <p>
                                Last Name{" "}
                                <span className="text-danger">(*)</span>
                              </p>
                              <input
                                className="px-4 py-2 rounded-pill border-0 bg-light "
                                name="job"
                                {...getFieldProps("job")}
                                type="text"
                                placeholder=" Last Name"
                              />
                            </div>
                            <div className="mb-3"></div>
                          </div>
                          {/* <div className="">
                          <p>
                            Email <span className="text-danger">(*)</span>
                          </p>
                          <input
                            style={{ width: "100%" }}
                            className="px-4 py-2 rounded-pill border-0 bg-light "
                            name="email"
                            {...getFieldProps("email")}
                            type="text"
                            placeholder="Email"
                          />
                        </div> */}
                          <div className="mb-3">
                            <label htmlFor="formFile" className="form-label">
                              Avatar
                            </label>
                            <input
                              className="form-control"
                              type="file"
                              id="formFile"
                              name="avatar"
                              onChange={handleChangeFileImage}
                            />
                            <div>
                              <img
                                style={{ width: "300px" }}
                                src={image}
                                alt=""
                              />
                            </div>
                          </div>
                          {/* </form> */}
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
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={userListData?.total_pages}
        previousLabel="< previous"
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        renderOnZeroPageCount={null}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}
