"use client"
import React, { useEffect, useState } from 'react'
import { BsChevronBarLeft, BsFileEarmarkPlusFill, BsFileEarmarkTextFill, BsFolderFill, BsGearFill, BsHouseFill, BsListCheck, BsMenuApp, BsMenuAppFill, BsMenuButtonFill, BsPersonFill } from 'react-icons/bs'
import axios from "axios"
import logo from "../../public/logo.svg"
import HomeSidebar from './HomeSidebar';
import FolderSidebar from './FolderSidebar';
import SettingsSidebar from './SettingsSidebar';
import { useRouter } from 'next/navigation';
import { CostState } from './Costcontext'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/redux/user'
import { fetchfilesFailure, fetchfilesSuccess, logoutFiles, setActiveFile } from '@/redux/files'
import { logoutFolders } from '@/redux/folders'
import { AiOutlineMenu } from 'react-icons/ai'
import Hamburger from './Hamburger'
import { getFiles } from './functions'

const Sidebar = () => {
  const { navItem0, setNavItem0, navItem1, setNavItem1, nav, setNav}= CostState();
  const [show, setShow]=useState(false);
  const [fileName, setFileName ]=useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const files = useSelector((state) => state.files.files);
  const router= useRouter();
  const dispatch=useDispatch();
  const menuObj= {
    home: <HomeSidebar />,
    folder: <FolderSidebar />,
    ingredients: <SettingsSidebar />,
    account: <span className='w-[10vw] mt-36 font-semibold text-2xl cursor-pointer'>My Account</span>
}
const config = {
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
};
const handleLogout=()=>{
  dispatch(logout());
  dispatch(logoutFiles());
  dispatch(logoutFolders());
  router.push("/");
}

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
     <>
     {!nav && <div className=' md:hidden pt-5 h-fit w-full px-5 flex justify-between bg-[#BC8880]'>
      <AiOutlineMenu onClick={()=>setNav(!nav)} className='w-[45px] h-[36px]'/>
      <Image src={logo} alt="logo" width={100} height={100} className='w-[70px] h-[70px] md:hidden flex'/>
      </div>}

      {nav &&
      <Hamburger />
      }
      <div className="hidden md:flex md:fixed left-0 h-[100%] z-[100]">
      <div className='bg-[#BC8880] p-5 w-[40%]'>
        <Image src={logo} alt="logo" width={100} height={100} className='mb-11'/>
        <div className='my-[10%]'>
        <BsHouseFill onClick={()=>{setNavItem0('home');setNavItem1('All Recipes');router.push('/home');router.refresh()}} className='w-[49px] h-[40px] mb-4 hover:text-[#EDD0C0]' />
        <BsFolderFill onClick={()=>{setNavItem0('folder'); setNavItem1('My Folders'); router.push('/folder');router.refresh();}} className='w-[49px] h-[41px] mb-4 hover:text-[#EDD0C0]'/>
        <BsListCheck onClick={()=>{setNavItem0('ingredients');setNavItem1('Ingredients');router.push('/ingredients');router.refresh();}} className='w-[49px] h-[48px] mb-4 hover:text-[#EDD0C0]'/>
        <BsPersonFill onClick={()=>{setNavItem0('account');setNavItem1('My Account'); router.push('/account');router.refresh();}} className='w-[45px] h-[45px] mb-4 hover:text-[#EDD0C0]'/>
        </div>
        <div className='absolute bottom-0'>
        <div className='mb-8 font-semibold text-lg cursor-pointer' onClick={handleLogout}>
        <u>Log Out</u>
        </div>
        </div>
      </div>
      <div className='bg-[#EDD0C0] flex flex-col p-5 w-[60%] rounded-r-lg'>
        { menuObj[navItem0]}
      </div>
  </div>
  </>
  )
}

export default Sidebar