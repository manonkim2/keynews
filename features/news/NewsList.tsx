"use client";

import type { NewsItem } from "@/lib/rss";
import { NewsCard } from "./NewsCard";

interface NewsListProps {
  newsList: NewsItem[];
}

/**
 * AIDEV-NOTE: 뉴스 리스트 컨테이너 컴포넌트
 * - Client Component (features/ 폴더 내 배치)
 * - props로만 데이터 수신
 */
export function NewsList({ newsList }: NewsListProps) {
  if (newsList.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">뉴스를 불러올 수 없습니다.</p>
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
