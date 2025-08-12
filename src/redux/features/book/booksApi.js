// 1. Updated booksApi.js - Add image URL helper
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/books',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    fetchAllBooks: builder.query({
      query: () => '/',
      providesTags: ['Book'],
    }),

    fetchBookById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),

    addBook: builder.mutation({
      query: (newBook) => {
        if (newBook instanceof FormData) {
          return {
            url: '/create-book',
            method: 'POST',
            body: newBook,
          };
        }
        
        return {
          url: '/create-book',
          method: 'POST',
          body: newBook,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: ['Book'],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...updatedBook }) => {
        if (updatedBook instanceof FormData) {
          return {
            url: `/edit/${id}`,
            method: 'PUT',
            body: updatedBook,
          };
        }
        
        return {
          url: `/edit/${id}`,
          method: 'PUT',
          body: updatedBook,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Book', id }, 'Book'],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Book'],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;

export default booksApi;

// 🔥 CRITICAL: Helper function to get full image URL
export const getImageUrl = (imageName) => {
  if (!imageName) {
    return '/placeholder-book.jpg'; // Make sure you have this in your public folder
  }
  
  // Construct full URL to your backend
  const imageUrl = `http://localhost:5000/uploads/${imageName}`;
  console.log('🖼️ Image URL:', imageUrl); // Debug log
  return imageUrl;
};

// Test function to verify image exists
export const testImageUrl = (imageName) => {
  const url = getImageUrl(imageName);
  const img = new Image();
  img.onload = () => console.log('✅ Image loaded successfully:', url);
  img.onerror = () => console.log('❌ Image failed to load:', url);
  img.src = url;
};


// Example of how to use the image in a component:
/*
import { getImageUrl } from '../redux/features/book/booksApi';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img 
        src={getImageUrl(book.coverImage)} 
        alt={book.title}
        onError={(e) => {
          e.target.src = '/placeholder-book.jpg'; // Fallback on error
        }}
      />
      <h3>{book.title}</h3>
      <p>{book.description}</p>
    </div>
  );
};
*/









// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import getBaseUrl from '../../../utils/baseURJ'

// const baseQuery = fetchBaseQuery({
//     baseUrl : `${getBaseUrl()}/api/books`,
//     credentials: 'include',
//     prepareHeaders: (headers) => {
//         const token = localStorage.getItem('token');
//         if(token) {
//             headers.set('Authorization',`Bearer ${token}`);
//         }
//         return headers;
//     }   

// })

// const booksApi = createApi({
//   reducerPath: 'bookApi',
//   baseQuery,
//   tagTypes: ['Books'],
//   endpoints : (builder) => ({
//     fetchAllBooks: builder.query({
//         query: () => "/",
//         providesTags: ["Books"]
//     }),

//     fetchBookById: builder.query({
//         query: (id) => `/${id}`,
//         providesTags: (results, error, id) =>  [{type: "Books", id }]
//     }),

//     addBookById: builder.mutation({
//         query: (newBook) => ({
//             url: `/create-book`,
//             method: "POST",
//             body: newBook 
//         }),
//         invalidatesTags: ["Books"]
//     }),

//     updateBookById: builder.mutation({
//         query: ({id, ...rest}) => ({
//             url: `/edit/${id}`,
//             method: "PUT",
//             body: rest,
//               headers: {
//                 'content-Type' : 'application/json'
//               }
//         }),
//         invalidatesTags: ["Books"]
//     }),

//     deleteBook: builder.mutation({
//         query: (id) => ({
//             url: `/${id}`,
//             method: "DELETE"
//         }),
//          invalidatesTags: ["Books"]
//     })
//   }) 
// }) 


// export const {useFetchAllBooksQuery, useFetchBookByIdQuery, useAddBookByIdMutation, useDeleteBookMutation, useUpdateBookByIdMutation} = booksApi
// export default booksApi;