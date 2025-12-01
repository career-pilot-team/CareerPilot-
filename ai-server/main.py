# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.recommend import router as recommend_router

# 앱 생성
app = FastAPI()

# 작성자 정헌용 : 이전 버전에서 CORS 정책에 막혀서,
# 프론트(dev 서버) 주소들을 허용하도록 설정함ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # 위에 적은 주소들만 허용
    allow_credentials=True,
    allow_methods=["*"],     # 모든 HTTP 메서드 허용 (GET, POST 등)
    allow_headers=["*"],     # 모든 헤더 허용
)
#ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
# 상태 체크용 엔드포인트 (컨테이너/라우팅 점검)
@app.get("/ai/health")
async def health():
    return {"status": "ai ok"}

# /ai 프리픽스로 추천 관련 라우터 마운트
app.include_router(recommend_router, prefix="/ai")
