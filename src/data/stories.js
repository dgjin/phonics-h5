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
  {
    id: 'my-cat', title: 'My Cat', cn: '我的小猫', emoji: '🐱', level: 'L1', color: 'coral',
    lines: [
      { en: 'I have a cat.', cn: '我有一只猫。', e: '🐱' },
      { en: 'The cat is soft.', cn: '这只猫软软的。', e: '🧶' },
      { en: 'It can run fast.', cn: '它跑得很快。', e: '💨' },
      { en: 'I love my cat.', cn: '我爱我的小猫。', e: '❤️' },
    ],
  },
  {
    id: 'numbers', title: 'One Two Three', cn: '数一数', emoji: '🔢', level: 'L1', color: 'amber',
    lines: [
      { en: 'I see one sun.', cn: '我看见一个太阳。', e: '☀️' },
      { en: 'I see two birds.', cn: '我看见两只鸟。', e: '🐦' },
      { en: 'I see three apples.', cn: '我看见三个苹果。', e: '🍎' },
      { en: 'I like numbers.', cn: '我喜欢数字。', e: '🔢' },
    ],
  },
  {
    id: 'fruits', title: 'Fruits', cn: '好吃的水果', emoji: '🍓', level: 'L1', color: 'pink',
    lines: [
      { en: 'The apple is red.', cn: '苹果是红色的。', e: '🍎' },
      { en: 'The banana is yellow.', cn: '香蕉是黄色的。', e: '🍌' },
      { en: 'The grape is purple.', cn: '葡萄是紫色的。', e: '🍇' },
      { en: 'I like fruit.', cn: '我喜欢水果。', e: '🍓' },
    ],
  },
  {
    id: 'my-room', title: 'My Room', cn: '我的房间', emoji: '🏠', level: 'L2', color: 'teal',
    lines: [
      { en: 'This is my room.', cn: '这是我的房间。', e: '🏠' },
      { en: 'I have a bed and a desk.', cn: '我有一张床和一张书桌。', e: '🛏️' },
      { en: 'My toys are in the box.', cn: '我的玩具在箱子里。', e: '🧸' },
      { en: 'I clean my room every day.', cn: '我每天打扫房间。', e: '🧹' },
    ],
  },
  {
    id: 'on-farm', title: 'On the Farm', cn: '开心农场', emoji: '🚜', level: 'L2', color: 'green',
    lines: [
      { en: 'The cow says moo.', cn: '奶牛哞哞叫。', e: '🐄' },
      { en: 'The pig says oink.', cn: '小猪哼哼叫。', e: '🐷' },
      { en: 'The duck says quack.', cn: '小鸭嘎嘎叫。', e: '🦆' },
      { en: 'I like the farm.', cn: '我喜欢农场。', e: '🚜' },
    ],
  },
  {
    id: 'weather', title: 'Weather', cn: '天气变变变', emoji: '🌈', level: 'L2', color: 'blue',
    lines: [
      { en: 'It is sunny today.', cn: '今天晴天。', e: '☀️' },
      { en: 'It is rainy today.', cn: '今天下雨。', e: '🌧️' },
      { en: 'It is windy today.', cn: '今天刮风。', e: '💨' },
      { en: 'I see a rainbow.', cn: '我看见一道彩虹。', e: '🌈' },
    ],
  },
];

export function getStory(id) {
  return STORIES.find((s) => s.id === id) || null;
}
