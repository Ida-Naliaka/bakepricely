"use client"
import React, { useEffect } from 'react'
import Layout from '@/Components/Layout';
import Navbar from '@/Components/Navbar';
import AllRecipes from '@/Components/AllRecipes';
import { CostState } from '@/Components/Costcontext';

const Home = () => {
  const { navItem0, setNavItem0}= CostState();
  useEffect(()=>{
    setNavItem0('home')
    //eslint-disable-next-line
  },[])
  return (
    <div className='h-screen overflow-x-hidden'>
     <Layout>
      <div className='flex flex-col md:py-11 px-11 md:bg-[white] bg-[#BC8880] min-h-screen h-fit'>
        <Navbar/>
        <AllRecipes/>
    </div>
    </Layout>
    </div>
  )
}

export default Home