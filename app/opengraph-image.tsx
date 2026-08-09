import { ImageResponse } from "next/og";

// Open Graph / social share card. Dark cyberpunk aesthetic matching the site.
// No performance claims — name + role only.
export const alt = "Benny Gingihashvili — SOC Analyst & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#020508";
const CYAN = "#00e5c8";
const ORANGE = "#ff8a3d";
const TEXT = "#e8eef2";
const TEXT3 = "#6b7280";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: BG,
          backgroundImage:
            "linear-gradient(rgba(0,229,200,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,200,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 12,
            background: CYAN,
          }}
        />

        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 26,
            letterSpacing: 4,
            color: CYAN,
            marginBottom: 24,
          }}
        >
          INITIALIZE SYSTEM //
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 1,
          }}
        >
          <span style={{ color: TEXT }}>BENNY</span>
          <span style={{ color: CYAN }}>GINGIHASHVILI</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "monospace",
            fontSize: 38,
            marginTop: 32,
          }}
        >
          <span style={{ color: CYAN }}>SOC ANALYST</span>
          <span style={{ color: TEXT3, margin: "0 16px" }}>·</span>
          <span style={{ color: ORANGE }}>FULL-STACK DEV</span>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 24,
            color: TEXT3,
            marginTop: 56,
          }}
        >
          &gt;_ bennygingi.tech
        </div>
      </div>
    ),
    { ...size }
  );
}
