# Pulse News — Architecture Guide

이 문서는 프로젝트의 기술적 구조와 컴포넌트 분리 전략을 정의한다.  
모든 개발 작업에서 이 문서의 원칙을 우선적으로 따른다.

---

## 1. Rendering Model (RSC 우선)

- **모든 데이터 fetch는 Server Component에서 수행한다.**
- page.tsx는 "데이터 오케스트레이션(병렬 fetch)"만 담당한다.
- Client Component에는 fetch 로직을 절대 두지 않는다.
- Client Component는 **features/** 폴더 내부에서만 정의한다.
- Client Component는 항상 **props로 데이터만 받는다.**

---

## 2. Feature-Sliced Design (FSD)

폴더 구조는 기능 중심으로 분리하여 확장성을 확보한다.

### features/

- 도메인 단위로 UI + 클라이언트 로직을 수직적으로 배치한다.
- 예: features/news, features/search, features/summarize
- 모든 **Client Component**는 반드시 여기 위치한다.
- 도메인 외부와의 의존성을 최소화한다.

### components/

- 버튼, 카드, UI 공통 요소 등 **도메인 독립적인 컴포넌트** 보관.
- 어떤 features에도 의존하지 않는다.

### lib/

- 외부 API, RSS parser, 네이버 검색 API, OpenAI 요약, Supabase client 등
- “비즈니스 도메인과 무관한 로직”을 모아둔다.

### app/

- Route + Layout + Server Component 페이지 구성.
- page.tsx는 fetch → features로 데이터 전달 역할만 수행.

---

## 3. API Responsibility

Next.js Route Handler로 외부 API 호출 책임을 분리한다.

### `/api/top`

- RSS 호출 → rss-parser로 JS 객체 변환
- 1시간 이내 기사 필터링
- 상위 10개 반환

### `/api/search`

- 네이버 뉴스 검색 API 호출
- 응답을 Zod로 검증 후 변환하여 반환

### `/api/summarize`

- Supabase summaries 테이블에서 기존 요약 조회
- 없으면 OpenAI로 3줄 요약 생성 후 Supabase에 저장
- 저장된 요약 반환

각 API는 단일 책임만 가진다.

---

## 4. 데이터 원칙

- RSS 및 검색 결과는 **저장하지 않는다.**
- 요약 결과만 Supabase에 저장한다.
- summaries 테이블 구조:
  - id, article_url (unique), title, summary_3lines, created_at

---

## 5. UI 원칙

- Tailwind 기반 스타일만 사용 (CSS 금지)
- SEO 및 초기 성능을 위해 Server Component 우선 구조 유지
- 상호작용(UI 이벤트)은 Client Component에만 존재

---

## 6. 확장 가능성

- features/ 하위 도메인을 추가하여 기능 확장 가능
- API는 도메인 단위로 분리하여 스케일링하기 용이
- Client Component는 Server Component에 영향을 주지 않음

## 7. API Route 사용 원칙

### 7.1 외부 API는 반드시 app/api/ 경유

RSS, 네이버 뉴스 검색 API, OpenAI 요약 등 외부 API는  
Client Component 또는 page.tsx에서 직접 호출하지 않는다.

다음과 같은 이유로 반드시 API Route를 경유한다:

- 서버 캐싱(Cache-Control, ISR)을 적용할 수 있음
- CORS 및 보안 문제 방지
- 응답 포맷이 변경되어도 클라이언트 영향 최소화
- SSR 성능 최적화 (빠른 TTFB)

### 7.2 lib/는 순수 로직만 보관

RSS 파싱, 데이터 변환 등 재사용 가능한 순수 로직은 lib/에 두고  
외부 네트워크 호출은 api route에서만 수행한다.

### 7.3 page.tsx는 API Route만 fetch한다

page.tsx는 다음 역할만 가진다:

- API Route fetch (server-side)
- 가공된 데이터를 features/ 클라이언트 컴포넌트로 전달

직접 RSS를 parseURL로 호출하지 않는다.
