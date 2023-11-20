import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth)
    const location = useLocation();
    console.log();
    const isPublicRoute = location.pathname === '/login' || location.pathname === '/register';
    return (
        user.name ? <Navigate to="/dashboard/app" /> : <Outlet />
    )
}

export default PublicRoute