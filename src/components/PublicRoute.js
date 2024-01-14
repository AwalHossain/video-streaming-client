import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
// replace with your auth context


const PublicRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth); // replace with your auth context
    console.log('user form the public route', user);
    return user ? <Navigate to="/dashboard/app" /> : children;
}

export default PublicRoute