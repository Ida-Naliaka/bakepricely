"use client"
import { fetchfilesFailure, fetchfilesSuccess, logoutFiles, setActiveFile } from '@/redux/files';
import React, { useEffect, useState } from 'react'
import { BsChevronBarLeft, BsFileEarmarkPlusFill, BsFileEarmarkTextFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { CostState } from './Costcontext';
import { useRouter } from 'next/navigation';
import Folder from './Folder';
import { AiFillFolderAdd } from 'react-icons/ai';
import { fetchfoldersStart, fetchfoldersSuccess, logoutFolders } from '@/redux/folders';
import axios from 'axios';
import { logout } from '@/redux/user';
import OutsideClickHandler from './OutsideClickHandler';
import { getFiles, getFolders } from './functions';

const Hamburger = () => {
    const dispatch=useDispatch()
    const router= useRouter();
    const {navItem0, setNavItem0, navitem1, setNavItem1, nav, setNav}=CostState()
    const [show, setShow]=useState(false);
    const [fileName, setFileName ]=useState(false);
    const [recipes, setRecipes ]=useState(false);
    const [foldersActive, setFoldersActive ]=useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolder, setNewFolder] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFolder, setShowFolder] = useState(false);
   const user = useSelector((state) => state.user.currentUser);
   const files = useSelector((state) => state.files.files);
   const folders = useSelector((state) => state.folders.Allfolders);

const handleAddFolder = async(e) => {
  e.preventDefault();
  setShowFolder(!showFolder);
  
  if (newFolderName.trim() === '') {
    return;
  }
  setLoading(true)
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  //works
  await axios.post('http://localhost:5000/api/folder', {
    userid:user._id,
    name:newFolderName
  }).then(res=>{
    if(res.data) {
      getFolders(dispatch, user);
      setNewFolderName('');
      setLoading(false);
    }
  })
};

  const handleLogout=()=>{
    dispatch(logout());
    dispatch(logoutFiles());
    dispatch(logoutFolders());
    router.push("/");
  }
  useEffect(()=>{
  getFiles(dispatch, user);
  getFolders(dispatch, user); 
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
  axios.put(`http://localhost:5000/api/user/newfile?userid=${user._id}`, newFile).then((res)=>{
   getFiles(dispatch, user);
    dispatch(setActiveFile(res.data));
    setNavItem1(res.data.name)
    setFileName('');
    setShow(false)
  })        
  }
  return (
    <OutsideClickHandler onOutsideClick={()=>setNav(!nav)}>
    <div className='flex flex-col bg-[#EDD0C0] w-52 h-screen items-center absolute top-0 left-0 z-[100]'>
        <BsChevronBarLeft className='absolute right-5 top-5 font-bold cursor-pointer' onClick={()=>setNav(!nav)}/>
        <button
        className='font-semibold text-xl w-fit px-3 rounded-md h-16 text-center mt-24 cursor-pointer bg-[#EDD0C0]'
        onClick={()=>{setRecipes(!recipes);setNavItem0('home')}}>All Recipes</button>
        <div className='flex flex-col items-start justify-center'>
           { files.map((file, index)=>(
            <div key={index} onClick={()=>{dispatch(setActiveFile(file));
            setNavItem1(file.name.charAt(0).toUpperCase() + file.name.slice(1));setNav(!nav)}} className=' flex items-center justify-center cursor-pointer my-2' >
              <BsFileEarmarkTextFill className="w-[20px] h-[25px]"/>
              <span className="font-semibold text-[18px]">{file.name.charAt(0).toUpperCase() + file.name.slice(1)}</span>
            </div>
            ))}
            <div className='flex items-center justify-center ml-5 cursor-pointer w-fit' >
                <BsFileEarmarkPlusFill className="w-[15px] h-[20px]"/>{
                show?
                <form onSubmit={handleAddFile} className="w-full">
                <input placeholder="file name" 
                onChange={(e)=>setFileName(e.target.value)}
                className="w-[90%] pl-2" />
                </form>
                :
                <span onClick={()=>setShow(!show)} className='opacity-70'>New File</span>
                }
            </div>
        </div>
        <button
        className='font-semibold text-xl w-fit px-3 rounded-md h-16 text-center cursor-pointer bg-[#EDD0C0]'
         onClick={()=>{setFoldersActive(!foldersActive);setNavItem0('folder'); router.push('/folder')}}>My Folders</button>
        <div className='flex flex-col'>
           { folders.map((folder, index)=>(
            <Folder folder={folder} key={index}/>
            ))
            }
            <div className='flex items-center justify-center ml-2 cursor-pointer w-fit' >
                <AiFillFolderAdd onClick={()=>setNewFolder(!newFolder)} className='w-[20px] h-[25px]'/>
                {
                newFolder?
                <form onSubmit={(e)=>{handleAddFolder(e); setNewFolder(!newFolder)}} className="w-full">
                <input placeholder="folder name" 
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-[90%] pl-2" />
                </form>
                :
                <span onClick={()=>setNewFolder(!newFolder)} className='opacity-70 text-sm'>New Folder</span>
                }
            </div>
        </div>
        <button
        className='font-semibold text-xl w-fit px-5 rounded-md h-16 text-center cursor-pointer bg-[#EDD0C0]'
        onClick={()=>{setNavItem0('account');setNav(!nav); router.push('/account')}} >My Account</button>
        <div className='font-semibold text-xl w-fit px-5 rounded-md h-16 text-center cursor-pointer bg-[#EDD0C0] absolute bottom-0'
         onClick={handleLogout}>
        <u>Log Out</u>
        </div>
      </div>
    </OutsideClickHandler>
  )
}

export default Hamburger