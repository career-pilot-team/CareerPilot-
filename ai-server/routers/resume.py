from fastapi import APIRouter, HTTPException
from schemas.resume import ResumeRequest, ResumeResponse
from services.resume_service import generate_resume

router = APIRouter()

@router.post("/resume/generate", response_model=ResumeResponse)
def generate_resume_api(body: ResumeRequest):
    try:
        return generate_resume(body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
