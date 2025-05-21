import React, { useState } from 'react'
import { HiX } from 'react-icons/hi'
import { HiMagnifyingGlass, HiMiniXMark, HiOutlineLockClosed } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productSlice'

const SearchBar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [serchTerm, setSerchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleSearchToggle = () => {
        setIsOpen((prev) => !prev)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        dispatch(setFilters({ search: serchTerm }))
        dispatch(fetchProductsByFilters({ search: serchTerm }))
        navigate(`/collections/all?search=${serchTerm}`)
        setIsOpen(false)
    }
    return (
        <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"}`}>
            {isOpen ?
                (<form onSubmit={handleSearch} className='relative flex items-center justify-center w-full'>
                    <div className='absolute w-1/2 flex items-center gap-x-3'>
                        <input
                            type='text'
                            name='search'
                            value={serchTerm}
                            onChange={(e) => setSerchTerm(e.target.value)}
                            placeholder='Search..'
                            className='bg-gray-100 px-4 py-2 rounded-lg pl-2 pr-12 focus:outline-none w-full placeholder:text-gray-700 placeholder:text-sm'
                        />
                        <button type='submit' className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
                            <HiMagnifyingGlass className='h-6 w-6' />
                        </button>
                    </div>
                    {/* close button */}
                    <button type='button'
                        onClick={handleSearchToggle} className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'>
                        <HiMiniXMark className='h-6 w-6' />
                    </button>
                </form>)
                : <button onClick={handleSearchToggle} className='flex items-center justify-center'>
                    <HiMagnifyingGlass className='h-6 w-6' />
                </button>}
        </div>
    )
}

export default SearchBar