

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const navigate = useNavigate();;

    if (loading) {
        return <div>Loading...</div>
    }
    if (!user && !loading) {
        navigate('/login');
        return null;
    }

    return children;
}

export default ProtectedRoute