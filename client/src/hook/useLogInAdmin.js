import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogInAdmin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const logInAdmin = async (email, password, rememberMe) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/adminlogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.message)
        }

        if (response.ok) {
            
            const storage = rememberMe ? localStorage : sessionStorage
            storage.setItem('user', JSON.stringify(json))

            dispatch({ type: 'LOGIN', payload: json })

            setIsLoading(false)

            return json;
        }
    }

    return { logInAdmin, isLoading, error }
}