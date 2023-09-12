"use client"
import React, { useState } from "react";
import {
  BsFileEarmarkPlus,
  BsFileEarmarkPlusFill,
  BsFileEarmarkText,
  BsFileEarmarkTextFill,
  BsFolder,
  BsFolderFill,
} from "react-icons/bs";
import { CostState } from "./Costcontext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchfilesFailure, fetchfilesSuccess, setActiveFile } from "@/redux/files";
import { fetchfoldersStart, fetchfoldersSuccess } from "@/redux/folders";
import { useRouter } from "next/navigation";
import { getFiles, getFolders } from "./functions";

const Folder = ({ folder }) => {
  const [newFileName, setNewFileName] = useState("");
  const [showFiles, setShowFiles] = useState(false);
  const [show, setShow] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const {navItem0,setNavItem0, navitem1, navItem2, setNavItem1, setNavItem2}= CostState();
  const user = useSelector((state) => state.user.currentUser);
  const router=useRouter();
  const files = folder.files;
  const dispatch = useDispatch();
  
  const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

  const handleAddFile = () => {
    setShow(!show);
    if (newFileName.trim() === "") {
      return;
    }
    try {
      //sort out folder._id
      const newFile = {
        fileName: newFileName,
        filecontent: "",
        servings: 1,
        LabourCost: 0,
        LabourHours: 0,
        Overheads: 0,
        Profit: 0,
      };
      axios
        .put(`http://localhost:5000/api/folder?folderid=${folder._id}`, newFile, config)
        .then((res) => {
            getFiles(dispatch, user);
            getFolders(dispatch, user);
            setNewFile(!newFile);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div onClick={()=>{
        setNavItem0('folder');
        document.getElementById(folder.name).scrollIntoView({ behavior: "smooth"})
        setNavItem1(folder.name.charAt(0).toUpperCase() + folder.name.slice(1));
        setShowFiles(!showFiles)}}
        className=' flex items-center justify-center cursor-pointer w-fit' >
        <BsFolderFill className="w-[28px] h-[30px] mr-3"/>
        <span className="text-[22px] font-semibold">{folder.name.charAt(0).toUpperCase() + folder.name.slice(1)}</span>
        </div>
        <div className='flex flex-col items-start justify-center ml-3 cursor-pointer w-fit'>
          { showFiles && files.map((file, index) => (
          <div
          key={index}
          onClick={() => {
            dispatch(setActiveFile(file));
            setNavItem2(file.name.charAt(0).toUpperCase() + file.name.slice(1));
            router.push('/recipe')
          }}
          className="flex items-center justify-center cursor-pointer my-1"
          >
            <BsFileEarmarkTextFill className="w-[20px] h-[25px]"/>
            <span >{file.name.charAt(0).toUpperCase() + file.name.slice(1)}</span>
              </div>
            ))}
            </div>
            
            {showFiles && 
            <div className='flex items-center justify-center ml-5 cursor-pointer w-fit' >
                <BsFileEarmarkPlusFill onClick={()=>setNewFile(!newFile)} className="w-[15px] h-[20px]"/>
                {
                newFile?
                <form onSubmit={(e)=>{e.preventDefault(); handleAddFile();}} className="w-full">
                <input placeholder="file name"
                autoFocus  
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-[90%] pl-2" />
                </form>
                :
                <span onClick={()=>setNewFile(!newFile)} className='opacity-70'>New File</span>
                }
            </div>}
            </div>
  );
};

export default Folder;
