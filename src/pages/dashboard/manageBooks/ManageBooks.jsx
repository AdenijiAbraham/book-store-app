import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/book/booksApi';

const ManageBooks = () => {

    const navigate = useNavigate();

    const {data: books, refetch, isLoading, error} = useFetchAllBooksQuery()

    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation()

    // Debug: Check if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        console.log('Token value:', token ? 'Present' : 'Missing');
        if (token) {
            try {
                // Decode JWT to check expiry (basic check)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();
                console.log('Token expired:', isExpired);
                console.log('Token expires at:', new Date(payload.exp * 1000));
            } catch (e) {
                console.log('Could not decode token:', e.message);
            }
        }
    }, []);

    // Handle deleting a book
    const handleDeleteBook = async (id) => {
        console.log('Attempting to delete book with ID:', id); // Debug log
        
        if (!id) {
            console.error('No book ID provided');
            alert('Error: No book ID provided');
            return;
        }

        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                console.log('Calling deleteBook mutation...'); // Debug log
                const result = await deleteBook(id).unwrap();
                console.log('Delete result:', result); // Debug log
                alert('Book deleted successfully!');
                refetch();
            } catch (error) {
                console.error('Full error object:', error);
                
                // Handle different error structures
                let errorMessage = 'Unknown error occurred';
                
                if (error?.status === 403) {
                    errorMessage = 'Access denied. You may not have permission to delete books or need to log in again.';
                } else if (error?.status === 401) {
                    errorMessage = 'Authentication required. Please log in again.';
                } else if (error?.status === 404) {
                    errorMessage = 'Book not found. It may have already been deleted.';
                } else if (error?.data?.message) {
                    errorMessage = error.data.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }
                
                alert(`Failed to delete book: ${errorMessage}`);
            }
        }
    };

    // Handle navigating to Edit Book page
    const handleEditClick = (id) => {
        console.log('Attempting to edit book with ID:', id); // Debug log
        
        if (!id) {
            console.error('No book ID provided for edit');
            alert('Error: No book ID provided');
            return;
        }

        // Try different possible route patterns
        const editPath = `/dashboard/edit-book/${id}`;
        console.log('Navigating to:', editPath); // Debug log
        navigate(editPath);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-center text-gray-500">Loading books...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <p className="text-center text-red-500">Error loading books: {error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">All Books</h2>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                            SEE ALL
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Book Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {books && books.map((book, index) => (
                                    <tr key={book._id || index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            <div className="truncate" title={book.title}>
                                                {book.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {book.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            ${book.newPrice}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => handleEditClick(book._id)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                                                    type="button"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    disabled={isDeleting}
                                                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors"
                                                    type="button"
                                                >
                                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty state */}
                    {(!books || books.length === 0) && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No books found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ManageBooks;