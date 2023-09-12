"use client";
import { createSlice } from "@reduxjs/toolkit";

const foldersSlice = createSlice({
  name: "folders",
  initialState: {
    Allfolders: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    fetchfoldersStart: (state) => {
        state.isFetching = true;
      },
    removeFolder: (state, action) => {
      const filter = state.Allfolders.filter(
        (folder) => folder._id !== action.payload._id
      );
      state.Allfolders = filter;
    },
    fetchfoldersSuccess: (state, action) => {
        state.isFetching = false;
       state.Allfolders=action.payload;
      },
    fetchfoldersFailure: (state) => {
        state.isFetching = false;
        state.error = true;
      },
    logoutFolders:(state)=>{
      state.Allfolders= []
      state.isFetching=false
      state.error= false
    },
  },
});

export const {
    fetchfoldersStart, 
    removeFolder,
    fetchfoldersFailure,
    fetchfoldersSuccess,
    logoutFolders,
} = foldersSlice.actions;
export default foldersSlice.reducer;
