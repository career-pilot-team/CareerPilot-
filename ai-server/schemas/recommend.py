# #schemas/recommend.py
from pydantic import BaseModel
from typing import List, Optional


class RecommendRequest(BaseModel):
    major: Optional[str] = ""
    desiredJob: Optional[str] = ""
    interests: List[str] = []
    skills: List[str] = []


class Node(BaseModel):
    id: str
    title: str
    reason: Optional[str] = None


class RecommendResponse(BaseModel):
    refinedJob: Optional[str] = ""
    certifications: List[str] = []
    techStack: List[str] = []
    roadmap: List[str] = []
    nodes: Optional[List[Node]] = None
