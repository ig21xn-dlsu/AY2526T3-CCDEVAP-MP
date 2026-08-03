/* Hey Ian, I notice that we dont actually store the user so it ends up logging us 
 * out everytime after a refresh i will just add the two new useEffects to store our storedUser data
 * I also need this since i need to attach a user when i create the listing 
 * 
 * -Philip
 * 
 * OKKKK 
 * - ian :)
 */


import { jwtDecode } from "jwt-decode";
import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      const decoded = jwtDecode(action.payload.token);
      return { ...state, user: { ...action.payload, _id: decoded._id }, isReady: true }
    }
    case 'LOGOUT':
      return { ...state, user: null, isReady: true }
    case 'AUTH_READY':
      return { ...state, isReady: true }
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isReady: false, 
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    } else {
      dispatch({ type: "AUTH_READY" });
    }
  }, []);

  // Periodically re-validate the session against the server. Catches
  // suspensions (and deletions/expired tokens) even if the user is just
  // idling on a page and not triggering any other protected requests.
  useEffect(() => {
    if (!state.user) return;

    const checkStillValid = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${state.user.token}` }
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
        }
      } catch (err) {
        console.error('Session check failed:', err.message);
      }
    };

    checkStillValid();
    const interval = setInterval(checkStillValid, 30000); // every 30s

    return () => clearInterval(interval);
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}