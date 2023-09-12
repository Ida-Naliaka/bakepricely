"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Folder from './Folder';
import { AiFillFolderAdd } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { fetchfoldersStart, fetchfoldersSuccess } from '@/redux/folders';
import { BsFileEarmarkPlusFill, BsFolderFill } from 'react-icons/bs';
import { CostState } from './Costcontext';
import { fetchfilesFailure, fetchfilesSuccess } from '@/redux/files';
import { getFolders } from './functions';

const FolderSidebar = () => {
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolder, setNewFolder] = useState(false);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const user = useSelector((state) => state.user.currentUser);
    const folders = useSelector((state) => state.folders.Allfolders);
    const dispatch=useDispatch();
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
const handleAddFolder = async(e) => {
  e.preventDefault();
  setShow(!show);
  
  if (newFolderName.trim() === '') {
    return;
  }
  setLoading(true)
  //works
  await axios.post('http://localhost:5000/api/folder', {
    userid:user._id,
    name:newFolderName
  }, config).then(res=>{
    if(res.data) {
      getFolders(dispatch, user);
      setNewFolderName('');
      setLoading(false);
    }
  })
};

useEffect(()=>{
  getFolders(dispatch, user); 
  //eslint-disable-next-line
},[])
  return (
    <div className='mt-28'>
      <h3 className='font-semibold text-2xl my-3'>My Folders</h3>
        <div className='flex flex-col'>
           { folders && folders.map((folder, index)=>(
            <Folder folder={folder} key={index}/>
            ))
            }
            { !folders.length && <i>No folders yet</i>
            }
        </div>
        </div> 
   
  )
}

export default FolderSidebar