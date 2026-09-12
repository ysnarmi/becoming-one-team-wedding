import Hero from "@/components/Hero";
import InvitationText from "@/components/InvitationText";
import CalendarSection from "@/components/CalendarSection";
import GallerySection from "@/components/GallerySection";
import DirectionsSection from "@/components/DirectionsSection";
import AccountSection from "@/components/AccountSection";
import MusicToggle from "@/components/MusicToggle";
import ShareSection from "@/components/ShareSection";
import { WEDDING } from "@/lib/config";

export default function Home() {
  const { date, groom, bride, venue } = WEDDING;

  return (
    <div
      style={{
        background: "#4a3f3f",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="invitation-wrap">
        <MusicToggle />
        <Hero />
        <InvitationText />
        <CalendarSection />
        <GallerySection />
        <DirectionsSection />
        <AccountSection />
        <ShareSection />

        <footer
          style={{
            background: "var(--cream-dark)",
            padding: "32px 24px",
            textAlign: "center",
            borderTop: "1px solid var(--cream-darker)",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "14px",
              color: "var(--text-light)",
              letterSpacing: "2px",
              margin: "0 0 6px",
            }}
          >
            {groom.fullName} ♥ {bride.fullName}
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-light)",
              letterSpacing: "1px",
              margin: 0,
            }}
          >
            {date.year}.{String(date.month).padStart(2, "0")}.
            {String(date.day).padStart(2, "0")} — {venue.name}
          </p>
        </footer>
      </div>
    </div>
  );
}
