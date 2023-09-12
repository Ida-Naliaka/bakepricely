"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getIngredients } from './functions';
import IngredientCard from './IngredientCard';

const AllIngredients = () => {
   const dispatch= useDispatch()
    const user = useSelector((state) => state.user.currentUser);
    const ingredients = useSelector((state) => state.ingredients.ingredients);
    const keysToDisplay = ['density', 'packageCost', 'packageSize', 'packageUnit', 'packageContents'];
    
    useEffect(()=>{
      getIngredients(dispatch, user)
    },[])
  return (
    <div className='flex flex-col h-[100%] pt-2 w-full md:px-11 items-center'>
      <h1 className='font-bold md:text-3xl text-2xl mb-5'>All Ingredients</h1>
      <div className='flex flex-col items-start justify-center 
      md:grid grid-cols-[repeat(auto-fit,minmax(200px,auto))] gap-x-3 gap-y-3 
      auto-rows-[repeat(auto-fit,minmax(50px,auto))] max-w-full'>
        {ingredients && ingredients.map((item, index) => (
        <IngredientCard item= {item} keysToDisplay={keysToDisplay} key={index} />
       ))
       }
       </div>
    </div>
  )
}

export default AllIngredients