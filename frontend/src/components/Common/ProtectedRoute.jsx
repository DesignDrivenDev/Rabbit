import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useSelector((state) => state.auth.user);

    // If no user is logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user's role does not match the required role
    if (role && user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;


// import React, { use } from 'react'
// import { useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom'

// const ProtectedRoute = ({ children, role }) => {
//     const { user } = useSelector((state) => state.auth)

//     console.log("adminrole", user.role)
//     if (!user && user.role !== role) {
//         return <Navigate to="/login" replace />
//     }
//     return children;
// }

// export default ProtectedRoute