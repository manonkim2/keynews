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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        {/* Header - Clean & Bright style */}
        <header className="mb-20">
          <h1 className="mb-3 text-[32px] font-semibold tracking-tight text-editorial-black">
            Key News
          </h1>
          <p className="text-[15px] text-editorial-gray">
            Your daily news digest
          </p>
        </header>

        {/* Tab Navigation */}
        <main>
          <TabNavigation topNewsList={newsList} keywords={keywords} />
        </main>
      </div>
    </div>
  );
}
