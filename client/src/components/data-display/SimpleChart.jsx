import React, { useState } from 'react';

export const SimpleAreaChart = ({
  data = [],
  height = 240,
  valuePrefix = '',
  valueSuffix = '',
  color = '#C6A66B',
  secondaryColor = '#1B2432',
  showSecondary = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Robust data normalization: ensure every item has valid finite numeric values
  const safeData = Array.isArray(data)
    ? data
        .map(item => {
          if (!item || typeof item !== 'object') return null;
          const val = Number(item.value ?? item.revenue ?? item.amount ?? 0);
          const secVal = Number(item.secondaryValue ?? item.target ?? 0);
          const label = String(item.label ?? item.month ?? item.day ?? item.name ?? '');
          return {
            label,
            value: Number.isFinite(val) ? val : 0,
            secondaryValue: Number.isFinite(secVal) ? secVal : 0,
          };
        })
        .filter(Boolean)
    : [];

  if (safeData.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-charcoal-muted dark:text-gray-400 select-none"
        style={{ height }}
      >
        No chart metrics recorded.
      </div>
    );
  }

  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 600;
  const chartHeight = Math.max(Number(height) || 240, 100);

  const rawMax = Math.max(
    ...safeData.map(d => Math.max(d.value, showSecondary ? d.secondaryValue || 0 : 0)),
    0
  );
  // Avoid division by zero or infinite scaling
  const maxVal = rawMax > 0 ? rawMax * 1.15 : 100;

  const count = safeData.length;
  const getX = index => {
    if (count <= 1) return chartWidth / 2;
    const x = paddingX + (index / (count - 1)) * (chartWidth - paddingX * 2);
    return Number.isFinite(x) ? Math.round(x * 100) / 100 : paddingX;
  };

  const getY = val => {
    const numericVal = Number.isFinite(Number(val)) ? Number(val) : 0;
    const availableHeight = chartHeight - paddingY * 2;
    const y = chartHeight - paddingY - (numericVal / maxVal) * availableHeight;
    return Number.isFinite(y) ? Math.round(y * 100) / 100 : chartHeight - paddingY;
  };

  // Build points arrays with verification that every coordinate is a finite number
  const pointList = safeData.map((d, i) => ({
    x: getX(i),
    y: getY(d.value),
  }));

  const points = pointList.map(p => `${p.x},${p.y}`).join(' ');
  const startX = pointList[0].x;
  const endX = pointList[pointList.length - 1].x;
  const baseY = chartHeight - paddingY;
  const areaPoints = `${startX},${baseY} ${points} ${endX},${baseY}`;

  const secondaryPoints = showSecondary
    ? safeData.map((d, i) => `${getX(i)},${getY(d.secondaryValue)}`).join(' ')
    : '';

  return (
    <div className="w-full overflow-hidden select-none relative">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((pct, idx) => {
          const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
          const safeY = Number.isFinite(y) ? Math.round(y * 100) / 100 : 0;
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={safeY}
                x2={chartWidth - paddingX}
                y2={safeY}
                stroke="currentColor"
                strokeDasharray="4 4"
                className="text-border dark:text-border-dark opacity-60"
              />
              <text
                x={paddingX - 10}
                y={safeY + 3}
                textAnchor="end"
                className="text-[10px] fill-charcoal-muted dark:fill-gray-400 font-sans"
              >
                {valuePrefix}
                {maxVal >= 1000 ? `${Math.round((maxVal * pct) / 1000)}k` : Math.round(maxVal * pct)}
              </text>
            </g>
          );
        })}

        {/* Secondary line if enabled */}
        {showSecondary && secondaryPoints && (
          <path
            d={`M ${secondaryPoints}`}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-70"
          />
        )}

        {/* Primary Area Fill */}
        {areaPoints && <polygon points={areaPoints} fill="url(#goldGradient)" />}

        {/* Primary Line */}
        {points && (
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        )}

        {/* Data points & X Labels */}
        {safeData.map((d, i) => {
          const x = getX(i);
          const y = getY(d.value);
          const isHovered = hoveredIndex === i;

          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={x}
                  y1={paddingY}
                  x2={x}
                  y2={chartHeight - paddingY}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              {/* Point circle */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#FFFFFF' : color}
                stroke={color}
                strokeWidth={isHovered ? 3 : 2}
                className="transition-all duration-200"
              />

              {/* X Axis Label */}
              <text
                x={x}
                y={chartHeight - 8}
                textAnchor="middle"
                className="text-[11px] fill-charcoal-muted dark:fill-gray-400 font-medium font-sans"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && safeData[hoveredIndex] && (
        <div
          className="absolute top-2 pointer-events-none transform -translate-x-1/2 bg-primary/95 dark:bg-black/90 backdrop-blur-md text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-accent/40 transition-all duration-150"
          style={{
            left: `${(getX(hoveredIndex) / chartWidth) * 100}%`,
          }}
        >
          <p className="font-semibold text-accent">{safeData[hoveredIndex].label}</p>
          <p className="font-mono">
            {valuePrefix}
            {safeData[hoveredIndex].value.toLocaleString()}
            {valueSuffix}
          </p>
        </div>
      )}
    </div>
  );
};

export const SimpleBarChart = ({ data = [], height = 200, valueSuffix = '%' }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const safeData = Array.isArray(data)
    ? data
        .map(item => {
          if (!item || typeof item !== 'object') return null;
          const val = Number(item.value ?? item.rate ?? item.occupancy ?? 0);
          const label = String(item.label ?? item.day ?? item.name ?? '');
          return {
            label,
            value: Number.isFinite(val) ? val : 0,
          };
        })
        .filter(Boolean)
    : [];

  if (safeData.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-charcoal-muted dark:text-gray-400 select-none"
        style={{ height }}
      >
        No occupancy benchmarks recorded.
      </div>
    );
  }

  const rawMax = Math.max(...safeData.map(d => d.value), 0);
  const maxVal = rawMax > 0 ? rawMax : 100;

  return (
    <div className="w-full flex items-end justify-between gap-3 pt-6 pb-2" style={{ height }}>
      {safeData.map((item, idx) => {
        const heightPct = Math.min(Math.max((item.value / maxVal) * 100, 0), 100);
        const isHovered = hoveredIdx === idx;

        return (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Value indicator tooltip */}
            <div
              className={`text-[10px] font-mono text-accent font-semibold mb-1 transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {item.value}
              {valueSuffix}
            </div>

            {/* Bar */}
            <div className="w-full max-w-[28px] bg-ivory dark:bg-primary-800 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5">
              <div
                className={`w-full rounded-t-md transition-all duration-500 ${
                  isHovered ? 'bg-accent' : 'bg-accent/80 hover:bg-accent'
                }`}
                style={{ height: `${heightPct}%` }}
              />
            </div>

            {/* Label */}
            <span className="text-[11px] font-medium text-charcoal-muted dark:text-gray-400 mt-2">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleAreaChart;


