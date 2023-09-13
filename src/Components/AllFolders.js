"use client"
import React, { useEffect, useState } from 'react'
import { CostState } from './Costcontext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchfoldersStart, fetchfoldersSuccess } from '@/redux/folders';
import axios from 'axios';
import FolderCard from './FolderCard';
import { AiFillFolderAdd } from 'react-icons/ai';
import { getFolders } from './functions';

const AllFolders = () => {
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolder, setNewFolder] = useState(false);
  const { navItem0, setNavItem0}= CostState();
  const folders = useSelector((state) => state.folders.Allfolders);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch= useDispatch();

  useEffect(()=>{
    getFolders(dispatch, user); 
    //eslint-disable-next-line
  },[])

  const handleAddFolder = async(e) => {
    e.preventDefault();    
    if (newFolderName.trim() === '') {
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    //works
    await axios.post('https://bakepricely.onrender.com/api/folder', {
      userid:user._id,
      name:newFolderName
    }, config).then(res=>{
      if(res.data) {
        getFolders(dispatch, user);
        setNewFolderName('');
      }
    })
  };
  return (
    <div className='flex flex-col h-[100%] pt-2 w-full px-11 items-center'>
        <h1 className='font-bold md:text-3xl text-2xl mb-5'>All Folders</h1>
        <div className='ml-2 cursor-pointer w-fit'>
        <button className='font-semibold w-[267px] h-[50px] bg-[#B3C0AE] my-3 rounded-lg flex items-center justify-center'
        onClick={()=> {setNavItem0("folder"); setNewFolder(!newFolder)}}>
          <AiFillFolderAdd className='w-5 h-5'/>
          New Folder
        </button>
        {
        newFolder &&
        <form onSubmit={(e)=>{handleAddFolder(e); setNewFolder(!newFolder)}} className="w-[267px]">
          <input placeholder="folder name" 
          autoFocus 
          onChange={(e) => setNewFolderName(e.target.value)}
          className="w-[full] pl-2 border-black border-solid border-[1px] rounded-lg" />
        </form>
        }   
      </div>
      <div className=' flex flex-col items-center justify-center max-w-full m-3 p-3;'>
        {folders.map((folder,index)=>{return <FolderCard folder={folder} key={index}/>} 
        )}
        {!folders &&<span className='md:text-center w-full'>No folders</span>}
      </div>
    </div>
  )
}

export default AllFolders