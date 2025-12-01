from pydantic import BaseModel
from typing import List, Optional


#-------------------------
#요청(Request)
#-------------------------
class RecommendRequest(BaseModel):
    major: Optional[str] = ""
    desiredJob: Optional[str] = ""
    interests: List[str] = []
    skills: List[str] = []


#-------------------------
#응답(Response)
#-------------------------
#Node (필요 시 사용)
class Node(BaseModel):
    id: str
    title: str
    reason: Optional[str] = None


#Task 모델 (프롬프트 형식에 맞춤)
class Task(BaseModel):
    id: int
    label: str


#Track 모델 (프롬프트 형식에 맞춤)
class Track(BaseModel):
    id: str
    title: str
    tasks: List[Task]


#전체 RecommendResponse
class RecommendResponse(BaseModel):
    refinedJob: Optional[str] = ""
    certifications: List[str] = []
    techStack: List[str] = []
    roadmap: List[str] = []
    nodes: Optional[List[Node]] = None
    tracks: List[Track] = []  # 반드시 존재해야 함