import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "src/assets/fonts");

async function loadFonts() {
  const [serif, sans] = await Promise.all([
    readFile(join(fontDir, "CormorantGaramond-Medium.ttf")),
    readFile(join(fontDir, "Inter-Medium.ttf")),
  ]);
  return [
    { name: "Cormorant", data: serif, weight: 500 as const, style: "normal" as const },
    { name: "Inter", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

// Satori can't decode WebP/AVIF, so ask Unsplash for a JPEG and inline it; fall back to a plain backdrop.
async function loadPhoto(url: string) {
  try {
    const res = await fetch(`${url}?w=1200&h=630&fit=crop&q=70&fm=jpg`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

interface OgInput {
  eyebrow: string;
  title: string;
  subtitle?: string;
  facts?: string[];
  photo?: string;
}

export async function renderOg({ eyebrow, title, subtitle, facts, photo }: OgInput) {
  const [fonts, background] = await Promise.all([loadFonts(), photo ? loadPhoto(photo) : Promise.resolve(null)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundImage: "linear-gradient(135deg, #0b1f3a 0%, #13294b 60%, #1c355e 100%)",
          fontFamily: "Inter",
          color: "#faf7f2",
        }}
      >
        {background && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={background} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: background
              ? "linear-gradient(90deg, rgba(11,31,58,0.94) 0%, rgba(11,31,58,0.78) 50%, rgba(11,31,58,0.25) 100%)"
              : "radial-gradient(circle at 85% 20%, rgba(201,169,110,0.25), transparent 55%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 1200, height: 630 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#c9a96e",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: 5,
                paddingBottom: 12,
              }}
            >
              <div style={{ width: 8, height: 20, background: "#0b1f3a", borderRadius: 2 }} />
              <div style={{ width: 8, height: 32, background: "#0b1f3a", borderRadius: 2 }} />
              <div style={{ width: 8, height: 26, background: "#0b1f3a", borderRadius: 2 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Cormorant", fontSize: 34, lineHeight: 1 }}>Skyline</span>
              <span style={{ fontSize: 13, letterSpacing: 6, color: "#c9a96e", marginTop: 4 }}>ESTATES</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#e3cfa5", fontSize: 20, letterSpacing: 4 }}>
              <div style={{ width: 48, height: 1, background: "#c9a96e" }} />
              {eyebrow.toUpperCase()}
            </div>
            <div style={{ fontFamily: "Cormorant", fontSize: title.length > 40 ? 64 : 76, lineHeight: 1.05, marginTop: 20 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 26, color: "rgba(250,247,242,0.78)", marginTop: 20 }}>{subtitle}</div>}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 12 }}>
              {(facts ?? []).map((fact) => (
                <div
                  key={fact}
                  style={{
                    display: "flex",
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "1px solid rgba(201,169,110,0.5)",
                    fontSize: 20,
                    color: "#faf7f2",
                  }}
                >
                  {fact}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 18, color: "rgba(250,247,242,0.6)" }}>Luxury real estate · Dubai</span>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}
