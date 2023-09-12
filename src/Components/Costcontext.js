"use client"
import { useRouter } from "next/navigation";
import React, { useState, useContext, createContext, useEffect  } from "react";
import { useSelector } from "react-redux";

const CostContext = createContext();
const CostProvider = ({ children }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [ingredientsCost, setIngredientsCost] = useState(0);
  const [files, setFiles] = useState([]);
  const [selected, setSelected]= useState('');
  const [navItem0, setNavItem0] = useState('');
  const [navItem1, setNavItem1] = useState("");
  const [navItem2, setNavItem2] = useState(""); 
  const [tab, setTab] = useState("Login"); 
  const [reload, setReload] = useState(false);
  const [nav, setNav]=useState(false);
  const router= useRouter()
  const user = useSelector((state) => state.user.currentUser);
  useEffect(()=>{
    if(!user) {
      router.push('/')
    }
    //eslint-disable-next-line
  },[router])
  
  return (
    <CostContext.Provider
      value={{
        totalCost, setTotalCost,
        ingredientsCost, setIngredientsCost,
       files, setFiles,
       selected, setSelected,
       navItem0, setNavItem0,
       navItem1, setNavItem1,
       navItem2, setNavItem2,
       tab, setTab,
       reload, setReload,
       nav, setNav
      }}
    >
      {children}
    </CostContext.Provider>
  );
};

export const CostState = () => {
  return useContext(CostContext);
};
export default CostProvider;