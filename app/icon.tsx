import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#170F1C",
          borderRadius: 14,
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontStyle: "italic", color: "#F2B84B" }}>S</div>
      </div>
    ),
    { ...size }
  );
}
