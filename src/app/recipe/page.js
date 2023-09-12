"use client"
import { CostState } from '@/Components/Costcontext';
import Layout from '@/Components/Layout';
import Navbar from '@/Components/Navbar';
import RecipeTemplate from '@/Components/RecipeTemplate';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Recipe = () => {
    const { reload, setReload, navItem0, setNavItem0}= CostState();
    useEffect(()=>{
    setNavItem0('home')
    //eslint-disable-next-line
  },[])
    const activeFile = useSelector((state) => state.files.activeFile);
return (
<div className='h-screen overflow-x-hidden'>
    <Layout>
        <div className='flex flex-col md:py-11 px-11 md:bg-[white] bg-[#BC8880] min-h-screen h-fit'>
            <Navbar />
            <RecipeTemplate passedrecipe={activeFile} reload={reload} />
        </div>
    </Layout>
</div>
    )
}

export default Recipe