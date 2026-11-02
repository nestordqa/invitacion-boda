import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14, background: "#f4f1e8", color: "#4f6b4a", fontSize: 30, fontFamily: "serif", fontStyle: "italic" }}>
        G&V
      </div>
    ),
    size,
  );
}
