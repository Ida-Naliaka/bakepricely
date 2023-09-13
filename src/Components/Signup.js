"use client"
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CostState } from "./Costcontext";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const {tab, setTab}= CostState();
    const router= useRouter();
  
    const handleClick = () =>{ setShow(!show)};
   
    const handleSubmit = async () => {
      const paswd = new RegExp("(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})");
      setLoading(true);
      if (!name || !email || !password || !confirmPassword) {
        toast.warning("Please Fill all the Fields.");
        setLoading(false);
        return;
      }
      if (password.match(paswd)) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          setLoading(false);
          return;
        }
        try {
          await axios.post("https://bakepricely.onrender.com/api/user/newuser", { name, email, password });
          toast.success("Registration Successful! Please check your email");
          setTab("Login");
          setLoading(false);
        } catch (error) {
          toast.error("Error Occured");
          console.log(error.response.data.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
        toast.error("Please set a strong password");
        return;
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center bg-[#BC8880] h-[100vh] w-[100vw] py-[5vh]">
        <h1 className="md:text-4xl text-2xl font-semibold my-7"> Welcome to BakePricely! Let&apos;s get started</h1>
        <form 
        className="flex flex-col w-fit items-center justify-center bg-[white] rounded-lg p-8 mb-8" 
        onSubmit={(e)=>{handleSubmit(); e.preventDefault()}}>
          <label className="font-semibold">Name</label>
          <input
          autoFocus 
          className="h-11 mb-3 border-black border-solid border-[1px] rounded-lg bg-[lightgray] text-[black] w-[60%] px-3"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          required
          />
          <label className="font-semibold">Email</label>
          <input
          className="h-11 mb-3 border-black border-solid border-[1px] rounded-lg bg-[lightgray] text-[black] w-[60%]"
          placeholder="email@example.com"
          onChange={(e) => setEmail(e.target.value)}
            required
          />
           <label className="text-center font-semibold">
            Password <br/>[at least 7 characters; must contain at least one digit and a
            special character]
          </label>
          <div className='relative w-full flex items-center justify-center'> 
            <input
            className="h-11 mb-3 border-black border-solid border-[1px] rounded-lg bg-[lightgray] text-[black] w-[60%]"
              type={show ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="h-[1.75rem] w-[3.5rem] hover:bg-[black] hover:text-[white] rounded-lg absolute top-[20%] right-[20%]"
            onClick={(e)=>{handleClick();e.preventDefault();}}>
                {show ? "Hide" : "Show"}
            </button>
            </div>
          <label className="font-semibold">
            Confirm Password
          </label>
          <div className='relative w-full flex items-center justify-center'> 
            <input
            className="h-11 mb-3 border-black border-solid border-[1px] rounded-lg bg-[lightgray] text-[black] w-[60%] "
            placeholder="Confirm Password"
            type={show ? "text" : "password"}
              onChange={(e) => setconfirmPassword(e.target.value)}
              required
            />
            <button className="h-[1.75rem] w-[3.5rem] hover:bg-[black] hover:text-[white] rounded-lg absolute top-[20%] right-[20%]"
            onClick={(e)=>{handleClick();e.preventDefault();}}>
                {show ? "Hide" : "Show"}
            </button>
            </div>
          <button
          className="bg-[#BC8880] hover:bg-[#EDD0C0] mt-7 py-3 w-[50%] rounded-lg"
          type="submit"
          disabled={loading}
        >
          Sign up
        </button>
         Already have an Account? <u onClick={()=>setTab("Login")}
         className="cursor-pointer"> Login</u>
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
  
  export default Signup;