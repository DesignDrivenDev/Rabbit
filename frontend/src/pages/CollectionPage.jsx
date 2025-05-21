import { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';

const CollectionPage = () => {
    const { collection } = useParams()
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector(state => state.products)
    const queryParams = Object.fromEntries([...searchParams])


    useEffect(() => {
        dispatch(fetchProductsByFilters(queryParams))
    }, [dispatch, collection, searchParams])

    const sidebarRef = useRef()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleClickOutside = (e) => {
        // Close thesidebar if clicked outside

        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false)
        }
    }
    useEffect(() => {
        // Add event listner for clicks
        document.addEventListener("mousedown", handleClickOutside)
        // Clean the event listner
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }
    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-red-500'>{error}</p>
            </div>
        )
    }
    return (
        <div className='flex flex-col lg:flex-row '>
            {/* Mobile filter button */}
            <button onClick={toggleSidebar} className="lg:hidden border p-2 flex justify-center items-center mx-4 mt-2">
                <FaFilter className='mr-2' /> Filters
            </button>
            {/* Filter Sidebar */}
            <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
                <FilterSidebar />
            </div>
            <div className="flex-grow p-4">
                <h2 className="text-2xl uppercase mb-4">All Collections</h2>
                {/* sort options */}
                <SortOptions />
                {/* Product Grid */}
                <ProductGrid products={products} />
            </div>
        </div >
    )
}

export default CollectionPage