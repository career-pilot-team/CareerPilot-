# services/resume_service.py

import json
import re
from .openai_client import client, OPENAI_MODEL
from schemas.resume import ResumeRequest, ResumeResponse, ResumeProject


# ==========================================================
# 1) 프롬프트 생성
# ==========================================================
def _build_prompt(body: ResumeRequest) -> str:

    projects_text = json.dumps([p.dict() for p in body.projects], ensure_ascii=False, indent=2)
    education_text = json.dumps([e.dict() for e in body.education], ensure_ascii=False, indent=2)
    skills_text = ", ".join(body.skills or [])

    return f"""
당신은 최고 수준의 전문 이력서 작성 AI입니다.
아래 사용자가 입력한 정보를 기반으로 **실제 기업 제출용 이력서 JSON**만 생성하세요.
⚠ JSON 외의 모든 자연어 문장은 절대 출력 금지.

---

## 출력 형식(JSON ONLY)

{{
  "summary": "",
  "skills": [],
  "projects": [
    {{
      "name": "",
      "description": "",
      "achievements": [],
      "tech": []
    }}
  ]
}}

---

## 입력 데이터

- 이름: {body.name}
- 이메일: {body.email}
- 연락처: {body.phone}
- 희망 직무: {body.desiredRole}
- 직무기술서(JD): {body.jd}

[프로젝트]
{projects_text}

[스킬]
{skills_text}

[학력]
{education_text}

---

## 작성 규칙

1) summary는 희망 직무 기반의 **전문적이고 매끄러운 문장**으로 재작성  
2) skills는 **중요도 순**으로 정렬된 리스트로 생성  
3) 프로젝트는 “문제 → 행동 → 결과(정량 성과)” 구조로 재작성  
4) achievements는 반드시 **정량적 표현**(%, 증가율, 지연 감소 등)을 2~4개 포함  
5) JSON 외 텍스트, 설명, 코드블록, 주석 절대 금지  
6) 프로젝트 정보가 부족하면 AI 판단으로 자연스럽게 보완  

반드시 JSON만 출력하세요.
"""


# ==========================================================
# 2) JSON 클린업 + 파싱
# ==========================================================

def _strip_code_fence(text: str) -> str:
    """ ```json 코드블록 제거 """
    return text.replace("```json", "").replace("```", "").strip()


def _extract_json(text: str) -> str:
    """ GPT가 JSON 앞뒤에 텍스트를 붙였을 때 순수 JSON만 정규식으로 추출 """
    match = re.search(r"\{.*\}", text, re.DOTALL)
    return match.group(0) if match else "{}"


def _parse_json_or_fallback(text: str) -> ResumeResponse:
    cleaned = _strip_code_fence(text)
    extracted = _extract_json(cleaned)

    try:
        data = json.loads(extracted)
    except Exception as e:
        print("❌ JSON PARSE ERROR:", e)
        print("RAW >>>", text)
        return ResumeResponse()  # fallback

    projects = [
        ResumeProject(
            name=p.get("name", ""),
            description=p.get("description", ""),
            achievements=p.get("achievements", []),
            tech=p.get("tech", []),
        )
        for p in data.get("projects", [])
    ]

    return ResumeResponse(
        summary=data.get("summary", ""),
        skills=data.get("skills", []),
        projects=projects,
    )


# ==========================================================
# 3) OpenAI 호출
# ==========================================================
def generate_resume(body: ResumeRequest) -> ResumeResponse:
    prompt = _build_prompt(body)

    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "너는 JSON 생성 전문 AI다. "
                    "출력은 무조건 JSON 하나만 허용된다. "
                    "JSON 바깥에 어떤 문장도 포함하면 안 된다."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        max_tokens=800,
    )

    raw = (resp.choices[0].message.content or "").strip()

    print("\n===== RAW RESUME OUTPUT =====\n", raw, "\n=============================\n")

    return _parse_json_or_fallback(raw)
