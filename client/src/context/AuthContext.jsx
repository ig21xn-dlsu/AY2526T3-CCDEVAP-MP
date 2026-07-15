/* Hey Ian, I notice that we dont actually store the user so it ends up logging us 
 * out everytime after a refresh i will just add the two new useEffects to store our storedUser data
 * I also need this since i need to attach a user when i create the listing 
 * 
 * -Philip
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

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
