"use client";

import { useState } from "react";
import type { NewsItem } from "@/types/news";
import type { Keyword } from "@/lib/schemas/keyword.schema";
import { NewsList } from "./NewsList";
import { SearchContainer } from "../search/SearchContainer";

interface TabNavigationProps {
  topNewsList: NewsItem[];
  keywords: Keyword[];
}

/**
 * AIDEV-NOTE: 탭 네비게이션 컴포넌트
 * - TOP10 뉴스와 키워드 검색을 탭으로 전환
 * - Client Component (features/ 폴더 내 배치)
 * - props로 Server Component에서 fetch한 데이터 수신
 * - CLAUDE.md: Client Component에서 fetch 금지
 * - ARCHITECTURE.md: Client Component는 props로만 데이터 수신
 */
export function TabNavigation({ topNewsList, keywords }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState<"top10" | "search">("top10");

  return (
    <div>
      {/* 탭 버튼 */}
      <div className="mb-8 flex justify-center gap-4">
        <button
          onClick={() => setActiveTab("top10")}
          className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
            activeTab === "top10"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          TOP 10 뉴스
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
            activeTab === "search"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          키워드 검색
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === "top10" && <NewsList newsList={topNewsList} />}
        {activeTab === "search" && <SearchContainer keywords={keywords} />}
      </div>
    </div>
  );
}
