"use client";

import Image from "next/image";
import type { NewsItem } from "@/lib/rss";

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

/**
 * AIDEV-NOTE: 뉴스 카드 UI 컴포넌트
 * - Client Component (features/ 폴더 내 배치)
 * - props로만 데이터 수신 (ARCHITECTURE.md 규칙)
 */
export function NewsCard({ news, index }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg">
      {/* Thumbnail Image */}
      {news.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={news.imageUrl}
            alt={news.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            fill
          />
          {/* Ranking Badge on Image */}
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg">
            {index + 1}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Ranking Badge (텍스트 전용 카드용) */}
        {!news.imageUrl && (
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            {index + 1}
          </div>
        )}

        {/* Title */}
        <h3 className="mb-3 pr-14 text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600">
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {news.title}
          </a>
        </h3>

        {/* Description */}
        {news.description && (
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {news.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <time dateTime={news.pubDate}>{formatDate(news.pubDate)}</time>
          <span className="text-blue-600">매일경제</span>
        </div>
      </div>
    </article>
  );
}
