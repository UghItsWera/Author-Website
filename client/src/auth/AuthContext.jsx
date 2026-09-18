import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  const AuthContext = createContext(null);
  
  function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isInitialising, setIsInitialising] = useState(true);
  
    useEffect(() => {
      /*
       * JWT restoration will be added once the final
       * authentication configuration is complete.
       */
  
      setIsInitialising(false);
    }, []);
  
    const login = async (username, password) => {
      const response = await fetch(
        "http://localhost:5297/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(
          data.message || "Unable to sign in."
        );
      }
  
      /*
       * Token storage will be added here at the end
       * when JWT configuration is finalised.
       */
  
      const authenticatedUser = {
        username: data.username,
        roles: data.roles,
      };
  
      setUser(authenticatedUser);
  
      return authenticatedUser;
    };
  
    const logout = () => {
      setUser(null);
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          isInitialising,
          isAuthenticated: Boolean(user),
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        "useAuth must be used inside an AuthProvider."
      );
    }
  
    return context;
  }
  
  export default AuthProvider;