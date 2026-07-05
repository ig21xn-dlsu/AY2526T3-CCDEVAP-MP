import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useLogInAdmin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const logInAdmin = async (email, password) => {
        
    }
    
}