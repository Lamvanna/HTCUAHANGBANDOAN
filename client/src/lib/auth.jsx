import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "./queryClient";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiRequest("POST", "/api/auth/login", {
        email,
        password,
      });

      // Clear cache when switching users
      console.log('Login - Clearing orders cache');
      queryClient.clear();
      console.log('Login - Cache cleared');

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const data = await apiRequest("POST", "/api/auth/register", userData);
      console.log('Registration response:', data);

      // Clear cache when registering new user
      queryClient.clear();

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));

      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Clear all React Query cache
    console.log('Logout - Clearing orders cache');
    queryClient.clear();
    console.log('Logout - Cache cleared');

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });

    // Force page refresh to ensure clean state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
