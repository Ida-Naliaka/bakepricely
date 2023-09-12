"use client"
import React, {useEffect} from "react";
import { CostState } from "@/Components/Costcontext";
import Login from "@/Components/Login";
import Signup from "@/Components/Signup";
import { logout } from "@/redux/user";
import { useDispatch } from "react-redux";
import { logoutFiles } from "@/redux/files";
import { logoutFolders } from "@/redux/folders";
  
  const Authenticate = () => {
    const { tab, setTab, selected, setSelected }= CostState();
    const dispatch= useDispatch();
    //eslint-disable-next-line
    useEffect(() => {
     dispatch(logout())
     dispatch(logoutFiles())
     dispatch(logoutFolders())
        //eslint-disable-next-line
      }, []);
      
    return (
      tab=="Login"? <Login/>:<Signup/>
    );
  };
  
  export default Authenticate;