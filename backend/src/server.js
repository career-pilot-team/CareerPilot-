const app = require('./app');
const sequelize = require('./db');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB 연결 성공 ');

    // 개발 단계에서는 alter: true로 컬럼 변경도 자동 반영 가능
    await sequelize.sync({ alter: false });
    console.log('✅ 모델과 DB 동기화 완료');

    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ DB 연결 실패:', err);
    process.exit(1);
  }
})();