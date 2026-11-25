import React, { useEffect, useMemo, useState } from "react";
import { fontFamily } from "./font";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";


// Short pages = fast reading = higher retention.
const SWITCH_EVERY_MS = 700;

const Page: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 1180 }}>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 86,
          lineHeight: 1.08,
          color: "white",
          textAlign: "center",
          whiteSpace: "pre-wrap",
          maxWidth: 880,
          WebkitTextStroke: "12px #000",
          paintOrder: "stroke fill",
          textShadow: "0 6px 0 rgba(0,0,0,0.55)",
          letterSpacing: -0.5,
        }}
      >
        {page.tokens.map((tok, i) => {
          const shown = tok.fromMs <= nowMs;
          const sinceMs = nowMs - tok.fromMs;
          const s = interpolate(sinceMs, [0, 90, 160], [0.75, 1.07, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <span
              key={`${tok.fromMs}-${i}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: shown ? 1 : 0,
                transform: `scale(${shown ? s : 0.75})`,
              }}
            >
              {tok.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ src: string; endMs: number }> = ({ src, endMs }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("captions"));
  const { fps } = useVideoConfig();

  useEffect(() => {
    fetch(staticFile(src))
      .then((r) => r.json())
      .then((d: Caption[]) => {
        setCaptions(d);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [src, handle, continueRender, cancelRender]);

  const pages = useMemo(
    () =>
      captions
        ? createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: SWITCH_EVERY_MS }).pages
        : [],
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const until = next ? next.startMs : Math.min(endMs, page.startMs + page.durationMs + 500);
        const dur = Math.round((until / 1000) * fps) - from;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Page page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
