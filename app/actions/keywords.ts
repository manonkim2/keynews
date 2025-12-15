"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Keyword } from "@/lib/schemas/keyword.schema";

/**
 * AIDEV-NOTE: 키워드 CRUD Server Actions
 * - CLAUDE.md: Client Component에서 fetch 수행 금지
 * - ARCHITECTURE.md: 모든 데이터 fetch는 Server Component에서 수행
 * - Server Actions로 서버에서만 DB 접근
 */

/**
 * 모든 키워드 조회
 */
export async function getKeywordsAction(): Promise<Keyword[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("keyword")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("키워드 조회 실패333:", error);
      return [];
    }

    return data as Keyword[];
  } catch (error) {
    console.error("키워드 조회 에러:", error);
    return [];
  }
}

/**
 * 새 키워드 추가
 */
export async function addKeywordAction(
  name: string
): Promise<{ success: boolean; error?: string; data?: Keyword }> {
  try {
    if (!name || name.trim().length === 0) {
      return { success: false, error: "키워드 이름은 필수입니다." };
    }

    const supabase = await createClient();

    // AIDEV-NOTE: 중복 키워드 체크
    const { data: existing } = await supabase
      .from("keyword")
      .select("*")
      .eq("name", name.trim())
      .single();

    if (existing) {
      return { success: false, error: "이미 존재하는 키워드입니다." };
    }

    const { data, error } = await supabase
      .from("keyword")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      console.error("키워드 추가 실패:", error);
      return { success: false, error: "키워드 추가에 실패했습니다." };
    }

    // AIDEV-NOTE: 페이지 재검증으로 UI 업데이트
    revalidatePath("/");

    return { success: true, data: data as Keyword };
  } catch (error) {
    console.error("키워드 추가 에러:", error);
    return { success: false, error: "키워드 추가에 실패했습니다." };
  }
}

/**
 * 키워드 삭제
 */
export async function deleteKeywordAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: "키워드 ID는 필수입니다." };
    }

    const supabase = await createClient();

    const { error } = await supabase.from("keyword").delete().eq("id", id);

    if (error) {
      console.error("키워드 삭제 실패:", error);
      return { success: false, error: "키워드 삭제에 실패했습니다." };
    }

    // AIDEV-NOTE: 페이지 재검증으로 UI 업데이트
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("키워드 삭제 에러:", error);
    return { success: false, error: "키워드 삭제에 실패했습니다." };
  }
}
