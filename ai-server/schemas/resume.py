# schemas/resume.py
from pydantic import BaseModel
from typing import List, Optional


# --- 요청(Request) 모델 ---
class Project(BaseModel):
    name: str
    description: str
    tech: List[str] = []


class Education(BaseModel):
    school: str
    degree: str
    year: str


class ResumeRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    desiredRole: Optional[str] = None
    jd: Optional[str] = ""

    projects: List[Project] = []
    skills: List[str] = []
    education: List[Education] = []


# --- 응답(Response) 모델 ---
class ResumeProject(BaseModel):
    name: str
    description: str
    achievements: List[str]
    tech: List[str]


class ResumeResponse(BaseModel):
    summary: str = ""
    skills: List[str] = []
    projects: List[ResumeProject] = []
