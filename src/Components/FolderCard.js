"use client";
import React, { useState } from 'react'
import { BsFileEarmarkPlusFill, BsFileEarmarkText, BsTrash3Fill } from 'react-icons/bs';
import Calculator from './Calculator';
import axios from 'axios';
import { fetchfoldersStart, fetchfoldersSuccess } from '@/redux/folders';
import { useDispatch, useSelector } from 'react-redux';
import { fetchfilesFailure, fetchfilesSuccess } from '@/redux/files';
import { CostState } from './Costcontext';
import { getFiles, getFolders } from './functions';

const FolderCard = ({folder}) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFile, setNewFile] = useState(false);
  const activeFile = useSelector((state) => state.files.activeFile);
  const user = useSelector((state) => state.user.currentUser);
  const {navItem0, setNavItem0}= CostState();
  const files = folder.files;
  const dispatch= useDispatch();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleAddFile = () => {
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
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      axios
        .put(`https://bakepricely.onrender.com/api/folder?folderid=${folder._id}`, newFile, config)
        .then((res) => {
            getFiles(dispatch, user);
            getFolders(dispatch, user);
            setNewFile(!newFile);
            setNewFileName('')
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteFolder=async()=>{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      await axios.delete(`https://bakepricely.onrender.com/api/folder?folderid=${folder._id}`, config).then((res)=>{
      getFolders(dispatch, user);
      getFiles(dispatch, user);
    })
    } catch (error) {
      console.log(error);
    }
}
  return (
    <div className='flex flex-col h-[100%] pt-2 w-full px-11 items-center' id={folder.name} >
        <h1 className='font-bold md:text-3xl text-2xl'>
          {folder.name.charAt(0).toUpperCase() + folder.name.slice(1)}
        </h1>
        <div className=' flex flex-col items-center justify-center 
        lg:grid grid-cols-[repeat(auto-fit,minmax(200px,auto))] gap-x-3 gap-y-3 
        auto-rows-[repeat(auto-fit,minmax(50px,auto))] max-w-full m-3 p-3'>
        {files && files.map((file,index)=>{
        return <Calculator Newrecipe={file} key={index}/> }
        )}
        {!files.length &&<span className='md:text-center w-full'>No files in folder</span>}
    </div>
    {
    newFile &&(
    <form onSubmit={(e)=>{e.preventDefault(); handleAddFile();}} className="w-[267px]">
      <input placeholder="file name" 
      value={newFileName}
      onChange={(e) => setNewFileName(e.target.value)}
      className="w-[full] pl-2 border-black border-solid border-[1px] rounded-lg" />
      </form>
      )
      }
      <button className='font-semibold w-[267px] h-[50px] bg-[#B3C0AE] my-3 rounded-lg flex items-center justify-center'
      onClick={()=>{setNavItem0("folder");setNewFile(!newFile)}}>
        <BsFileEarmarkPlusFill className="w-5 h-5"/>
        New Recipe!
      </button>
      <div
          onClick={() => handleDeleteFolder()}
          className="bg-[red] hover:text-white text-black rounded-full w-[267px] cursor-default flex items-center justify-center"
        > Delete folder <BsTrash3Fill />
        </div>
      <hr/>
    </div>
  )
}

export default FolderCard