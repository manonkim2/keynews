"use client";

import { useState, useTransition } from "react";
import type { Keyword } from "@/lib/schemas/keyword.schema";
import type { NewsItem } from "@/types/news";
import { NewsCard } from "@/features/news/NewsCard";
import { searchNewsAction } from "@/app/actions/search";

interface KeywordSearchProps {
  keywords: Keyword[];
}

/**
 * AIDEV-NOTE: 키워드 검색 컴포넌트
 * - PROJECT.md 2번: 네이버 뉴스 검색 API 호출
 * - PROJECT.md 2번: 결과는 저장하지 않고 즉시 렌더링
 * - Client Component (features/ 폴더 내 배치)
 * - CLAUDE.md: Client Component에서 fetch 금지 → Server Actions 사용
 * - ARCHITECTURE.md: Client Component는 props로만 데이터 수신
 */
export function KeywordSearch({ keywords }: KeywordSearchProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (keywordName: string) => {
    setSelectedKeyword(keywordName);
    setError("");
    setSearchResults([]);

    // AIDEV-NOTE: Server Action 호출 (fetch 대신)
    startTransition(async () => {
      const result = await searchNewsAction({
        query: keywordName,
        display: 10,
        sort: "date",
      });

      if (!result.success) {
        setError(result.error || "검색에 실패했습니다.");
        return;
      }

      setSearchResults(result.data || []);
    });
  };

  return (
    <div className="space-y-6">
      {/* 키워드 선택 버튼 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          키워드 선택
        </h2>
        {keywords.length === 0 ? (
          <p className="text-sm text-gray-500">
            저장된 키워드가 없습니다. 먼저 키워드를 추가해주세요.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <button
                key={keyword.id}
                onClick={() => handleSearch(keyword.name)}
                disabled={isPending}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedKeyword === keyword.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } disabled:opacity-50`}
              >
                {keyword.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 검색 결과 */}
      {isPending && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">검색 중...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!isPending && !error && searchResults.length === 0 && selectedKeyword && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            &quot;{selectedKeyword}&quot;에 대한 검색 결과가 없습니다.
          </p>
        </div>
      )}

      {!isPending && searchResults.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            &quot;{selectedKeyword}&quot; 검색 결과 ({searchResults.length}개)
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {searchResults.map((news, index) => (
              <NewsCard key={news.link} news={news} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
