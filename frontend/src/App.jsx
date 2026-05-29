import './App.css'
import { useState } from 'react';
import {Route,Routes,Navigate} from "react-router-dom";
import Home from './Components/home'
import socket from './socket';
import Dashboard from './Components/Dashboard/dashboard';
function App() {
  const [isLogin,setIsLogin]= useState(localStorage.getItem("isLogin"));
    const setLoginFunc=(val)=>{
    setIsLogin(val)
  }


  return (
  <Routes>
      <Route path="/" element={isLogin?<Navigate to={"/dashboard"}/>: <Home setLoginFunc={setLoginFunc}/> }/>
      <Route path="/dashboard" element={ isLogin?<Dashboard setLoginFunc={setLoginFunc}/>:<Navigate to={"/"}/>}/> 
      </Routes>   
  )
}

export default App
