import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      console.log('fetching user');
      const response = await fetch('/user');
      const data = await response.json();
      setUser(data);
      if (response.ok) {
        return data;
      }
    } catch (error) {
      console.error('Error during user verification:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        getUser,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
