"use client";

import { WEDDING } from "@/lib/config";
import Image from "next/image";
import { useState, type CSSProperties } from "react";

const INITIAL_COUNT = 9;

// 인물이 사진 위쪽에 있어서 crop 시 위쪽을 기준으로 보여줘야 하는 사진들
const TOP_ALIGNED = new Set(["/images/gallery/3.jpg", "/images/gallery/4.jpg"]);

// 2열 매스너리: 1열 세로 + 2열 가로가로 쌓임, 3장 단위로 반복
const CYCLE: { col: 1 | 2; span: 1 | 2; ratio: string }[] = [
  { col: 1, span: 2, ratio: "16 / 20" }, // 세로 (1열)
  { col: 2, span: 1, ratio: "16 / 10" }, // 가로 (2열)
  { col: 2, span: 1, ratio: "16 / 10" }, // 가로 (2열)
];

export default function GallerySection() {
  // 맨 위 타이틀 사진(photos[0])은 갤러리에서 제외
  const photos = WEDDING.photos.slice(1);
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = showAll ? photos : photos.slice(0, INITIAL_COUNT);
  const hasMore = !showAll && photos.length > INITIAL_COUNT;

  return (
    <div className="section">
      <div className="section-title">
        <span className="section-subtitle">GALLERY</span>
        <h2 className="section-heading">갤러리</h2>
      </div>

      {/* 2-column masonry grid (grid-area 기반) */}
      <div
        className="gallery-grid-container"
        style={{ margin: "0 16px" }}
      >
        <div
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "4px",
          }}
        >
          {visible.map((src, i) => {
            const { col, span, ratio } = CYCLE[i % CYCLE.length];
            return (
              <div
                key={i}
                onClick={() => setLightboxIndex(i)}
                style={{
                  gridColumn: col,
                  gridRow: `span ${span}`,
                  cursor: "pointer",
                  overflow: "hidden",
                  animation: showAll && i >= INITIAL_COUNT ? "fadeInGallery .7s ease-in-out" : undefined,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio: ratio,
                    backgroundImage: `url("${src}")`,
                    backgroundSize: "cover",
                    backgroundPosition: TOP_ALIGNED.has(src) ? "center top" : "center",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 사진 더 보기 button */}
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "1.5rem",
              lineHeight: "1.5rem",
              padding: "0 26px",
              border: "1px solid var(--rose-light)",
              borderRadius: "32px",
              background: "none",
              color: "var(--rose-muted)",
              fontSize: "13px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <BounceDiamond color="var(--rose-light)" />
            <span>사진 더 보기</span>
          </button>
        </div>
      )}

      {/* Lightbox (좌우 화살표로 사진 넘기는 캐러셀) */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "90vw",
              maxWidth: "430px",
              aspectRatio: "1",
            }}
          >
            <Image
              src={visible[lightboxIndex]}
              alt="확대 사진"
              fill
              style={{
                objectFit: "contain",
                objectPosition: TOP_ALIGNED.has(visible[lightboxIndex]) ? "center top" : "center",
              }}
            />
          </div>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((idx) => (idx! - 1 + visible.length) % visible.length);
              }}
              aria-label="이전 사진"
              style={arrowButtonStyle("left")}
            >
              <ChevronIcon direction="left" />
            </button>
          )}
          {lightboxIndex < visible.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((idx) => (idx! + 1) % visible.length);
              }}
              aria-label="다음 사진"
              style={arrowButtonStyle("right")}
            >
              <ChevronIcon direction="right" />
            </button>
          )}

          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="닫기"
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInGallery {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceDiamond {
          0% { transform: translateY(-4px) rotate(45deg); opacity: 0; }
          50% { transform: translateY(-1px) rotate(45deg); opacity: 1; }
          100% { transform: translateY(-4px) rotate(45deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function arrowButtonStyle(side: "left" | "right"): CSSProperties {
  return {
    position: "absolute",
    [side]: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.35)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 1001,
    padding: 0,
  };
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  const points = direction === "left" ? "15 4 7 12 15 20" : "9 4 17 12 9 20";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline
        points={points}
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BounceDiamond({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.333rem",
        height: "0.333rem",
        borderBottom: `1px solid ${color}`,
        borderRight: `1px solid ${color}`,
        transform: "translateY(-4px) rotate(45deg)",
        animation: "bounceDiamond 1.5s ease-in-out infinite",
      }}
    />
  );
}
