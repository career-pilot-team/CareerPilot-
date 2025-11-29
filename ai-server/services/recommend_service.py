
from .openai_client import client, OPENAI_MODEL
from schemas.recommend import RecommendRequest, RecommendResponse
import json

# 프롬프트 구성 → OpenAI 호출 → JSON 파싱 ㅡㅡㅡㅡㅡ 정명형 버전
# 사용자 입력을 바탕으로 모델에 보낼 프롬프트를 생성
# def _build_prompt(body: RecommendRequest) -> str:
#     interests = ", ".join(body.interests or [])
#     skills = ", ".join(body.skills or [])
#     return f"""
# You are an expert career counselor.
# Major: {body.major}
# Desired job: {body.desiredJob}
# Interests: {interests}
# Current skills: {skills}

# Provide:
# 1) refined job role (sub-role),
# 2) recommended certifications,
# 3) recommended technology stack,
# 4) a step-by-step learning roadmap.

# Return a SINGLE JSON with keys:
# "refinedJob", "certifications", "techStack", "roadmap".
# If unknown, use empty string or empty arrays.
# """

# 모델이 ```json ... ```로 감싼 출력을 정리
# def _strip_code_fence(text: str) -> str:
#     return text.replace("```json", "").replace("```", "").strip()

# 모델 출력이 JSON이면 파싱, 아니면 안전한 기본값으로 폴백
# def _parse_json_or_fallback(text: str) -> RecommendResponse:
#     cleaned = _strip_code_fence(text)
#     try:
#         data = json.loads(cleaned)
#         return RecommendResponse(
#             refinedJob=data.get("refinedJob", ""),
#             certifications=data.get("certifications", []) or [],
#             techStack=data.get("techStack", []) or [],
#             roadmap=data.get("roadmap", []) or [],
#         )
#     except Exception:
#         return RecommendResponse()

# 메인 서비스 함수: 프롬프트 생성 → OpenAI 호출 → 파싱 결과 반환 (염정명형 ver)
# def get_detailed_recommendation(body: RecommendRequest) -> RecommendResponse:
#     prompt = _build_prompt(body)

#     resp = client.chat.completions.create(
#         model=OPENAI_MODEL,
#         messages=[
#             {"role": "system", "content": "You are a helpful career recommendation assistant."},
#             {"role": "user", "content": prompt},
#         ],
#         temperature=0.7,
#         max_tokens=500,
#     )

#     text = (resp.choices[0].message.content or "").strip()
#     return _parse_json_or_fallback(text) ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 정명형 버전

#ㅡㅡㅡㅡㅡㅡㅡㅡㅡ ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ정헌용 버전

# 프롬프트 구성 → OpenAI 호출 → JSON 파싱
# 사용자 입력을 바탕으로 모델에 보낼 프롬프트를 생성
def _build_prompt(body: RecommendRequest) -> str:
    interests = ", ".join(body.interests or [])
    skills = ", ".join(body.skills or [])
    return f"""
너는 한국인 대학생/취준생을 위한 커리어 코치야.

[사용자 정보]
- 전공: {body.major}
- 희망 직무: {body.desiredJob}
- 관심사: {interests if interests else "없음"}
- 현재 보유 스킬: {skills if skills else "없음"}

[요구사항]
아래 다섯 가지 정보를 모두 **자연스러운 한국어**로 작성해.
응답은 반드시 하나의 JSON 객체 한 개만 포함해야 하고,
JSON 바깥에는 다른 텍스트를 절대로 쓰지 마.

[중요]
- 반드시 "nodes" 필드를 포함해야 한다.
- nodes에는 최소 3개 이상의 노드를 넣어야 한다.
- nodes가 비어 있거나 생략되면 그 응답은 잘못된 응답이다.

1) refinedJob:
   - 사용자의 희망 직무를 조금 더 구체화한 직무 이름 또는 한 줄 설명
   - 예시: "데이터 엔지니어(ETL 파이프라인 중심)"

2) certifications:
   - 이 직무에 도움이 되는 자격증 이름 리스트
   - 예시: ["SQLD", "ADsP", "정보처리기사"]
   - 요소들은 전부 한국어로 작성해.

3) techStack:
   - 준비에 필요한 기술 스택 리스트
   - 예시: ["Python", "Pandas", "MySQL", "Linux 기초"]
   - 기술 이름 자체는 영어여도 되지만, 필요하면 한국어 설명을 섞어도 좋다.

4) roadmap:
   - 단계별 학습 로드맵을 한 단계당 한 문장 또는 짧은 문단으로 작성
   - 예시: ["1개월차: 파이썬 문법과 기본 문법 복습",
           "2개월차: SQL 기본 문법과 JOIN, GROUP BY 연습",
           "3개월차: 작은 데이터 파이프라인 프로젝트 진행"]

5) nodes:
   - 위 로드맵 전체에서 특히 중요한 핵심 단계(n) 3~5개만 골라서 정리
   - 각 노드는 아래 형식을 따름:
     - id: "n1", "n2"처럼 순서대로
     - title: 핵심 단계의 제목 (예: "SQL & 데이터베이스 기초")
     - reason: 왜 중요한지 한 줄 설명

[반드시 지켜야 할 JSON 형식]

{{
  "refinedJob": "문자열 (한국어 한 줄 설명)",
  "certifications": ["자격증1", "자격증2", "..."],
  "techStack": ["기술1", "기술2", "..."],
  "roadmap": ["단계 설명1", "단계 설명2", "..."],
  "nodes": [
    {{
      "id": "n1",
      "title": "문자열 - 핵심 단계 제목",
      "reason": "문자열 - 이 단계가 중요한 이유"
    }},
    {{
      "id": "n2",
      "title": "문자열 - 핵심 단계 제목",
      "reason": "문자열 - 이 단계가 중요한 이유"
    }},
    {{
      "id": "n3",
      "title": "문자열 - 핵심 단계 제목",
      "reason": "문자열 - 이 단계가 중요한 이유"
    }}
  ]
}}

각 value는 전부 한국어 문장 또는 한국어가 포함된 문자열이어야 한다.
정보가 없다면 "refinedJob"에는 빈 문자열 "",
"certifications"와 "techStack", "roadmap", "nodes"에는 빈 배열 []을 사용해라.
"""


def _strip_code_fence(text: str) -> str:
    return text.replace("```json", "").replace("```", "").strip()


def _parse_json_or_fallback(text: str) -> RecommendResponse:
    cleaned = _strip_code_fence(text)
    try:
        data = json.loads(cleaned)
        return RecommendResponse(
            refinedJob=data.get("refinedJob", "") or "",
            certifications=data.get("certifications", []) or [],
            techStack=data.get("techStack", []) or [],
            roadmap=data.get("roadmap", []) or [],
            # 🔹 새로 추가: nodes도 같이 파싱
            nodes=data.get("nodes", []) or [],
        )
    except Exception:
        # 🔹 실패했을 때도 nodes는 기본값으로
        return RecommendResponse()


def get_detailed_recommendation(body: RecommendRequest) -> RecommendResponse:
    prompt = _build_prompt(body)

    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "너는 커리어 로드맵을 설계하는 한국어 커리어 코치야. "
                    "반드시 자연스러운 한국어만 사용해. 영어 문장은 절대 쓰지 마. "
                    "응답은 항상 사용자 프롬프트에서 요구한 JSON 형식만 출력하고, "
                    "반드시 'nodes' 필드를 포함해 최소 3개의 노드를 채워라. "
                    "JSON 바깥의 다른 텍스트는 절대 출력하지 마."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.3,   # ← 말 잘 듣게 조금 낮춤
        max_tokens=500,
    )

    text = (resp.choices[0].message.content or "").strip()
    return _parse_json_or_fallback(text)


#ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ정헌용 버전