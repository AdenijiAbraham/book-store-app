import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase.config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged  } from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import { Provider } from "react-redux";




const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext)
}

const googleProvider = new GoogleAuthProvider();


// authprovider
export const AuthProvider = ( { children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

     //register a user
      const registerUser = async(email, password ) => {
         return await createUserWithEmailAndPassword (auth, email, password)
     }

     //login the user
     const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password)
     }

     // sign up with Gmail account
       const SignInWithGoogle = async (email, password) => {
        return await signInWithPopup(auth, googleProvider)
     }

     //  log out the user
     const logout = () => {
        return signOut(auth)
     }
     

     // manage user or Monitor auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            if(user) {
                const {email, displayName, photoURL} =user;
                const userData = {
                    email, username:displayName, photo: photoURL
                }
            }
        }); 

       return () => unsubscribe(); // Clean up subscription
       }, []);
      

     const value = {
        currentUser,
        loading,
        registerUser,
        loginUser,
        SignInWithGoogle,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}





// import { createContext, useContext, useState, useEffect } from "react";
// import { auth } from "../firebase/firebase.config";
// import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

// const AuthContext = createContext();
// export const useAuth = () => {
//     return useContext(AuthContext);
// };

// //authProvider
// export const AuthProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const registerUser = async (email, password) => {
//         return await createUserWithEmailAndPassword(auth, email, password);
//     };

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             setCurrentUser(user);
//             setLoading(false);
//         });

//         return unsubscribe;
//     }, []);

//     const value = {
//         currentUser,
//         registerUser,
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };