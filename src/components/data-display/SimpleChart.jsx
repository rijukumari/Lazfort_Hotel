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

  if (!data || data.length === 0) return null;

  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 600;
  const chartHeight = height;

  const maxVal = Math.max(
    ...data.map(d => Math.max(d.value, showSecondary ? d.secondaryValue || 0 : 0))
  ) * 1.15;

  const getX = index => {
    return paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = val => {
    return chartHeight - paddingY - (val / (maxVal || 1)) * (chartHeight - paddingY * 2);
  };

  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPoints = `${getX(0)},${chartHeight - paddingY} ${points} ${getX(
    data.length - 1
  )},${chartHeight - paddingY}`;

  const secondaryPoints = showSecondary
    ? data.map((d, i) => `${getX(i)},${getY(d.secondaryValue || 0)}`).join(' ')
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
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="currentColor"
                strokeDasharray="4 4"
                className="text-border dark:text-border-dark opacity-60"
              />
              <text
                x={paddingX - 10}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-charcoal-muted dark:fill-gray-400 font-sans"
              >
                {valuePrefix}
                {Math.round((maxVal * pct) / 1000)}k
              </text>
            </g>
          );
        })}

        {/* Secondary line if enabled */}
        {showSecondary && (
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
        <polygon points={areaPoints} fill="url(#goldGradient)" />

        {/* Primary Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points & X Labels */}
        {data.map((d, i) => {
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
      {hoveredIndex !== null && (
        <div
          className="absolute top-2 pointer-events-none transform -translate-x-1/2 bg-primary/95 dark:bg-black/90 backdrop-blur-md text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-accent/40 transition-all duration-150"
          style={{
            left: `${(getX(hoveredIndex) / chartWidth) * 100}%`,
          }}
        >
          <p className="font-semibold text-accent">{data[hoveredIndex].label}</p>
          <p className="font-mono">
            {valuePrefix}
            {data[hoveredIndex].value.toLocaleString()}
            {valueSuffix}
          </p>
        </div>
      )}
    </div>
  );
};

export const SimpleBarChart = ({ data = [], height = 200, valueSuffix = '%' }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const maxVal = Math.max(...data.map(d => d.value), 100);

  return (
    <div className="w-full flex items-end justify-between gap-3 pt-6 pb-2" style={{ height }}>
      {data.map((item, idx) => {
        const heightPct = (item.value / maxVal) * 100;
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

