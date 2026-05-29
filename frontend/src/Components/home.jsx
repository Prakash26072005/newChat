import React , {useState} from "react";
import './home.css';
import Login from './login';
import Register from "./register";
const Home = ({setLoginFunc}) => {
    const [loginPage,setLoginPage]= useState(false)
       const funcSetLogin=(val)=>{
        setLoginPage(val);
    }
  return (
    <div className="home">
{loginPage?<Login setLoginFunc={setLoginFunc} funcSetLogin={funcSetLogin}/>:<Register funcSetLogin={funcSetLogin}/>}
    </div>
  )
}

export default Home;