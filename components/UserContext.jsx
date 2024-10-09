import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'; // Import Firebase auth functions

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const userauth = auth(); // Get the Firebase auth instance

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged( (user) => {
      if (user) {
        setUser(auth().currentUser); // Set the user state to the logged-in user
      } else {
        setUser(null); // No user is signed in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userauth]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
