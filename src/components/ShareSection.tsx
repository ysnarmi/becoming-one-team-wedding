"use client";

import { useState } from "react";
import { WEDDING } from "@/lib/config";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

const KAKAO_SDK_SRC = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

function loadKakaoSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Kakao) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = KAKAO_SDK_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK load failed"));
    document.head.appendChild(script);
  });
}

export default function ShareSection() {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const handleKakaoShare = async () => {
    const { kakaoJsKey } = WEDDING.share;
    if (!kakaoJsKey) {
      alert(
        "카카오톡 공유를 사용하려면 developers.kakao.com 에서 JavaScript 키를 발급받아 src/lib/config.ts 의 share.kakaoJsKey 에 넣어주세요."
      );
      return;
    }
    try {
      await loadKakaoSdk();
      if (!window.Kakao) return;
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoJsKey);
      }
      const url = getUrl();
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${WEDDING.groom.name} · ${WEDDING.bride.name} 결혼식`,
          description: `${WEDDING.date.month}월 ${WEDDING.date.day}일(${WEDDING.date.dayName.slice(0, 1)}) ${WEDDING.date.displayTime} 결혼합니다.`,
          imageUrl: WEDDING.photos[0]?.startsWith("http")
            ? WEDDING.photos[0]
            : `${url.replace(/\/$/, "")}${WEDDING.photos[0]}`,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          {
            title: "모바일 초대장 보기",
            link: { mobileWebUrl: url, webUrl: url },
          },
        ],
      });
    } catch {
      alert("카카오톡 공유를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("링크 복사에 실패했어요.");
    }
  };

  return (
    <div className="section">
      <div className="section-title">
        <span className="section-subtitle">SHARE</span>
        <h2 className="section-heading">공유하기</h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        <ShareButton label="카카오톡 공유" onClick={handleKakaoShare}>
          <KakaoIcon />
        </ShareButton>
        <ShareButton label="QR코드" onClick={() => setShowQr(true)}>
          <QrIcon />
        </ShareButton>
        <ShareButton label={copied ? "복사됨!" : "주소 복사"} onClick={handleCopyLink}>
          <LinkIcon />
        </ShareButton>
      </div>

      {showQr && (
        <div
          onClick={() => setShowQr(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                getUrl()
              )}`}
              alt="청첩장 QR코드"
              width={220}
              height={220}
            />
            <button
              onClick={() => setShowQr(false)}
              style={{
                marginTop: "16px",
                border: "1px solid var(--rose-light)",
                borderRadius: "20px",
                background: "none",
                color: "var(--rose-muted)",
                fontSize: "13px",
                padding: "6px 20px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShareButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-medium)",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "var(--rose-pale)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </span>
      <span style={{ fontSize: "12px", letterSpacing: "0.5px" }}>{label}</span>
    </button>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4C6.98 4 3 7.15 3 11.03c0 2.5 1.66 4.7 4.15 5.96-.18.66-.66 2.4-.75 2.78-.12.47.17.46.36.34.15-.1 2.35-1.6 3.3-2.25.62.09 1.27.14 1.94.14 5.02 0 9-3.15 9-7.03S17.02 4 12 4z"
        fill="var(--rose-muted)"
      />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose-muted)" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" fill="var(--rose-muted)" stroke="none" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose-muted)" strokeWidth="1.6" strokeLinecap="round">
      <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5" />
      <path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5" />
    </svg>
  );
}
