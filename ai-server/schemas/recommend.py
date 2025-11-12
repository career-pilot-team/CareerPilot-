# schemas/recommend.py
from pydantic import BaseModel
from typing import List, Optional

# 프런트/백엔드에서 넘어오는 추천 요청 스키마
class RecommendRequest(BaseModel):
    major: Optional[str] = ""
    desiredJob: Optional[str] = ""
    interests: List[str] = []
    skills: List[str] = []
# AI가 반환해야 하는 표준 응답 스키마(JSON 형식)
class RecommendResponse(BaseModel):
    refinedJob: Optional[str] = ""
    certifications: List[str] = []
    techStack: List[str] = []
    roadmap: List[str] = []
