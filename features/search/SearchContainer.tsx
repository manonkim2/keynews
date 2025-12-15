"use client";

import type { Keyword } from "@/lib/schemas/keyword.schema";
import { KeywordManager } from "./KeywordManager";
import { KeywordSearch } from "./KeywordSearch";

interface SearchContainerProps {
  keywords: Keyword[];
}

/**
 * AIDEV-NOTE: 키워드 검색 전체 컨테이너
 * - Client Component (features/ 폴더 내 배치)
 * - 키워드 관리와 검색을 하나의 화면에서 처리
 * - CLAUDE.md: Client Component에서 fetch 금지
 * - ARCHITECTURE.md: Client Component는 props로만 데이터 수신
 * - 초기 키워드 데이터는 Server Component에서 fetch하여 props로 전달
 */
export function SearchContainer({ keywords }: SearchContainerProps) {
  return (
    <div className="space-y-6">
      {/* 키워드 관리 */}
      <KeywordManager keywords={keywords} />

      {/* 키워드 검색 */}
      <KeywordSearch keywords={keywords} />
    </div>
  );
}
