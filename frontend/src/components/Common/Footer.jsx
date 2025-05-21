import React from 'react'
import { FiPhoneCall } from 'react-icons/fi'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className='border-t py-12'>
            <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-4'>
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>News Letter</h3>
                    <p className="text-gray-500 mb-4">
                        Be the first to hear about new products, exclusive events and online offers.
                    </p>
                    <p className="font-medium text-sm text-gray-600 mb-6">Sign Up and get 10% off on your first Order</p>
                    {/* News Letter form */}
                    <form className='flex' >
                        <input
                            type="email"
                            placeholder='Enter Your Email'
                            className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
                            required
                        />
                        <button type='submit' className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all'>Subscribe</button>
                    </form>
                </div>
                {/* Shop Links */}
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Shop</h3>
                    <ul className='space-y-2 text-gray-600 '>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>Men's Top Wear</Link>
                        </li>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>Women's Top Wear</Link>
                        </li>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>Men's Bottom Wear</Link>
                        </li>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>Women's Bottom Wear</Link>
                        </li>
                    </ul>
                </div>
                {/* support links */}
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Support</h3>
                    <ul className='space-y-2 text-gray-600 '>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>Contact Us</Link>
                        </li>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>About Us</Link>
                        </li>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>FAQs</Link>
                        </li>
                        <li>
                            <Link to="/" className='hover:text-gray-500 transition-colors'>Features</Link>
                        </li>
                    </ul>
                </div>
                {/* social media links */}
                <div>
                    <h3 className="text-lg text-gray-800 mb-4">
                        Follow Us
                    </h3>
                    <div className='flex items-center space-x-4 mb-6'>
                        <a href="https://facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-gray-300'>
                            <TbBrandMeta className='w-5 h-5' />
                        </a>
                        <a href="https://facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-gray-300'>
                            <IoLogoInstagram className='w-5 h-5' />
                        </a>
                        <a href="https://facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-gray-300'>
                            <RiTwitterXLine className='w-4 h-4' />
                        </a>
                    </div>
                    <p className='text-gray-500'>Call Us</p>
                    <p>
                        <FiPhoneCall className='inline-block mr-2 w-4 h-4' />
                        7008751514
                    </p>
                </div>
            </div>
            {/* footer bottom */}
            <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
                <p className='text-gray-500 text-sm tracking-tighter text-center'>&copy; {new Date().getFullYear()} LearnClub. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer