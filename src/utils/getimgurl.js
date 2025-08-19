// utils/getimgurl.js

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
  return `https://book-store-app-backend-six.vercel.app/uploads/${name}`;
}

// Main function - returns backend URL (string, not object)
function getImgUrl(name) {
  return getBackendImgUrl(name);
}

export { getImgUrl, getAssetImgUrl, getBackendImgUrl };














// function getImgUrl (name) {
//     return new URL(`../assets/books/${name}`, import.meta.url)
// }

// export {getImgUrl};  





// function getImgUrl(name) {
//   if (!name) return '/placeholder-book.jpg'; // optional fallback
//   return `http://localhost:5000/uploads/${name}`;
// }

// export { getImgUrl };

