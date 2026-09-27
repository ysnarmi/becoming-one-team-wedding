"use client";

import { WEDDING } from "@/lib/config";
import { useEffect, useState, type CSSProperties } from "react";

type Side = "신랑측" | "신부측";
type Meal = "예정" | "안함" | "미정";

// 첫 방문 팝업을 "오늘 하루" 숨길 때 쓰는 키 — 값으로 YYYY-MM-DD 를 저장한다
const HIDE_KEY = "rsvp-popup-hidden-until";

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function RsvpSection() {
  const [open, setOpen] = useState(false);

  // 첫 방문 시 자동으로 팝업 — localStorage 는 클라이언트에서만 읽는다
  useEffect(() => {
    if (!WEDDING.rsvp.autoOpen) return;
    let hidden: string | null = null;
    try {
      hidden = window.localStorage.getItem(HIDE_KEY);
    } catch {
      // 사생활 보호 모드 등에서 접근이 막히면 그냥 띄운다
    }
    if (hidden === todayKey()) return;
    const timer = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // 팝업이 열려 있는 동안 뒤 배경 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="section">
      <div className="section-title">
        <span className="section-subtitle">RSVP</span>
        <h2 className="section-heading">참석 여부 전달</h2>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: "13px",
          lineHeight: 2,
          color: "var(--text-medium)",
          margin: "0 0 24px",
          whiteSpace: "pre-line",
        }}
      >
        {WEDDING.rsvp.message}
      </p>

      <div style={{ textAlign: "center" }}>
        <button onClick={() => setOpen(true)} style={primaryButtonStyle}>
          참석 여부 전달
        </button>
      </div>

      {open && <RsvpModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [side, setSide] = useState<Side>("신랑측");
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [companions, setCompanions] = useState("");
  const [meal, setMeal] = useState<Meal>("예정");
  const [hideToday, setHideToday] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (hideToday) {
      try {
        window.localStorage.setItem(HIDE_KEY, todayKey());
      } catch {
        // 저장 실패해도 닫기는 정상 동작
      }
    }
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("성함을 입력해주세요.");
      return;
    }
    const total = Number(count);
    if (!count.trim() || !Number.isFinite(total) || total < 1) {
      setError("참석인원을 1명 이상으로 입력해주세요.");
      return;
    }

    setError("");
    setSending(true);
    try {
      await submitRsvp({
        side,
        name: trimmedName,
        count: total,
        companions: companions.trim(),
        meal,
      });
      setDone(true);
    } catch {
      setError("전달에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="참석 의사 전달"
        style={{
          width: "100%",
          maxWidth: "370px",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
          background: "#fff",
          borderRadius: "14px",
          padding: "26px 22px 22px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        {done ? (
          <Done onClose={close} />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "22px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: 500,
                  color: "var(--text-dark)",
                  letterSpacing: "0.5px",
                }}
              >
                참석 의사 전달
              </h3>
              <button onClick={close} aria-label="닫기" style={closeButtonStyle}>
                <CloseIcon />
              </button>
            </div>

            <Field label="구분">
              <div style={{ display: "flex", gap: "8px" }}>
                {(["신랑측", "신부측"] as Side[]).map((s) => (
                  <Choice
                    key={s}
                    label={s}
                    selected={side === s}
                    onClick={() => setSide(s)}
                    grow
                  />
                ))}
              </div>
            </Field>

            <Field label="성함">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                maxLength={20}
              />
            </Field>

            <Field label="참석인원">
              <input
                value={count}
                onChange={(e) =>
                  setCount(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))
                }
                inputMode="numeric"
                placeholder="본인 포함 총 참석인원"
                style={inputStyle}
              />
            </Field>

            <Field label="동행인">
              <input
                value={companions}
                onChange={(e) => setCompanions(e.target.value)}
                placeholder="함께 오시는 분 성함"
                style={inputStyle}
                maxLength={60}
              />
            </Field>

            <Field label="식사여부">
              <div style={{ display: "flex", gap: "8px" }}>
                {(["예정", "안함", "미정"] as Meal[]).map((m) => (
                  <Choice
                    key={m}
                    label={m}
                    selected={meal === m}
                    onClick={() => setMeal(m)}
                    grow
                  />
                ))}
              </div>
            </Field>

            {error && (
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "12px",
                  color: "#c0554f",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={sending}
              style={{
                ...primaryButtonStyle,
                display: "block",
                width: "100%",
                marginTop: "22px",
                opacity: sending ? 0.6 : 1,
                cursor: sending ? "default" : "pointer",
              }}
            >
              {sending ? "전달 중..." : "참석 의사 전달하기"}
            </button>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "14px",
                fontSize: "12px",
                color: "var(--text-light)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={hideToday}
                onChange={(e) => setHideToday(e.target.checked)}
                style={{ accentColor: "var(--rose)", cursor: "pointer" }}
              />
              오늘 하루 보지 않기
            </label>
          </>
        )}
      </div>
    </div>
  );
}

function Done({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "18px 0 6px" }}>
      <div
        style={{
          width: "52px",
          height: "52px",
          margin: "0 auto 18px",
          borderRadius: "50%",
          background: "var(--rose-pale)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="var(--rose)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "15px",
          color: "var(--text-dark)",
        }}
      >
        참석 의사가 전달되었습니다
      </p>
      <p
        style={{
          margin: "0 0 22px",
          fontSize: "13px",
          lineHeight: 1.8,
          color: "var(--text-medium)",
        }}
      >
        소중한 시간 내어 답변해주셔서 감사합니다.
        <br />
        결혼식 당일에 뵙겠습니다.
      </p>
      <button onClick={onClose} style={{ ...primaryButtonStyle, width: "100%" }}>
        닫기
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <span
        style={{
          flex: "0 0 62px",
          fontSize: "13px",
          color: "var(--text-dark)",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function Choice({
  label,
  selected,
  onClick,
  grow,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  grow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: grow ? 1 : "0 0 auto",
        height: "42px",
        border: selected ? "1px solid var(--rose)" : "1px solid transparent",
        borderRadius: "6px",
        background: selected ? "var(--rose-pale)" : "var(--cream-dark)",
        color: selected ? "var(--rose-muted)" : "var(--text-light)",
        fontSize: "14px",
        fontFamily: "inherit",
        cursor: "pointer",
        letterSpacing: "0.5px",
      }}
    >
      {label}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="var(--text-medium)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  height: "42px",
  padding: "0 12px",
  border: "1px solid transparent",
  borderRadius: "6px",
  background: "var(--cream-dark)",
  color: "var(--text-dark)",
  fontSize: "14px",
  fontFamily: "inherit",
  outline: "none",
};

const primaryButtonStyle: CSSProperties = {
  height: "48px",
  padding: "0 40px",
  border: "1px solid var(--rose-light)",
  borderRadius: "6px",
  background: "var(--rose-pale)",
  color: "var(--rose-muted)",
  fontSize: "15px",
  fontFamily: "inherit",
  letterSpacing: "1px",
  cursor: "pointer",
};

const closeButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  lineHeight: 0,
  cursor: "pointer",
};

/** 참석 의사를 설정된 엔드포인트로 전송한다. 엔드포인트가 비어 있으면 콘솔에만 남긴다. */
async function submitRsvp(payload: {
  side: Side;
  name: string;
  count: number;
  companions: string;
  meal: Meal;
}) {
  const { endpoint } = WEDDING.rsvp;
  const body = { ...payload, submittedAt: new Date().toISOString() };

  if (!endpoint) {
    console.warn("[RSVP] 저장할 엔드포인트가 없습니다. 받은 내용:", body);
    return;
  }

  // Google Apps Script 웹앱은 CORS 응답 헤더를 주지 않아 no-cors 로 보낸다.
  // 응답 본문을 읽을 수 없으므로 네트워크 오류가 없으면 성공으로 간주한다.
  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
}
