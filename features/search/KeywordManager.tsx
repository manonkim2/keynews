"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        키워드 관리
      </h2>

      {/* 키워드 추가 입력 */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isPending) {
                handleAddKeyword();
              }
            }}
            placeholder="새 키워드 입력"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isPending}
          />
          <button
            onClick={handleAddKeyword}
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isPending ? "처리 중..." : "추가"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* 키워드 목록 */}
      <div className="space-y-2">
        {keywords.length === 0 ? (
          <p className="text-sm text-gray-500">
            저장된 키워드가 없습니다.
          </p>
        ) : (
          keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span className="text-sm text-gray-900">{keyword.name}</span>
              <button
                onClick={() => handleDeleteKeyword(keyword.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
