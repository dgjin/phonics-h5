/* 分级绘本：中国小学生熟悉的经典读物（伊索寓言 / 经典童话）英文简写版。
 * 每条：{ id, title, cn, emoji, level, color, cover, lines:[{en, cn, e, img}] }
 * 插画为 Cloudflare Workers AI 生成的水彩绘本图，存 public/stories/。无图时 emoji 兜底。 */
export const STORIES = [
  {
    id: 'turnip', title: 'The Big Turnip', cn: '拔萝卜', emoji: '🥬', level: 'L1', color: 'green',
    cover: '/stories/turnip-7.webp',
    lines: [
      { en: 'Grandpa plants a turnip.', cn: '老爷爷种了一个萝卜。', e: '👴', img: '/stories/turnip-1.webp' },
      { en: 'The turnip grows very big.', cn: '萝卜长得非常大。', e: '🥬', img: '/stories/turnip-2.webp' },
      { en: 'Grandpa pulls it, but it stays.', cn: '老爷爷拔，可是拔不动。', e: '💪', img: '/stories/turnip-3.webp' },
      { en: 'Grandma helps Grandpa.', cn: '老奶奶来帮忙。', e: '👵', img: '/stories/turnip-4.webp' },
      { en: 'The girl helps too.', cn: '小女孩也来帮忙。', e: '👧', img: '/stories/turnip-5.webp' },
      { en: 'The dog helps too.', cn: '小狗也来帮忙。', e: '🐶', img: '/stories/turnip-6.webp' },
      { en: 'Out comes the big turnip!', cn: '大萝卜终于拔出来啦！', e: '🎉', img: '/stories/turnip-7.webp' },
    ],
  },
  {
    id: 'crow', title: 'The Thirsty Crow', cn: '乌鸦喝水', emoji: '🐦', level: 'L2', color: 'amber',
    cover: '/stories/crow-2.webp',
    lines: [
      { en: 'A crow is very thirsty.', cn: '一只乌鸦很口渴。', e: '🐦', img: '/stories/crow-1.webp' },
      { en: 'It finds a pitcher of water.', cn: '它找到一壶水。', e: '🏺', img: '/stories/crow-2.webp' },
      { en: 'But the water is too low.', cn: '可是水太浅了。', e: '💧', img: '/stories/crow-3.webp' },
      { en: 'The crow drops in small stones.', cn: '乌鸦丢进一些小石头。', e: '🪨', img: '/stories/crow-4.webp' },
      { en: 'The water comes up and up.', cn: '水慢慢升上来。', e: '⬆️', img: '/stories/crow-5.webp' },
      { en: 'Now the crow can drink!', cn: '现在乌鸦喝到水啦！', e: '😋', img: '/stories/crow-6.webp' },
    ],
  },
  {
    id: 'tortoise', title: 'The Tortoise and the Hare', cn: '龟兔赛跑', emoji: '🐢', level: 'L2', color: 'teal',
    cover: '/stories/tortoise-1.webp',
    lines: [
      { en: 'A hare laughs at a tortoise.', cn: '兔子嘲笑乌龟跑得慢。', e: '🐰', img: '/stories/tortoise-1.webp' },
      { en: '"Let us have a race!"', cn: '“我们来比赛吧！”', e: '🏁', img: '/stories/tortoise-2.webp' },
      { en: 'The hare runs very fast.', cn: '兔子跑得飞快。', e: '💨', img: '/stories/tortoise-3.webp' },
      { en: 'The hare sleeps under a tree.', cn: '兔子在树下睡着了。', e: '😴', img: '/stories/tortoise-4.webp' },
      { en: 'The tortoise walks and walks.', cn: '乌龟一直慢慢地走。', e: '🐢', img: '/stories/tortoise-5.webp' },
      { en: 'The tortoise wins the race!', cn: '乌龟赢得了比赛！', e: '🏆', img: '/stories/tortoise-6.webp' },
      { en: 'Slow and steady wins.', cn: '坚持不懈就能赢。', e: '⭐', img: '/stories/tortoise-7.webp' },
    ],
  },
  {
    id: 'lion', title: 'The Lion and the Mouse', cn: '狮子和老鼠', emoji: '🦁', level: 'L2', color: 'coral',
    cover: '/stories/lion-1.webp',
    lines: [
      { en: 'A little mouse wakes a lion.', cn: '一只小老鼠吵醒了狮子。', e: '🐭', img: '/stories/lion-1.webp' },
      { en: 'The lion is angry.', cn: '狮子很生气。', e: '😠', img: '/stories/lion-2.webp' },
      { en: '"Please let me go!"', cn: '“请放了我吧！”', e: '🙏', img: '/stories/lion-3.webp' },
      { en: 'The lion lets the mouse go.', cn: '狮子放走了老鼠。', e: '🦁', img: '/stories/lion-4.webp' },
      { en: 'One day the lion is trapped.', cn: '有一天狮子被网困住了。', e: '🕸️', img: '/stories/lion-5.webp' },
      { en: 'The mouse bites the net.', cn: '老鼠咬断了网。', e: '✂️', img: '/stories/lion-6.webp' },
      { en: 'Now they are good friends.', cn: '他们成了好朋友。', e: '❤️', img: '/stories/lion-7.webp' },
    ],
  },
  {
    id: 'pigs', title: 'The Three Little Pigs', cn: '三只小猪', emoji: '🐷', level: 'L2', color: 'pink',
    cover: '/stories/pigs-1.webp',
    lines: [
      { en: 'Three little pigs build houses.', cn: '三只小猪盖房子。', e: '🐷', img: '/stories/pigs-1.webp' },
      { en: 'The first house is straw.', cn: '第一座是稻草房。', e: '🌾', img: '/stories/pigs-2.webp' },
      { en: 'The second house is sticks.', cn: '第二座是木头房。', e: '🪵', img: '/stories/pigs-3.webp' },
      { en: 'The third house is bricks.', cn: '第三座是砖头房。', e: '🧱', img: '/stories/pigs-4.webp' },
      { en: 'A wolf blows the houses down.', cn: '大灰狼吹倒了房子。', e: '🐺', img: '/stories/pigs-5.webp' },
      { en: 'But the brick house stays strong.', cn: '只有砖房很结实。', e: '💪', img: '/stories/pigs-6.webp' },
      { en: 'The pigs are safe and happy.', cn: '小猪们安全又开心。', e: '🎉', img: '/stories/pigs-7.webp' },
    ],
  },
  {
    id: 'fox', title: 'The Fox and the Grapes', cn: '狐狸和葡萄', emoji: '🦊', level: 'L2', color: 'purple',
    cover: '/stories/fox-1.webp',
    lines: [
      { en: 'A fox sees sweet grapes.', cn: '狐狸看见甜甜的葡萄。', e: '🦊', img: '/stories/fox-1.webp' },
      { en: 'The grapes are very high.', cn: '葡萄挂得很高。', e: '🍇', img: '/stories/fox-2.webp' },
      { en: 'The fox jumps again and again.', cn: '狐狸一次又一次地跳。', e: '🦊', img: '/stories/fox-3.webp' },
      { en: 'But it cannot reach them.', cn: '可是怎么也够不到。', e: '😣', img: '/stories/fox-4.webp' },
      { en: '"These grapes are sour!"', cn: '“这些葡萄是酸的！”', e: '😤', img: '/stories/fox-5.webp' },
      { en: 'Then the fox walks away.', cn: '然后狐狸走开了。', e: '🚶', img: '/stories/fox-6.webp' },
    ],
  },
  {
    id: 'duckling', title: 'The Ugly Duckling', cn: '丑小鸭', emoji: '🦆', level: 'L2', color: 'teal',
    cover: '/stories/duckling-6.webp',
    lines: [
      { en: 'A grey duckling is born.', cn: '一只灰色的小鸭出生了。', e: '🐣', img: '/stories/duckling-1.webp' },
      { en: 'The others say he is ugly.', cn: '大家都说他很丑。', e: '😢', img: '/stories/duckling-2.webp' },
      { en: 'The duckling is sad and alone.', cn: '小鸭又伤心又孤单。', e: '🦆', img: '/stories/duckling-3.webp' },
      { en: 'Winter comes and goes.', cn: '冬天来了又走了。', e: '❄️', img: '/stories/duckling-4.webp' },
      { en: 'He grows up by the lake.', cn: '他在湖边长大了。', e: '🌊', img: '/stories/duckling-5.webp' },
      { en: 'He is a beautiful swan!', cn: '他变成了美丽的天鹅！', e: '🦢', img: '/stories/duckling-6.webp' },
    ],
  },
  {
    id: 'my-family', title: 'My Family', cn: '我的家人', emoji: '👨‍👩‍👧‍👦', level: 'L1', color: 'amber',
    cover: '/stories/family-4.webp',
    lines: [
      { en: 'This is my dad.', cn: '这是我的爸爸。', e: '👨', img: '/stories/family-1.webp' },
      { en: 'This is my mum.', cn: '这是我的妈妈。', e: '👩', img: '/stories/family-2.webp' },
      { en: 'This is me.', cn: '这是我。', e: '🧒', img: '/stories/family-3.webp' },
      { en: 'I love my family.', cn: '我爱我的家人。', e: '❤️', img: '/stories/family-4.webp' },
    ],
  },
];

export function getStory(id) {
  return STORIES.find((s) => s.id === id) || null;
}
