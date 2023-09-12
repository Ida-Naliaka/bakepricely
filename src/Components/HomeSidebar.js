"use client"
import React, { useEffect, useState } from 'react'
import { CostState } from './Costcontext'
import axios from 'axios';
import { BsFileEarmarkPlusFill, BsFileEarmarkTextFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {fetchfilesStart, setActiveFile, fetchfilesSuccess, fetchfilesFailure, fetchfolderedfilesSuccess, fetchUnfolderedfilesSuccess} from "../redux/files";
import { useRouter } from 'next/navigation';
import { getFiles } from './functions';

const HomeSidebar = () => {
    const {navItem2, setNavItem2, navItem1, setNavItem1, navItem0, setNavItem0}= CostState();
    const [show, setShow ]=useState(false);
    const [fileName, setFileName ]=useState(false);
    const user = useSelector((state) => state.user.currentUser);
    const files = useSelector((state) => state.files.files);
    const dispatch = useDispatch();
    const router= useRouter()
    const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

useEffect(()=>{
 getFiles(dispatch, user);
  //eslint-disable-next-line
},[])

const handleAddFile=(e)=>{
    e.preventDefault();
    if (fileName.trim() === '') {
        return;
    }
  //works
    const newFile = {
      fileName:fileName,
      servings: 1,
      fileContent: "", 
      LabourCost:0,
      LabourHours: 0,
      Overheads : 0,
      Profit:0,
    };
    axios.put(`http://localhost:5000/api/user/newfile?userid=${user._id}`, newFile, config).then((res)=>{
     getFiles(dispatch, user);
      dispatch(setActiveFile(res.data));
      setNavItem1(res.data.name)
      setFileName('');
      setShow(false)
    })        
}

  return (
    <div className='mt-28'>
        <h3 className='font-semibold text-2xl my-3'>My Recipes</h3>
        <div className='flex flex-col items-start justify-center'>
           { files.map((file, index)=>(
            <div key={index} 
            onClick={()=>{
              dispatch(setActiveFile(file));
              setNavItem1(file.name); router.push('/recipe')}}
             className=' flex items-center justify-center cursor-pointer my-2' >
              <BsFileEarmarkTextFill/>
              <span>{file.name.charAt(0).toUpperCase() + file.name.slice(1)}</span>
            </div>
            ))}
            <div className='flex items-center justify-center ml-5 cursor-pointer w-fit' >
                <BsFileEarmarkPlusFill onClick={()=>setShow(!show)}/>{
                show?
                <form onSubmit={handleAddFile} className="w-full">
                <input 
                autoFocus 
                placeholder="file name" 
                onChange={(e)=>setFileName(e.target.value)}
                className="w-[90%] pl-2" />
                </form>
                :
                <span onClick={()=>setShow(!show)} className='opacity-70'>New File</span>
                }
            </div>
        </div>
        </div>
  )
}

export default HomeSidebar