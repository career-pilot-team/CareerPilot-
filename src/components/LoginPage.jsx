import React from "react";
import "./LoginPage.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="login-container">
      <header className="header">
        <Link to="/" className="logo-link">
        <img src={logo} alt="logo" className="logo" />
        </Link>
        
        <nav className="nav-links">
          <Link to="/login">로그인</Link>
          <Link to="/register">회원가입</Link>
          <Link to="/mypage">마이페이지</Link>
        </nav>
      </header>

      <main className="login-box">
        <h1>Login</h1>

        <form className="login-form">
          <label>이메일</label>
          <input type="email" placeholder="email" />

          <label>비밀번호</label>
          <input type="password" placeholder="Password" />

          <button type="submit" className="login-btn">LOGIN</button>

          <div className="divider">
            <span>or</span>
          </div>

          <button type="button" className="google-btn">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="google-icon"
            />
            Continue with Google
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
