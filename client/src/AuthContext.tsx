import React, { createContext, useState, useEffect } from "react";

type AuthState = "loggedIn" | "loggedOut";

interface AuthContextInterface {
  token: string;
  authState: AuthState;
  saveToken: (token: string) => void;
  clearToken: () => void;
}

export const AuthContext = createContext<AuthContextInterface>({
  token: "",
  authState: "loggedOut",
  saveToken: () => {},
  clearToken: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthState>("loggedOut");
  const [token, setToken] = useState(
    window.localStorage.getItem("token") || ""
  );

  useEffect(() => {
    setAuthState(token ? "loggedIn" : "loggedOut");
  }, [token]);

  const saveToken = (token: string) => {
    window.localStorage.setItem("token", token);
    setToken(token);
  };

  const clearToken = () => {
    window.localStorage.removeItem("token");
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        authState,
        saveToken,
        clearToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
