/* 录音（跟读）：基于 MediaRecorder，确定性、跨平台稳定。
 * 录完得到一段可回放的音频 URL，让孩子和范读对比——不依赖语音识别。 */

export function recorderSupported() {
  return (
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined'
  );
}

/* 开始录音，返回控制器 { stop()->Promise<url>, cancel() }。
 * stop() 结束录音并 resolve 一个 objectURL（用完请 revokeObjectURL）。 */
export async function startRecorder() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  let mr;
  try {
    mr = new MediaRecorder(stream);
  } catch (e) {
    stream.getTracks().forEach((t) => t.stop());
    throw e;
  }
  const chunks = [];
  mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  mr.start();

  const cleanup = () => stream.getTracks().forEach((t) => t.stop());

  return {
    stop: () => new Promise((resolve) => {
      mr.onstop = () => {
        cleanup();
        const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        resolve(URL.createObjectURL(blob));
      };
      try { mr.stop(); } catch (e) { cleanup(); resolve(null); }
    }),
    cancel: () => { try { mr.stop(); } catch (e) {} cleanup(); },
  };
}
