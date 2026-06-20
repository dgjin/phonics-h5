/* 分级句型 / 对话：A=孩子，B=对方。简单句型，复用常见词。
 * 每条：{ id, title, cn, emoji, level, color, lines:[{speaker:'A'|'B', en, cn, e}] } */
export const DIALOGUES = [
  {
    id: 'greetings', title: 'Greetings', cn: '打招呼', emoji: '👋', level: 'L1', color: 'teal',
    lines: [
      { speaker: 'A', en: 'Hello!', cn: '你好！', e: '👋' },
      { speaker: 'B', en: 'Hi! Nice to meet you.', cn: '嗨！很高兴见到你。', e: '😊' },
      { speaker: 'A', en: 'How are you?', cn: '你好吗？', e: '🙂' },
      { speaker: 'B', en: 'I am fine. Thank you.', cn: '我很好，谢谢。', e: '👍' },
    ],
  },
  {
    id: 'family', title: 'My Family', cn: '我的家人', emoji: '👨‍👩‍👧‍👦', level: 'L1', color: 'coral',
    lines: [
      { speaker: 'A', en: 'Who is he?', cn: '他是谁？', e: '👦' },
      { speaker: 'B', en: 'He is my dad.', cn: '他是我爸爸。', e: '👨' },
      { speaker: 'A', en: 'Who is she?', cn: '她是谁？', e: '👧' },
      { speaker: 'B', en: 'She is my mum.', cn: '她是我妈妈。', e: '👩' },
    ],
  },
  {
    id: 'classroom', title: 'In the Classroom', cn: '在教室', emoji: '🏫', level: 'L2', color: 'green',
    lines: [
      { speaker: 'A', en: 'What is this?', cn: '这是什么？', e: '❓' },
      { speaker: 'B', en: 'It is a book.', cn: '这是一本书。', e: '📖' },
      { speaker: 'A', en: 'What is that?', cn: '那是什么？', e: '❓' },
      { speaker: 'B', en: 'It is a pencil.', cn: '那是一支铅笔。', e: '✏️' },
    ],
  },
  {
    id: 'colours', title: 'Colours', cn: '说颜色', emoji: '🎨', level: 'L2', color: 'pink',
    lines: [
      { speaker: 'A', en: 'What colour is it?', cn: '它是什么颜色？', e: '🎨' },
      { speaker: 'B', en: 'It is red.', cn: '它是红色。', e: '🔴' },
      { speaker: 'A', en: 'I like blue.', cn: '我喜欢蓝色。', e: '🔵' },
      { speaker: 'B', en: 'Me too!', cn: '我也是！', e: '😄' },
    ],
  },
];

export function getDialogue(id) {
  return DIALOGUES.find((d) => d.id === id) || null;
}
