import { WEDDING } from "@/lib/config";

export default function InvitationText() {
  const { invitation, groom, bride } = WEDDING;

  return (
    <div className="section" style={{ textAlign: "center" }}>
      <div className="section-title">
        <span className="section-subtitle">INVITATION</span>
        <h2 className="section-heading">{invitation.title}</h2>
      </div>

      <p
        style={{
          fontSize: "14px",
          lineHeight: "2.2",
          color: "var(--text-medium)",
          whiteSpace: "pre-wrap",
          margin: "0 0 36px",
        }}
      >
        {invitation.message}
      </p>

      {/* Family members */}
      <div
        style={{
          fontSize: "13px",
          lineHeight: "2.4",
          color: "var(--text-medium)",
          borderTop: "1px solid var(--cream-darker)",
          paddingTop: "28px",
        }}
      >
        <div style={{ marginBottom: "6px" }}>
          <span style={{ color: "var(--text-light)" }}>
            {groom.father} · {groom.mother}
          </span>
          <span style={{ color: "var(--text-light)", fontSize: "11px", margin: "0 6px" }}>의 아들</span>
          <strong style={{ color: "var(--text-dark)", fontWeight: "600" }}>{groom.name}</strong>
        </div>
        <div>
          <span style={{ color: "var(--text-light)" }}>
            {bride.father} · {bride.mother}
          </span>
          <span style={{ color: "var(--text-light)", fontSize: "11px", margin: "0 6px" }}>의 딸</span>
          <strong style={{ color: "var(--text-dark)", fontWeight: "600" }}>{bride.name}</strong>
        </div>
      </div>
    </div>
  );
}
