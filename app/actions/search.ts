"use server";

import { searchNaverNews, stripHtmlTags } from "@/lib/naver/client";
import type { NewsItem } from "@/types/news";

/**
 * AIDEV-NOTE: 네이버 뉴스 검색 Server Action
 * - CLAUDE.md: Client Component에서 fetch 수행 금지
 * - ARCHITECTURE.md: 외부 API는 서버에서만 호출
 * - PROJECT.md 2번: 네이버 뉴스 검색 API 호출 및 가공
 */

interface SearchNewsActionParams {
  query: string;
  display?: number;
  sort?: "sim" | "date";
}

export async function searchNewsAction(
  params: SearchNewsActionParams
): Promise<{ success: boolean; data?: NewsItem[]; error?: string }> {
  try {
    if (!params.query || params.query.trim().length === 0) {
      return { success: false, error: "검색어는 필수입니다." };
    }

    // AIDEV-NOTE: lib/naver/client.ts의 searchNaverNews 직접 호출
    const naverResponse = await searchNaverNews({
      query: params.query.trim(),
      display: params.display ?? 10,
      sort: params.sort ?? "date",
    });

    // AIDEV-NOTE: 네이버 API 응답을 NewsItem 형식으로 변환
    const newsItems: NewsItem[] = naverResponse.items.map((item) => ({
      title: stripHtmlTags(item.title),
      link: item.originallink || item.link,
      pubDate: item.pubDate,
      description: stripHtmlTags(item.description),
    }));

    return { success: true, data: newsItems };
  } catch (error) {
    console.error("뉴스 검색 에러:", error);

    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "뉴스 검색에 실패했습니다." };
  }
}
