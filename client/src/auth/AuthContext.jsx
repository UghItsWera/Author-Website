import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "authorStudioToken";
const USER_KEY = "authorStudioUser";

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(
      atob(
        token
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    if (!payload.exp) {
      return false;
    }

    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

async function getResponseData(response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return {
    message: text || "Something went wrong.",
  };
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitialising, setIsInitialising] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedToken || !storedUser) {
      setIsInitialising(false);
      return;
    }

    if (isTokenExpired(storedToken)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setIsInitialising(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setToken(storedToken);
      setUser(parsedUser);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

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

    const data = await getResponseData(response);

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to sign in."
      );
    }

    if (!data.token) {
      throw new Error(
        "Login succeeded, but no authentication token was returned."
      );
    }

    const authenticatedUser = {
      username: data.username,
      roles: data.roles,
    };

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authenticatedUser)
    );

    setToken(data.token);
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isInitialising,
        isAuthenticated: Boolean(token && user),
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