import React, { useState } from "react";
import "./LoginPage.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000/api";

const LoginPage = () => {
  const navigate = useNavigate();

  // 로그인 폼 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요."
        );
        setLoading(false);
        return;
      }

      // 토큰 & 유저 정보 저장
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // 로그인 성공 후 메인페이지로 이동
      setLoading(false);
      alert("로그인 성공!");
    
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setLoading(false);
    }
  };

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

        <form className="login-form" onSubmit={handleSubmit}>
          <label>이메일</label>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>비밀번호</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "로그인 중..." : "LOGIN"}
          </button>

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
