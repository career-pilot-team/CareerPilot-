# main.py
from fastapi import FastAPI
from routers.recommend import router as recommend_router

app = FastAPI()

# 상태 체크용 엔드포인트 (컨테이너/라우팅 점검)
@app.get("/ai/health")
def health():
    return "ai ok"

# /ai 프리픽스로 추천 관련 라우터 마운트
app.include_router(recommend_router, prefix="/ai")
