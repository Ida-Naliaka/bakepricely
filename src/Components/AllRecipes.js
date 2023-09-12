"use client";
import React from 'react'
import Calculator from './Calculator';
import { useSelector } from 'react-redux';
import { CostState } from './Costcontext';

const AllRecipes = () => {
    const files = useSelector((state) => state.files.files);
    const {navItem0, setNavItem0}=CostState();
  
  return (
    <div className='flex flex-col h-[100%] pt-2 w-full px-11 items-center'>
        <h1 className='font-bold md:text-3xl text-2xl mb-5'>All Recipes</h1>
        <div
        className=' flex flex-col items-center justify-center 
        lg:grid grid-cols-[repeat(auto-fit,minmax(200px,auto))] gap-x-3 gap-y-3 
        auto-rows-[repeat(auto-fit,minmax(50px,auto))] max-w-full m-3 p-3;'>
        {files.map((file,index)=>{
        return <Calculator Newrecipe={file} key={index}/>
    }
           
    )}
    </div>
    <button className='font-semibold w-[267px] h-[50px] bg-[#B3C0AE] my-7 rounded-lg'
    onClick={()=> setNavItem0("folder")}>Create New Recipe!</button>
    </div>
  )
}

export default AllRecipes