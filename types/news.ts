/**
 * AIDEV-NOTE: 뉴스 관련 타입 정의
 * - RSS 피드 및 API 응답에서 사용되는 뉴스 아이템 타입
 */
export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  content?: string;
  imageUrl?: string;
}
