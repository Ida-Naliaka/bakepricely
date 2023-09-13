"use client"
import React, {useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CostState } from "./Costcontext";
import {loginFailure,loginStart,loginSuccess,logout} from "../redux/user";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
  
  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const {tab, setTab, navItem0, setNavItem0}= CostState();
    const router= useRouter();
    const dispatch = useDispatch();

    const handleClick = () => setShow(!show);
    const handleSubmit = async () => {
      setLoading(true);
      if (!email || !password) {
        console.log("Please Fill All the Fields.");
        setLoading(false);
        return;
      }
      try {
        dispatch(loginStart());
        const userCred={email:email, password:password}
       return await axios
          .post("https://bakepricely.onrender.com/api/user/authenticate", userCred).then((res) => {
            dispatch(loginSuccess(res.data));
            setLoading(false);
            router.push('/home')
            setNavItem0('home')
          });
      } catch (error) {
        dispatch(loginFailure());
        toast.error('Error occurred')
        console.log(error)
        setLoading(false);
      }
    };
    return (
      <div className="flex flex-col items-center justify-center bg-[#EDD0C0] h-[100vh] w-[100vw] py-[5vh]">
        <h1 className="md:text-4xl text-2xl font-semibold my-7"> Welcome to BakePricely! Let&apos;s get started</h1>
        <form onSubmit={(e) => {
            handleSubmit();
            e.preventDefault();
          }}
          className="flex flex-col w-fit items-center justify-center bg-[white] rounded-lg p-8 mb-8">

          <label>Email</label>
          <input
          type="email"
          autoFocus 
          className="h-11 border-black border-solid border-[1px] rounded-lg bg-[lightgray] text-[black] w-[100%] px-3"
            placeholder="Enter your Email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="text-center font-semibold">
            Password 
          </label>
          <div className='relative w-full flex items-center justify-center'> 
            <input
            className="h-11 pl-3 mb-3 border-black border-solid border-[1px] rounded-lg bg-[lightgray] text-[black] w-[100%]"
              type={show ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="h-[1.75rem] w-[3.5rem] hover:bg-[black] hover:text-[white] rounded-lg absolute top-[20%] right-3"
            onClick={(e)=>{handleClick();e.preventDefault();}}>
                {show ? "Hide" : "Show"}
            </button>
            </div>
            <button
              type="submit"
              className="bg-[#BC8880] hover:bg-[#EDD0C0] mt-7 py-3 w-[50%] rounded-lg"
              disabled={loading}
            >
              Log In
            </button>
          Don&apos;t have an Account?<u onClick={()=>setTab("Signup")} className="cursor-pointer">Signup</u> 
        </form>
       <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
    );
  };
  
  export default Login;