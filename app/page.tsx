import type { NewsItem } from "@/types/news";
import { NewsList } from "@/features/news/NewsList";

/**
 * AIDEV-NOTE: 메인 페이지 - Server Component
 * - ARCHITECTURE.md 7.3: page.tsx는 API Route만 fetch
 * - DB 저장 없이 즉시 렌더링
 */
export default async function Home() {
  // AIDEV-NOTE: /api/top에서 매일경제 RSS 메인 TOP 10 뉴스 가져오기
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/top`, {
    cache: "no-store", // SSR 시 매번 최신 데이터 fetch
  });

  const newsList: NewsItem[] = res.ok ? await res.json() : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Key News</h1>
          <p className="text-gray-600">TOP 10 뉴스</p>
        </header>

        {/* News List */}
        <main className="mx-auto max-w-6xl">
          <NewsList newsList={newsList} />
        </main>
      </div>
    </div>
  );
}
