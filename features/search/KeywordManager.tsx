"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Keyword } from "@/lib/schemas/keyword.schema";
import { addKeywordAction, deleteKeywordAction } from "@/app/actions/keywords";

interface KeywordManagerProps {
  keywords: Keyword[];
}

/**
 * AIDEV-NOTE: 키워드 관리 컴포넌트
 * - PROJECT.md 2번: 키워드 입력 UI 제공
 * - PROJECT.md 2번: 키워드 CRUD 가능
 * - Client Component (features/ 폴더 내 배치)
 * - CLAUDE.md: Client Component에서 fetch 금지 → Server Actions 사용
 * - ARCHITECTURE.md: Client Component는 props로만 데이터 수신
 */
export function KeywordManager({ keywords }: KeywordManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newKeyword, setNewKeyword] = useState("");
  const [error, setError] = useState("");

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) {
      setError("키워드를 입력해주세요.");
      return;
    }

    setError("");

    // AIDEV-NOTE: Server Action 호출 (fetch 대신)
    startTransition(async () => {
      const result = await addKeywordAction(newKeyword.trim());

      if (!result.success) {
        setError(result.error || "키워드 추가에 실패했습니다.");
        return;
      }

      setNewKeyword("");
      // AIDEV-NOTE: Server Component 데이터 새로고침
      router.refresh();
    });
  };

  const handleDeleteKeyword = async (id: string) => {
    // AIDEV-NOTE: Server Action 호출 (fetch 대신)
    startTransition(async () => {
      const result = await deleteKeywordAction(id);

      if (!result.success) {
        alert(result.error || "키워드 삭제에 실패했습니다.");
        return;
      }

      // AIDEV-NOTE: Server Component 데이터 새로고침
      router.refresh();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-editorial-divider bg-white p-6"
    >
      <h2 className="mb-6 text-[18px] font-semibold text-editorial-black">
        Manage Keywords
      </h2>

      {/* 키워드 추가 입력 */}
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

      {/* 키워드 목록 */}
      <div className="space-y-2">
        {keywords.length === 0 ? (
          <p className="py-4 text-center font-mono text-[13px] text-editorial-gray">
            No keywords saved yet
          </p>
        ) : (
          <AnimatePresence>
            {keywords.map((keyword, index) => (
              <motion.div
                key={keyword.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 2 }}
                className="flex items-center justify-between rounded-lg border border-editorial-divider bg-editorial-hover px-4 py-3 transition-colors hover:border-editorial-gray"
              >
                <span className="text-[15px] font-medium text-editorial-black">
                  {keyword.name}
                </span>
                <motion.button
                  onClick={() => handleDeleteKeyword(keyword.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[13px] text-editorial-gray transition-colors hover:text-red-500"
                >
                  Delete
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
