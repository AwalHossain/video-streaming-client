import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    console.log('user', user, 'loading', loading);

    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>
    }

    return children;
}

export default ProtectedRoute;