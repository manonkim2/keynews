"use client";

import type { NewsItem } from "@/types/news";
import { NewsCard } from "./NewsCard";

interface NewsListProps {
  newsList: NewsItem[];
}

/**
 * AIDEV-NOTE: 뉴스 리스트 컨테이너 컴포넌트
 * - Client Component (features/ 폴더 내 배치)
 * - props로만 데이터 수신
 * - List-based 디자인 (editorial style, 카드 제거)
 */
export function NewsList({ newsList }: NewsListProps) {
  if (newsList.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-[13px] text-editorial-gray">
          No news available
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {newsList.map((news, index) => (
        <NewsCard key={news.link} news={news} index={index} />
      ))}
    </div>
  );
}
