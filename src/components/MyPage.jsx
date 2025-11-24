import React from "react";
import "./MyPage.css";
import logo from "../assets/logo.png";

const MyPage = () => {
  return (
    <div className="mypage-container">
      {/* 상단 헤더 */}
      <header className="mypage-header">
        <div className="mypage-header-inner">
          <img src={logo} alt="logo" className="logo" />
          {/* <nav className="mypage-nav">
            <a href="/login">로그인</a>
            <a href="/register">회원가입</a>
            <a href="/mypage" className="active">
              마이페이지
            </a>
          </nav>
        </div>
      </header> */}
    <nav className="nav-links">
          <a href="#">로그인</a>
          <a href="#">회원가입</a>
          <a href="#" className="active">마이페이지</a>
        </nav>
        </div>
      </header>
      


      {/* 메인 영역 */}
      <main className="mypage-main">
        {/* 프로필 영역 */}
        <section className="mypage-profile">
          <div className="profile-avatar">
            <span className="profile-avatar-icon">👤</span>
          </div>
          <h2 className="profile-name">name</h2>
          <p className="profile-email">e-mail</p>
        </section>

        {/* 정보 입력 카드 */}
        <section className="mypage-card">
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
              <input
                id="certs"
                type="text"
                placeholder="SQLD, TOEIC"
              />
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
              <textarea
                id="specialNote"
                placeholder="Value"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentStatus">현재 직업/상태</label>
              <input
                id="currentStatus"
                type="text"
                placeholder="대학생"
              />
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
        </section>
      </main>
    </div>
  );
};

export default MyPage;
