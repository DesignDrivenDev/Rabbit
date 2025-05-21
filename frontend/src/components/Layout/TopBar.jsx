import React from 'react'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'

const TopBar = () => {
    return (
        <div className='bg-rabbit-red text-white'>
            <div className='container mx-auto flex justify-between items-center p-4'>
                <div className='hidden md:flex items-center space-x-2'>
                    <a href="#" className='hover:text-gray-300'>
                        <TbBrandMeta className='h-5 w-5' />
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <IoLogoInstagram className='h-5 w-5' />
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <RiTwitterXLine className='h-4 w-4' />
                    </a>
                </div>
                <div className='text-sm text-center flex-grow'>
                    <span>We ship worldwide - Fast and reliable shipping!</span>
                </div>
                <div className='hidden md:block'>
                    <a href="tel:+917008751514" className='text-sm hover:text-gray-300'>
                        +917008751514
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TopBar