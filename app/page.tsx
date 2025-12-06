import { getTop10News } from "@/lib/rss";
import { NewsList } from "@/features/news/NewsList";

/**
 * AIDEV-NOTE: 메인 페이지 - Server Component
 * - RSS fetch는 Server Component에서만 수행 (ARCHITECTURE.md 규칙)
 * - DB 저장 없이 즉시 렌더링
 */
export default async function Home() {
  // AIDEV-NOTE: 매일경제 RSS에서 메인 TOP 10 뉴스 가져오기
  const newsList = await getTop10News();

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
