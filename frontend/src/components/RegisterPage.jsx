import React, { useState } from "react";
import "./RegisterPage.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  // 회원가입에 필요한 필드
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message || "회원가입에 실패했습니다. 다시 시도해 주세요."
        );
        setLoading(false);
        return;
      }

      setSuccessMsg("회원가입이 완료되었습니다!");

      // 잠깐 메시지 보여주고 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("서버와 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setLoading(false);
    }
  };

  return (
    <>

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

      <div className="register-container">
        <main className="register-box">
          <h1>Register</h1>

          <form className="register-form" onSubmit={handleSubmit}>
            <label>이름</label>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>이메일</label>
            <input
              type="email"
              placeholder="e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>비밀번호</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />

            {/*  추가 정보 (로그인에는 사용x) */}
            <label>희망 직무</label>
            <input type="text" placeholder="직무 입력" />

            <div className="row">
              <div className="half">
                <label>보유 기술 스택</label>
                <input type="text" placeholder="기술 스택" />
              </div>
              <div className="half">
                <label>수준</label>
                <select defaultValue="중">
                  <option>상</option>
                  <option>중</option>
                  <option>하</option>
                </select>
              </div>
            </div>

            {error && <p className="register-error">{error}</p>}
            {successMsg && <p className="register-success">{successMsg}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default RegisterPage;
