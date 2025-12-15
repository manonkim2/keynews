"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Keyword } from "@/lib/schemas/keyword.schema";
import type { NewsItem } from "@/types/news";
import { NewsCard } from "@/features/news/NewsCard";
import {
  addKeywordAction,
  deleteKeywordAction,
} from "@/app/actions/keywords";
import { searchNewsAction } from "@/app/actions/search";

interface SearchContainerProps {
  keywords: Keyword[];
}

/**
 * AIDEV-NOTE: 키워드 검색 통합 컴포넌트
 * - KeywordManager와 KeywordSearch 통합
 * - 더 심플한 UI: 타이틀 제거, input 밑에 바로 키워드 표시
 * - 키워드 버튼에 X로 바로 삭제 가능
 */
export function SearchContainer({ keywords }: SearchContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newKeyword, setNewKeyword] = useState("");
  const [error, setError] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) {
      setError("Please enter a keyword");
      return;
    }

    setError("");

    startTransition(async () => {
      const result = await addKeywordAction(newKeyword.trim());

      if (!result.success) {
        setError(result.error || "Failed to add keyword");
        return;
      }

      setNewKeyword("");
      router.refresh();
    });
  };

  const handleDeleteKeyword = async (id: string) => {
    startTransition(async () => {
      const result = await deleteKeywordAction(id);

      if (!result.success) {
        alert(result.error || "Failed to delete keyword");
        return;
      }

      router.refresh();
    });
  };

  const handleSearch = async (keywordName: string) => {
    setSelectedKeyword(keywordName);
    setSearchError("");
    setSearchResults([]);
    setIsSearching(true);

    const result = await searchNewsAction({
      query: keywordName,
      display: 10,
      sort: "date",
    });

    setIsSearching(false);

    if (!result.success) {
      setSearchError(result.error || "Search failed");
      return;
    }

    setSearchResults(result.data || []);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Keyword Input & List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-editorial-divider bg-white p-6"
      >
        {/* Add Keyword Input */}
        <div className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isPending) {
                  handleAddKeyword();
                }
              }}
              placeholder="Add new keyword"
              className="flex-1 rounded-lg border border-editorial-divider bg-white px-4 py-2.5 text-[15px] text-editorial-black placeholder:text-editorial-light focus:border-editorial-blue focus:outline-none focus:ring-2 focus:ring-editorial-blue/20 disabled:bg-editorial-hover"
              disabled={isPending}
            />
            <motion.button
              onClick={handleAddKeyword}
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg bg-editorial-blue px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-indigo-600 disabled:bg-editorial-light disabled:cursor-not-allowed"
            >
              {isPending ? "Adding..." : "Add"}
            </motion.button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-[13px] text-red-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Keywords List */}
        {keywords.length === 0 ? (
          <p className="py-4 text-center font-mono text-[13px] text-editorial-gray">
            No keywords yet. Add one above.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <motion.button
                key={keyword.id}
                onClick={() => handleSearch(keyword.name)}
                disabled={isPending || isSearching}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative rounded-lg px-4 py-2 pr-8 text-[14px] font-medium transition-colors ${
                  selectedKeyword === keyword.name
                    ? "bg-editorial-blue text-white shadow-md"
                    : "bg-editorial-hover text-editorial-black hover:bg-editorial-divider"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {keyword.name}
                {/* X Delete Button */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteKeyword(keyword.id);
                  }}
                  className={`absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-[12px] transition-colors ${
                    selectedKeyword === keyword.name
                      ? "hover:bg-white/20 text-white/70 hover:text-white"
                      : "hover:bg-editorial-gray/10 text-editorial-gray hover:text-red-500"
                  }`}
                >
                  ×
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {isSearching && (
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

        {searchError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-red-200 bg-red-50 p-6"
          >
            <p className="text-[14px] text-red-600">{searchError}</p>
          </motion.div>
        )}

        {!isSearching &&
          !searchError &&
          searchResults.length === 0 &&
          selectedKeyword && (
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

        {!isSearching && searchResults.length > 0 && (
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
    </motion.div>
  );
}
