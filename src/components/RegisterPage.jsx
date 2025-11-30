import React from "react";
import "./RegisterPage.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const RegisterPage = () => {
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

        <form className="register-form">
          <label>이름</label>
          <input type="text" placeholder="name" />

          <label>이메일</label>
          <input type="email" placeholder="e-mail" />

          <label>비밀번호</label>
          <input type="password" placeholder="password" />

          <label>비밀번호 확인</label>
          <input type="password" placeholder="비밀번호 확인" />

          <label>희망 직무</label>
          <input type="text" placeholder="직무 입력" />

          <div className="row">
            <div className="half">
              <label>보유 기술 스택</label>
              <input type="text" placeholder="기술 스택" />
            </div>
            <div className="half">
              <label>수준</label>
              <select>
                <option>상</option>
                <option>중</option>
                <option>하</option>
              </select>
            </div>
          </div>
          
          
          {/*자꾸 에러나서 일단 주석처리 - 왼쪽정렬해야하는데 오른쪽으로 붙음
           <div className="checkbox-group">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I accept the terms <br />
              <span className="terms-text">개인정보 수집 및 이용동의 (필수)</span>
            </label>
          </div> */}

          <button type="submit" className="submit-btn">
            회원가입
          </button>
        </form>
      </main>
    </div>
    </>
  );
};

export default RegisterPage;
