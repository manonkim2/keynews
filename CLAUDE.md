# CLAUDE Development Rules

이 문서는 Claude가 이 코드베이스에서 작업할 때 반드시 따라야 할 규칙이다.  
PROJECT.md 및 ARCHITECTURE.md와 함께 개발 행동의 기준이 된다.

---

## 1. 문서 우선순위

모든 작업은 다음 문서를 기준으로 판단한다:

1. CLAUDE.md (이 문서)
2. /docs/PROJECT.md (기능 요구사항)
3. /docs/ARCHITECTURE.md (아키텍처 구조)

작업 전 문서를 먼저 스캔하고, 문서 내용과 충돌하는 코드를 생성하면 안 된다.

---

## 2. 금지 규칙

- Client Component에서 fetch 수행 금지
- TypeScript any 사용 금지
- 승인 없이 글로벌 상태(store) 생성 금지
- 임의의 API 또는 존재하지 않는 코드 생성 금지
- RSC 구조를 깨는 fetch 패턴 금지

---

## 3. AIDEV-\* 주석 규칙

코드 내에서 AI 협업을 명확히 하기 위해 다음을 사용한다:

- `AIDEV-NOTE:` 중요 제약 또는 설계 설명
- `AIDEV-TODO:` 후속 작업
- `AIDEV-QUESTION:` 사람에게 확인 필요

규칙:

- 기존 AIDEV-\* 주석이 있으면 수정 시 반드시 업데이트해야 한다.
- 사람이 삭제 요청하지 않으면 AIDEV-NOTE 삭제 금지.

---

## 4. 코드 생성 원칙

- 가능하면 실행 가능한 코드 생성 우선
- 파일 경로를 명확히 표기
- Server Component / Client Component 구분을 항상 중요하게 다룸
- 폴더 구조(FSD)를 준수해야 함:
  - Client Component → features/
  - Server fetch → page.tsx or route handlers

---

## 5. 기능 체크 (PROJECT.md 기반)

코드를 생성하기 전에:

- 해당 작업이 PROJECT.md의 어떤 기능 체크박스를 충족하는지 분석해야 한다.

코드 생성 후:

- 체크박스 기준으로 모든 항목을 다시 검증하고 충족 여부를 보고해야 한다.
- 누락된 경우 수정안 또는 패치 코드를 제안해야 한다.
