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
    case 'LOGIN':
      const decoded = jwtDecode(action.payload.token);
      return { user: { ...action.payload, _id: decoded._id } }
    case 'LOGOUT':
      return { user: null }
    case 'UPDATE_USER':
      return { user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  console.log('AuthContext state: ', state)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
} 
