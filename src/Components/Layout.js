import React from 'react'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }) => {
  
  return (
    <div className='relative'>
    <div className='md:flex justify-between h-full w-full'>
        <Sidebar />
        <main className='md:w-[80%] md:absolute md:right-0 md:left-[20%]' >
          {children}
        </main>
    </div>
    <Footer />
    </div>
  )
}

export default Layout