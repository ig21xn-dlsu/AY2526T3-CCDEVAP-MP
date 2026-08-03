import { useState } from "react";
import { useAuthContext } from './useAuthContext';

export const useAdminCreateUser = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext(); 

    const createUser = async (lastName, firstName, email, password, confirmPassword, role) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify({ firstName, lastName, email, password, confirmPassword, role })
        });

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.message);
            return false;
        }

        setIsLoading(false);
        return true;
    };

    return { createUser, isLoading, error };
};