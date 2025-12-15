# Pulse News — 기능 체크리스트 (최신 업데이트)

## 1. 메인: TOP 10 뉴스

[x] 매일경제 RSS에서 최신 기사 가져오기
[x] rss-parser로 RSS 데이터를 JS 객체로 가공하기
[x] 정렬 후 상위 10개만 반환하기
[x] DB 사용 금지
[x] 해당 fetch는 Server Component에서만 수행

---

## 2. 키워드 기반 뉴스 검색 (네이버 뉴스 API)

[x] 키워드 입력 UI 제공
[x] 입력한 키워드 supabase DB에 업데이트
[x] 키워드 CRUD 가능
[x] /api/search 서버 라우트에서 키워드 관련된 네이버 뉴스 검색 API 호출
[x] 응답을 적절히 가공하여 클라이언트로 전달
[x] 결과는 저장하지 않고 즉시 렌더링

---

## 3. 3줄 요약 (OpenAI → Supabase 저장)

[ ] 기사 카드에 “요약하기” 버튼 제공  
[ ] /api/summarize 엔드포인트 생성  
[ ] 요약 요청 시 title, description/snippet, article_url을 전달  
[ ] 서버에서 Supabase summaries 테이블을 먼저 조회  
[ ] 기존 요약이 있으면 → 그대로 반환  
[ ] 기존 요약이 없으면 → OpenAI로 3줄 요약 생성  
[ ] 생성된 요약을 Supabase summaries 테이블에 저장  
[ ] FE에 저장된 요약 데이터를 반환  
[ ] API 키(OpenAI)는 반드시 서버에서만 사용
