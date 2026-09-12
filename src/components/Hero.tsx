"use client";

import { WEDDING } from "@/lib/config";
import Image from "next/image";
import { useEffect, useRef } from "react";

const SNOW_VIDEO = "/images/flowers/snow_00.mp4";

export default function Hero() {
  const { date, groom, bride, venue, photos } = WEDDING;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React가 muted 속성을 SSR 마크업에 반영하지 않아 모바일에서 자동재생이
    // 막히고 재생 버튼이 뜨는 경우가 있어, 직접 속성을 설정하고 재생을 시도한다
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <div
      style={{
        background: "var(--cream)",
        textAlign: "center",
        paddingBottom: "40px",
      }}
    >
      {/* Date */}
      <div
        style={{
          paddingTop: "52px",
          paddingBottom: "28px",
          fontFamily: "'Cormorant Garamond', serif",
          color: "var(--text-dark)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 0, fontSize: 0 }}>
          {[date.year, date.month, date.day].map((val, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                padding: "0 12px 4px",
                borderRight: i < 2 ? "1px solid var(--rose-light)" : "none",
                fontSize: "28px",
                lineHeight: "24px",
              }}
            >
              {val}
            </span>
          ))}
        </div>
        <div
          style={{
            letterSpacing: "3px",
            fontSize: "13px",
            marginTop: "10px",
            color: "var(--text-medium)",
          }}
        >
          SATURDAY
        </div>
      </div>

      {/* Main photo — 눈 내리는 영상이 이 위에 겹쳐집니다 */}
      <div style={{ padding: "0 28px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4/5",
            overflow: "hidden",
          }}
        >
          <Image
            src={photos[0]}
            alt="웨딩 사진"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <video
            ref={videoRef}
            src={SNOW_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>

      {/* Names */}
      <div style={{ marginTop: "28px", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            fontSize: "20px",
            letterSpacing: "2px",
            marginBottom: "14px",
            color: "var(--text-dark)",
          }}
        >
          <span>{groom.name}</span>
          <span
            style={{
              width: "1px",
              height: "18px",
              background: "var(--text-dark)",
              opacity: 0.4,
              display: "inline-block",
            }}
          />
          <span>{bride.name}</span>
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "var(--text-medium)",
            lineHeight: "2",
            letterSpacing: "1px",
          }}
        >
          <div>
            {date.year}년 {date.month}월 {date.day}일 {date.dayName}
          </div>
          <div>{date.displayTime}</div>
          <div>
            {venue.name}
            {venue.hall && ` ${venue.hall}`}
          </div>
        </div>
      </div>
    </div>
  );
}
