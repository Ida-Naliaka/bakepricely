"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import { BsChevronRight, BsFolderFill, BsGearFill, BsHouseFill, BsListCheck, BsPersonFill } from 'react-icons/bs';
import { CostState } from './Costcontext';

const Navbar = () => {
    const {navItem0, setNavItem0, navItem2, setNavItem2, navItem1, setNavItem1}= CostState();
    const router= useRouter();
    const menuObj= {
        home: <BsHouseFill className='w-[26px] h-[23px] text-[#808080]' />,
        folder: <BsFolderFill className='w-[28px] h-[25px] text-[#808080]' />,
        ingredients: <BsListCheck className='w-[28px] h-[25px] text-[#808080]' />,
        account: <BsPersonFill className='w-[28px] h-[25px] text-[#808080]' />
    }
    return (
    <nav className='w-full h-[5vh] md:bg-[white] bg-[#BC8880] mb-5 lg:mx-11 mx-28'>
        <div className='hidden md:flex items-center text-xl'>
        <div className='px-3 text-[#808080] cursor-default' onClick={()=> {setNavItem1(""); setNavItem2(""); router.push(`/${navItem0}`)}}>
           { menuObj[navItem0]}
        </div>
        {navItem1 &&<BsChevronRight className='text-[#808080] w-[12px] h-[15px]'/>}
        {navItem1 && 
        <>
        <div className={
            !navItem2 ?
            'mx-3 px-3 w-fit rounded-lg shadow-sm text-[#808080] bg-[#B3C0AE] opacity-80':
            'px-3 w-fit text-[#808080]'}>
            {navItem1}
        </div>
       {navItem2 && <BsChevronRight className='text-[#808080] w-[12px] h-[15px]'/>}
        </>
        }
       {navItem2 && 
       <div className={'px-3 w-fit rounded-lg shadow-sm text-[#808080] bg-[#B3C0AE] opacity-50'}>
        {navItem2}
        </div>
        }
        </div>
    </nav>
  )
}

export default Navbar