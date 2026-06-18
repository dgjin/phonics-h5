/*
 * 云端账号配置（Supabase）
 * 在 https://supabase.com 创建免费项目后，到 Project Settings → API 复制：
 *   - Project URL  填入 SUPABASE_URL
 *   - anon public key 填入 SUPABASE_ANON_KEY
 * 并在 SQL Editor 执行 README 中的建表 SQL。
 * 留空则应用以「本地访客」模式运行（进度仅存本设备，仍可离线使用）。
 */
export const CONFIG = {
  SUPABASE_URL: 'https://gdrruugeqttiyufqqaug.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcnJ1dWdlcXR0aXl1ZnFxYXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjUyMzgsImV4cCI6MjA4NjI0MTIzOH0.BzKuhMdGycaBJvXO1dmYByvnw1lKdQ-mkG-mQPjgvTA',
};

/*
 * 教材图片资源基址。
 * 默认 '/word-img'：图片已随应用打包在 public/word-img/，由站点(Pages/Vercel)同源托管，
 * 免费、走同一 CDN、不依赖第三方、也无需 R2。
 * 也可改成自有 R2/CDN 公开域名，或用构建环境变量 VITE_ASSETS_BASE 覆盖。
 * 设为空字符串 '' 则回退使用词表里原始的第三方热链地址。
 */
export const ASSETS_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ASSETS_BASE) || '/word-img';
