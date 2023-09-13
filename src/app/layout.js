"use client"
import CostProvider from '@/Components/Costcontext'
import './globals.css'
import { Inter } from 'next/font/google'
import { PersistGate } from 'redux-persist/es/integration/react'
import { persistor, store } from '@/redux/store'
import { Provider } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BakePricely',
  description: 'A Cake Costing Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <CostProvider>
        {children}
     </CostProvider>
     </PersistGate>
     </Provider>
     </body>
    </html>
  )
}
