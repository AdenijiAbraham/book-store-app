import React, { useState } from 'react'
import InputField from './InputField'
import SelectField from './SelectField'
import { useForm } from 'react-hook-form'
import { useAddBookMutation } from '../../../redux/features/book/booksApi'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const AddBook = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const navigate = useNavigate()
    const [imageFile, setImageFile] = useState(null)
    const [addBook, { isLoading, isError }] = useAddBookMutation()
    const [imageFileName, setImageFileName] = useState('')
    
    // Enhanced file validation
    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        const maxSize = 5 * 1024 * 1024 // 5MB
        
        if (!allowedTypes.includes(file.type)) {
            return 'Please select a valid image file (JPEG, PNG, or WebP)'
        }
        
        if (file.size > maxSize) {
            return 'Image size should be less than 5MB'
        }
        
        return null
    }
    
    const showError = (title, message) => {
        Swal.fire({
            title,
            text: message,
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        })
    }
    
    const showSuccess = () => {
        Swal.fire({
            title: 'Book Added Successfully!',
            text: 'Your book has been uploaded successfully!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'View Books',
            cancelButtonText: 'Add Another'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/dashboard/manage-books')
            } else {
                // Reset form for adding another book
                resetForm()
            }
        })
    }
    
    const resetForm = () => {
        reset()
        setImageFileName('')
        setImageFile(null)
    }
    
    const onSubmit = async (data) => {
        console.log('📝 Form data received:', data)
        console.log('🖼️ Image file:', imageFile)
        
        // Validate image file
        if (!imageFile) {
            showError('Missing Image', 'Please select a cover image')
            return
        }
        
        const fileError = validateFile(imageFile)
        if (fileError) {
            showError('Invalid File', fileError)
            return
        }
        
        // Parse prices to ensure they're valid numbers
        const oldPrice = parseFloat(data.oldPrice)
        const newPrice = parseFloat(data.newPrice)
        
        // Basic price validation (just check if they're valid numbers)
        if (isNaN(oldPrice)) {
            showError('Price Error', 'Old price must be a valid number')
            return
        }
        
        if (isNaN(newPrice)) {
            showError('Price Error', 'New price must be a valid number')
            return
        }
        
        try {
            // Create FormData for file upload
            const formData = new FormData()
            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('category', data.category)
            formData.append('trending', data.trending || false)
            formData.append('oldPrice', oldPrice.toString())
            formData.append('newPrice', newPrice.toString())
            formData.append('coverImage', imageFile)
            
            console.log('🚀 Submitting book data...')
            
            const response = await addBook(formData).unwrap()
            console.log('✅ Success response:', response)
            
            showSuccess()
            
        } catch (error) {
            console.error('❌ Error adding book:', error)
            
            let errorMessage = 'Failed to add book. Please try again.'
            let errorTitle = 'Upload Failed'
            
            // Better error handling
            if (error?.status === 413) {
                errorTitle = 'File Too Large'
                errorMessage = 'The image file is too large. Please choose a smaller file.'
            } else if (error?.status === 400) {
                errorTitle = 'Invalid Data'
                errorMessage = error?.data?.message || 'Please check your input data.'
            } else if (error?.status === 401) {
                errorTitle = 'Unauthorized'
                errorMessage = 'You are not authorized to perform this action.'
            } else if (error?.status >= 500) {
                errorTitle = 'Server Error'
                errorMessage = 'Server is currently unavailable. Please try again later.'
            } else if (error?.data) {
                if (typeof error.data === 'string') {
                    errorMessage = error.data
                } else if (error.data.message) {
                    errorMessage = error.data.message
                } else if (error.data.errors && Array.isArray(error.data.errors)) {
                    errorMessage = error.data.errors.join(', ')
                }
            }
            
            showError(errorTitle, `${errorMessage} (Status: ${error?.status || 'Unknown'})`)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const fileError = validateFile(file)
            if (fileError) {
                showError('Invalid File', fileError)
                e.target.value = '' // Clear the input
                return
            }
            
            setImageFile(file)
            setImageFileName(file.name)
        }
    }
    
    return (
        <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <InputField
                    label="Title"
                    name="title"
                    placeholder="Enter book title"
                    register={register}
                    validation={{ required: "Title is required" }}
                />

                <InputField
                    label="Description"
                    name="description"
                    placeholder="Enter book description"
                    type="textarea"
                    register={register}
                    validation={{ required: "Description is required" }}
                />

                <SelectField
                    label="Category"
                    name="category"
                    options={[
                        { value: '', label: 'Choose A Category' },
                        { value: 'business', label: 'Business' },
                        { value: 'technology', label: 'Technology' },
                        { value: 'fiction', label: 'Fiction' },
                        { value: 'horror', label: 'Horror' },
                        { value: 'adventure', label: 'Adventure' },
                    ]}
                    register={register}
                    validation={{ required: "Category is required" }}
                />

                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            {...register('trending')}
                            className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
                    </label>
                </div>

                <InputField
                    label="Old Price"
                    name="oldPrice"
                    type="text"
                    placeholder="Old Price"
                    register={register}
                    validation={{ 
                        required: "Old price is required"
                    }}
                />

                <InputField
                    label="New Price"
                    name="newPrice"
                    type="text"
                    placeholder="New Price"
                    register={register}
                    validation={{ 
                        required: "New price is required"
                    }}
                />

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cover Image *
                    </label>
                    <input 
                        type="file" 
                        accept="image/jpeg,image/jpg,image/png,image/webp" 
                        onChange={handleFileChange} 
                        className="mb-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        required
                    />
                    {imageFileName && (
                        <p className="text-sm text-gray-500">
                            Selected: <span className="font-medium">{imageFileName}</span>
                        </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                        Accepted formats: JPEG, PNG, WebP (max 5MB)
                    </p>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
                        <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>{error.message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding Book...
                        </span>
                    ) : (
                        'Add Book' 
                    )}
                </button>
            </form>
        </div>
    )
}

export default AddBook






// import React, { useState } from 'react'
// import InputField from './InputField'
// import SelectField from './SelectField'
// import { useForm } from 'react-hook-form'
// import { useAddBookMutation } from '../../../redux/features/book/booksApi'
// import Swal from 'sweetalert2'
// import { useNavigate } from 'react-router-dom'

// const AddBook = () => {
//     const { register, handleSubmit, formState: { errors }, reset } = useForm()
//     const navigate = useNavigate()
//     const [imageFile, setImageFile] = useState(null)
//     const [addBook, { isLoading, isError }] = useAddBookMutation()
//     const [imageFileName, setImageFileName] = useState('')
    
//     // Enhanced file validation
//     const validateFile = (file) => {
//         const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
//         const maxSize = 5 * 1024 * 1024 // 5MB
        
//         if (!allowedTypes.includes(file.type)) {
//             return 'Please select a valid image file (JPEG, PNG, or WebP)'
//         }
        
//         if (file.size > maxSize) {
//             return 'Image size should be less than 5MB'
//         }
        
//         return null
//     }
    
//     const showError = (title, message) => {
//         Swal.fire({
//             title,
//             text: message,
//             icon: 'error',
//             confirmButtonColor: '#d33',
//             confirmButtonText: 'OK'
//         })
//     }
    
//     const showSuccess = () => {
//         Swal.fire({
//             title: 'Book Added Successfully!',
//             text: 'Your book has been uploaded successfully!',
//             icon: 'success',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#6b7280',
//             confirmButtonText: 'View Books',
//             cancelButtonText: 'Add Another'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 navigate('/dashboard/manage-books')
//             } else {
//                 // Reset form for adding another book
//                 resetForm()
//             }
//         })
//     }
    
//     const resetForm = () => {
//         reset()
//         setImageFileName('')
//         setImageFile(null)
//     }
    
//     const onSubmit = async (data) => {
//         console.log('📝 Form data received:', data)
//         console.log('🖼️ Image file:', imageFile)
        
//         // Validate image file
//         if (!imageFile) {
//             showError('Missing Image', 'Please select a cover image')
//             return
//         }
        
//         const fileError = validateFile(imageFile)
//         if (fileError) {
//             showError('Invalid File', fileError)
//             return
//         }
        
//         // Validate price logic
//         const oldPrice = parseFloat(data.oldPrice) || 0
//         const newPrice = parseFloat(data.newPrice) || 0
        
//         if (newPrice > oldPrice) {
//             showError('Price Error', 'New price should not be higher than old price')
//             return
//         }
        
//         try {
//             // Determine which method to use based on your API
//             // Method 1: FormData (for actual file upload)
//             const formData = new FormData()
//             formData.append('title', data.title)
//             formData.append('description', data.description)
//             formData.append('category', data.category)
//             formData.append('trending', data.trending || false)
//             formData.append('oldPrice', oldPrice)
//             formData.append('newPrice', newPrice)
//             formData.append('coverImage', imageFile)
            
//             console.log('🚀 Submitting book data...')
            
//             const response = await addBook(formData).unwrap()
//             console.log('✅ Success response:', response)
            
//             showSuccess()
            
//         } catch (error) {
//             console.error('❌ Error adding book:', error)
            
//             let errorMessage = 'Failed to add book. Please try again.'
//             let errorTitle = 'Upload Failed'
            
//             // Better error handling
//             if (error?.status === 413) {
//                 errorTitle = 'File Too Large'
//                 errorMessage = 'The image file is too large. Please choose a smaller file.'
//             } else if (error?.status === 400) {
//                 errorTitle = 'Invalid Data'
//                 errorMessage = error?.data?.message || 'Please check your input data.'
//             } else if (error?.status === 401) {
//                 errorTitle = 'Unauthorized'
//                 errorMessage = 'You are not authorized to perform this action.'
//             } else if (error?.status >= 500) {
//                 errorTitle = 'Server Error'
//                 errorMessage = 'Server is currently unavailable. Please try again later.'
//             } else if (error?.data) {
//                 if (typeof error.data === 'string') {
//                     errorMessage = error.data
//                 } else if (error.data.message) {
//                     errorMessage = error.data.message
//                 } else if (error.data.errors && Array.isArray(error.data.errors)) {
//                     errorMessage = error.data.errors.join(', ')
//                 }
//             }
            
//             showError(errorTitle, `${errorMessage} (Status: ${error?.status || 'Unknown'})`)
//         }
//     }

//     const handleFileChange = (e) => {
//         const file = e.target.files[0]
//         if (file) {
//             const fileError = validateFile(file)
//             if (fileError) {
//                 showError('Invalid File', fileError)
//                 e.target.value = '' // Clear the input
//                 return
//             }
            
//             setImageFile(file)
//             setImageFileName(file.name)
//         }
//     }
    
//     return (
//         <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <InputField
//                     label="Title"
//                     name="title"
//                     placeholder="Enter book title"
//                     register={register}
//                     validation={{ required: "Title is required" }}
//                 />

//                 <InputField
//                     label="Description"
//                     name="description"
//                     placeholder="Enter book description"
//                     type="textarea"
//                     register={register}
//                     validation={{ required: "Description is required" }}
//                 />

//                 <SelectField
//                     label="Category"
//                     name="category"
//                     options={[
//                         { value: '', label: 'Choose A Category' },
//                         { value: 'business', label: 'Business' },
//                         { value: 'technology', label: 'Technology' },
//                         { value: 'fiction', label: 'Fiction' },
//                         { value: 'horror', label: 'Horror' },
//                         { value: 'adventure', label: 'Adventure' },
//                     ]}
//                     register={register}
//                     validation={{ required: "Category is required" }}
//                 />

//                 <div className="mb-4">
//                     <label className="inline-flex items-center">
//                         <input
//                             type="checkbox"
//                             {...register('trending')}
//                             className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
//                         />
//                         <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
//                     </label>
//                 </div>

//                 <InputField
//                     label="Old Price"
//                     name="oldPrice"
//                     type="number"
//                     step="0.01"
//                     placeholder="Old Price"
//                     register={register}
//                     validation={{ 
//                         required: "Old price is required",
//                         min: { value: 0, message: "Price must be positive" }
//                     }}
//                 />

//                 <InputField
//                     label="New Price"
//                     name="newPrice"
//                     type="number"
//                     step="0.01"
//                     placeholder="New Price"
//                     register={register}
//                     validation={{ 
//                         required: "New price is required",
//                         min: { value: 0, message: "Price must be positive" }
//                     }}
//                 />

//                 <div className="mb-4">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Cover Image *
//                     </label>
//                     <input 
//                         type="file" 
//                         accept="image/jpeg,image/jpg,image/png,image/webp" 
//                         onChange={handleFileChange} 
//                         className="mb-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
//                         required
//                     />
//                     {imageFileName && (
//                         <p className="text-sm text-gray-500">
//                             Selected: <span className="font-medium">{imageFileName}</span>
//                         </p>
//                     )}
//                     <p className="text-xs text-gray-400 mt-1">
//                         Accepted formats: JPEG, PNG, WebP (max 5MB)
//                     </p>
//                 </div>

//                 {Object.keys(errors).length > 0 && (
//                     <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
//                         <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
//                         <ul className="text-sm text-red-600 list-disc list-inside">
//                             {Object.entries(errors).map(([field, error]) => (
//                                 <li key={field}>{error.message}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 <button 
//                     type="submit" 
//                     disabled={isLoading}
//                     className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors ${
//                         isLoading 
//                             ? 'bg-gray-400 cursor-not-allowed' 
//                             : 'bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300'
//                     }`}
//                 >
//                     {isLoading ? (
//                         <span className="flex items-center justify-center">
//                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             Adding Book...
//                         </span>
//                     ) : (
//                         'Add Book' 
//                     )}
//                 </button>
//             </form>
//         </div>
//     )
// }

// export default AddBook









// import React, { useState } from 'react'
// import InputField from './InputField'
// import SelectField from './SelectField'
// import { useForm } from 'react-hook-form';
// import { useAddBookMutation } from '../../../redux/features/book/booksApi'; // Fixed path and hook name
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';

// const AddBook = () => {
//     const { register, handleSubmit, formState: { errors }, reset } = useForm();
//     const navigate = useNavigate();
//     const [imageFile, setimageFile] = useState(null);
//     const [addBook, {isLoading, isError}] = useAddBookMutation() // Updated hook name
//     const [imageFileName, setimageFileName] = useState('')
    
//     const onSubmit = async (data) => {  
//         console.log("📝 Form data received:", data);
//         console.log("🖼️ Image file:", imageFile);
//         console.log("📸 Image file name:", imageFileName);
        
//         // Validate required fields
//         if (!imageFile) {
//             alert("Please select a cover image");
//             return;
//         }

//         // Method 1: Try FormData first (for file upload)
//         const formData = new FormData();
//         formData.append('title', data.title);
//         formData.append('description', data.description);
//         formData.append('category', data.category);
//         formData.append('trending', data.trending || false);
//         formData.append('oldPrice', parseFloat(data.oldPrice) || 0);
//         formData.append('newPrice', parseFloat(data.newPrice) || 0);
//         formData.append('coverImage', imageFile);
        
//         console.log("🚀 FormData contents:");
//         for (let [key, value] of formData.entries()) {
//             console.log(`${key}:`, value);
//         }
        
//         try {
//             const response = await addBook(formData).unwrap();
//             console.log("✅ Success response:", response);
            
//             Swal.fire({
//                 title: "Book added",
//                 text: "Your book is uploaded successfully!",
//                 icon: "success",
//                 showCancelButton: true,
//                 confirmButtonColor: "#3085d6",
//                 cancelButtonColor: "#d33",
//                 confirmButtonText: "Yes, It's Okay!"
//               });
//               reset();
//               setimageFileName('')
//               setimageFile(null);
//         } catch (error) {
//             console.error("❌ FormData attempt failed. Error:", error);
            
//             // Method 2: Try JSON with just filename (fallback)
//             console.log("🔄 Trying JSON approach...");
            
//             const jsonData = {
//                 title: data.title,
//                 description: data.description,
//                 category: data.category,
//                 trending: data.trending || false,
//                 oldPrice: parseFloat(data.oldPrice) || 0,
//                 newPrice: parseFloat(data.newPrice) || 0,
//                 coverImage: imageFileName // Just filename, not the file
//             };
            
//             console.log("🚀 JSON data:", jsonData);
            
//             try {
//                 const response = await addBook(jsonData).unwrap();
//                 console.log("✅ Success with JSON:", response);
                
//                 Swal.fire({
//                     title: "Book added",
//                     text: "Your book is uploaded successfully!",
//                     icon: "success",
//                     showCancelButton: true,
//                     confirmButtonColor: "#3085d6",
//                     cancelButtonColor: "#d33",
//                     confirmButtonText: "Yes, It's Okay!"
//                 }).then(() => {
//                  navigate('/dashboard/manage-books');
//             });
//                 reset();
//                 setimageFileName('')
//                 setimageFile(null);
                
//             } catch (jsonError) {
//                 console.error("❌ JSON attempt also failed:", jsonError);
//                 console.error("❌ Error status:", jsonError?.status);
//                 console.error("❌ Error data:", jsonError?.data);
//                 console.error("❌ Error data stringified:", JSON.stringify(jsonError?.data, null, 2));
                
//                 let errorMessage = "Failed to add book. Please try again.";
                
//                 if (jsonError?.data) {
//                     if (typeof jsonError.data === 'string') {
//                         errorMessage = jsonError.data;
//                     } else if (jsonError.data.message) {
//                         errorMessage = jsonError.data.message;
//                     } else if (jsonError.data.error) {
//                         errorMessage = jsonError.data.error;
//                     } else if (jsonError.data.errors && Array.isArray(jsonError.data.errors)) {
//                         errorMessage = jsonError.data.errors.join(', ');
//                     } else {
//                         errorMessage = JSON.stringify(jsonError.data);
//                     }
//                 }
                
//                 alert(`Error (${jsonError?.status}): ${errorMessage}`);
//             }
//         }
//     }

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if(file) {
//             setimageFile(file);
//             setimageFileName(file.name);
//         }
//     }
    
//   return (
//     <div className="max-w-lg   mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

//       {/* Form starts here */}
//       <form onSubmit={handleSubmit(onSubmit)} className=''>
//         {/* Reusable Input Field for Title */}
//         <InputField
//           label="Title"
//           name="title"
//           placeholder="Enter book title"
//           register={register}
//           validation={{ required: "Title is required" }}
//         />

//         {/* Reusable Textarea for Description */}
//         <InputField
//           label="Description"
//           name="description"
//           placeholder="Enter book description"
//           type="textarea"
//           register={register}
//           validation={{ required: "Description is required" }}
//         />

//         {/* Reusable Select Field for Category */}
//         <SelectField
//           label="Category"
//           name="category"
//           options={[
//             { value: '', label: 'Choose A Category' },
//             { value: 'business', label: 'Business' },
//             { value: 'technology', label: 'Technology' },
//             { value: 'fiction', label: 'Fiction' },
//             { value: 'horror', label: 'Horror' },
//             { value: 'adventure', label: 'Adventure' },
//             // Add more options as needed
//           ]}
//           register={register}
//           validation={{ required: "Category is required" }}
//         />

//         {/* Trending Checkbox */}
//         <div className="mb-4">
//           <label className="inline-flex items-center">
//             <input
//               type="checkbox"
//               {...register('trending')}
//               className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
//             />
//             <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
//           </label>
//         </div>

//         {/* Old Price */}
//         <InputField
//           label="Old Price"
//           name="oldPrice"
//           type="number"
//           placeholder="Old Price"
//           register={register}
//           validation={{ 
//             required: "Old price is required",
//             min: { value: 0, message: "Price must be positive" }
//           }}
//         />

//         {/* New Price */}
//         <InputField
//           label="New Price"
//           name="newPrice"
//           type="number"
//           placeholder="New Price"
//           register={register}
//           validation={{ 
//             required: "New price is required",
//             min: { value: 0, message: "Price must be positive" }
//           }}
//         />

//         {/* Cover Image Upload */}
//         <div className="mb-4">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handleFileChange} 
//             className="mb-2 w-full" 
//             required
//           />
//           {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
//         </div>

//         {/* Display form errors */}
//         {Object.keys(errors).length > 0 && (
//           <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
//             <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
//             <ul className="text-sm text-red-600">
//               {Object.entries(errors).map(([field, error]) => (
//                 <li key={field}>{error.message}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Submit Button */}
//         <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md">
//          {
//             isLoading ? <span className="">Adding.. </span> : <span>Add Book</span>
//           }
//         </button>
//       </form>
//     </div>
//   )
// }

// export default AddBook






// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'; 
// import Swal from 'sweetalert2';
// import InputField from './InputField';
// import SelectField from './SelectField';
// import { useAddBookByIdMutation } from '../../../redux/features/book/booksApi';
// import { useNavigate } from 'react-router-dom';

// const AddBook = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
//   const navigate = useNavigate();
//   const [imageFile, setimageFile] = useState(null);
//   const [addBook, { isLoading }] = useAddBookByIdMutation();
//   const [imageFileName, setimageFileName] = useState('');

//   const onSubmit = async (data) => {
//     const newBookData = {
//       ...data,
//       coverImage: imageFileName
//     };

//     try {
//       await addBook(newBookData).unwrap();

//       Swal.fire({
//         title: "Book added",
//         text: "Your book is uploaded successfully!",
//         icon: "success",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "Yes, It's Okay!"
//       }).then((result) => {
//         if (result.isConfirmed) {
//           reset();
//           setimageFileName('');
//           setimageFile(null);
//           navigate('/dashboard/manage-books'); // ✅ navigate after confirmation
//         }
//       });

//     } catch (error) {
//       console.error(error);
//       Swal.fire({
//         title: "Failed",
//         text: "Failed to add book. Please try again.",
//         icon: "error",
//         confirmButtonColor: "#d33",
//         confirmButtonText: "OK"
//       });
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setimageFile(file);
//       setimageFileName(file.name);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

//       {/* Form starts here */}
//       <form onSubmit={handleSubmit(onSubmit)} className=''>
//         <InputField
//           label="Title"
//           name="title"
//           placeholder="Enter book title"
//           register={register}
//         />

//         <InputField
//           label="Description"
//           name="description"
//           placeholder="Enter book description"
//           type="textarea"
//           register={register}
//         />

//         <SelectField
//           label="Category"
//           name="category"
//           options={[
//             { value: '', label: 'Choose A Category' },
//             { value: 'business', label: 'Business' },
//             { value: 'technology', label: 'Technology' },
//             { value: 'fiction', label: 'Fiction' },
//             { value: 'horror', label: 'Horror' },
//             { value: 'adventure', label: 'Adventure' },
//           ]}
//           register={register}
//         />

//         <div className="mb-4">
//           <label className="inline-flex items-center">
//             <input
//               type="checkbox"
//               {...register('trending')}
//               className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
//             />
//             <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
//           </label>
//         </div>

//         <InputField
//           label="Old Price"
//           name="oldPrice"
//           type="number"
//           placeholder="Old Price"
//           register={register}
//         />

//         <InputField
//           label="New Price"
//           name="newPrice"
//           type="number"
//           placeholder="New Price"
//           register={register}
//         />

//         <div className="mb-4">
//           <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
//           <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 w-full" />
//           {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
//         </div>

//         <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md">
//           {isLoading ? <span>Adding.. </span> : <span>Add Book</span>}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddBook;





// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'; 
// import Swal from 'sweetalert2';
// import InputField from './InputField';
// import SelectField from './SelectField';
// import { useAddBookByIdMutation } from '../../../redux/features/book/booksApi';
// import { useNavigate } from 'react-router-dom';
// import getBaseUrl from '../../../utils/baseURJ';

// const AddBook = () => {
//     const navigate = useNavigate();
//     const { register, handleSubmit, formState: { errors }, reset } = useForm();
//     const [imageFile, setImageFile] = useState(null);
//     const [addBook, {isLoading, isError}] = useAddBookByIdMutation()
//     const [imageFileName, setImageFileName] = useState('')
//     const [uploading, setUploading] = useState(false);

//     const uploadImage = async (file) => {
//         const formData = new FormData();
//         formData.append('image', file);
        
//         try {
//             const response = await fetch(`${getBaseUrl()}/api/upload`, {
//                 method: 'POST',
//                 body: formData,
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
            
//             if (!response.ok) {
//                 throw new Error('Failed to upload image');
//             }
            
//             const data = await response.json();
//             return data.imageUrl; // Assuming your API returns { imageUrl: "path/to/image" }
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             throw error;
//         }
//     };

//     const onSubmit = async (data) => {
//         setUploading(true);
//         let coverImageUrl = '';
        
//         try {
//             // Upload image first if there's a file
//             if (imageFile) {
//                 coverImageUrl = await uploadImage(imageFile);
//             }

//             const newBookData = {
//                 ...data,
//                 coverImage: coverImageUrl
//             }
            
//             await addBook(newBookData).unwrap();
//             Swal.fire({
//                 title: "Book added",
//                 text: "Your book is uploaded successfully!",
//                 icon: "success",
//                 showCancelButton: true,
//                 confirmButtonColor: "#3085d6",
//                 cancelButtonColor: "#d33",
//                 confirmButtonText: "Yes, It's Okay!"
//             }).then(() => {
//                 navigate('/dashboard/manage-books');
//             });
//             reset();
//             setImageFileName('')
//             setImageFile(null);
//         } catch (error) {
//             console.error(error);
//             alert("Failed to add book. Please try again.")   
//         } finally {
//             setUploading(false);
//         }
//     }

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if(file) {
//             setImageFile(file);
//             setImageFileName(file.name);
//         }
//     }

//     return (
//         <div className="max-w-lg mx-auto md:p-6 p-3 bg-white rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

//             <form onSubmit={handleSubmit(onSubmit)} className=''>
//                 <InputField
//                     label="Title"
//                     name="title"
//                     placeholder="Enter book title"
//                     register={register}
//                 />

//                 <InputField
//                     label="Description"
//                     name="description"
//                     placeholder="Enter book description"
//                     type="textarea"
//                     register={register}
//                 />

//                 <SelectField
//                     label="Category"
//                     name="category"
//                     options={[
//                         { value: '', label: 'Choose A Category' },
//                         { value: 'business', label: 'Business' },
//                         { value: 'technology', label: 'Technology' },
//                         { value: 'fiction', label: 'Fiction' },
//                         { value: 'horror', label: 'Horror' },
//                         { value: 'adventure', label: 'Adventure' },
//                     ]}
//                     register={register}
//                 />

//                 <div className="mb-4">
//                     <label className="inline-flex items-center">
//                         <input
//                             type="checkbox"
//                             {...register('trending')}
//                             className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
//                         />
//                         <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
//                     </label>
//                 </div>

//                 <InputField
//                     label="Old Price"
//                     name="oldPrice"
//                     type="number"
//                     placeholder="Old Price"
//                     register={register}
//                 />

//                 <InputField
//                     label="New Price"
//                     name="newPrice"
//                     type="number"
//                     placeholder="New Price"
//                     register={register}
//                 />

//                 <div className="mb-4">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
//                     <input 
//                         type="file" 
//                         accept="image/*" 
//                         onChange={handleFileChange} 
//                         className="mb-2 w-full" 
//                         required
//                     />
//                     {imageFileName && <p className="text-sm text-gray-500">Selected: {imageFileName}</p>}
//                 </div>

//                 <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md" disabled={isLoading || uploading}>
//                     {(isLoading || uploading) ? <span className="">Adding...</span> : <span>Add Book</span>}
//                 </button>
//             </form>
//         </div>
//     ) 
// }

// export default AddBook