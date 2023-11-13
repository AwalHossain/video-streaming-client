import { useEffect, useState } from "react";
import { useCheckSessionQuery } from "../redux/features/auth/authApi";

const useAuth = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const { data, isLoading } = useCheckSessionQuery();
    console.log('data', data);
    useEffect(() => {
        if (data?.data) {
            setUser(data?.data);
            setLoading(false);
        }
        setLoading(isLoading);
    }, [isLoading, data]);

    return { user, loading };
};

export default useAuth;