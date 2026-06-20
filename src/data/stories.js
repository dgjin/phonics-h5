/* 分级绘本：中国小学生熟悉的经典读物（伊索寓言 / 经典童话）英文简写版。
 * 每条：{ id, title, cn, emoji, level, color, lines:[{en, cn, e}] }
 * 句子简短、配 emoji 场景 + 中文，适合低/中年级朗读。 */
export const STORIES = [
  {
    id: 'turnip', title: 'The Big Turnip', cn: '拔萝卜', emoji: '🥬', level: 'L1', color: 'green',
    cover: '/stories/turnip-cover.png',
    lines: [
      { en: 'Grandpa plants a turnip.', cn: '老爷爷种了一个萝卜。', e: '👴', img: '/stories/turnip-1.png' },
      { en: 'The turnip grows very big.', cn: '萝卜长得非常大。', e: '🥬', img: '/stories/turnip-2.png' },
      { en: 'Grandpa pulls it, but it stays.', cn: '老爷爷拔，可是拔不动。', e: '💪', img: '/stories/turnip-3.png' },
      { en: 'Grandma helps Grandpa.', cn: '老奶奶来帮忙。', e: '👵', img: '/stories/turnip-4.png' },
      { en: 'The girl helps too.', cn: '小女孩也来帮忙。', e: '👧', img: '/stories/turnip-5.png' },
      { en: 'The dog helps too.', cn: '小狗也来帮忙。', e: '🐶', img: '/stories/turnip-6.png' },
      { en: 'Out comes the big turnip!', cn: '大萝卜终于拔出来啦！', e: '🎉' },
    ],
  },
  {
    id: 'crow', title: 'The Thirsty Crow', cn: '乌鸦喝水', emoji: '🐦', level: 'L2', color: 'amber',
    cover: '/stories/crow-cover.png',
    lines: [
      { en: 'A crow is very thirsty.', cn: '一只乌鸦很口渴。', e: '🐦', img: '/stories/crow-1.png' },
      { en: 'It finds a pitcher of water.', cn: '它找到一壶水。', e: '🏺', img: '/stories/crow-2.png' },
      { en: 'But the water is too low.', cn: '可是水太浅了。', e: '💧', img: '/stories/crow-3.png' },
      { en: 'The crow drops in small stones.', cn: '乌鸦丢进一些小石头。', e: '🪨', img: '/stories/crow-4.png' },
      { en: 'The water comes up and up.', cn: '水慢慢升上来。', e: '⬆️' },
      { en: 'Now the crow can drink!', cn: '现在乌鸦喝到水啦！', e: '😋', img: '/stories/crow-6.png' },
    ],
  },
  {
    id: 'tortoise', title: 'The Tortoise and the Hare', cn: '龟兔赛跑', emoji: '🐢', level: 'L2', color: 'teal',
    cover: '/stories/tortoise-cover.png',
    lines: [
      { en: 'A hare laughs at a tortoise.', cn: '兔子嘲笑乌龟跑得慢。', e: '🐰', img: '/stories/tortoise-1.png' },
      { en: '"Let us have a race!"', cn: '“我们来比赛吧！”', e: '🏁' },
      { en: 'The hare runs very fast.', cn: '兔子跑得飞快。', e: '💨' },
      { en: 'The hare sleeps under a tree.', cn: '兔子在树下睡着了。', e: '😴', img: '/stories/tortoise-4.png' },
      { en: 'The tortoise walks and walks.', cn: '乌龟一直慢慢地走。', e: '��', img: '/stories/tortoise-5.png' },
      { en: 'The tortoise wins the race!', cn: '乌龟赢得了比赛！', e: '🏆' },
      { en: 'Slow and steady wins.', cn: '坚持不懈就能赢。', e: '⭐' },
    ],
  },
  {
    id: 'lion', title: 'The Lion and the Mouse', cn: '狮子和老鼠', emoji: '🦁', level: 'L2', color: 'coral',
    cover: '/stories/lion-cover.png',
    lines: [
      { en: 'A little mouse wakes a lion.', cn: '一只小老鼠吵醒了狮子。', e: '🐭' },
      { en: 'The lion is angry.', cn: '狮子很生气。', e: '😠' },
      { en: '"Please let me go!"', cn: '“请放了我吧！”', e: '🙏' },
      { en: 'The lion lets the mouse go.', cn: '狮子放走了老鼠。', e: '🦁' },
      { en: 'One day the lion is trapped.', cn: '有一天狮子被网困住了。', e: '🕸️' },
      { en: 'The mouse bites the net.', cn: '老鼠咬断了网。', e: '✂️' },
      { en: 'Now they are good friends.', cn: '他们成了好朋友。', e: '❤️' },
    ],
  },
  {
    id: 'pigs', title: 'The Three Little Pigs', cn: '三只小猪', emoji: '🐷', level: 'L2', color: 'pink',
    cover: '/stories/pigs-cover.png',
    lines: [
      { en: 'Three little pigs build houses.', cn: '三只小猪盖房子。', e: '🐷' },
      { en: 'The first house is straw.', cn: '第一座是稻草房。', e: '🌾' },
      { en: 'The second house is sticks.', cn: '第二座是木头房。', e: '🪵' },
      { en: 'The third house is bricks.', cn: '第三座是砖头房。', e: '🧱' },
      { en: 'A wolf blows the houses down.', cn: '大灰狼吹倒了房子。', e: '🐺' },
      { en: 'But the brick house stays strong.', cn: '只有砖房很结实。', e: '💪' },
      { en: 'The pigs are safe and happy.', cn: '小猪们安全又开心。', e: '🎉' },
    ],
  },
  {
    id: 'fox', title: 'The Fox and the Grapes', cn: '狐狸和葡萄', emoji: '🦊', level: 'L2', color: 'purple',
    cover: '/stories/fox-cover.png',
    lines: [
      { en: 'A fox sees sweet grapes.', cn: '狐狸看见甜甜的葡萄。', e: '🦊' },
      { en: 'The grapes are very high.', cn: '葡萄挂得很高。', e: '🍇' },
      { en: 'The fox jumps again and again.', cn: '狐狸一次又一次地跳。', e: '🦊' },
      { en: 'But it cannot reach them.', cn: '可是怎么也够不到。', e: '😣' },
      { en: '"These grapes are sour!"', cn: '“这些葡萄是酸的！”', e: '😤' },
      { en: 'Then the fox walks away.', cn: '然后狐狸走开了。', e: '🚶' },
    ],
  },
  {
    id: 'duckling', title: 'The Ugly Duckling', cn: '丑小鸭', emoji: '🦆', level: 'L2', color: 'teal',
    cover: '/stories/duckling-cover.png',
    lines: [
      { en: 'A grey duckling is born.', cn: '一只灰色的小鸭出生了。', e: '🐣' },
      { en: 'The others say he is ugly.', cn: '大家都说他很丑。', e: '😢' },
      { en: 'The duckling is sad and alone.', cn: '小鸭又伤心又孤单。', e: '🦆' },
      { en: 'Winter comes and goes.', cn: '冬天来了又走了。', e: '❄️' },
      { en: 'He grows up by the lake.', cn: '他在湖边长大了。', e: '🌊' },
      { en: 'He is a beautiful swan!', cn: '他变成了美丽的天鹅！', e: '🦢' },
    ],
  },
  {
    id: 'my-family', title: 'My Family', cn: '我的家人', emoji: '👨‍👩‍👧‍👦', level: 'L1', color: 'amber',
    cover: '/stories/family-cover.png',
    lines: [
      { en: 'This is my dad.', cn: '这是我的爸爸。', e: '👨' },
      { en: 'This is my mum.', cn: '这是我的妈妈。', e: '👩' },
      { en: 'This is me.', cn: '这是我。', e: '🧒' },
      { en: 'I love my family.', cn: '我爱我的家人。', e: '❤️' },
    ],
  },
];

export function getStory(id) {
  return STORIES.find((s) => s.id === id) || null;
}
