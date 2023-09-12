"use client"
import AllFolders from '@/Components/AllFolders'
import { CostState } from '@/Components/Costcontext'
import Layout from '@/Components/Layout'
import Navbar from '@/Components/Navbar'
import RecipeTemplate from '@/Components/RecipeTemplate'
import React, { useEffect } from 'react'

const Folder = () => {
  const { navItem0, setNavItem0}= CostState();
  useEffect(()=>{
    setNavItem0('folder')
    //eslint-disable-next-line
  },[])
  return (
    <div className='h-screen overflow-x-hidden'>
    <Layout>
      <div className='flex flex-col md:py-11 px-11 md:bg-[white] bg-[#BC8880] min-h-screen h-fit'>
        <Navbar />
        <AllFolders />
    </div>
    </Layout>
    </div>
  )
}

export default Folder