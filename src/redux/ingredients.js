"use client";
import { createSlice } from "@reduxjs/toolkit";

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState: {
    ingredients: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    fetchingredientsStart: (state) => {
        state.isFetching = true;
      },
    removeIngredient: (state, action) => {
      const filter = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload._id
      );
      state.ingredient = filter;
    },
    fetchingredientsSuccess: (state, action) => {
        state.isFetching = false;
       state.ingredients=action.payload;
      },
    fetchingredientsFailure: (state) => {
        state.isFetching = false;
        state.error = true;
      },
    logoutIngredients:(state)=>{
      state.ingredients= []
      state.isFetching=false
      state.error= false
    },
  },
});

export const {
  fetchingredientsStart, 
  removeingredient,
  fetchingredientsSuccess,
  fetchingredientsFailure,
  logoutIngredients,
} = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
