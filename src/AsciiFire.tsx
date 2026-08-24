// Animated ASCII "wall of fire" rendered from the studio's letters
// (t h e f o u r d e u c e s). Adapted from an Originkit component into a
// plain Vite/React component: fills its parent, fixed fire config, and the
// density ramp is replaced by the studio name so the flames are spelled out.

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type FireParticle = {
  kind: "ember" | "spark";
  glyph: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  heat: number;
  life: number;
  maxLife: number;
};

type FireConfig = {
  intensity: number;
  wind: number;
  decay: number;
  turbulence: number;
  thickness: number;
  embers: boolean;
  sparks: boolean;
  pulse: boolean;
};

const FONT_SIZE = 12;
const FPS = 30;

// Cold → hot ramp built from the studio name (leading space = no fire).
const FIRE_CHARS = " thefourdeuces";

const PALETTE = [
  "#411205",
  "#7c2105",
  "#b93608",
  "#e85b0c",
  "#ff8b18",
  "#ffc247",
  "#fff1aa",
];
const SPARK_COLOR = "#ff3030";

const CONFIG: FireConfig = {
  intensity: 100,
  wind: 10,
  decay: 13,
  turbulence: 30,
  thickness: 1,
  embers: true,
  sparks: true,
  pulse: false,
};

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum);

const seedFuel = (
  heat: Float32Array,
  columns: number,
  rows: number,
  config: FireConfig,
  elapsedSeconds: number,
): void => {
  const pulseMultiplier = config.pulse
    ? 0.88 + Math.sin(elapsedSeconds * 2.2) * 0.12
    : 1;
  const fuelRows = clamp(Math.round(config.thickness), 1, Math.max(1, rows - 1));
  const baseHeat = clamp(config.intensity / 100, 0.05, 1) * pulseMultiplier;

  for (let rowOffset = 0; rowOffset < fuelRows; rowOffset += 1) {
    const row = rows - 1 - rowOffset;
    const rowStrength = 1 - rowOffset / Math.max(fuelRows * 2, 1);
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const flicker = 0.58 + Math.random() * 0.42;
      heat[index] = clamp(baseHeat * rowStrength * flicker, 0, 1);
    }
  }
};

const propagateFire = (
  heat: Float32Array,
  nextHeat: Float32Array,
  columns: number,
  rows: number,
  config: FireConfig,
): void => {
  nextHeat.fill(0);
  const windOffset = config.wind / 50;
  const turbulence = config.turbulence / 100;
  const cooling = config.decay / 1000;

  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const randomDrift = (Math.random() - 0.5) * (1.5 + turbulence * 5);
      const sourceColumn = clamp(
        Math.round(column - windOffset + randomDrift),
        0,
        columns - 1,
      );
      const rowBelow = (row + 1) * columns;
      const rowTwoBelow = Math.min(row + 2, rows - 1) * columns;
      const sideDirection = Math.random() < 0.5 ? -1 : 1;
      const side =
        rowBelow + clamp(sourceColumn + sideDirection, 0, columns - 1);
      const center = rowBelow + sourceColumn;
      const deep = rowTwoBelow + sourceColumn;
      let carriedHeat =
        heat[center] * 0.58 + heat[side] * 0.16 + heat[deep] * 0.26;
      const randomCooling =
        cooling * (0.2 + Math.random() * (1.3 + turbulence * 2));
      if (Math.random() < turbulence * 0.08) {
        carriedHeat *= 0.45 + Math.random() * 0.35;
      }
      nextHeat[row * columns + column] = clamp(
        carriedHeat - randomCooling,
        0,
        1,
      );
    }
  }

  const fuelStart = Math.max(0, rows - Math.round(config.thickness));
  nextHeat.set(heat.subarray(fuelStart * columns), fuelStart * columns);
};

const updateParticles = (
  particles: FireParticle[],
  columns: number,
  rows: number,
  config: FireConfig,
): FireParticle[] => {
  const updated = particles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.velocityX + config.wind / 500,
      y: particle.y + particle.velocityY,
      velocityX:
        particle.velocityX + (Math.random() - 0.5) * (config.turbulence / 300),
      heat: particle.heat * (particle.kind === "spark" ? 0.985 : 0.94),
      life: particle.life - 1,
    }))
    .filter(
      (p) => p.life > 0 && p.y >= 0 && p.x >= 0 && p.x < columns,
    );

  const spawnParticle = (isSpark: boolean): void => {
    const sourceColumn = Math.floor(Math.random() * columns);
    const life = isSpark ? 20 + Math.random() * 24 : 22 + Math.random() * 28;
    updated.push({
      kind: isSpark ? "spark" : "ember",
      glyph: isSpark ? (Math.random() < 0.5 ? "'" : "|") : ".",
      x: sourceColumn + (Math.random() - 0.5) * 2,
      y: rows - Math.max(2, config.thickness),
      velocityX: (Math.random() - 0.5) * (isSpark ? 0.45 : 0.16),
      velocityY: isSpark
        ? -(0.8 + Math.random() * 0.8)
        : -(0.16 + Math.random() * 0.24),
      heat: isSpark ? 1.2 : 0.76,
      life,
      maxLife: life,
    });
  };

  if (config.embers && Math.random() < 0.2 * 2.4) spawnParticle(false);
  if (config.sparks && Math.random() < 0.07 * 2.4) spawnParticle(true);

  return updated.slice(-Math.max(40, Math.round(columns * 1.5)));
};

const escapeHtml = (character: string): string => {
  if (character === "&") return "&amp;";
  if (character === "<") return "&lt;";
  if (character === ">") return "&gt;";
  return character;
};

const renderFire = (
  element: HTMLPreElement,
  heat: Float32Array,
  particles: FireParticle[],
  columns: number,
  rows: number,
): void => {
  const displayHeat = new Float32Array(heat);
  const particleGlyphs = new Map<number, { color: string; glyph: string }>();

  for (const particle of particles) {
    const column = clamp(Math.round(particle.x), 0, columns - 1);
    const row = clamp(Math.round(particle.y), 0, rows - 1);
    const fade = particle.life / particle.maxLife;
    const index = row * columns + column;
    displayHeat[index] = Math.max(displayHeat[index], particle.heat * fade);
    if (particle.kind === "spark" || !particleGlyphs.has(index)) {
      particleGlyphs.set(index, {
        color:
          particle.kind === "spark"
            ? SPARK_COLOR
            : PALETTE[Math.max(0, PALETTE.length - 3)],
        glyph: particle.glyph,
      });
    }
  }

  const lines: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    let line = "";
    let activeColor = "";
    let run = "";
    const flushRun = (): void => {
      if (!run) return;
      line += activeColor
        ? `<span style="color:${activeColor}">${run}</span>`
        : run;
      run = "";
    };

    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const value = displayHeat[index];
      const particleGlyph = particleGlyphs.get(index);
      const characterIndex = clamp(
        Math.floor(value * (FIRE_CHARS.length - 1)),
        0,
        FIRE_CHARS.length - 1,
      );
      const paletteIndex = clamp(
        Math.floor(Math.pow(value, 0.72) * (PALETTE.length - 1)),
        0,
        PALETTE.length - 1,
      );
      const color =
        particleGlyph?.color ?? (value < 0.025 ? "" : PALETTE[paletteIndex]);
      const character =
        particleGlyph?.glyph ??
        (value < 0.025 ? " " : FIRE_CHARS[characterIndex]);

      if (color !== activeColor) {
        flushRun();
        activeColor = color;
      }
      run += escapeHtml(character);
    }
    flushRun();
    lines.push(line);
  }
  element.innerHTML = lines.join("\n");
};

export default function AsciiFire({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const output = outputRef.current;
    if (!container || !output) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const measurementContext = document
      .createElement("canvas")
      .getContext("2d");
    let animationFrameId = 0;
    let isActive = true;
    let columns = 1;
    let rows = 1;
    let heat = new Float32Array(1);
    let nextHeat = new Float32Array(1);
    let particles: FireParticle[] = [];
    let previousFrameTime = 0;
    let startTime = performance.now();

    const handleResize = (): void => {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(bounds.width, container.clientWidth) || 600;
      const height = Math.max(bounds.height, container.clientHeight) || 600;
      const fontFamily =
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      const lineHeight = FONT_SIZE * 1.05;
      if (measurementContext) {
        measurementContext.font = `${FONT_SIZE}px ${fontFamily}`;
      }
      const characterWidth =
        measurementContext?.measureText("M").width || FONT_SIZE * 0.6;
      const nextColumns = Math.max(1, Math.floor(width / characterWidth));
      const nextRows = Math.max(1, Math.floor(height / lineHeight));
      if (nextColumns === columns && nextRows === rows) return;

      columns = nextColumns;
      rows = nextRows;
      heat = new Float32Array(columns * rows);
      nextHeat = new Float32Array(columns * rows);
      particles = [];

      for (let step = 0; step < Math.min(rows, 48); step += 1) {
        seedFuel(heat, columns, rows, CONFIG, step / FPS);
        propagateFire(heat, nextHeat, columns, rows, CONFIG);
        [heat, nextHeat] = [nextHeat, heat];
      }
      renderFire(output, heat, particles, columns, rows);
    };

    const drawFrame = (timestamp: number): void => {
      const frameInterval = 1000 / FPS;
      const elapsedSinceFrame = timestamp - previousFrameTime;
      if (elapsedSinceFrame >= frameInterval || previousFrameTime === 0) {
        const elapsedSeconds = (timestamp - startTime) / 1000;
        seedFuel(heat, columns, rows, CONFIG, elapsedSeconds);
        propagateFire(heat, nextHeat, columns, rows, CONFIG);
        [heat, nextHeat] = [nextHeat, heat];
        particles = updateParticles(particles, columns, rows, CONFIG);
        renderFire(output, heat, particles, columns, rows);
        previousFrameTime = timestamp - (elapsedSinceFrame % frameInterval);
      }
      if (reducedMotionQuery.matches) return;
      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    const handleMotionPreferenceChange = (): void => {
      window.cancelAnimationFrame(animationFrameId);
      previousFrameTime = 0;
      startTime = performance.now();
      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();
    void document.fonts.ready.then(() => {
      if (isActive) handleResize();
    });
    animationFrameId = window.requestAnimationFrame(drawFrame);
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}
    >
      <pre
        ref={outputRef}
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          userSelect: "none",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: FONT_SIZE,
          fontVariantLigatures: "none",
          lineHeight: 1.05,
          whiteSpace: "pre",
          textRendering: "optimizeSpeed",
        }}
      />
    </div>
  );
}
