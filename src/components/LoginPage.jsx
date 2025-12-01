import React from "react";
import "./LoginPage.css";
import logo from "../assets/logo.png";

const LoginPage = () => {
  return (
    <div className="login-container">
      <header className="header">
        <img src={logo} alt="logo" className="logo" />
        <nav className="nav-links">
          <a href="#">로그인</a>
          <a href="#">회원가입</a>
          <a href="#">마이페이지</a>
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
