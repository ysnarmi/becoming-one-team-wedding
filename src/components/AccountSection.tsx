"use client";

import { WEDDING } from "@/lib/config";
import { useState, useRef } from "react";

const CopyIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0.48 0.48 23.04 23.04"
    fill="currentColor"
    width="12"
    height="12"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="16"
    height="16"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

interface Account {
  bank: string;
  number: string;
  holder: string;
  kakaoPayUrl?: string;
}

function AccountRow({ account }: { account: Account }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account.number);
    } catch {
      const el = document.createElement("textarea");
      el.value = account.number;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "relative",
        padding: ".75rem 0 .75rem .85rem",
        lineHeight: "26px",
        letterSpacing: 0,
        textAlign: "left",
        background: "var(--cream)",
        borderTop: "1px solid rgba(0,0,0,.05)",
        fontSize: "min(.85rem, 16px)",
      }}
    >
      <div>
        <span
          style={{
            display: "inline-block",
            marginRight: "4px",
            fontWeight: 500,
          }}
        >
          {account.bank}
        </span>
        <span
          style={{
            display: "inline-block",
            width: "1px",
            height: "12px",
            background: "#e5e5e5",
            borderRadius: "10px",
            verticalAlign: "middle",
            margin: "-1px 6px 0",
          }}
        />
        <span>{account.number}</span>
      </div>
      <div style={{ color: "var(--text-medium)", fontSize: "13px" }}>
        {account.holder}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: ".75rem",
          right: ".75rem",
          display: "flex",
          alignItems: "center",
          gap: "3px",
          padding: "0 4px",
          height: "24px",
          fontSize: "12px",
          color: copied ? "var(--rose)" : "#333",
          border: "1px solid",
          borderColor: copied ? "var(--rose)" : "#e1e1e1",
          borderRadius: "4px",
          background: "none",
          cursor: "pointer",
          letterSpacing: ".5px",
          fontFamily: "inherit",
          transition: "all .2s",
        }}
      >
        <CopyIcon />
        {copied ? "복사됨" : "복사"}
      </button>

      {/* KakaoPay button */}
      {account.kakaoPayUrl && (
        <a
          href={account.kakaoPayUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: "calc(.75rem + 28px)",
            right: ".75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6px",
            height: "24px",
            fontSize: "11px",
            background: "#fbdf1d",
            borderRadius: "4px",
            border: "1px solid #fbdf1d",
            color: "#3a1d1d",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          카카오페이
        </a>
      )}
    </div>
  );
}

function AccountGroup({
  title,
  accounts,
}: {
  title: string;
  accounts: Account[];
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="item" style={{ marginTop: "12px" }}>
      {/* Header */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "relative",
          padding: "8px 0",
          textAlign: "center",
          cursor: "pointer",
          zIndex: 999,
          color: "var(--text-dark)",
          background: "var(--cream-darker)",
          borderRadius: open ? "6px 6px 0 0" : "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "14px",
          transition: "border-radius .2s",
        }}
      >
        <span>{title}</span>
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "18px",
            display: "flex",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .4s",
            color: "var(--text-medium)",
          }}
        >
          <ChevronIcon />
        </span>
      </div>

      {/* Expandable content */}
      <div
        ref={contentRef}
        style={{
          overflow: "hidden",
          maxHeight: open ? `${(contentRef.current?.scrollHeight ?? 400)}px` : "0px",
          transition: "max-height .4s ease",
          borderRadius: "0 0 6px 6px",
          border: open ? "1px solid var(--cream-darker)" : "none",
          borderTop: "none",
        }}
      >
        {accounts.map((acc, i) => (
          <AccountRow key={i} account={acc} />
        ))}
      </div>
    </div>
  );
}

export default function AccountSection() {
  return (
    <div className="section">
      <div className="section-title">
        <h2
          style={{
            fontSize: "17px",
            color: "var(--text-dark)",
            fontWeight: 400,
            letterSpacing: "1px",
            margin: "0 0 20px",
          }}
        >
          마음 전하실 곳
        </h2>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "var(--text-medium)",
          lineHeight: "1.9",
          textAlign: "center",
          margin: "0 0 24px",
        }}
      >
        참석이 어려우신 분들을 위해
        <br />
        계좌번호를 기재하였습니다.
        <br />
        너그러운 마음으로 양해 부탁드립니다.
      </p>

      <div style={{ padding: "0 var(--account-margin-lr, 1.1rem)" }}>
        <AccountGroup
          title="신랑측 계좌번호"
          accounts={WEDDING.groom.accounts}
        />
        <AccountGroup
          title="신부측 계좌번호"
          accounts={WEDDING.bride.accounts}
        />
      </div>
    </div>
  );
}
