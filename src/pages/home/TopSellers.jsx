import React, { useState, useEffect } from 'react'
import BookCard from '../Books/BookCard';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { useFetchAllBooksQuery } from '../../redux/features/book/booksApi';
//import { useFetchAllBooksQuery } from '../../redux/features/cart/booksApi';

const categories = ["Choose a Genre", "Business", "Fiction", "Finance", "Motivation"]
      
const TopSellers = () => {

      const [selectedcategory, setSelectedcategory] = useState("Choose a Genre");
      
      const {data: books = []} = useFetchAllBooksQuery()

 // codes below are used if api to backend not yet created
         // const [books, setBooks] = useState([]);

      // useEffect(()  => {
      //      fetch("books.json").
      //      then(res => res.json()).
      //      then((data)  => setBooks(data))
      // }, [])

      const filteredBooks = selectedcategory === "Choose a Genre" ? books : books.filter(book => 
        book.category === selectedcategory.toLowerCase());
        
  return (
    <div className='py-10'> 
        <h2 className='text-3xl font-semibold mb-6'>Top Sellers </h2>
          {/*category filtering*/}
          <div className='mb-8 flex items-center'>
             <select 
             onChange={(e) => setSelectedcategory(e.target.value)}
             name="category" id='category' className='border bg-[#EAEAEA]
             border-gray-300 rounded-md px-4 py-2 focus:outline-none'>
                  {
                      categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))
                 }
             </select>
          </div>
          <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true} 
        
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
           },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2, 
            spaceBetween: 50,
          },
          1180: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        { 
                filteredBooks.length > 0 && filteredBooks.map((book, index) => (
                  <SwiperSlide key={index}>
                        <BookCard  book={book} />
                  </SwiperSlide>
                  
                ))
           }
        
 </Swiper> 

           
    </div>
  )
}
   
export default TopSellers;







// import React, { useState, useEffect } from 'react'
// import BookCard from '../Books/BookCard';
// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// // import required modules
// import { Pagination, Navigation } from 'swiper/modules';
// import { useFetchAllBooksQuery } from '../../redux/features/book/booksApi';

// const categories = ["Choose a Genre", "Business", "Fiction", "Finance", "Motivation"]
      
// const TopSellers = () => {
//   const [selectedcategory, setSelectedcategory] = useState("Choose a Genre");
//   const {data: books = []} = useFetchAllBooksQuery()

//   const filteredBooks = selectedcategory === "Choose a Genre" ? books : books.filter(book => 
//     book.category === selectedcategory.toLowerCase());
        
//   return (
//     <div className='py-6 sm:py-8 lg:py-10'> 
//       {/* Title - responsive text size */}
//       <h2 className='text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 px-2 sm:px-0'>
//         Top Sellers 
//       </h2>
      
//       {/* Category filtering - responsive */}
//       <div className='mb-6 sm:mb-8 flex items-center px-2 sm:px-0'>
//         <select 
//           onChange={(e) => setSelectedcategory(e.target.value)}
//           name="category" 
//           id='category' 
//           className='w-full sm:w-auto border bg-[#EAEAEA] border-gray-300 rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
//         >
//           {categories.map((category, index) => (
//             <option key={index} value={category}>{category}</option>
//           ))}
//         </select>
//       </div>
      
//       {/* Swiper with improved responsive breakpoints */}
//       <div className='px-2 sm:px-0'>
//         <Swiper
//           slidesPerView={1}
//           spaceBetween={15}
//           navigation={true}
//           pagination={{
//             clickable: true,
//             dynamicBullets: true,
//           }}
//           breakpoints={{
//             // Mobile phones (up to 480px)
//             320: {
//               slidesPerView: 1,
//               spaceBetween: 15,
//             },
//             // Large mobile phones (480px and up)
//             480: {
//               slidesPerView: 1.2,
//               spaceBetween: 20,
//             },
//             // Small tablets (640px and up)
//             640: {
//               slidesPerView: 1.5,
//               spaceBetween: 20,
//             },
//             // Tablets (768px and up)
//             768: {
//               slidesPerView: 2,
//               spaceBetween: 25,
//             },
//             // Small laptops (1024px and up)
//             1024: {
//               slidesPerView: 2.5, 
//               spaceBetween: 30,
//             },
//             // Large laptops (1180px and up)
//             1180: {
//               slidesPerView: 3,
//               spaceBetween: 35,
//             },
//             // Extra large screens (1400px and up)
//             1400: {
//               slidesPerView: 4,
//               spaceBetween: 40,
//             },
//           }}
//           modules={[Pagination, Navigation]}
//           className="mySwiper responsive-swiper"
//         >
//           {filteredBooks.length > 0 && filteredBooks.map((book, index) => (
//             <SwiperSlide key={index} className="pb-12">
//               <BookCard book={book} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* No books message */}
//       {filteredBooks.length === 0 && (
//         <div className='text-center py-8'>
//           <p className='text-gray-500 text-sm sm:text-base'>
//             No books found in this category.
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }
   
// export default TopSellers;