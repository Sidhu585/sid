import { ImageResponse } from "next/og";
import { SEED_BIRTHDAY } from "@/lib/config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { name, course, college, birthdayDay } = SEED_BIRTHDAY;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#170F1C",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            left: "50%",
            transform: "translateX(-50%)",
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(242,184,75,0.35) 0%, rgba(242,184,75,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,143,163,0.28) 0%, rgba(255,143,163,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(183,156,237,0.24) 0%, rgba(183,156,237,0) 70%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#F2B84B" }}>
          {`${birthdayDay} SEPTEMBER`}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 128,
            color: "#FBF3EC",
            fontWeight: 600,
            marginTop: 12,
            fontStyle: "italic",
          }}
        >
          {name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#C9B9C2", marginTop: 8 }}>
          {`${course} • ${college}`}
        </div>
      </div>
    ),
    { ...size }
  );
}
