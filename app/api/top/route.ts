import { NextResponse } from "next/server";
import Parser from "rss-parser";
import type { NewsItem } from "@/types/news";

// AIDEV-NOTE: RSS 파서 커스텀 필드 타입 정의
interface RSSMediaContent {
  $: {
    url: string;
    medium?: string;
  };
}

interface CustomFeedItem {
  "media:content"?: RSSMediaContent;
  "media:thumbnail"?: RSSMediaContent;
}

const parser = new Parser<Record<string, never>, CustomFeedItem>({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

/**
 * AIDEV-NOTE: /api/top - 매일경제 RSS 피드에서 메인 TOP 10 기사 조회
 * - ARCHITECTURE.md 7.1: 외부 API는 반드시 app/api/ 경유
 * - RSS 파싱은 서버에서만 수행
 * - 캐싱 및 보안을 위해 API Route 사용
 */
export async function GET() {
  const RSS_URL = "https://www.mk.co.kr/rss/30000001/";

  try {
    const feed = await parser.parseURL(RSS_URL);

    // AIDEV-NOTE: 시간 필터링 없이 RSS 피드 순서대로 상위 10개만 반환
    const topNews: NewsItem[] = feed.items
      .map((item) => {
        // AIDEV-NOTE: 이미지 URL 추출 (enclosure, media:content 등)
        let imageUrl: string | undefined;
        if (item.enclosure?.url) {
          imageUrl = item.enclosure.url;
        } else if (item["media:content"]?.$?.url) {
          imageUrl = item["media:content"].$.url;
        } else if (item["media:thumbnail"]?.$?.url) {
          imageUrl = item["media:thumbnail"].$.url;
        }

        return {
          title: item.title || "",
          link: item.link || "",
          pubDate: item.pubDate || "",
          description: item.contentSnippet || "",
          content: item.content || "",
          imageUrl,
        };
      })
      .slice(0, 10); // 상위 10개만 반환

    return NextResponse.json(topNews);
  } catch (error) {
    console.error("RSS fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSS feed" },
      { status: 500 }
    );
  }
}
