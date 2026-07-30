import { createContext, useContext, useReducer } from 'react';

const InitialValue = {
  isAuthenticated: false,
  user: null,
};
const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function authReducer(state: any, action: any) {
  switch (action.type) {
    case 'login':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'logout':
      return { ...state, isAuthenticated: false, user: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: any;
  login: (user: any) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ isAuthenticated, user }, dispatch] = useReducer(
    authReducer,
    InitialValue,
  );

  function login(user: any) {
    if (
      user.email === FAKE_USER.email ||
      user.password === FAKE_USER.password
    ) {
      dispatch({ type: 'login', payload: FAKE_USER });
    } else {
      alert('Invalid email or password');
    }
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
