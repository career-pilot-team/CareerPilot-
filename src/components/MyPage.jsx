
import React from "react";
import "./MyPage.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const MyPage = () => {
  return (
    <div className="mypage-container">
      {/* 상단 헤더 */}
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

      {/* 메인 영역 */}
      <main className="mypage-main">

        {/* 🔹 사용자 기본 정보 카드 (READ ONLY) */}
        <section className="mypage-profile-card">
          <div className="profile-avatar">
            <span className="profile-avatar-icon">👤</span>
          </div>

          <h2 className="profile-name">홍길동</h2>
          <p className="profile-email">honggildong@email.com</p>

          <div className="profile-info-box">
            <div className="profile-row">
              <span className="profile-label">희망 직무</span>
              <span className="profile-value">IT 개발자</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">보유 자격증</span>
              <span className="profile-value">SQLD, TOEIC</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">관심 산업분야</span>
              <span className="profile-value">헬스케어, 디지털 헬스</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">현재 상태</span>
              <span className="profile-value">대학생</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">최종학력/전공</span>
              <span className="profile-value">대학교 재학 / 컴퓨터공학</span>
            </div>
          </div>
        </section>

        {/* 🔹 정보 수정 카드 */}
        <section className="mypage-card edit-card">
          <h3 className="edit-title">정보 수정</h3>

          <div className="mypage-form-grid">
            <div className="form-group">
              <label htmlFor="targetJob">희망 직무</label>
              <input
                id="targetJob"
                type="text"
                placeholder="IT-개발직, IT-관리직"
              />
            </div>

            <div className="form-group">
              <label htmlFor="certs">보유 자격증</label>
              <input id="certs" type="text" placeholder="SQLD, TOEIC" />
            </div>

            <div className="form-group">
              <label htmlFor="interestField">관심 산업분야</label>
              <input
                id="interestField"
                type="text"
                placeholder="ex: 디지털 헬스케어"
              />
            </div>

            <div className="form-group form-group-textarea">
              <label htmlFor="specialNote">특이사항</label>
              <textarea id="specialNote" placeholder="Value" rows={4} />
            </div>

            <div className="form-group">
              <label htmlFor="currentStatus">현재 직업/상태</label>
              <input id="currentStatus" type="text" placeholder="대학생" />
            </div>

            <div className="form-group">
              <label htmlFor="education">최종학력 / 전공</label>
              <input
                id="education"
                type="text"
                placeholder="대학/재학/컴퓨터공학"
              />
            </div>
          </div>

          <button className="edit-save-btn">수정 내용 저장하기</button>
        </section>
      </main>
    </div>
  );
};

export default MyPage;
