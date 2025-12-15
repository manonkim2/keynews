"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { NewsItem } from "@/types/news";

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

/**
 * AIDEV-NOTE: 뉴스 카드 UI 컴포넌트
 * - Client Component (features/ 폴더 내 배치)
 * - props로만 데이터 수신 (ARCHITECTURE.md 규칙)
 * - 이미지 + framer-motion 애니메이션 적용
 * - Apple News / Linear 스타일
 */
export function NewsCard({ news, index }: NewsCardProps) {
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins}m ago`;
      }
      if (diffHours < 24) {
        return `${diffHours}h ago`;
      }
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return dateString;
    }
  };

  // Extract domain from URL
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace("www.", "");
    } catch {
      return "mk.co.kr";
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
      }}
      className="group relative overflow-hidden rounded-2xl border border-editorial-divider bg-white"
    >
      <motion.a
        href={news.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        whileHover="hover"
        initial="initial"
        animate="initial"
      >
        {/* Image Section */}
        {news.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-editorial-hover">
            <motion.div
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.08 },
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full w-full"
            >
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        )}

        {/* Content Section */}
        <motion.div
          variants={{
            initial: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="p-6"
        >
          {/* Title with Ranking Number */}
          <div className="flex items-start gap-3">
            {/* Ranking Number */}
            <motion.span
              variants={{
                initial: { opacity: 0.5, y: 0 },
                hover: { opacity: 1, y: -1 },
              }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[24px] font-light leading-none text-editorial-light"
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>

            {/* Title */}
            <motion.h3
              variants={{
                initial: { color: "#18181b", x: 0 },
                hover: { color: "#6366f1", x: 2 },
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex-1 line-clamp-2 text-[17px] font-semibold leading-normal"
            >
              {news.title}
            </motion.h3>
          </div>

          {/* Description (if no image) */}
          {!news.imageUrl && news.description && (
            <p className="mb-3 ml-9 line-clamp-2 text-[14px] leading-relaxed text-editorial-gray">
              {news.description}
            </p>
          )}

          {/* Metadata */}
          <motion.div
            variants={{
              initial: { opacity: 0.7 },
              hover: { opacity: 1 },
            }}
            transition={{ duration: 0.3 }}
            className="ml-9 mt-3 flex items-center gap-2 text-[13px] text-editorial-gray"
          >
            <span>{getDomain(news.link)}</span>
            <span>·</span>
            <time dateTime={news.pubDate}>{formatTimeAgo(news.pubDate)}</time>
          </motion.div>
        </motion.div>
      </motion.a>
    </motion.article>
  );
}
