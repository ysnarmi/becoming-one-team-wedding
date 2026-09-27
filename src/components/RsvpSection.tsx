"use client";

import { WEDDING } from "@/lib/config";
import { useEffect, useState, type CSSProperties } from "react";

type Side = "신랑측" | "신부측";
type Meal = "예정" | "안함" | "미정";

// 첫 방문 팝업을 "오늘 하루" 숨길 때 쓰는 키 — 값으로 YYYY-MM-DD 를 저장한다
const HIDE_KEY = "rsvp-popup-hidden-until";

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function RsvpSection() {
  // 첫 방문 팝업은 인사말(intro) → 입력폼(form) 두 단계로 뜬다
  const [popup, setPopup] = useState<"intro" | "form" | null>(null);
  // '오늘 하루 보지 않기' 는 intro 에서 체크하고, 팝업을 닫을 때 저장한다
  const [hideToday, setHideToday] = useState(false);

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
    const timer = setTimeout(() => setPopup("intro"), 600);
    return () => clearTimeout(timer);
  }, []);

  // 팝업이 열려 있는 동안 뒤 배경 스크롤 잠금
  useEffect(() => {
    if (!popup) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [popup]);

  const closePopup = () => {
    if (hideToday) {
      try {
        window.localStorage.setItem(HIDE_KEY, todayKey());
      } catch {
        // 저장 실패해도 닫기는 정상 동작
      }
    }
    setPopup(null);
  };

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
        <button onClick={() => setPopup("form")} style={primaryButtonStyle}>
          참석 여부 전달
        </button>
      </div>

      {popup === "intro" && (
        <IntroModal
          hideToday={hideToday}
          onToggleHideToday={() => setHideToday((v) => !v)}
          onNext={() => setPopup("form")}
          onClose={closePopup}
        />
      )}
      {popup === "form" && <RsvpModal onClose={closePopup} />}
    </div>
  );
}

/** 첫 방문 시 뜨는 인사말 단계. 여기서 버튼을 누르면 입력폼으로 넘어간다. */
function IntroModal({
  hideToday,
  onToggleHideToday,
  onNext,
  onClose,
}: {
  hideToday: boolean;
  onToggleHideToday: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const { groom, bride, date, venue } = WEDDING;
  const when = `${date.year}년 ${date.month}월 ${date.day}일 ${date.dayName} ${date.displayTime}`;
  const where = venue.hall ? `${venue.name} ${venue.hall}` : venue.name;

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="참석 의사 전달 안내"
        style={{
          width: "100%",
          maxWidth: "340px",
          background: "#fff",
          border: "4px solid var(--cream-darker)",
          borderRadius: "8px",
          padding: "16px 24px 24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} aria-label="닫기" style={closeButtonStyle}>
            <CloseIcon />
          </button>
        </div>

        <h3
          style={{
            margin: "2px 0 18px",
            textAlign: "center",
            fontSize: "19px",
            fontWeight: 600,
            color: "var(--text-dark)",
          }}
        >
          참석 의사 전달
        </h3>

        <p
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: "14px",
            lineHeight: 2,
            color: "var(--text-medium)",
            whiteSpace: "pre-line",
          }}
        >
          {WEDDING.rsvp.introMessage}
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--cream-darker)",
            margin: "22px 0 20px",
          }}
        />

        <InfoRow icon={<HeartIcon />} strong>
          신랑 {groom.fullName} &amp; 신부 {bride.fullName}
        </InfoRow>
        <InfoRow icon={<CalendarIcon />}>{when}</InfoRow>
        <InfoRow icon={<PinIcon />}>{where}</InfoRow>

        <button onClick={onNext} style={{ ...submitButtonStyle, marginTop: "24px" }}>
          참석 의사 전달하기
        </button>

        <button
          onClick={onToggleHideToday}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            width: "100%",
            marginTop: "14px",
            padding: 0,
            border: "none",
            background: "none",
            fontFamily: "inherit",
            fontSize: "13px",
            color: hideToday ? "var(--rose-muted)" : "var(--text-light)",
            cursor: "pointer",
          }}
        >
          <CheckCircleIcon active={hideToday} />
          오늘 하루 보지 않기
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  strong,
  children,
}: {
  icon: React.ReactNode;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "11px",
        fontSize: "14px",
        fontWeight: strong ? 600 : 400,
        color: strong ? "var(--text-dark)" : "var(--text-medium)",
      }}
    >
      <span style={{ flex: "0 0 17px", lineHeight: 0 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9z"
        stroke="var(--rose)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5">
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5">
      <path d="M12 21s6.5-5.5 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.5 12 21 12 21z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function CheckCircleIcon({ active }: { active: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={active ? "var(--rose)" : "var(--cream-darker)"} />
      <path
        d="M7.5 12.4l3 3 6-6.4"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [side, setSide] = useState<Side>("신랑측");
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [companions, setCompanions] = useState("");
  const [meal, setMeal] = useState<Meal>("예정");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

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
    <div onClick={onClose} style={overlayStyle}>
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
          borderRadius: "16px",
          padding: "28px 24px 24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        }}
      >
        <style>{`.rsvp-input::placeholder { color: #AAA; }`}</style>
        {done ? (
          <Done onClose={onClose} />
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
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "#222",
                  letterSpacing: "-0.2px",
                }}
              >
                참석 의사 전달
              </h3>
              <button onClick={onClose} aria-label="닫기" style={closeButtonStyle}>
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
                    tone={s === "신랑측" ? "blue" : "pink"}
                  />
                ))}
              </div>
            </Field>

            <Field label="성함">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rsvp-input"
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
                className="rsvp-input"
                style={inputStyle}
              />
            </Field>

            <Field label="동행인">
              <input
                value={companions}
                onChange={(e) => setCompanions(e.target.value)}
                placeholder="함께 오시는 분 성함"
                className="rsvp-input"
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
                    tone="outline"
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
                ...submitButtonStyle,
                marginTop: "24px",
                opacity: sending ? 0.6 : 1,
                cursor: sending ? "default" : "pointer",
              }}
            >
              {sending ? "전달 중..." : "참석 의사 전달하기"}
            </button>
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
      <button onClick={onClose} style={submitButtonStyle}>
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
        gap: "14px",
        marginBottom: "14px",
      }}
    >
      <span
        style={{
          flex: "0 0 70px",
          fontSize: "15px",
          fontWeight: 500,
          color: "#333",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

// 선택 표시 방식이 항목마다 다르다 —
// 구분은 신랑(파랑)/신부(분홍)로 채우고, 식사여부는 흰 배경 + 회색 테두리로 표시
const SELECTED_FILL = { blue: "#87A5DF", pink: "#DF86A4" };

function Choice({
  label,
  selected,
  onClick,
  tone,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  tone: "blue" | "pink" | "outline";
}) {
  const filled = selected && tone !== "outline";
  const outlined = selected && tone === "outline";

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        height: "44px",
        border: outlined ? "1px solid #999" : "1px solid transparent",
        borderRadius: "4px",
        background: filled
          ? SELECTED_FILL[tone as "blue" | "pink"]
          : outlined
            ? "#fff"
            : "#F9F9F9",
        color: filled ? "#fff" : outlined ? "#333" : "#666",
        fontSize: "15px",
        fontFamily: "inherit",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="#333"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 14px",
  border: "1px solid transparent",
  borderRadius: "4px",
  background: "#F9F9F9",
  color: "#333",
  fontSize: "15px",
  fontFamily: "inherit",
  outline: "none",
};

// 모달 안 전송 버튼은 원본 디자인 색을 그대로 쓴다
const submitButtonStyle: CSSProperties = {
  width: "100%",
  height: "52px",
  border: "1px solid #E7DED0",
  borderRadius: "4px",
  background: "#FAF7F3",
  color: "#A57056",
  fontSize: "17px",
  fontFamily: "inherit",
  cursor: "pointer",
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
