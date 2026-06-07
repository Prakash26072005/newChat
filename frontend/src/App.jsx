import './App.css'
import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Home from './Components/home'
import Dashboard from './Components/Dashboard/dashboard';
import api from './axiosInstance';

function App() {
  const [isLogin, setIsLogin] = useState(() => localStorage.getItem("isLogin") === "true");

  const setLoginFunc = (val) => {
    setIsLogin(val);
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!localStorage.getItem("isLogin")) return;

      try {
        const response = await api.get("/api/auth/me", { withCredentials: true });

        if (response.data?.user) {
          localStorage.setItem("userInfo", JSON.stringify(response.data.user));
          setIsLogin(true);
          return;
        }
      } catch (error) {
        console.log("Session verification failed", error);
      }

      localStorage.removeItem("isLogin");
      localStorage.removeItem("userInfo");
      setIsLogin(false);
    };

    verifySession();
  }, []);

  return (
  <Routes>
      <Route path="/" element={isLogin?<Navigate to={"/dashboard"}/>: <Home setLoginFunc={setLoginFunc}/> }/>
      <Route path="/dashboard" element={ isLogin?<Dashboard setLoginFunc={setLoginFunc}/>:<Navigate to={"/"}/>}/> 
      </Routes>   
  )
}

export default App
