import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}, ${profile.title}. Vue 3, TypeScript, design systems. Remote from ${profile.location}.`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/dmitry.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          background: "#0b0a08",
          color: "#f3ede4",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <img
          src={photoSrc}
          alt=""
          width={504}
          height={630}
          style={{
            width: 504,
            height: 630,
            objectFit: "cover",
            objectPosition: "38% 20%",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 72px",
            width: 696,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#8eafc4",
              fontSize: 22,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 64,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.02,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#c8bdb0",
              fontSize: 28,
              lineHeight: 1.35,
            }}
          >
            Vue 3 · TypeScript · Design Systems · Real-Time Web Apps
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              color: "#8eafc4",
              fontSize: 22,
            }}
          >
            {profile.location} · {profile.workMode}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
