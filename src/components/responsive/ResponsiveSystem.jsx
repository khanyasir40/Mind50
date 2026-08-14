import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import './responsive.css';

const ViewportContext = createContext({
  width: typeof window !== 'undefined' ? window.innerWidth : 390,
  height: typeof window !== 'undefined' ? window.innerHeight : 844,
  isMobile: true,
  isPortrait: true,
  devicePixelRatio: 1,
});

export const ViewportProvider = ({ children }) => {
  const [viewport, setViewport] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 390;
    const h = typeof window !== 'undefined' ? window.innerHeight : 844;
    return {
      width: w,
      height: h,
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isPortrait: h >= w,
      isLandscape: w > h,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth || document.documentElement.clientWidth;
      const h = window.innerHeight || document.documentElement.clientHeight;
      setViewport({
        width: w,
        height: h,
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isPortrait: h >= w,
        isLandscape: w > h,
        devicePixelRatio: window.devicePixelRatio || 1,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => useContext(ViewportContext);

/**
 * SafeAreaContainer - Inset wrapper for mobile status/nav bars
 */
export const SafeAreaContainer = ({ children, style = {}, className = '' }) => (
  <div
    className={`safe-area-container ${className}`}
    style={{ width: '100%', minWidth: 0, boxSizing: 'border-box', ...style }}
  >
    {children}
  </div>
);

/**
 * ResponsivePage - Main view layout container
 */
export const ResponsivePage = ({ children, style = {}, maxWidth = '1200px' }) => (
  <div
    style={{
      width: '100%',
      maxWidth,
      margin: '0 auto',
      padding: 'var(--space-md) var(--space-sm) 125px',
      boxSizing: 'border-box',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-md)',
      ...style,
    }}
    className="animate-fade-in"
  >
    {children}
  </div>
);

/**
 * ResponsiveGameViewport - Observes container dimensions for game rendering
 */
export const ResponsiveGameViewport = ({ children, headerHeight = 70, controlsHeight = 80 }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 360, height: 500 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.floor(width),
          height: Math.floor(height),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const availableHeight = Math.max(260, dimensions.height - headerHeight - controlsHeight);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {typeof children === 'function'
        ? children({
            viewportWidth: dimensions.width,
            viewportHeight: availableHeight,
            fullHeight: dimensions.height,
          })
        : children}
    </div>
  );
};

/**
 * ResponsiveBoard - Dynamic grid dimension calculator fitting inside GameViewport
 */
export const ResponsiveBoard = ({
  rows = 3,
  cols = 3,
  containerWidth = 360,
  containerHeight = 400,
  maxTileSize = 100,
  minTileSize = 32,
  padding = 16,
  renderTile,
  style = {},
}) => {
  const availW = Math.max(100, containerWidth - padding * 2);
  const availH = Math.max(100, containerHeight - padding * 2);

  // Dynamic Tile Size calculation
  const rawTileWidth = availW / cols;
  const rawTileHeight = availH / rows;
  const calculatedTile = Math.floor(Math.min(rawTileWidth, rawTileHeight));
  const tileSize = Math.max(minTileSize, Math.min(maxTileSize, calculatedTile));
  const gap = Math.max(4, Math.floor(tileSize * 0.1));

  const totalGridWidth = cols * tileSize + (cols - 1) * gap;
  const totalGridHeight = rows * tileSize + (rows - 1) * gap;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
        gap: `${gap}px`,
        width: `${totalGridWidth}px`,
        height: `${totalGridHeight}px`,
        margin: '0 auto',
        justifyContent: 'center',
        alignContent: 'center',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => {
        const r = Math.floor(index / cols);
        const c = index % cols;
        return renderTile({ index, row: r, col: c, tileSize, gap });
      })}
    </div>
  );
};

/**
 * ResponsiveTile - Scalable grid cell button
 */
export const ResponsiveTile = ({
  tileSize,
  children,
  onClick,
  active = false,
  color = 'var(--bg-surface)',
  activeColor = 'var(--accent-primary)',
  style = {},
}) => (
  <button
    onClick={onClick}
    style={{
      width: `${tileSize}px`,
      height: `${tileSize}px`,
      borderRadius: `${Math.max(6, Math.floor(tileSize * 0.2))}px`,
      background: active ? activeColor : color,
      border: '1px solid var(--border-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${Math.max(12, Math.floor(tileSize * 0.38))}px`,
      fontWeight: '800',
      color: active ? '#FFF' : 'var(--text-primary)',
      cursor: 'pointer',
      userSelect: 'none',
      touchAction: 'manipulation',
      transition: 'transform 0.1s ease, background 0.15s ease',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </button>
);
