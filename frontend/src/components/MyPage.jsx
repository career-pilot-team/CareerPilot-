import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function MyPage() {
  const token = localStorage.getItem("token");

  // 프로필 + 유저 정보
  const [profile, setProfile] = useState(null);

  // 수정 폼 상태
  const [editData, setEditData] = useState({
    major: "",
    desiredRole: "",
    interests: "",
    skills: "",
  });

  // 1) 프로필 + 유저 정보 로드
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        // user 기본 정보 + profile 정보 동시에 요청
        const [authRes, profileRes] = await Promise.all([
          axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/profile/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const user = authRes.data.user;                // { id, email, name }
        const rawProfile = profileRes.data.profile || {}; // null이면 빈 객체로

        // 화면에서 쓸 profile 객체 형태 통일
        const merged = {
          user,                          // 이름/이메일
          major: rawProfile.major || "",
          desiredRole: rawProfile.desiredRole || "",
          interests: Array.isArray(rawProfile.interests)
            ? rawProfile.interests
            : [],
          skills: Array.isArray(rawProfile.skills)
            ? rawProfile.skills
            : [],
        };

        setProfile(merged);

        // 수정 폼 초기값 세팅
        setEditData({
          major: merged.major,
          desiredRole: merged.desiredRole,
          interests: merged.interests.join(", "),
          skills: merged.skills.join(", "),
        });
      } catch (err) {
        console.error("프로필 조회 오류:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // input 값 변경
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // 2) 프로필 저장
  const handleSave = () => {
    axios
      .post(
        "/api/profile/me",
        {
          major: editData.major,
          desiredRole: editData.desiredRole,
          interests: editData.interests
            ? editData.interests.split(",").map((v) => v.trim())
            : [],
          skills: editData.skills
            ? editData.skills.split(",").map((v) => v.trim())
            : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        alert("저장 완료!");

        // 저장 후 화면에 바로 반영
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                major: editData.major,
                desiredRole: editData.desiredRole,
                interests: editData.interests
                  ? editData.interests.split(",").map((v) => v.trim())
                  : [],
                skills: editData.skills
                  ? editData.skills.split(",").map((v) => v.trim())
                  : [],
              }
            : prev
        );
      })
      .catch((err) => {
        console.error("프로필 저장 오류:", err);
      });
  };

  // 아직 프로필 로딩 전이면
  if (!profile) return <div>로딩 중...</div>;

  return (
    <div className="mypage-container">
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

      <main className="mypage-main">
        {/* 상단 카드 */}
        <div className="mypage-profile-card">
          <div className="profile-avatar">
            <span className="profile-avatar-icon">👤</span>
          </div>

          {/* user 정보는 profile.user에서 읽음 */}
          <h2 className="profile-name">{profile.user?.name}</h2>
          <p className="profile-email">{profile.user?.email}</p>

          <div className="profile-info-box">
            <div className="profile-row">
              <span className="profile-label">전공</span>
              <span className="profile-value">{profile.major || "-"}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">희망 직무</span>
              <span className="profile-value">
                {profile.desiredRole || "-"}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">관심 분야</span>
              <span className="profile-value">
                {profile.interests.length > 0
                  ? profile.interests.join(", ")
                  : "-"}
              </span>
            </div>

            <div className="profile-row">
              <span className="profile-label">스킬</span>
              <span className="profile-value">
                {profile.skills.length > 0
                  ? profile.skills.join(", ")
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* 정보 수정 카드 */}
        <div className="mypage-card">
          <h3 className="edit-title">정보 수정</h3>

          <div className="mypage-form-grid">
            <div className="form-group">
              <label>전공</label>
              <input
                name="major"
                value={editData.major}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>희망 직무</label>
              <input
                name="desiredRole"
                value={editData.desiredRole}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>관심 분야</label>
              <input
                name="interests"
                value={editData.interests}
                onChange={handleChange}
                placeholder="쉼표로 구분"
              />
            </div>

            <div className="form-group">
              <label>스킬</label>
              <input
                name="skills"
                value={editData.skills}
                onChange={handleChange}
                
              />
            </div>
          </div>

          <button className="edit-save-btn" onClick={handleSave}>
            저장하기
          </button>
        </div>
      </main>
    </div>
  );
}

export default MyPage;
