import React from 'react'
import { useAuth } from '../context/Auth.Context'
import { Navigate, useNavigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {currentUser, loading } = useAuth();

     if(loading) {
      return <div>Loading...</div>
     }

    if(currentUser) {
        return children;
    }

  return <Navigate to="/login" replace />

}

export default PrivateRoute
