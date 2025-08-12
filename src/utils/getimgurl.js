// function getImgUrl (name) {
//     return new URL(`../assets/books/${name}`, import.meta.url)
// }

// export {getImgUrl};  





function getImgUrl(name) {
  if (!name) return '/placeholder-book.jpg'; // optional fallback
  return `http://localhost:5000/uploads/${name}`;
}

export { getImgUrl };

