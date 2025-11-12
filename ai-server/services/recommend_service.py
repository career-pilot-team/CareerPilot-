
from .openai_client import client, OPENAI_MODEL
from schemas.recommend import RecommendRequest, RecommendResponse
import json
# 프롬프트 구성 → OpenAI 호출 → JSON 파싱
# 사용자 입력을 바탕으로 모델에 보낼 프롬프트를 생성
def _build_prompt(body: RecommendRequest) -> str:
    interests = ", ".join(body.interests or [])
    skills = ", ".join(body.skills or [])
    return f"""
You are an expert career counselor.
Major: {body.major}
Desired job: {body.desiredJob}
Interests: {interests}
Current skills: {skills}

Provide:
1) refined job role (sub-role),
2) recommended certifications,
3) recommended technology stack,
4) a step-by-step learning roadmap.

Return a SINGLE JSON with keys:
"refinedJob", "certifications", "techStack", "roadmap".
If unknown, use empty string or empty arrays.
"""

# 모델이 ```json ... ```로 감싼 출력을 정리
def _strip_code_fence(text: str) -> str:
    return text.replace("```json", "").replace("```", "").strip()

# 모델 출력이 JSON이면 파싱, 아니면 안전한 기본값으로 폴백
def _parse_json_or_fallback(text: str) -> RecommendResponse:
    cleaned = _strip_code_fence(text)
    try:
        data = json.loads(cleaned)
        return RecommendResponse(
            refinedJob=data.get("refinedJob", ""),
            certifications=data.get("certifications", []) or [],
            techStack=data.get("techStack", []) or [],
            roadmap=data.get("roadmap", []) or [],
        )
    except Exception:
        return RecommendResponse()

# 메인 서비스 함수: 프롬프트 생성 → OpenAI 호출 → 파싱 결과 반환
def get_detailed_recommendation(body: RecommendRequest) -> RecommendResponse:
    prompt = _build_prompt(body)

    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "You are a helpful career recommendation assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=500,
    )

    text = (resp.choices[0].message.content or "").strip()
    return _parse_json_or_fallback(text)
