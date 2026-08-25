"use client";

import { WEDDING } from "@/lib/config";
import Image from "next/image";
import { useState } from "react";

const INITIAL_COUNT = 9;

export default function GallerySection() {
  const { photos } = WEDDING;
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const visible = showAll ? photos : photos.slice(0, INITIAL_COUNT);
  const hasMore = !showAll && photos.length > INITIAL_COUNT;

  return (
    <div className="section">
      <div className="section-title">
        <span className="section-subtitle">GALLERY</span>
        <h2 className="section-heading">갤러리</h2>
      </div>

      {/* 3-column square grid */}
      <div
        style={{
          lineHeight: 0,
          textAlign: "left",
          margin: "0 16px",
        }}
      >
        {visible.map((src, i) => (
          <div
            key={i}
            onClick={() => setLightbox(src)}
            style={{
              position: "relative",
              display: "inline-block",
              width: "calc(33.3% - 4px)",
              margin: "2px",
              background: "#eee",
              overflow: "hidden",
              cursor: "pointer",
              animation: showAll && i >= INITIAL_COUNT ? "fadeInGallery .7s ease-in-out" : undefined,
            }}
          >
            {/* Square placeholder */}
            <div style={{ paddingBottom: "100%", position: "relative", background: "rgba(0,0,0,.02)" }} />
            <Image
              src={src}
              alt={`웨딩 사진 ${i + 1}`}
              fill
              sizes="33vw"
              style={{ objectFit: "cover", position: "absolute", top: "-1px", left: "-1px" }}
            />
          </div>
        ))}
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

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
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
            style={{
              position: "relative",
              width: "90vw",
              maxWidth: "430px",
              aspectRatio: "1",
            }}
          >
            <Image
              src={lightbox}
              alt="확대 사진"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <button
            onClick={() => setLightbox(null)}
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
