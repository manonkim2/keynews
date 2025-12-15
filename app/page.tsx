import type { NewsItem } from "@/types/news";
import { TabNavigation } from "@/features/news/TabNavigation";
import { getKeywordsAction } from "@/app/actions/keywords";

/**
 * AIDEV-NOTE: 메인 페이지 - Server Component
 * - ARCHITECTURE.md 7.3: page.tsx는 데이터 오케스트레이션(병렬 fetch)만 담당
 * - TabNavigation으로 TOP10 뉴스와 키워드 검색 탭 전환
 */
export default async function Home() {
  // AIDEV-NOTE: 병렬 fetch - TOP 10 뉴스와 키워드 동시 조회
  const [newsRes, keywords] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/top`,
      {
        cache: "no-store",
      }
    ),
    getKeywordsAction(),
  ]);

  const newsList: NewsItem[] = newsRes.ok ? await newsRes.json() : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Key News</h1>
          <p className="text-gray-600">TOP 10 뉴스 & 키워드 검색</p>
        </header>

        {/* Tab Navigation */}
        <main className="mx-auto max-w-6xl">
          <TabNavigation topNewsList={newsList} keywords={keywords} />
        </main>
      </div>
    </div>
  );
}
