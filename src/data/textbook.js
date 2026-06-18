/* 教材同步 · 外研版《新交际英语》(一年级起点) 一年级上册
 * 词表来源：51jiaoxi.com 单词跟读页（按单元）；中文取常用义、emoji 仅在贴切时给出，
 * 无 emoji 的词（多为功能词/动词）UI 以首字母方块兜底。
 * 每个词字段：{ w: 英文, cn: 中文, e?: emoji }
 */
export const TEXTBOOK = {
  id: 'wyjxjj-1a',
  name: '外研版·新交际英语',
  volume: '一年级上册',
  sample: false,
  units: [
    {
      id: 'u1', title: 'Unit 1 Hello 问候', words: [
        { w: 'hello', cn: '你好', e: '👋' },
        { w: 'nice', cn: '好的', e: '😊' },
        { w: 'meet', cn: '见面', e: '🤝' },
        { w: 'you', cn: '你' },
        { w: "let's", cn: '让我们' },
        { w: 'play', cn: '玩', e: '🧸' },
        { w: 'I', cn: '我' },
        { w: 'am', cn: '是' },
        { w: 'too', cn: '也' },
        { w: 'photo', cn: '照片', e: '📷' },
        { w: 'how', cn: '怎样' },
        { w: 'say', cn: '说', e: '🗣️' },
      ],
    },
    {
      id: 'u2', title: 'Unit 2 Numbers 数字', words: [
        { w: 'one', cn: '一', e: '1️⃣' },
        { w: 'two', cn: '二', e: '2️⃣' },
        { w: 'three', cn: '三', e: '3️⃣' },
        { w: 'four', cn: '四', e: '4️⃣' },
        { w: 'five', cn: '五', e: '5️⃣' },
        { w: 'six', cn: '六', e: '6️⃣' },
        { w: 'seven', cn: '七', e: '7️⃣' },
        { w: 'balloon', cn: '气球', e: '🎈' },
        { w: 'thank', cn: '谢谢', e: '🙏' },
        { w: 'please', cn: '请', e: '🥺' },
        { w: 'number', cn: '数字', e: '🔢' },
      ],
    },
    {
      id: 'u3', title: 'Unit 3 My Family 我的家庭', words: [
        { w: 'my', cn: '我的' },
        { w: 'family', cn: '家庭', e: '👨‍👩‍👧‍👦' },
        { w: 'mum', cn: '妈妈', e: '👩' },
        { w: 'dad', cn: '爸爸', e: '👨' },
        { w: 'grandpa', cn: '爷爷', e: '👴' },
        { w: 'grandma', cn: '奶奶', e: '👵' },
        { w: 'sister', cn: '姐妹', e: '👧' },
        { w: 'brother', cn: '兄弟', e: '👦' },
        { w: 'and', cn: '和' },
        { w: 'this', cn: '这个' },
        { w: 'is', cn: '是' },
        { w: 'love', cn: '爱', e: '❤️' },
        { w: 'me', cn: '我' },
      ],
    },
    {
      id: 'u4', title: 'Unit 4 Classroom 教室', words: [
        { w: 'what', cn: '什么' },
        { w: 'open', cn: '打开', e: '🔓' },
        { w: 'door', cn: '门', e: '🚪' },
        { w: 'classroom', cn: '教室', e: '🏫' },
        { w: 'blackboard', cn: '黑板' },
        { w: 'window', cn: '窗户', e: '🪟' },
        { w: 'desk', cn: '书桌' },
        { w: 'chair', cn: '椅子', e: '🪑' },
        { w: 'it', cn: '它' },
        { w: 'big', cn: '大的' },
        { w: 'that', cn: '那个' },
        { w: 'teacher', cn: '老师', e: '👩‍🏫' },
        { w: 'good job', cn: '干得好', e: '👍' },
        { w: 'a', cn: '一（个）' },
        { w: 'very', cn: '非常' },
        { w: 'old', cn: '旧的' },
        { w: 'school', cn: '学校', e: '🏫' },
        { w: 'look', cn: '看', e: '👀' },
      ],
    },
    {
      id: 'u5', title: 'Unit 5 School Things 学习用品', words: [
        { w: 'schoolbag', cn: '书包', e: '🎒' },
        { w: 'pencil case', cn: '笔袋', e: '🖊️' },
        { w: 'pencil', cn: '铅笔', e: '✏️' },
        { w: 'book', cn: '书', e: '📖' },
        { w: 'bye', cn: '再见', e: '👋' },
        { w: 'here you are', cn: '给你', e: '🤲' },
        { w: 'read', cn: '读', e: '📚' },
        { w: 'together', cn: '一起', e: '🤝' },
      ],
    },
    {
      id: 'u6', title: 'Unit 6 Colours 颜色', words: [
        { w: 'red', cn: '红色', e: '🔴' },
        { w: 'green', cn: '绿色', e: '🟢' },
        { w: 'blue', cn: '蓝色', e: '🔵' },
        { w: 'black', cn: '黑色', e: '⚫' },
        { w: 'white', cn: '白色', e: '⚪' },
        { w: 'yellow', cn: '黄色', e: '🟡' },
        { w: 'colour', cn: '颜色', e: '🎨' },
        { w: 'so', cn: '这么' },
        { w: 'many', cn: '许多' },
        { w: 'happy', cn: '快乐的', e: '😄' },
        { w: 'Chinese New Year', cn: '春节', e: '🧧' },
        { w: 'stop', cn: '停', e: '🛑' },
        { w: 'go', cn: '走', e: '🟢' },
        { w: 'slow', cn: '慢', e: '🐌' },
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
