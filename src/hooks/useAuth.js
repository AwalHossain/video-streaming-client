import { useEffect } from "react";
import { useCheckSessionQuery } from "../redux/features/auth/authApi";



const useAuth = () => {
    const { data: user, isLoading: loading } = useCheckSessionQuery();

    useEffect(() => {

    }, [])

    return { user, loading }
}

export default useAuth;