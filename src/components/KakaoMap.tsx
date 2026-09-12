"use client";

import { useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/config";

declare global {
  interface Window {
    kakao?: any;
  }
}

const SDK_SRC = (key: string) =>
  `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;

function loadKakaoMapsSdk(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_SRC(key);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao Maps SDK load failed"));
    document.head.appendChild(script);
  });
}

export default function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { kakaoJsKey } = WEDDING.share;
  const { name, address: rawAddress } = WEDDING.venue;
  // 지오코딩은 층수/우편번호가 붙으면 실패하는 경우가 많아 순수 주소만 추출
  const address = rawAddress.replace(/\s*\(.*?\)\s*/g, "").replace(/\s*\d+층\s*$/, "").trim();

  useEffect(() => {
    if (!kakaoJsKey || !containerRef.current) {
      setError("kakaoJsKey가 설정되지 않았어요");
      return;
    }
    let cancelled = false;

    loadKakaoMapsSdk(kakaoJsKey)
      .then(() => {
        if (cancelled) return;
        window.kakao.maps.load(() => {
          if (cancelled || !containerRef.current) return;
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(address, (result: any[], status: string) => {
            if (cancelled) return;
            if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
              setError(`주소 검색 실패 (status: ${status}, 검색어: "${address}")`);
              return;
            }
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            const map = new window.kakao.maps.Map(containerRef.current, {
              center: coords,
              level: 3,
            });
            new window.kakao.maps.Marker({ map, position: coords });

            const infoWindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${name}</div>`,
            });
            infoWindow.open(map, new window.kakao.maps.Marker({ position: coords }));
          });
        });
      })
      .catch((err) => setError(`SDK 로드 실패: ${err?.message ?? err}`));

    return () => {
      cancelled = true;
    };
  }, [kakaoJsKey, address, name]);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16/9",
        background: "#e0dbd5",
        borderRadius: "8px",
        marginBottom: "16px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        textAlign: "center",
      }}
    >
      {error ? (
        <span style={{ color: "var(--text-light)", fontSize: "12px", wordBreak: "break-all" }}>
          지도를 불러오지 못했어요
          <br />
          {error}
        </span>
      ) : (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
