import { naverNewsResponseSchema, type NaverNewsResponse } from "./types";

/**
 * AIDEV-NOTE: 네이버 뉴스 검색 API 클라이언트
 * - ARCHITECTURE.md 7.2: lib/는 순수 로직만 보관
 * - 실제 네트워크 호출은 API Route에서 수행
 */

const NAVER_SEARCH_API_URL = "https://openapi.naver.com/v1/search/news.json";

interface SearchNewsParams {
  query: string; // 검색어 (필수)
  display?: number; // 검색 결과 출력 건수 (기본값: 10, 최대: 100)
  start?: number; // 검색 시작 위치 (기본값: 1, 최대: 1000)
  sort?: "sim" | "date"; // 정렬 옵션 (sim: 정확도순, date: 날짜순, 기본값: sim)
}

/**
 * 네이버 뉴스 검색 API 호출
 * AIDEV-NOTE: 이 함수는 서버 환경(API Route)에서만 호출되어야 함
 */
export async function searchNaverNews(
  params: SearchNewsParams
): Promise<NaverNewsResponse> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "네이버 API 키가 설정되지 않았습니다. NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 .env.local에 추가하세요."
    );
  }

  const searchParams = new URLSearchParams({
    query: params.query,
    display: String(params.display ?? 10),
    start: String(params.start ?? 1),
    sort: params.sort ?? "sim",
  });

  const url = `${NAVER_SEARCH_API_URL}?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  });

  if (!response.ok) {
    throw new Error(`네이버 API 호출 실패: ${response.status}`);
  }

  const data = await response.json();

  // AIDEV-NOTE: Zod로 응답 데이터 검증
  return naverNewsResponseSchema.parse(data);
}

/**
 * HTML 태그 제거 헬퍼 함수
 * AIDEV-NOTE: 네이버 API는 제목/설명에 HTML 태그(<b>, </b> 등)를 포함하므로 제거 필요
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}
