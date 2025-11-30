import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./Feature2Page.css";
// import feature2Img from "../assets/feature2Img.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const INITIAL_TRACKS = [
  {
    id: "python",
    title: "Python 기본 학습",
    color: "#e34234",
    tasks: [
      { id: 1, label: "파이썬 문법 기초 익히기 (자료형, 조건문, 반복문)", done: false },
      { id: 2, label: "함수·모듈·패키지 사용해 보기", done: false },
      { id: 3, label: "Pandas로 기본 데이터 분석 실습", done: false },
      { id: 4, label: "실습 노트북 하나 완성하기", done: false },
    ],
  },
  {
    id: "sql",
    title: "SQL · DB 기초",
    color: "#e34234",
    tasks: [
      { id: 1, label: "기본 SELECT / WHERE / ORDER BY 연습", done: false },
      { id: 2, label: "JOIN · GROUP BY · HAVING 문제 풀어 보기", done: false },
      { id: 3, label: "실제 테이블 스키마 설계 연습", done: false },
      { id: 4, label: "미니 프로젝트 쿼리 작성해 보기", done: false },
    ],
  },
  {
    id: "cloud",
    title: "AWS · 클라우드 이해",
    color: "#e34234",
    tasks: [
      { id: 1, label: "AWS 기본 서비스 개념 정리 (EC2, S3, RDS 등)", done: false },
      { id: 2, label: "콘솔에서 S3 버킷 만들어 보기", done: false },
      { id: 3, label: "간단한 데이터 파이프라인 구조 그려 보기", done: false },
      { id: 4, label: "관련 기술 블로그 글 3개 정리", done: false },
    ],
  },
];

const CHART_COLORS = ["#7C3AED", "#e34234", "#E5E7EB"];

function Feature2Page() {
  const [tracks, setTracks] = useState(INITIAL_TRACKS);

  // 체크박스 토글
  const handleToggleTask = (trackId, taskId) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id !== trackId
          ? track
          : {
              ...track,
              tasks: track.tasks.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task
              ),
            }
      )
    );
  };

  // 트랙별 진행률
  const getTrackProgress = (track) => {
    const total = track.tasks.length;
    const done = track.tasks.filter((t) => t.done).length;
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  };

  // 전체 성장률 + 도넛 차트 데이터
  const { overallRate, chartData } = useMemo(() => {
    const totalTasks = tracks.reduce((sum, t) => sum + t.tasks.length, 0);
    const doneTasks = tracks.reduce(
      (sum, t) => sum + t.tasks.filter((task) => task.done).length,
      0
    );
    const overallRate =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    let completedTracks = 0;
    let inProgressTracks = 0;
    let notStartedTracks = 0;

    tracks.forEach((track) => {
      const doneCount = track.tasks.filter((t) => t.done).length;
      if (doneCount === 0) notStartedTracks += 1;
      else if (doneCount === track.tasks.length) completedTracks += 1;
      else inProgressTracks += 1;
    });

    const chartData = [
      { name: "완료 트랙", value: completedTracks },
      { name: "진행 중 트랙", value: inProgressTracks },
      { name: "미시작 트랙", value: notStartedTracks },
    ];

    return { overallRate, chartData };
  }, [tracks]);

  return (
    <div className="feature2-page">
      <div className="feature2-container">

            <header className="header">
              <Link to="/" className="logo-link">
                 <img src={logo} alt="logo" className="feature2-logo" />
                 </Link>
                     <nav className="nav-links">
                          <Link to="/login">로그인</Link>
                          <Link to="/register">회원가입</Link>
                          <Link to="/mypage">마이페이지</Link>
                 </nav>
           </header>



           
        {/* 성장 현황 + 로드맵 */}
        <section className="growth-section">
          <h2 className="growth-title">내 성장 현황</h2>

             {/* <div className="growth-emoji">
                <img src={feature2Img} alt="성장을 응원하는 이모지" />
              </div>
 */}

          <div className="growth-card">
            {/* 상단: 이모지 + 도넛 차트 & 전체 성장률 */}
            <div className="growth-main">
            

              <div className="growth-chart-wrapper">
                <div className="growth-chart-area">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* 차트 아래: 전체 성장률 텍스트 */}
                <div className="growth-summary">
                  <p className="growth-percentage">{overallRate}%</p>
                  <p className="growth-percentage-label">전체 성장률</p>
                  <p className="growth-helper-text">
                    체크리스트를 완료할수록 성장률이 올라가요♥
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="goal-block">
            <p className="goal-label">현재 목표</p>
            <p className="goal-text">
              “데이터 엔지니어(클라우드 데이터 파이프라인 구축 전문가)”
            </p>
          </div>

          <div className="roadmap-card">
            <p className="roadmap-title">로드맵</p>
            <ol className="roadmap-list">
              <li>
                <strong>1개월차:</strong> AWS 클라우드 기초 학습과 Python 심화 학습
              </li>
              <li>
                <strong>2개월차:</strong> 데이터베이스 이론과 SQL 실전 연습
              </li>
              <li>
                <strong>3개월차:</strong> 클라우드 데이터 파이프라인 프로젝트 구현
              </li>
            </ol>
          </div>
        </section>

        {/* To Do & 성장 트래커 */}
        <section className="todo-section">
          <h3 className="todo-title">To Do</h3>

          <div className="todo-columns">
            {tracks.map((track) => {
              const progress = getTrackProgress(track);
              return (
                <div key={track.id} className="todo-column">
                  <div className="todo-progress-header">
                    <span className="todo-track-title">{track.title}</span>
                    <span className="todo-progress-rate">{progress}%</span>
                  </div>
                  <div className="todo-progress-bar">
                    <div
                      className="todo-progress-fill"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: track.color,
                      }}
                    />
                  </div>

                  <ul className="todo-list">
                    {track.tasks.map((task) => (
                      <li key={task.id} className="todo-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() =>
                              handleToggleTask(track.id, task.id)
                            }
                          />
                          <span>{task.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Feature2Page;
