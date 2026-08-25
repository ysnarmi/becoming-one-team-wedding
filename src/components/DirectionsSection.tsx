import { WEDDING } from "@/lib/config";

const SubwayIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
    <path d="M10 4C7.25 4 5 6.25 5 9v12a6.012 6.012 0 003.531 5.469L6 29h2.344l2.031-2.031c.2.02.418.031.625.031h10c.207 0 .426-.012.625-.031L23.656 29H26l-2.531-2.531A6.012 6.012 0 0027 21V9c0-2.75-2.25-5-5-5zm0 2h12c1.32 0 2.438.828 2.844 2H7.156A2.992 2.992 0 0110 6zm-3 4h8v6H7zm10 0h8v6h-8zM7 18h18v3c0 2.219-1.781 4-4 4H11c-2.219 0-4-1.781-4-4zm3.5 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm11 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
  </svg>
);

const BusIcon = () => (
  <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
    <path d="M9 4C6.8 4 5 5.8 5 8v5H3v3h2v11c0 .55.45 1 1 1h3l.344-1h13.312L23 28h3c.55 0 1-.45 1-1V16h2v-3h-2V8c0-2.2-1.8-4-4-4zm0 2h14c1.117 0 2 .883 2 2H7c0-1.117.883-2 2-2zm-2 4h8v7H7zm10 0h8v7h-8zM7 19h18v6H7zm1 2v2h4v-2zm12 0v2h4v-2z" />
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const icons = { subway: SubwayIcon, bus: BusIcon, car: CarIcon };

export default function DirectionsSection() {
  const { venue } = WEDDING;

  return (
    <div className="section" style={{ background: "var(--cream-dark)" }}>
      <div className="section-title">
        <span className="section-subtitle">LOCATION</span>
        <h2 className="section-heading">오시는 길</h2>
      </div>

      {/* Venue info */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-dark)" }}>
          {venue.name}
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-light)", marginTop: "4px" }}>
          {venue.hall && `${venue.hall} · `}{venue.address}
        </div>
      </div>

      {/* Map placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "#e0dbd5",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "16px",
          overflow: "hidden",
        }}
      >
        <span style={{ color: "var(--text-light)", fontSize: "13px" }}>
          지도를 연동해 주세요
        </span>
      </div>

      {/* Navigation buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "32px",
        }}
      >
        {[
          { name: "네이버 지도", url: venue.naverMapUrl, color: "#03c75a" },
          { name: "카카오 내비", url: venue.kakaoMapUrl, color: "#fee500" },
          { name: "티맵", url: venue.tmapUrl, color: "#d72713" },
        ].map((nav) => (
          <a
            key={nav.name}
            href={nav.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 4px",
              background: "var(--cream)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-dark)",
              textDecoration: "none",
              border: "1px solid var(--cream-darker)",
              fontWeight: "500",
            }}
          >
            {nav.name}
          </a>
        ))}
      </div>

      {/* Direction details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {venue.directions.map((dir) => {
          const Icon = icons[dir.icon as keyof typeof icons] ?? CarIcon;
          return (
            <div key={dir.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "var(--cream)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--rose-muted)",
                }}
              >
                <Icon />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--rose-muted)",
                    marginBottom: "4px",
                  }}
                >
                  {dir.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-medium)",
                    lineHeight: "1.8",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {dir.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
