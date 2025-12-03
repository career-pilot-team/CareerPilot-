import json
import re
from .openai_client import client, OPENAI_MODEL
from schemas.recommend import RecommendRequest, RecommendResponse


# 1) 프롬프트 생성 — JSON Schema 강제 + 출력 제한
def _build_prompt(body: RecommendRequest) -> str:
    interests = ", ".join(body.interests or [])
    skills = ", ".join(body.skills or [])

    return f"""
당신은 '한국 대학생/취준생 맞춤 진로 추천 AI'입니다. 
너의 목표는 사용자가 현실적이며 단계적으로 성장할 수 있는 **직무 로드맵 JSON**을 완성도 높게 만들어 주는 것이다.

### 사용자 정보
- 전공: {body.major}
- 희망 직무: {body.desiredJob}
- 관심사: {interests if interests else "없음"}
- 보유 스킬: {skills if skills else "없음"}

---

# 출력 형식 규칙 (절대 어기면 안 됨)
- **JSON만 출력** (설명, 자연어 문장, 코드블록 금지)
- **JSON 바깥에 어떠한 텍스트도 절대 출력 금지**
- 필드 생략 금지
- 값이 부족하면 최소 수준으로라도 채워 넣기

---

# JSON 생성 품질 규칙 (매우 중요)
· **단계형 학습 로드맵**을 반드시 3단계 이상 작성하라  
· nodes 는 학습 전체에서 중요한 “핵심 단계 요약"을 3개 이상 작성  
· tracks[*].tasks 는 체크리스트 형식으로 3~6개 작성  
· certifications, techStack 은 실제 해당 직무에 필요한 항목 중심으로 구체적으로 작성

---

# 작성 원칙
1) 사용자의 전공, 희망 직무, 관심사, 스킬을 종합적으로 분석하여 가장 자연스럽고 현실적인 경로를 제시하라.
2) 모든 문장은 자연스러운 한국어로 작성한다.
3) 내용은 깊이 있게 작성하고, 기술적인 상세 설명을 충분히 포함한다.
4) roadmap, tracks, nodes는 반드시 서로 논리적으로 연결되어야 한다.
5) tracks는 최소 2개 이상, 각 트랙의 tasks는 3개 이상으로 구성하라.
6) nodes는 3개 이상 핵심 개념을 포함해야 한다.

---

# 난이도 정책 (대학생 맞춤 — 매우 중요)
- 대학생/취준생이 3~6개월 학습 후 도전할 수 있는 난이도로 제한한다.
- 실무 난이도가 너무 높은 기술(AWS SageMaker, Kubernetes 전문 운영 등)을 기본 스택으로 넣지 않는다.
- 학습 순서는 기초 → 중급 → 초급 프로젝트 경험 순으로 구성한다.

---

# 자격증 생성 규칙 (대학생 / 취업준비생 기준) (중요)
- 자격증은 최소 3개 이상 포함해야 한다.
- 자격증은 반드시 실제로 존재하는 자격증만 포함해야 한다.
- 한국 대학생 또는 취준생이 6개월~1년 안에 준비할 수 있는 난이도의 자격증만 추천하라.
- 너무 고급 난이도의 자격증(CISSP, AWS Professional, Azure Expert 등)은 절대 포함하지 않는다.
- 온라인 강의 플랫폼(Coursera, Udemy 등)의 수료증은 자격증으로 간주하지 않는다.
- 허구 자격증(예: “Node.js 자격증”, “React 인증”)은 절대 생성하지 않는다.

---

#  출력해야 할 JSON 구조 (그대로 출력)
{{
  "refinedJob": "string",
  "certifications": ["string", ...],
  "techStack": ["string", ...],
  "roadmap": ["string", ...],
  "nodes": [
    {{"id": "n1", "title": "string", "reason": "string"}},
    {{"id": "n2", "title": "string", "reason": "string"}},
    {{"id": "n3", "title": "string", "reason": "string"}}
  ],
  "tracks": [
    {{
      "id": "track1",
      "title": "string",
      "tasks": [
        {{"id": 1, "label": "string"}},
        {{"id": 2, "label": "string"}},
        {{"id": 3, "label": "string"}}
      ]
    }},
    {{
      "id": "track2",
      "title": "string",
      "tasks": [
        {{"id": 1, "label": "string"}},
        {{"id": 2, "label": "string"}},
        {{"id": 3, "label": "string"}}
      ]
    }}
  ]
}}

---

# 절대 어기면 안 되는 제약
- JSON 외 텍스트 출력 금지
- tracks ≥ 3
- tasks ≥ 3 each
- nodes ≥ 3
- 모든 문장은 자연스러운 한국어
"""



# 2) JSON 정리 — 코드블록 제거 + JSON 추출 + Repair
def _strip_code_fence(text: str) -> str:
    text = text.replace("```json", "")
    text = text.replace("```", "")
    return text.strip()


def _extract_json(text: str) -> str:
    """
    GPT가 JSON 앞뒤에 이상한 문자열을 붙였을 때
    '{ ... }' 부분만 정규식으로 추출.
    """

    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0)

    return "{}"   # JSON을 못 찾으면 빈 JSON 반환


def _parse_json_or_fallback(text: str) -> RecommendResponse:
    cleaned = _strip_code_fence(text)
    extracted = _extract_json(cleaned)

    try:
        data = json.loads(extracted)

    except Exception as e:
        print("❌ JSON PARSE ERROR:", e)
        print("RAW AI OUTPUT >>>", text)
        return RecommendResponse()

    return RecommendResponse(
        refinedJob=data.get("refinedJob", ""),
        certifications=data.get("certifications", []),
        techStack=data.get("techStack", []),
        roadmap=data.get("roadmap", []),
        nodes=data.get("nodes", []),
        tracks=data.get("tracks", [])
    )



# 3) OpenAI 요청 — 신뢰성 99% JSON 생성
def get_detailed_recommendation(body: RecommendRequest) -> RecommendResponse:
    prompt = _build_prompt(body)

    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "너는 JSON 생성 전문가다. "
                    "출력은 무조건 JSON 한 개만 가능하다. "
                    "JSON 바깥의 텍스트는 절대 포함하지 마라."
                )
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        max_tokens=800,
    )

    raw = (resp.choices[0].message.content or "").strip()
    print("\n===== RAW AI OUTPUT =====\n", raw, "\n==========================\n")

    return _parse_json_or_fallback(raw)
