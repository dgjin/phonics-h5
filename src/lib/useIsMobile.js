import { useState, useEffect } from 'react';

/* 是否为移动端 / 窄屏（≤760px，与 #app 最大宽度一致）。
 * 用于在手机访问时启用 iOS 风格底部标签栏布局。 */
const QUERY = '(max-width: 760px)';

export function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    setMobile(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return mobile;
}
