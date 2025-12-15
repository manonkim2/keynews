"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-editorial-divider bg-white p-6"
      >
        <h2 className="mb-6 text-[18px] font-semibold text-editorial-black">
          Select Keyword
        </h2>
        {keywords.length === 0 ? (
          <p className="py-4 text-center font-mono text-[13px] text-editorial-gray">
            No keywords available. Add one above.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <motion.button
                key={keyword.id}
                onClick={() => handleSearch(keyword.name)}
                disabled={isPending}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-lg px-4 py-2 text-[14px] font-medium transition-all ${
                  selectedKeyword === keyword.name
                    ? "bg-editorial-blue text-white shadow-md"
                    : "bg-editorial-hover text-editorial-black hover:bg-editorial-divider"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {keyword.name}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* 검색 결과 */}
      <AnimatePresence mode="wait">
        {isPending && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-editorial-divider bg-editorial-hover p-12 text-center"
          >
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-editorial-divider border-t-editorial-blue"></div>
            <p className="mt-4 font-mono text-[13px] text-editorial-gray">
              Searching...
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-red-200 bg-red-50 p-6"
          >
            <p className="text-[14px] text-red-600">{error}</p>
          </motion.div>
        )}

        {!isPending && !error && searchResults.length === 0 && selectedKeyword && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-editorial-divider bg-editorial-hover p-12 text-center"
          >
            <p className="font-mono text-[13px] text-editorial-gray">
              No results found for &quot;{selectedKeyword}&quot;
            </p>
          </motion.div>
        )}

        {!isPending && searchResults.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-6 flex items-baseline gap-3">
              <h3 className="text-[20px] font-semibold text-editorial-black">
                &quot;{selectedKeyword}&quot;
              </h3>
              <span className="font-mono text-[13px] text-editorial-gray">
                {searchResults.length} results
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {searchResults.map((news, index) => (
                <NewsCard key={news.link} news={news} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
