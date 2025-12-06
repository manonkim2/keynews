import { createClient } from "@/lib/supabase/server";
import { keywordArraySchema } from "@/lib/schemas/keyword.schema";

export default async function Home() {
  const supabase = await createClient();

  // AIDEV-NOTE: Supabase keyword 테이블 연결 테스트
  const { data, error } = await supabase.from("keyword").select("*");

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">
          <h2 className="text-xl font-bold">에러 발생</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  // zod 스키마로 외부 데이터 검증 (CLAUDE.md 규칙)
  const keywords = keywordArraySchema.parse(data);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-8 text-3xl font-bold">Supabase 연결 테스트</h1>
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Keywords:</h2>
        {keywords.length === 0 ? (
          <p className="text-gray-500">키워드가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {keywords.map((keyword) => (
              <li
                key={keyword.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="font-medium">{keyword.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(keyword.created_at).toLocaleString("ko-KR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
