import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    console.log('user', user, 'loading', loading);

    useEffect(() => {
        if (!user && !loading) {
            navigate('/login', { state: { from: location } });
        }
    }, [user, loading, navigate, location]);

    if (loading || !user) {
        return <div>Loading...</div>
    }

    return children;
}

export default ProtectedRoute;