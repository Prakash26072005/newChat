import React, { useState, useRef } from "react";
import "./register.css";
import Loader from "./Loader/loader";
import axios from "axios";
const Register = ({ funcSetLogin }) => {

  const passwordRef = useRef();
  const nameRef = useRef();

  const [ProfileModel, SetProfileModel] = useState(false);
  const [inputField, setInputFields] = useState({
    mobileNumber: "",
    password: "",
    name: "",
    profilePic:
      "https://images.unsplash.com/photo-1728887823143-d92d2ebbb53a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcnRvb24lMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D",
  });
  const [loading, setLoading] = useState(false);
  const handleSetImage = (link) => {
    setInputFields({
      ...inputField,
      ["profilePic"]: link,
    });
  };
  const HandleClickNotRegistered = () => {
    funcSetLogin(true);
  };
  const handleOnChange = (event, key) => {
    setInputFields({
      ...inputField,
      [key]: event.target.value,
    });
  };

  const handleRegister = async () => {
    setLoading(true);
    await axios
      .post("http://localhost:8000/api/auth/register", inputField)
      .then((response) => {
        console.log(response);
        funcSetLogin(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login">
      {loading && <Loader />}
      <div className="register-card">
        <div className="card-name">Register</div>
        <div className="login-form">
          <input
            
            type="text"
            value={inputField.mobileNumber}
            onChange={(event) => handleOnChange(event, "mobileNumber")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                passwordRef.current.focus();
              }
            }}
            className="inputBox"
            placeholder="Enter Mobile No."
          />

          <input
            ref={passwordRef}
            type="password"
            value={inputField.password}
            onChange={(event) => handleOnChange(event, "password")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                nameRef.current.focus();
              }
            }}
            className="inputBox"
            placeholder="Enter Password"
          />

          <input
            ref={nameRef}
            type="text"
            value={inputField.name}
            onChange={(event) => handleOnChange(event, "name")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRegister(); // Last field pe Enter => Register
              }
            }}
            className="inputBox"
            placeholder="Enter Name"
          />
          <div className="imageFile">
            <div className="select-profile-btn">Select Profile Image</div>
            <img
              className="avatar"
              src="https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
            />
          </div>
          <div className="button" onClick={handleRegister}>
            Register
          </div>
          <div className="linkedLinks" onClick={HandleClickNotRegistered}>
            Already have an account? Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
