import { z } from "zod";

/**
 * AIDEV-NOTE: 네이버 뉴스 검색 API 응답 타입
 * - 공식 API 문서: https://developers.naver.com/docs/serviceapi/search/news/news.md
 */

export const naverNewsItemSchema = z.object({
  title: z.string(), // HTML 태그 포함된 제목
  originallink: z.string(), // 원본 뉴스 링크
  link: z.string(), // 네이버 뉴스 링크
  description: z.string(), // HTML 태그 포함된 설명
  pubDate: z.string(), // 발행일 (RFC 1123 형식)
});

export const naverNewsResponseSchema = z.object({
  lastBuildDate: z.string(),
  total: z.number(),
  start: z.number(),
  display: z.number(),
  items: z.array(naverNewsItemSchema),
});

export type NaverNewsItem = z.infer<typeof naverNewsItemSchema>;
export type NaverNewsResponse = z.infer<typeof naverNewsResponseSchema>;
