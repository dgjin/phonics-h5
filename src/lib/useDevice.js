import { useState, useEffect } from 'react';

/* 设备与方向检测
 * - mobile:  宽度 < 768px（手机）
 * - tablet:  768px ≤ 宽度 < 1024px（iPad / 安卓平板）
 * - desktop: 宽度 ≥ 1024px
 * orientation: portrait（竖屏）/ landscape（横屏）
 */
function getInfo() {
  if (typeof window === 'undefined') {
    return { type: 'mobile', orientation: 'portrait', isMobile: true, isTablet: false, isDesktop: false, isPad: false, isLandscape: false };
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const type = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  const landscape = width > height;
  return {
    type,
    orientation: landscape ? 'landscape' : 'portrait',
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    isPad: type === 'tablet',
    isLandscape: landscape,
  };
}

export function useDevice() {
  const [info, setInfo] = useState(() => getInfo());

  useEffect(() => {
    const onChange = () => setInfo(getInfo());
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
    };
  }, []);

  return info;
}

/* 保留旧 hook 签名，内部阈值扩展为 1024，让平板也启用移动布局 */
export function useIsMobile() {
  const { isMobile, isTablet } = useDevice();
  return isMobile || isTablet;
}
