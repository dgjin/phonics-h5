/* 教材同步 · 外研版《新交际英语》(一年级起点) 一年级上册
 *
 * ⚠️ 示例数据：下列单元划分与词表为「占位示例」（颜色 / 数字为各版一上通用词），
 *    需以课本背面《单词表》为准替换、补全。每个词字段：
 *    { w: 英文, cn: 中文, e: emoji(可选) }
 *    无合适 emoji 时可省略 e，UI 会显示首字母方块兜底。
 */
export const TEXTBOOK = {
  id: 'wyjxjj-1a',
  name: '外研版·新交际英语',
  volume: '一年级上册',
  sample: true, // 标记为示例数据；替换为真实词表后改为 false
  units: [
    {
      id: 'colours', title: 'Colours 颜色', words: [
        { w: 'red', cn: '红色', e: '🔴' },
        { w: 'yellow', cn: '黄色', e: '🟡' },
        { w: 'blue', cn: '蓝色', e: '🔵' },
        { w: 'green', cn: '绿色', e: '🟢' },
        { w: 'black', cn: '黑色', e: '⚫' },
        { w: 'white', cn: '白色', e: '⚪' },
      ],
    },
    {
      id: 'numbers', title: 'Numbers 数字', words: [
        { w: 'one', cn: '一', e: '1️⃣' },
        { w: 'two', cn: '二', e: '2️⃣' },
        { w: 'three', cn: '三', e: '3️⃣' },
        { w: 'four', cn: '四', e: '4️⃣' },
        { w: 'five', cn: '五', e: '5️⃣' },
      ],
    },
  ],
};

export function textbookUnit(unitId) {
  return TEXTBOOK.units.find((u) => u.id === unitId) || null;
}

/* 把教材单元词转成背单词/听写通用的词对象 */
export function textbookWords(unitId) {
  const u = textbookUnit(unitId);
  if (!u) return [];
  return u.words.map((x) => ({ w: x.w, e: x.e || '', s: '', cn: x.cn || '', level: TEXTBOOK.volume }));
}
