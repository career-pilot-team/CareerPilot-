import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import "./Feature2Page.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

// 도넛 차트 색상
const CHART_COLORS = ["#7C3AED", "#e34234", "#E5E7EB"];

function Feature2Page() {
  const token = localStorage.getItem("token");

  // 추천 결과 전체 (refinedJob, roadmap, tracks 등)
  const [recommendResult, setRecommendResult] = useState(null);
  // ToDo용 트랙/태스크
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) 나의 최신 추천 결과 불러오기
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:4000/api/recommend/result", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!res.data.ok || !res.data.result) {
          setRecommendResult(null);
          setTracks([]);
          return;
        }

        const result = res.data.result;

        // tracks → 프론트에서 쓰기 좋은 형태로 매핑
        const adaptedTracks =
          result.tracks?.map((t) => ({
            id: t.id,
            title: t.title,
            color: "#e34234",
            tasks: t.tasks.map((task) => ({
              id: task.id,
              label: task.label,
              done: task.isDone, // 백엔드 필드명: isDone
            })),
          })) ?? [];

        setRecommendResult(result);
        setTracks(adaptedTracks);
      })
      .catch((err) => {
        console.error("추천 결과 조회 오류:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // 2) 체크박스 토글 → PATCH /api/tasks/:taskId
  const handleToggleTask = (trackId, taskId) => {
    const targetTrack = tracks.find((t) => t.id === trackId);
    if (!targetTrack) return;

    const targetTask = targetTrack.tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const nextDone = !targetTask.done;

    // 낙관적 업데이트(프론트 먼저 반영)
    setTracks((prev) =>
      prev.map((track) =>
        track.id !== trackId
          ? track
          : {
              ...track,
              tasks: track.tasks.map((task) =>
                task.id === taskId ? { ...task, done: nextDone } : task
              ),
            }
      )
    );

    axios
      .patch(
        `http://localhost:4000/api/tasks/${taskId}`,
        { isDone: nextDone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        // 성공 시 따로 할 작업 없으면 생략
      })
      .catch((err) => {
        console.error("체크리스트 업데이트 오류: ", err);
        // 실패 시 롤백까지 하고 싶으면 여기서 setTracks로 되돌리는 로직 추가 가능
      });
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

  // 로딩 중일 때
  if (loading) {
    return <div className="feature2-page">로딩중...</div>;
  }

  return (
    <div className="feature2-page">
      <div className="feature2-container">
        {/* 헤더 */}
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

          <div className="growth-card">
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

          {/* 목표 / 로드맵 - 추천 결과가 있을 때만 표시 */}
          {recommendResult ? (
            <>
              <div className="goal-block">
                <p className="goal-label">현재 목표</p>
                <p className="goal-text">“{recommendResult.refinedJob}”</p>
              </div>

              <div className="roadmap-card">
                <p className="roadmap-title">로드맵</p>
                <ol className="roadmap-list">
                  {recommendResult.roadmap?.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="goal-block">
              <p className="goal-label">현재 목표</p>
              <p className="goal-text">
                로드맵 추천 이력이 없습니다. 먼저 추천을 받아보세요!
              </p>
            </div>
          )}
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
