import "./login.scss";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthContext,
  LOGIN_FAILURE,
  LOGIN_START,
  LOGIN_SUCCESS,
} from "../../context/AuthContext";

const Login = () => {
  console.log("Login...");
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { user, loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: LOGIN_START });

    try {
      const res = await axios.post(
        "http://localhost:8800/auth/login",
        credentials
      );

      console.log("res.data: ", res.data);

      // isAdmin 속성에 따라 로그인 분기처리
      if (res.data.isAdmin) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data.details,
        });

        navigate("/");
      } else {
        dispatch({
          type: LOGIN_FAILURE,
          payload: { message: "You are not allowed!" },
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.response.data,
      });
    }
  };

  console.log("{ user, loading, error }: ", { user, loading, error });

  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button className="lButton" onClick={handleClick} disabled={loading}>
          로그인
        </button>
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
