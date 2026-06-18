import { ASSETS_BASE } from '../config.js';

/* 教材图片原始（第三方）前缀；迁移到自有 R2 后由 ASSETS_BASE 接管 */
export const ORIGIN_IMG_PREFIX = 'https://ywld-1315558954.51jiaoxi.com/yy-static/word/img/';

/* 解析图片地址：
 * - 未配置 ASSETS_BASE：返回原始（第三方）地址，保持现状；
 * - 已配置：把任意图片地址映射到自有基址下的同名文件（按最后一段文件名）。 */
export function assetUrl(img) {
  if (!img) return img;
  if (!ASSETS_BASE) return img;
  const file = img.slice(img.lastIndexOf('/') + 1);
  return ASSETS_BASE.replace(/\/+$/, '') + '/' + file;
}
