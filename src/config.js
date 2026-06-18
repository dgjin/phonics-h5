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
 * 教材图片资源基址。把图片迁移到自有 Cloudflare R2 后，
 * 填入 R2 的公开访问域名（指向存放图片的目录），例如：
 *   'https://assets.你的域名.com/word-img'  或  R2 提供的 *.r2.dev 公共地址。
 * 留空时：仍使用词表里原始的第三方图片地址（热链，存在失效/版权风险）。
 * 也可在构建环境变量里设置 VITE_ASSETS_BASE 覆盖（无需改代码）。
 */
export const ASSETS_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ASSETS_BASE) || '';
