import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth); // replace with your auth context

    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute; 