"use client"
import { persistor, store } from '@/redux/store'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import CostProvider from './Costcontext'

const Wrapper = ({children}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <CostProvider>
      {children}
     </CostProvider>
     </PersistGate>
     </Provider>
  )
}

export default Wrapper