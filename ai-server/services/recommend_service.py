import json
import re
from fastapi import HTTPException
from .openai_client import client, OPENAI_MODEL
from schemas.recommend import RecommendRequest, RecommendResponse


# 1) 프롬프트 생성 — JSON Schema 강제 + 출력 제한
def _build_prompt(body: RecommendRequest) -> str:
    interests = ", ".join(body.interests or [])
    skills = ", ".join(body.skills or [])

    return f"""
당신은 '한국 대학생/취준생 맞춤 진로 추천 AI'입니다. 
사용자의 전공과 희망 직무, 관심사를 고려해서 **현실적이고 단계적인 직무 로드맵 JSON**을 생성해야 합니다.

---

## 1. 사용자 정보

- 전공: {body.major}
- 희망 직무: {body.desiredJob}
- 관심사: {interests if interests else "없음"}
- 보유 스킬: {skills if skills else "없음"}

위 정보를 종합해서, 사용자가 3~6개월 동안 따라갈 수 있는 "학습 + 실습" 계획을 만들고,
그에 맞는 자격증, 기술 스택, 체크리스트를 JSON으로 반환하세요.

---

## 2. 출력 형식 (반드시 JSON만 출력, 다른 텍스트 금지)

- 출력은 **JSON 객체 1개만** 허용
- 코드블록( ``` ), 주석, 설명 문장, 자연어는 절대 출력 금지
- 필드는 모두 포함해야 하며, 값이 부족하면 최소한이라도 채워 넣기
- 문자열은 모두 자연스러운 한국어로 작성

반드시 아래 구조를 그대로 따르세요:

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

## 3. 각 필드별 작성 규칙 (예시 수준으로 상세히)

### 3-1) refinedJob
- 사용자의 희망 직무를 한 단계 더 구체화한 직무 이름
- 예시:
  - "데이터 엔지니어(클라우드 기반 데이터 파이프라인 중심)"
  - "백엔드 개발자(Spring 기반 서버 개발)"
  - "AI 엔지니어(딥러닝 모델 구현 및 튜닝)"

### 3-2) certifications (대학생/취준생 기준 자격증)
- 최소 2~4개
- **실제로 존재하는 자격증 이름만** 사용
- 한국 대학생/취준생이 6개월~1년 안에 준비 가능해야 함
- "머신러닝 전문가", "딥러닝 엔지니어", "Python 프로그래밍"처럼
  단순 역할/기술명은 절대 자격증으로 넣지 말 것
- 프로급/고급 자격증(Professional, Expert, Specialty, Engineer Associate 등)은 피하고,
  다음과 같은 난이도/형태를 참고할 것 (예시일 뿐, 그대로 복붙 금지):
  - "정보처리기사"
  - "빅데이터 분석기사"
  - "SQLD"
  - "ADsP"
  - "리눅스 마스터 2급"
  - "TensorFlow Developer Certificate"

### 3-3) techStack
- 해당 직무를 준비하는 데 필요한 핵심 기술 4~8개
- 예시:
  - 데이터/AI: ["Python", "Pandas", "NumPy", "TensorFlow", "Jupyter Notebook"]
  - 백엔드: ["Java", "Spring Boot", "JPA", "MySQL", "Linux 기초"]
- 단순 나열이 아니라, "실제로 공부해야 할 것" 위주로 선정

### 3-4) roadmap (3개월 이상, "N개월차:" 형식 필수)
- 최소 3단계 이상
- 각 원소는 **"N개월차: ~"** 형식으로 작성
- 각 단계마다 구체적인 학습/실습 내용을 한 문장 이상으로 작성
- 예시:
  - "1개월차: 파이썬 문법 복습 및 자료형·함수·모듈 기초 다지기"
  - "2개월차: Pandas와 NumPy로 데이터 전처리 및 EDA 실습 진행"
  - "3개월차: 공공데이터를 활용해 간단한 데이터 파이프라인 미니 프로젝트 수행"

### 3-5) nodes (로드맵의 핵심 단계 요약)
- 최소 3개
- 로드맵 전체에서 **특히 중요한 전환점/핵심 단계**만 요약
- title은 한 줄 제목, reason은 간단한 이유
- 예시:
  - "Python & 데이터 분석 기초" / "후속 학습의 기반이 되는 단계"
  - "SQL & 데이터베이스 기초" / "데이터를 다루는 실무의 필수 역량"
  - "클라우드 데이터 파이프라인" / "실무에 바로 연결되는 핵심 경험"

### 3-6) tracks + tasks (체크리스트용 학습 트랙)
- tracks는 **최소 3개 이상**
- 각 track에는 3~5개의 tasks 포함
- 각 task.label은 **바로 실천 가능한 행동**으로 작성
- 예시 스타일:

예시)
Python · 데이터 엔지니어 트랙이라면:

- track 1: "Python 기본 학습"
  - "파이썬 문법 기초 익히기 (자료형, 조건문, 반복문)"
  - "함수·모듈·패키지 사용해 보기"
  - "간단한 데이터 분석 스크립트 작성"

- track 2: "SQL · DB 기초"
  - "기본 SELECT / WHERE / ORDER BY 연습"
  - "JOIN · GROUP BY · HAVING 문제 풀어 보기"
  - "간단한 프로젝트용 DB 스키마 설계해 보기"

---

## 4. 예시 출력 스타일 (참고용, 그대로 복붙 금지)

아래는 **출력 형식과 상세 수준의 예시**입니다.  
이 예시의 스타일과 디테일 수준을 유지하되,  
사용자의 전공/희망 직무에 맞게 내용을 바꿔서 작성하세요:

{{
  "refinedJob": "데이터 엔지니어(클라우드 기반 데이터 파이프라인 중심)",
  "certifications": ["SQLD", "ADsP", "정보처리기사"],
  "techStack": ["Python", "Pandas", "MySQL", "Linux 기초"],
  "roadmap": [
    "1개월차: 파이썬 문법과 기본 문법 복습",
    "2개월차: SQL 기본 문법과 JOIN, GROUP BY 연습",
    "3개월차: 작은 데이터 파이프라인 프로젝트 진행"
  ],
  "nodes": [
    {{ "id": "n1", "title": "Python & 데이터 분석 기초", "reason": "후속 학습의 기반" }},
    {{ "id": "n2", "title": "SQL & 데이터베이스 기초", "reason": "데이터 다루기의 핵심" }},
    {{ "id": "n3", "title": "클라우드 데이터 파이프라인", "reason": "실무 연계 단계" }}
  ],
  "tracks": [
    {{
      "id": "python",
      "title": "Python 기본 학습",
      "tasks": [
        {{ "id": 1, "label": "파이썬 문법 기초 익히기 (자료형, 조건문, 반복문)" }},
        {{ "id": 2, "label": "함수·모듈·패키지 사용해 보기" }}
      ]
    }},
    {{
      "id": "sql",
      "title": "SQL · DB 기초",
      "tasks": [
        {{ "id": 1, "label": "기본 SELECT / WHERE / ORDER BY 연습" }},
        {{ "id": 2, "label": "JOIN · GROUP BY · HAVING 문제 풀어 보기" }}
      ]
    }}
  ]
}}

---

## 5. 절대 어기면 안 되는 제약 정리

- JSON 외 텍스트 출력 금지
- tracks 개수는 3개 이상
- 각 tracks[*].tasks는 3개 이상
- nodes는 3개 이상
- roadmap은 최소 3개월 이상의 단계를 포함하고, 각 원소는 "N개월차: ..." 형식을 따른다.
- 모든 문장은 자연스러운 한국어로 작성한다.
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
        max_tokens=1400,
        #response_format={"type":"json_object"},
    )

    raw = (resp.choices[0].message.content or "").strip()
    print("\n===== RAW AI OUTPUT =====\n", raw, "\n==========================\n")

    return _parse_json_or_fallback(raw)
