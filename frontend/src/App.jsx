
import React from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
    <Navbar/>
    {/* Your App Component */}
    <div>
      <Outlet/>
    </div>
    <Toaster />
    <Footer/>
    </>
  )
}

export default App