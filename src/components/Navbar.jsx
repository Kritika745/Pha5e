import React from 'react'

const Navbar = () => {
  return (
    <nav className="w-full bg-[#212121] text-white py-4 shadow-md fixed top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
      
        <div className="text-2xl font-bold">
          <a href="#"><img src="/logo.svg" alt="" /></a>
        </div>

       
        <ul className="flex space-x-14 text-md">
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Our vision</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Our team</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Our projects</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400 transition duration-300">Contact us</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
