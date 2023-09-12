"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import folderReducer from "./folders";
import fileReducer from "./files";
import userReducer from "./user";
import ingredientReducer from "./ingredients";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
//import storage from "redux-persist/lib/storage";
import storage from 'reduxjs-toolkit-persist/lib/storage'
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  version: 1,
  storage
};

const rootReducer = combineReducers({ user: userReducer, files: fileReducer, folders: folderReducer, ingredients: ingredientReducer});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware:[thunk], /*(getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk),*/
});

export let persistor = persistStore(store);
