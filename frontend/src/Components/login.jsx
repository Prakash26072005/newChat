import { useState, useRef } from "react";
import "./login.css";
import api from "../axiosInstance";
import Loader from "./Loader/loader";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = ({ funcSetLogin, setLoginFunc }) => {
  const [inputField, setinputField] = useState({
    mobileNumber: "",
    password: "",
  });


  const passwordRef = useRef();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const HandleClickNotRegistered = () => {
    funcSetLogin(false);
  };
  const handleOnChange = (event, key) => {
    setinputField({
      ...inputField,
      [key]: event.target.value,
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    await api
      .post(   "/api/auth/login", inputField, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);

        let userInfo = response.data.user;
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("isLogin", "true");
        setLoginFunc(true);
        navigate("/dashboard");
      })
      .catch((err) => {
        let errMsg = err.response.data.error;
        toast.error(errMsg);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login">
      {loading && <Loader />}
      <ToastContainer />
      <div className="login-card">
        <div className="card-name">Login</div>
        <div className="login-form">
          <input
            type="text"
         
            value={inputField.mobileNumber}
            className="inputBox"
           onKeyDown={(e) => {
  if (e.key === "Enter") {
    passwordRef.current.focus();
  }
}}
            onChange={(event) => handleOnChange(event, "mobileNumber")}
            placeholder="Enter Mobile No."
          ></input>
          <input
            type="password"
            ref={passwordRef}
            value={inputField.password}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            className="inputBox"
            onChange={(event) => handleOnChange(event, "password")}
            placeholder="Enter Password"
          ></input>
          <div className="button" onClick={handleLogin}>
            Login
          </div>
          <div className="linkedLinks" onClick={HandleClickNotRegistered}>
            Not Rgistered Yet
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
