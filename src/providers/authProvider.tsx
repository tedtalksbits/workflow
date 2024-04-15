import { IUser } from '@/types/user';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
type AuthContextType = {
  user: IUser | null;
  loading: boolean;
  login: (
    credentials: { username: string; password: string },
    callback: (res: Record<string, unknown>) => void
  ) => void;
  logout: (callback: (res: Record<string, unknown>) => void) => void;
};

export const AuthContext = createContext({} as AuthContextType);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (
    credentials: { username: string; password: string },
    callback: (
      res: Awaited<ReturnType<typeof window.electron.user.logIn>>
    ) => void
  ) => {
    console.log(credentials);
    window.electron.user.logIn(credentials).then((res) => {
      console.log('res', res);
      setUser(res.data);
      callback(res);
    });
  };

  const logout = (
    callback: (
      res: Awaited<ReturnType<typeof window.electron.user.logOut>>
    ) => void
  ) => {
    console.log('logOut');
    window.electron.user.logOut().then((res) => {
      console.log('res', res);
      setUser(null);
      callback(res);
    });
  };

  // get last session
  useEffect(() => {
    console.log('app loaded, get user last session');
    window.electron.user.loginLocal().then((res) => {
      console.log('res', res);
      setUser(res.data);
      setLoading(false);
      if (res.success) toast.success('Welcome back!');
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
