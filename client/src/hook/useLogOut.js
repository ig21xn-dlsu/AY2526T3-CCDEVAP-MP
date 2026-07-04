import { useAuthContext } from './userAuthContext.js'

export const useLogOut = () => {

    const { dispatch } = useAuthContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({ type: 'LOGOUT'})
    }

    return {logout}
}