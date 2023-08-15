import React from 'react';
import { useEffect } from 'react';
import firebaseApp, { auth, onAuthChange } from '@/firebase';
export type GoogleCredentials = {
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoURL: string;
  uid: string;
};
type AuthContextType = {
  user: GoogleCredentials | null;
  setUser: React.Dispatch<React.SetStateAction<GoogleCredentials | null>>;
};
export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  setUser: () => auth.currentUser,
});
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  function getLocalUser() {
    console.log('getLocalUser');
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
  const [user, setUser] = React.useState<GoogleCredentials | null>(
    getLocalUser()
  );

  useEffect(() => {
    console.log('useEffect');
    onAuthChange((user) => {
      if (user) {
        const { displayName, email, emailVerified, photoURL, uid } = user;
        const googleCredentials: GoogleCredentials = {
          displayName,
          email,
          emailVerified,
          photoURL,
          uid,
        };
        setUser(googleCredentials);
        localStorage.setItem('user', JSON.stringify(googleCredentials));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
