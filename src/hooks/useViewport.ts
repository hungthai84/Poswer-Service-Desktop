import { useEffect, useState } from 'react';

export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface ViewportInfo {
  width: number;
  height: number;
  deviceType: DeviceBreakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  isShort: boolean;
}

function readViewport(): ViewportInfo {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const height = typeof window !== 'undefined' ? window.innerHeight : 800;

  const deviceType: DeviceBreakpoint =
    width < 640
      ? 'mobile'
      : width < 1024
      ? 'tablet'
      : width < 1536
      ? 'desktop'
      : 'wide';

  return {
    width,
    height,
    deviceType,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024 && width < 1536,
    isWide: width >= 1536,
    isShort: height < 560,
  };
}

export function useViewport(): ViewportInfo {
  const [viewport, setViewport] = useState<ViewportInfo>(() => readViewport());

  useEffect(() => {
    let rafId = 0;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setViewport(readViewport());
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
}
