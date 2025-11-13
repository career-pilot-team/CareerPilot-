#routers/recommend.py
from fastapi import APIRouter, HTTPException
from schemas.recommend import RecommendRequest, RecommendResponse
from services.recommend_service import get_detailed_recommendation

# 추천 API 라우터: 요청 바디를 받아 서비스 호출 후 결과 반환
router = APIRouter()

# 상세 추천 엔드포인트: 모델 호출 → JSON 응답 반환
@router.post("/recommend/detailed", response_model=RecommendResponse)
def recommend_detailed(body: RecommendRequest):
    try:
        return get_detailed_recommendation(body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
