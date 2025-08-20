// utils/getimgurl.js 
import getBaseUrl from "./baseURJ.js"; // Import your existing getBaseUrl function

// Function to get image URL from assets
function getAssetImgUrl(name) {
  if (!name) return '/placeholder-book.jpg';
  try {
    return new URL(`../assets/books/${name}`, import.meta.url).href;
  } catch {
    return '/placeholder-book.jpg';
  }
} 

// Function to get image URL from backend
function getBackendImgUrl(name) {
  if (!name) return '/placeholder-book.jpg';
  const baseUrl = getBaseUrl();
  return `${baseUrl}/uploads/${name}`;
}

// Main function - returns backend URL (string, not object)
function getImgUrl(name) {
  return getBackendImgUrl(name);
} 

export { getImgUrl, getAssetImgUrl, getBackendImgUrl };





// // utils/getimgurl.js
// // Function to get image URL from assets
// function getAssetImgUrl(name) {
//   if (!name) return '/placeholder-book.jpg';
//   try {
//     return new URL(`../assets/books/${name}`, import.meta.url).href;
//   } catch {
//     return '/placeholder-book.jpg';
//   }
// } 

// // Function to get image URL from backend
// function getBackendImgUrl(name) {
//   if (!name) return '/placeholder-book.jpg';
//   return `http://localhost:5000/uploads/${name}`;
// }

// // Main function - returns backend URL (string, not object)
// function getImgUrl(name) {
//   return getBackendImgUrl(name);
// }

// export { getImgUrl, getAssetImgUrl, getBackendImgUrl };

