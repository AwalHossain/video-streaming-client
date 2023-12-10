import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, userLoggedIn } = useSelector(state => state.auth)
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user && !userLoggedIn) {
            navigate('/login', { state: { from: location } });
        }
        setIsLoading(false);
    }, [user, userLoggedIn, navigate, location]);


    if (isLoading) {
        return <div>loading....</div>; // or return a loading spinner
    }

    return children;
}

export default ProtectedRoute;