import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT = "LOGOUT";

const AuthReducer = (state, action) => {
  console.log("AuthReducer...");
  switch (action.type) {
    case LOGIN_START:
      return {
        user: null,
        loading: true,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  console.log("AuthContextProvider...");
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const { user, loading, error } = state;

  useEffect(() => {
    console.log("useEffect... user: ", user);
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
