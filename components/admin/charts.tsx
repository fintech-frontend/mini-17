"use client";

import { useEffect, useRef, useState } from "react";

/* Grafiklar: bitta seriya — brend to'q ko'k; toifalar — tasdiqlangan palitraning
   1–3 slotlari (ko'k, to'q sariq, yashil-moviy), tartib bilan, takrorlanmasdan. */
export const SERIES = ["#2a78d6", "#eb6834", "#1baf7a"];
const PRIMARY = "#012F91";
const GRID = "#eef0f3";
const AXIS_TEXT = "#6b7280";

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

// Chiroyli o'q bo'linmalari (0, 25k, 50k ...)
function niceMax(max: number) {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

const compact = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(v % 1_000_000 ? 1 : 0)} млн` : v >= 1000 ? `${Math.round(v / 1000)} тыс` : `${Math.round(v)}`;

function Tooltip({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full -mt-2 bg-gray-900 text-white text-xs rounded-md px-2.5 py-1.5 shadow-lg whitespace-nowrap"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}

// ---------- Chiziqli grafik (vaqt bo'yicha) ----------
export function LineChart({
  points,
  format,
  height = 260,
}: {
  points: { label: string; value: number }[];
  format: (v: number) => string;
  height?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 16, right: 16, bottom: 28, left: 56 };
  const w = Math.max(width - pad.left - pad.right, 10);
  const h = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(...points.map((p) => p.value), 0));
  const x = (i: number) => pad.left + (points.length <= 1 ? w / 2 : (i / (points.length - 1)) * w);
  const y = (v: number) => pad.top + h - (v / max) * h;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(w / 70))));

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.min(points.length - 1, Math.max(0, Math.round(rel * (points.length - 1)))));
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Выручка по периодам">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + w} y1={y(t)} y2={y(t)} stroke={GRID} />
              <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={AXIS_TEXT}>
                {compact(t)}
              </text>
            </g>
          ))}
          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill={AXIS_TEXT}>
                {p.label}
              </text>
            ) : null
          )}
          <path d={`${path} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={PRIMARY} opacity="0.06" />
          <path d={path} fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {hover !== null && (
            <>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + h} stroke="#9ca3af" strokeDasharray="3 3" />
              <circle cx={x(hover)} cy={y(points[hover].value)} r="5" fill={PRIMARY} stroke="#fff" strokeWidth="2" />
            </>
          )}
          <rect
            x={pad.left}
            y={pad.top}
            width={w}
            height={h}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          />
        </svg>
      )}
      {hover !== null && width > 0 && (
        <Tooltip x={x(hover)} y={y(points[hover].value)}>
          <span className="text-white/70">{points[hover].label}: </span>
          <span className="font-semibold tabular-nums">{format(points[hover].value)}</span>
        </Tooltip>
      )}
    </div>
  );
}

// ---------- Gorizontal ustunli grafik (kategoriyalar) ----------
export function BarList({
  items,
  format,
}: {
  items: { label: string; value: number }[];
  format: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={item.label}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          className="grid grid-cols-[minmax(0,140px)_1fr_auto] items-center gap-3 text-sm"
        >
          <span className="truncate text-gray-700" title={item.label}>
            {item.label}
          </span>
          <span className="h-5 bg-gray-50 rounded overflow-hidden">
            <span
              className="block h-full rounded-r transition-opacity"
              style={{
                width: `${Math.max((item.value / max) * 100, item.value > 0 ? 1.5 : 0)}%`,
                background: PRIMARY,
                opacity: hover === null || hover === i ? 1 : 0.45,
              }}
            />
          </span>
          <span className="tabular-nums text-gray-900 font-medium text-right">{format(item.value)}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------- Donut (to'lov usullari ulushi) ----------
export function Donut({
  items,
  format,
  centerLabel,
}: {
  items: { label: string; value: number }[];
  format: (v: number) => string;
  centerLabel: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = items.reduce((s, i) => s + i.value, 0);
  const size = 180;
  const r = 70;
  const stroke = 26;
  const c = 2 * Math.PI * r;
  const GAP = total > 0 && items.filter((i) => i.value > 0).length > 1 ? 2 : 0; // segmentlar orasida 2px oq bo'shliq
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Доля способов оплаты">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GRID} strokeWidth={stroke} />
          {total > 0 &&
            items.map((item, i) => {
              const len = (item.value / total) * c;
              const seg = (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={SERIES[i]}
                  strokeWidth={hover === i ? stroke + 4 : stroke}
                  strokeDasharray={`${Math.max(len - GAP, 0)} ${c}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{ transition: "stroke-width .15s" }}
                />
              );
              offset += len;
              return seg;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hover !== null && total > 0 ? (
            <>
              <span className="text-xl font-bold tabular-nums text-gray-900">
                {Math.round((items[hover].value / total) * 100)}%
              </span>
              <span className="text-[11px] text-gray-500 max-w-24 leading-tight">{items[hover].label}</span>
            </>
          ) : (
            <>
              <span className="text-xl font-bold tabular-nums text-gray-900">{format(total)}</span>
              <span className="text-[11px] text-gray-500">{centerLabel}</span>
            </>
          )}
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {items.map((item, i) => (
          <li
            key={item.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="flex items-center gap-2.5 text-sm"
          >
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: SERIES[i] }} aria-hidden />
            <span className="flex-1 text-gray-700">{item.label}</span>
            <span className="tabular-nums text-gray-900 font-medium whitespace-nowrap">{format(item.value)}</span>
            <span className="tabular-nums text-gray-500 w-10 text-right">
              {total ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
