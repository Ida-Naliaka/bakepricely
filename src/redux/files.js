"use client";
import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    activeFile:{},
    isFetching: false,
    error: false,
  },
  reducers: {
    fetchfilesStart: (state) => {
        state.isFetching = true;
      },
    setActiveFile: (state, action) => {      
      state.activeFile=action.payload;
    },
    removeFile: (state, action) => {
      const filter = state.Allfiles.filter(
        (file) => file._id !== action.payload._id
      );
      state.files = filter;
    },
    fetchfilesSuccess: (state, action) => {
        state.isFetching = false;
       state.files=action.payload;
      },
    fetchfilesFailure: (state) => {
        state.isFetching = false;
        state.error = true;
      },
    logoutFiles:(state)=>{
      state.files= []
      state.unfolderedfiles= []
      state.folderedfiles= []
      state.activeFile={}
      state.isFetching=false
      state.error= false
    },
  },
});

export const {
  fetchfilesStart, 
  setActiveFile,
  removeFile,
  fetchUnfolderedfilesSuccess,
  fetchfolderedfilesSuccess,
  fetchfilesSuccess,
  fetchfilesFailure,
  logoutFiles,
} = filesSlice.actions;
export default filesSlice.reducer;
