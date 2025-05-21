import React, { useCallback, useEffect, useState } from 'react';
const FileUpload = ({ onFilesSelected }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = files.filter(file =>
            file.type.startsWith('image/') &&
            file.size <= 5 * 1024 * 1024 // 5MB limit
        );

        if (validFiles.length !== files.length) {
            alert('Only image files under 5MB are allowed');
        }

        if (validFiles.length > 0) {
            onFilesSelected(validFiles);
        }
    };

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center 
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <p className="text-gray-600">
                    <span className="font-medium text-blue-600">Click to upload</span> or
                    drag and drop
                </p>
                <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                </p>
            </div>
        </div>
    );
};




const ProductForm = ({ productData, setProductData, onSubmit }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    // Form configuration for reusable structure
    const formConfig = [
        {
            id: 'name',
            label: 'Product Name',
            type: 'text',
            required: true,
            colSpan: 2
        },
        {
            id: 'description',
            label: 'Description',
            type: 'textarea',
            required: true,
            colSpan: 2
        },
        {
            id: 'price',
            label: 'Price',
            type: 'number',
            required: true
        },
        {
            id: 'countInStock',
            label: 'Stock Quantity',
            type: 'number'
        },
        {
            id: 'sku',
            label: 'SKU',
            type: 'text',
            required: true
        },
        {
            id: 'category',
            label: 'Category',
            type: 'select',
            options: ['Clothing', 'Shoes', 'Accessories', 'Equipment']
        },
        {
            id: 'brand',
            label: 'Brand',
            type: 'select',
            options: ['Brand A', 'Brand B', 'Brand C']
        },
        {
            id: 'material',
            label: 'Material',
            type: 'select',
            options: ['Cotton', 'Polyester', 'Leather', 'Rubber']
        },
        {
            id: 'gender',
            label: 'Gender',
            type: 'select',
            options: ['Men', 'Women', 'Unisex']
        },
        {
            id: 'sizes',
            label: 'Available Sizes',
            type: 'multi-select',
            options: ['S', 'M', 'L', 'XL']
        },
        {
            id: 'colors',
            label: 'Available Colors',
            type: 'multi-select',
            options: ['Red', 'Blue', 'Black', 'White']
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (field, value) => {
        setProductData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const handleImageUpload = async (files) => {
        const newImages = await Promise.all(
            files.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                altText: file.name.split('.')[0] // Default alt text
            }))
        );

        setProductData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...productData.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setProductData(prev => ({ ...prev, images: newImages }));
    };

    const removeImage = (index) => {
        setProductData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };


    // Cleanup object URLs
    useEffect(() => {
        return () => {
            productData.images.forEach(image => {
                if (image.preview) URL.revokeObjectURL(image.preview);
            });
        };
    }, [productData.images]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Separate existing images from new uploads
            const existingImages = productData.images.filter(img => !img.file);
            const newImages = productData.images.filter(img => img.file);

            // Upload new images (mock API call)
            // const uploadedImages = await Promise.all(
            //     newImages.map(async (image) => {
            //         // Replace this with actual upload logic
            //         const mockUpload = await new Promise(resolve => setTimeout(() =>
            //             resolve({
            //                 url: `https://storage.example.com/${image.file.name}`,
            //                 altText: image.altText
            //             }), 1000
            //         ));
            //         return mockUpload;
            //     })
            // );

            // Combine all images
            const allImages = [...existingImages, ...newImages];
            // const allImages = [...existingImages, ...uploadedImages];

            // Prepare final form data
            const formData = {
                ...productData,
                images: allImages,
                price: Number(productData.price),
                countInStock: Number(productData.countInStock),
            };

            // Call parent submit handler
            await onSubmit(formData);

        } catch (error) {
            setSubmitError(error.message || 'Failed to save product');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {formConfig.map((field) => (
                <div key={field.id} className={`col-span-${field.colSpan || 1}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                        <select
                            name={field.id}
                            value={productData[field.id]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            {field.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : field.type === 'multi-select' ? (
                        <div className="flex flex-wrap gap-2">
                            {field.options.map(option => (
                                <label key={option} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={productData[field.id].includes(option)}
                                        onChange={() => handleArrayChange(field.id, option)}
                                        className="rounded text-blue-600"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    ) : field.type === 'textarea' ? (
                        <textarea
                            name={field.id}
                            value={productData[field.id]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md h-32"
                        />
                    ) : (
                        <input
                            type={field.type}
                            name={field.id}
                            value={productData[field.id]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    )}
                </div>
            ))}

            <div className="col-span-2">
                <h3 className="text-lg font-medium mb-4">Product Images</h3>

                <FileUpload onFilesSelected={handleImageUpload} />

                <div className="grid grid-cols-3 gap-4 mt-4">
                    {productData.images.map((image, index) => (
                        <div key={index} className="relative group border p-2 rounded-lg">
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full 
                         h-6 w-6 flex items-center justify-center opacity-0 
                         group-hover:opacity-100 transition-opacity"
                            >
                                &times;
                            </button>

                            <img
                                src={image.preview || image.url}
                                alt={image.altText}
                                className="w-full h-32 object-cover mb-2 rounded"
                            />

                            <input
                                type="text"
                                placeholder="Alt text"
                                value={image.altText}
                                onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
                                className="w-full p-2 border rounded text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit Section */}
            <div className="col-span-2 border-t pt-6 mt-6">
                <div className="flex justify-end gap-4">
                    {submitError && (
                        <div className="text-red-500 mr-auto">{submitError}</div>
                    )}

                    <button
                        type="button"
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        onClick={() => setProductData(initialProductData)} // Reset form
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 text-white rounded-md ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;

// use
{/* <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
<ProductForm
    productData={productData}
    setProductData={setProductData}
    onSubmit={handleSubmit}
/> */}

// const handleSubmit = async (formData) => {
//     try {
//         // Replace with actual API call
//         console.log('Submitting:', formData);
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         alert('Product saved successfully!');
//     } catch (error) {
//         throw new Error('Failed to save product');
//     }
// };