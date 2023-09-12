"use client"
import AllIngredients from '@/Components/AllIngredients'
import { CostState } from '@/Components/Costcontext'
import Layout from '@/Components/Layout'
import Navbar from '@/Components/Navbar'
import React, { useEffect } from 'react'

const Ingredients = () => {
  const { navItem0, setNavItem0}= CostState();
  useEffect(()=>{
    setNavItem0('ingredients');
    //eslint-disable-next-line
  },[])
  
  return (
    <div className='h-screen overflow-x-hidden'>
    <Layout>
      <div className='flex flex-col md:py-11 px-11 md:bg-[white] bg-[#BC8880] min-h-screen h-fit'>
        <Navbar />
        <AllIngredients/>
    </div>
    </Layout>
    </div>
  )
}

export default Ingredients