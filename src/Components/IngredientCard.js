"use client";
import React, {useState } from "react";
import { BsCheckSquareFill, BsPencilFill, BsTrash3Fill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {removeingredient } from "@/redux/ingredients";
import { getIngredients } from "./functions";

const IngredientCard = ({ item, keysToDisplay }) => {
  const [editableRow, setEditableRow] = useState(false);
    const [editedData, setEditedData] = useState({});
    const dispatch=useDispatch();
    const user = useSelector((state) => state.user.currentUser);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    const handleEditClick = () => {
      setEditableRow(true);
      setEditedData({ ...item });
    };
  
    const handleSaveClick = async() => {
      try {
      await axios.put(`https://bakepricely.onrender.com/api/ingredient/${item._id}`, editedData, config).then((res)=>{
      getIngredients(dispatch, user)
      setEditableRow(false);      
      })
      } catch (error) {
        console.log(error);
      }
      
    };
  
    const handleInputChange = (e, key) => {
      setEditedData({
        ...editedData,
        [key]: e.target.value,
      });
    };
  
    const handleDeleteClick = async() => {
      try {
      await axios.delete(`https://bakepricely.onrender.com/api/ingredient/${item._id}`, config).then(()=>{
        dispatch(removeingredient(item)) 
      })
      } catch (error) {
        console.log(error);
      }
    };
    
    const caps=(word)=>{
        const upperCase=word.charAt(0).toUpperCase() + word.slice(1);
        return upperCase
    }
    const toShortenValues={
        'packageCost':'cost',
        'packageSize': 'size',
        'packageUnit': 'pkgunit',
        'packageContents': 'No./pkg'
      };
  
  return (
    <div 
       className="md:w-[100%] h-fit bg-[#DFDADA] flex flex-col p-2 justify-center w-[90%] rounded-lg">
         <div className="w-full flex items-center justify-between">
           <span className="font-semibold text-lg cursor-pointer">
             {caps(item.name)}
           </span>
           <div
           className="bg-[#DFDADA] flex justify-between rounded-full w-[20%] cursor-pointer"
           >
            {
            editableRow ?
            <BsCheckSquareFill  onClick={() => handleSaveClick()} />:
            <BsPencilFill onClick={() => handleEditClick()}/>
              }
              <BsTrash3Fill onClick={() => handleDeleteClick()}/>
           </div>
         </div>
          <div className='flex flex-col items-start justify-center md:grid grid-cols-[repeat(auto-fit,minmax(50px,auto))] gap-x-2 gap-y-3
            auto-rows-[repeat(auto-fit,minmax(50px,auto))] max-w-full p-2'>
            {keysToDisplay.map((key, index)=>{
          return(
           item[key]?
           <div className="flex flex-col items-center justify-around my-2" key={index}>
           <label className="font-semibold">
               { Object.keys(toShortenValues).includes(key)? caps(toShortenValues[key]): caps(key)}
           </label>
           <input
           autoFocus
           defaultValue={item[key]?item[key]:'N/A'}
           value={editedData[key]}
           onChange={(e) => handleInputChange(e, key)}
           className={editableRow?
            "w-[100%] h-[42px] rounded-lg bg-white text-md p-2 items-center justify-center":
            "w-[100%] h-[42px] rounded-lg bg-[#C8626D] text-md p-2 items-center justify-center"}
           readOnly= {editableRow ? false: true }
           />
         </div>:<div  key={index}> </div>
         )
         })
         }
         </div>
       </div>
  );
};

export default IngredientCard;
