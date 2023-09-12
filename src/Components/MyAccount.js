"use client"
import React, { useEffect, useState } from 'react'
import { BsEye } from 'react-icons/bs';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFile } from '@/redux/files';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MyAccount = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [show, setShow]= useState(false);
  const [err, setErr]= useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch=useDispatch();
  const router= useRouter();
  useEffect(()=>{
    dispatch(setActiveFile({}))
    //eslint-disable-next-line
  },[])

  const handleSubmit = async () => {
    const paswd = new RegExp("(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})");
    setLoading(true);
    if (!password || !confirmPassword) {
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
        await axios.post("http://localhost:5000/api/user/changepassword", { password }).then(()=>{
          toast.success("Successfully changed password");
        router.push('/');
        setLoading(false);
        })
      } catch (error) {
        toast.errror("Error Occured");
        console.log(error.response.data.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErr(true);
      setPassword("")
      setconfirmPassword("")
      return;
    }
  };
  const handleClick=()=>{setShow(!show)}
  const  handleDelete=async()=>{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
  };
    try {
       await axios.delete(`http://localhost:5000/api/user/deleteuser?userid=${user._id}`, config).then((res)=>{
     router.push('/')
    })
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='h-[100%] pt-2 w-full flex flex-col items-center md:px-11'>
      <h1 className='font-bold text-3xl my-5'>{user.name}&apos;s Profile</h1>
    <form className='w-fit h-[fit] md:bg-[#DFDADA] flex flex-col p-3'>
      <div className='flex my-2 md:flex-row flex-col'>
        <span className='font-semibold text-[18px]'> Username</span>
        <span className='w-fit h-[28px] rounded-lg bg-white px-3 md:ml-11'>{ user.name }</span>
      </div>
      <div className='flex md:flex-row flex-col my-2'>
        <label className='font-semibold text-[18px]'>Email Address</label>
        <span className='w-fit h-[28px] rounded-lg bg-white px-3 md:ml-11'> {user.email} </span>
      </div>
      <div className='font-semibold text-[18px] flex flex-col'>Change password</div>
      <div className='flex items-start justify-around my-2 md:flex-row flex-col'>
        <label className='font-medium text-[16px] w-[60%]'>New Password </label>
        <div className='relative w-full flex items-center justify-center'> 
        <input
        type= {show?"text":"password"}
        autoFocus 
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className='w-fit h-[28px] px-3 rounded-lg bg-white'
        />
        <button className="h-[1.75rem] w-[3.5rem] rounded-lg absolute top-[10%] right-0"
        onClick={(e)=>{handleClick();e.preventDefault();}}>
          {show ?  <BsEye/> : <AiFillEyeInvisible/>}
        </button>
        </div>
      </div>
      {err&& <span className='text-[red]'>[at least 7 characters; must contain at least one digit and a
            special character]</span>}
      <div className='flex items-start justify-around my-2 md:flex-row flex-col'>
      <label className='font-medium text-[16px] w-[60%]'>Confirm Password</label>
      <div className='relative w-full flex items-center justify-center'> 
        <input
        type= {show?"text":"password"}
        placeholder="Confirm Password"
        onChange={(e) => setconfirmPassword(e.target.value)}
        className='w-fit h-[28px] px-3 rounded-lg bg-white'
        />
        <button className="h-[1.75rem] w-[3.5rem] rounded-lg absolute top-[10%] right-0"
        onClick={(e)=>{handleClick();e.preventDefault();}}>
          {show ?  <BsEye/> : <AiFillEyeInvisible/>}
        </button>
        </div>
      </div>
      <div onClick={()=>handleSubmit()} className='rounded-lg md:bg-[#BC8880] bg-[#DFDADA] w-fit px-5 cursor-pointer'>
        Submit
      </div>
        <button className='w-fit h-[28px] rounded-lg bg-[red] px-3 ml-11 text-[white] my-7' onClick={handleDelete}> DELETE ACCOUNT</button>
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
  )
}

export default MyAccount