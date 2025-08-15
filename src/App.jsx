import './App.css'
import { Outlet } from 'react-router-dom' 
import Navbar from './components/Navbar';
import Footer from './components/footer';
import { AuthProvider } from './context/Auth.Context';


function App() {

  return (
    <>
    <AuthProvider>
          
           <Navbar />
          <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'  /*bg-red-500 h-screen flex items-center justify-center*/ > 
             <Outlet/>
        </main>
      <Footer />
    </AuthProvider>

    </>
  )
}

export default App;










//https://www.youtube.com/watch?v=pVkZ3YrwmHI

//to start create and name(name of project) a folder inside local disk
//inside project folder craete backend and front end folder
//navigate to front end , open terminal
//  and run / install vite
//npm create vite@latest ./ 
//   the   ./ means it should install only in the current folder
// after creating vite, there is a pop up options, from the pop options, 
// select react, then select javascript as the variant
// run npm install  and
// npm run dev

// copy the local host code in your browser

//TAILWIND CSS
//GO TO TAILWINDCSS.COM AND FOLLOW THE INSTALLATION GUIDE
// OR CLICK ON get started => to installation  => framework guide (vite)
// npm install -D tailwindcss postcss autoprefixer
// -D means it is a development dependency
// npx tailwindcss init -p
// replace the content in tailwind.config.js with 
// content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],

// then replace codes in index.css with
// @tailwind base;
// @tailwind components;
// @tailwind utilities;

//then type in  terminal 
// npm run dev

//then go to the web for react router dom to install it
// npm install react-router-dom
// stop @ video minutes 30 : 40 sec

//dependencies and steps
//for the front end

//npm install react-icons --save (used in Navbar.jsx)
//npm install swiper (used in TopSeller.jsx)
// react hook form used in login {npm install react-hook-form}
// react redux { Redux Toolkit is available as a package on NPM for use with a module bundler or in a Node application:
 //npm install @reduxjs/toolkit} If you need React bindings: npm install react-redux {used in store.js}
 // npm install sweetalert2  - used/imported in main.jsx as import 'sweetalert2/dist/sweetalert2.js' and  imported as import swal from "sweetalert2" in cartSlice.js and used as Swal.fire({
//   position: "top-end",
//   icon: "success",
//   title: "Your work has been saved",
//   showConfirmButton: false,
//   timer: 1500 
// });
    // and as else
    // Swal.fire({
    //   title: "Already Added to the Cart?",
    //   text: "You won't be able to revert this!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "ok"
    // }) 

 
// , FRONTEND start @ 0 : 20  : 28  and continued at 5: 09 : 00

// FIREBASE- AUTHENTICATING USER  5 : 37 : 29  to 6 : 33 : 29  // https://console.firebase.google.com/?_gl=1*1he63wv*_ga*MTMyMjQwMzc0Ni4xNzUyODI4Mzgy*_ga_CW55HF8NVT*czE3NTI4MjgzODIkbzEkZzEkdDE3NTI4Mjg2MTUkajYwJGwwJGgw
// npm install firebase
// CREATE FIRE BASE FOLDER WITH FIREBASE.CONFIG.JS AND ALSO CREATE  .env.local
 // private route to protect checkout 6 : 26 : 40
 // creating admin/user 7: 19 : 58  and /bycrypt and jsonwebtoken 
 // using axios 7 : 58 : 27

  
//stopped @ 8 : 52 : 20      03 - 08 - 2025

// https://github.com/mdalmamunit427/build-full-stack-book-store-mern-app
// https://github.com/mdalmamunit427/book-store-app-ui-assets


// echo "a book-store-app-frontend" >> README.md
// git init
// git add .
// git commit -m "First comit"
// git branch -M main
// git remote add origin https://github.com/AdenijiAbraham/book-store-app.git
// git push -u origin main