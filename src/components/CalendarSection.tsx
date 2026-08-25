"use client";

import { WEDDING } from "@/lib/config";
import { useState, useEffect } from "react";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarRows(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CalendarSection() {
  const { date, groom, bride } = WEDDING;
  const weddingDate = new Date(date.year, date.month - 1, date.day, 13, 30, 0);

  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = weddingDate.getTime() - Date.now();
      if (diff <= 0) { setT({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      const s = Math.floor(diff / 1000);
      setT({
        days: Math.floor(s / 86400),
        hours: Math.floor((s % 86400) / 3600),
        mins: Math.floor((s % 3600) / 60),
        secs: s % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const rows = getCalendarRows(date.year, date.month);

  return (
    <div style={{ padding: "30px 0" }}>
      <div
        style={{
          padding: "2.6rem 0 3rem",
          background: "var(--cream-dark)",
          borderTop: "1px solid var(--cream-darker)",
          borderBottom: "1px solid var(--cream-darker)",
          textAlign: "center",
        }}
      >
        {/* Date header */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.4rem",
            letterSpacing: "1px",
            color: "var(--text-dark)",
            opacity: 0.8,
          }}
        >
          {date.year}.{date.month}.{date.day}
        </div>
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "1px",
            marginTop: "4px",
            marginBottom: "1.5rem",
            color: "var(--text-medium)",
          }}
        >
          {date.dayName} {date.displayTime}
        </div>

        {/* Calendar table */}
        <div
          style={{
            margin: "0 auto",
            padding: "0 10px",
            maxWidth: "300px",
            borderTop: "1px solid var(--cream-darker)",
            borderBottom: "1px solid var(--cream-darker)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              lineHeight: "2rem",
            }}
          >
            <thead>
              <tr>
                {WEEK_DAYS.map((d, i) => (
                  <th
                    key={d}
                    style={{
                      fontWeight: "normal",
                      paddingBottom: "8px",
                      color: i === 0 ? "#c6472b" : "var(--text-medium)",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((day, ci) => {
                    const isWedding = day === date.day;
                    return (
                      <td
                        key={ci}
                        style={{ position: "relative", textAlign: "center", lineHeight: "2rem" }}
                      >
                        {isWedding && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                lineHeight: "28px",
                                borderRadius: "50%",
                                background: "var(--rose-light)",
                                color: "#fff",
                                fontSize: "13px",
                              }}
                            >
                              {day}
                            </div>
                          </div>
                        )}
                        <span
                          style={{
                            color: isWedding
                              ? "transparent"
                              : ci === 0
                              ? "#c6472b"
                              : "var(--text-dark)",
                          }}
                        >
                          {day ?? ""}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* D-day countdown */}
        <div style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              display: "inline-flex",
              alignItems: "flex-start",
              gap: 0,
              marginBottom: "12px",
            }}
          >
            {[
              { label: "Days", value: t.days, wide: true },
              { label: "", value: null },
              { label: "Hour", value: t.hours },
              { label: "", value: null },
              { label: "Min", value: t.mins },
              { label: "", value: null },
              { label: "Sec", value: t.secs },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  textAlign: "center",
                  fontSize: "10px",
                  lineHeight: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: 0,
                }}
              >
                <div
                  style={{
                    color: "var(--text-dark)",
                    opacity: 0.4,
                    minHeight: "1rem",
                  }}
                >
                  {item.label || " "}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: item.value !== null ? "1.2rem" : "1rem",
                    padding: "0 3px",
                    lineHeight: "1.8rem",
                    color: "var(--text-dark)",
                    opacity: 0.8,
                    minWidth: item.value !== null ? (item.wide ? "auto" : "2rem") : undefined,
                  }}
                >
                  {item.value !== null ? pad(item.value) : ":"}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "var(--text-medium)",
              letterSpacing: "-0.5px",
            }}
          >
            <span>{groom.name}</span>
            <span style={{ color: "var(--rose)", fontSize: "11px", margin: "0 4px" }}>♥</span>
            <span>{bride.name}</span>
            <span>의 결혼식이 </span>
            <span style={{ color: "var(--rose)" }}>{t.days + 1}일</span>
            <span> 남았습니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
