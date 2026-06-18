/* 分级小故事：用简单句、复用常见词，配 emoji + 中文。
 * 每个故事：{ id, title, cn, emoji, level, color, lines:[{en, cn, e}] }
 * level: L1 最简单（3-4 句、每句 3-5 词），L2 稍长。 */
export const STORIES = [
  {
    id: 'pet-dog', title: 'My Pet Dog', cn: '我的小狗', emoji: '🐶', level: 'L1', color: 'teal',
    lines: [
      { en: 'I have a dog.', cn: '我有一只狗。', e: '🐶' },
      { en: 'The dog is big.', cn: '这只狗很大。', e: '🐕' },
      { en: 'It is my friend.', cn: '它是我的朋友。', e: '🤝' },
      { en: 'I love my dog.', cn: '我爱我的狗。', e: '❤️' },
    ],
  },
  {
    id: 'colours', title: 'Colours', cn: '五颜六色', emoji: '🎨', level: 'L1', color: 'pink',
    lines: [
      { en: 'The sky is blue.', cn: '天空是蓝色的。', e: '🔵' },
      { en: 'The tree is green.', cn: '树是绿色的。', e: '🌳' },
      { en: 'The sun is yellow.', cn: '太阳是黄色的。', e: '☀️' },
      { en: 'I like colours.', cn: '我喜欢颜色。', e: '🎨' },
    ],
  },
  {
    id: 'my-family', title: 'My Family', cn: '我的家', emoji: '👨‍👩‍👧‍👦', level: 'L1', color: 'coral',
    lines: [
      { en: 'This is my dad.', cn: '这是我的爸爸。', e: '👨' },
      { en: 'This is my mum.', cn: '这是我的妈妈。', e: '👩' },
      { en: 'This is me.', cn: '这是我。', e: '🧒' },
      { en: 'I love my family.', cn: '我爱我的家。', e: '👨‍👩‍👧‍👦' },
    ],
  },
  {
    id: 'at-school', title: 'At School', cn: '在学校', emoji: '🏫', level: 'L2', color: 'green',
    lines: [
      { en: 'I go to school.', cn: '我去上学。', e: '🏫' },
      { en: 'I have a book.', cn: '我有一本书。', e: '📖' },
      { en: 'I have a pencil.', cn: '我有一支铅笔。', e: '✏️' },
      { en: 'I read with my friend.', cn: '我和朋友一起读书。', e: '📚' },
    ],
  },
];

export function getStory(id) {
  return STORIES.find((s) => s.id === id) || null;
}
