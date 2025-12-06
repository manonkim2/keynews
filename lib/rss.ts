import Parser from "rss-parser";

// AIDEV-NOTE: RSS 피드에서 받아오는 아이템의 타입 정의
export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  content?: string;
  imageUrl?: string;
}

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
 * 매일경제 RSS 피드에서 메인 TOP 10 기사를 가져온다
 * AIDEV-NOTE: DB 저장 없이 즉시 반환, Server Component에서만 호출
 */
export async function getTop10News(): Promise<NewsItem[]> {
  const RSS_URL = "https://www.mk.co.kr/rss/30000001/";

  try {
    const feed = await parser.parseURL(RSS_URL);

    // AIDEV-NOTE: 시간 필터링 없이 RSS 피드 순서대로 상위 10개만 반환
    const topNews = feed.items
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

    return topNews;
  } catch (error) {
    console.error("RSS fetch error:", error);
    return [];
  }
}
