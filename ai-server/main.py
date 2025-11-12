from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 요청 바디 정의
class RecommendRequest(BaseModel):
    skills: list[str]

@app.post("/recommend")
def recommend(req: RecommendRequest):
    """
    예시: 기술 목록에 따라 추천 직무를 반환
    """
    if "python" in req.skills:
        jobs = ["AI Engineer", "Data Scientist"]
    elif "react" in req.skills:
        jobs = ["Frontend Developer", "Fullstack Developer"]
    else:
        jobs = ["Project Manager", "Planner"]

    return {"recommendations": jobs}


