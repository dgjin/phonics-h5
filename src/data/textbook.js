/* 教材同步 · 外研版《新交际英语》(一年级起点)
 * 包含：一上 / 一下 / 二上 / 二下 共4册
 * 词表来源：51jiaoxi.com 单词跟读页
 * 词字段：{ w: 英文, cn: 中文, e?: emoji, img?: 图片URL }
 */

const BOOK_1A = {
  id: 'wyjxjj-1a',
  name: '外研版·新交际英语',
  volume: '一年级上册',
  grade: '一年级',
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
        { w: 'family', cn: '家庭', e: '👨\u200d👩\u200d👧\u200d👦' },
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
        { w: 'teacher', cn: '老师', e: '👩\u200d🏫' },
        { w: 'good job', cn: '干得好', e: '��' },
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

const IMG = 'https://ywld-1315558954.51jiaoxi.com/yy-static/word/img/';

const BOOK_1B = {
  id: 'wyjxjj-1b',
  name: '外研版·新交际英语',
  volume: '一年级下册',
  grade: '一年级',
  sample: false,
  units: [
    {
      id: 'u1', title: 'Unit 1 Pets 宠物', words: [
        { w: 'pet', cn: '宠物', e: '🐾', img: IMG + '21bf9574-a62d-11ea-a25c-b42e99c756f3.jpg' },
        { w: 'bird', cn: '鸟', e: '🐦', img: IMG + '26b87fb2-e5e4-11eb-b17e-00163e135ac6.jpg' },
        { w: 'dog', cn: '狗', e: '🐶', img: IMG + 'c7b45a90-e5e3-11eb-9f6d-00163e135ac6.png' },
        { w: 'cat', cn: '猫', e: '🐱', img: IMG + 'b5370d0e-e5e3-11eb-9721-00163e135ac6.jpg' },
        { w: 'fish', cn: '鱼', e: '🐟', img: IMG + 'd3e6fb18-8464-11ea-8b9f-b42e9969d22a.jpg' },
        { w: 'rabbit', cn: '兔', e: '🐰', img: IMG + '4b4cec52-8529-11ea-ab05-b42e9969d22a.jpg' },
        { w: 'friend', cn: '朋友', e: '🤝', img: IMG + '9698ccba-8467-11ea-a7d3-b42e9969d22a.jpg' },
      ],
    },
    {
      id: 'u2', title: 'Unit 2 Animals 动物', words: [
        { w: 'animal', cn: '动物', e: '��', img: IMG + 'd23544f8-847d-11ea-af58-b42e9969d22a.jpg' },
        { w: 'they', cn: '它们', img: IMG + 'ae8504e4-a630-11ea-9192-b42e99c756f3.jpg' },
        { w: 'welcome', cn: '欢迎', e: '🎉', img: IMG + 'a12617da-a633-11ea-a98a-b42e99c756f3.jpg' },
        { w: 'zoo', cn: '动物园', e: '🦁', img: IMG + '245f750c-8464-11ea-b973-b42e9969d22a.jpg' },
        { w: 'tiger', cn: '老虎', e: '🐯', img: IMG + '2d54ad50-e5e4-11eb-9e17-00163e135ac6.jpg' },
        { w: 'lion', cn: '狮子', e: '🦁', img: IMG + '3336ab46-b53c-11ea-a999-b42e99c756f3.jpg' },
        { w: 'bear', cn: '熊', e: '🐻', img: IMG + '0b7186c2-e5e4-11eb-a226-00163e135ac6.jpg' },
        { w: 'monkey', cn: '猴', e: '🐒', img: IMG + '1e1e553e-e5e4-11eb-84f2-00163e135ac6.jpg' },
        { w: 'panda', cn: '大熊猫', e: '🐼', img: IMG + '332967b6-e5e4-11eb-be72-00163e135ac6.png' },
        { w: 'cute', cn: '可爱的', e: '🥰', img: IMG + '47f03136-f03c-11eb-8914-b42e99c756f3.jpg' },
        { w: 'picture', cn: '图画', e: '🖼️', img: IMG + 'b1d88f70-ccac-11ea-9ad1-b42e99c756f3.jpg' },
        { w: 'which', cn: '哪些', img: IMG + '5e9138ec-f03c-11eb-8334-b42e99c756f3.jpg' },
        { w: 'face', cn: '脸', e: '😊', img: IMG + 'f7a15e90-f0da-11eb-8262-00163e135ac6.jpg' },
        { w: 'eye', cn: '眼睛', e: '👁️', img: IMG + '5c546812-e5e3-11eb-a1f8-00163e135ac6.jpg' },
        { w: 'ear', cn: '耳朵', e: '��', img: IMG + 'bfff22ee-8461-11ea-b16a-b42e9969d22a.jpg' },
        { w: 'nose', cn: '鼻子', e: '👃', img: IMG + 'ff572610-f0da-11eb-8e14-00163e135ac6.jpg' },
      ],
    },
    {
      id: 'u3', title: 'Unit 3 Body Parts 身体', words: [
        { w: 'mouth', cn: '嘴', e: '👄', img: IMG + '0b38d076-8462-11ea-9983-b42e9969d22a.jpg' },
        { w: 'we', cn: '我们', img: IMG + '80ac1ac2-a62f-11ea-8b73-b42e99c756f3.jpg' },
        { w: 'twin', cn: '双胞胎', e: '👯', img: IMG + '2929.jpg' },
        { w: 'have', cn: '有', img: IMG + '71347cfe-f4f2-11eb-bd18-00163e135ac6.jpg' },
        { w: 'small', cn: '小的', e: '🤏', img: IMG + '5cbf5f08-f4ea-11eb-9a9c-00163e135ac6.jpg' },
        { w: 'same', cn: '相同的', img: IMG + 'ba5aad76-ea8a-11eb-a177-00163e135ac6.jpg' },
        { w: 'know', cn: '知道', img: IMG + '51fd58b6-f03c-11eb-b7c3-b42e99c756f3.jpg' },
        { w: 'now', cn: '现在', img: IMG + 'ad19d728-f3f8-11eb-813b-00163e135ac6.jpg' },
        { w: 'long', cn: '长的', img: IMG + '312b122e-846a-11ea-8091-b42e9969d22a.jpg' },
        { w: 'hair', cn: '头发', e: '💇', img: IMG + '4b9d90ee-8471-11ea-9a8c-b42e9969d22a.jpg' },
        { w: 'short', cn: '短的', img: IMG + '55f08cf6-f4ea-11eb-9609-00163e135ac6.jpg' },
        { w: 'different', cn: '不同的', img: IMG + 'e7ebc428-8543-11ea-adfa-b42e9969d22a.jpg' },
        { w: 'touch', cn: '触摸', img: IMG + '8ee05d30-f03c-11eb-9a29-b42e99c756f3.jpg' },
        { w: 'your', cn: '你的', img: IMG + 'f557fad0-fa7c-11eb-b95d-00163e135ac6.jpg' },
        { w: 'body', cn: '身体', e: '🧍', img: IMG + 'b534669e-8462-11ea-97f7-b42e9969d22a.jpg' },
        { w: 'come on', cn: '来吧', img: IMG + 'f78232d4-f4ec-11eb-bbe2-00163e135ac6.jpg' },
      ],
    },
    {
      id: 'u4', title: 'Unit 4 Robots 机器人', words: [
        { w: 'boy', cn: '男孩', e: '👦', img: IMG + '33f238d0-8467-11ea-96cf-b42e9969d22a.jpg' },
        { w: 'girl', cn: '女孩', e: '👧', img: IMG + '58e302e2-8467-11ea-af1c-b42e9969d22a.jpg' },
        { w: 'rock', cn: '摇动', img: IMG + '3909.jpg' },
        { w: 'move', cn: '移动', img: IMG + 'e033a8b0-8526-11ea-8fc4-b42e9969d22a.jpg' },
        { w: 'head', cn: '头', e: '🗣️', img: IMG + '99dbf3ee-e5e3-11eb-97b1-00163e135ac6.png' },
        { w: 'hand', cn: '手', e: '✋', img: IMG + '8ada151a-e5e3-11eb-a431-00163e135ac6.jpg' },
        { w: 'arm', cn: '手臂', img: IMG + '911633e6-e5e3-11eb-9c69-00163e135ac6.jpg' },
        { w: 'leg', cn: '腿', img: IMG + 'cb7a9692-8462-11ea-81cb-b42e9969d22a.jpg' },
        { w: 'foot', cn: '脚', e: '🦶', img: IMG + 'a19c595c-e5e3-11eb-b31b-00163e135ac6.jpg' },
        { w: 'robot', cn: '机器人', e: '🤖', img: IMG + '968a366e-850a-11ea-abbd-b42e9969d22a.jpg' },
        { w: 'cool', cn: '酷的', e: '😎', img: IMG + '37b739a8-847b-11ea-9523-b42e9969d22a.jpg' },
        { w: 'monster', cn: '怪兽', e: '👾', img: IMG + 'e03c91b4-b53a-11ea-b10d-b42e99c756f3.jpg' },
        { w: 'aunt', cn: '姑母', e: '👩', img: IMG + '5747131c-8476-11ea-a6eb-b42e9969d22a.jpg' },
        { w: 'her', cn: '她的', img: IMG + '48cf7000-f03c-11eb-bdfc-b42e99c756f3.jpg' },
        { w: 'part', cn: '部位', img: IMG + '0ba1c04c-e924-11eb-b8b8-00163e135ac6.jpg' },
        { w: 'toy', cn: '玩具', e: '🧸', img: IMG + 'd067c89a-846b-11ea-8d02-b42e9969d22a.jpg' },
      ],
    },
    {
      id: 'u5', title: 'Unit 5 Sports & Home 运动与家', words: [
        { w: 'his', cn: '他的', img: IMG + '485a13fe-f03c-11eb-b423-b42e99c756f3.jpg' },
        { w: 'name', cn: '名字', e: '🏷️', img: IMG + '8ef0a5da-f987-11eb-86c6-00163e135ac6.jpg' },
        { w: 'he', cn: '他', img: IMG + '69cd1464-b45a-11ea-9d54-b42e99c756f3.jpg' },
        { w: 'swim', cn: '游泳', e: '🏊', img: IMG + 'c845d1c0-8515-11ea-885b-b42e9969d22a.jpg' },
        { w: 'fast', cn: '快的', e: '💨', img: IMG + 'f1297dee-e924-11eb-8e7e-00163e135ac6.jpg' },
        { w: 'she', cn: '她', img: IMG + '7d18e1c0-f0df-11eb-8753-00163e135ac6.jpg' },
        { w: 'run', cn: '跑', e: '🏃', img: IMG + '8a15adfa-a635-11ea-9511-b42e99c756f3.jpg' },
        { w: 'strong', cn: '健壮的', e: '💪', img: IMG + '64283b4a-8470-11ea-b9da-b42e9969d22a.jpg' },
        { w: 'basketball', cn: '篮球', e: '🏀', img: IMG + '45ebb4a8-f4c6-11eb-9805-00163e135ac6.jpg' },
        { w: 'well', cn: '很好', img: IMG + '8fb65a32-e929-11eb-b711-00163e135ac6.jpg' },
        { w: 'home', cn: '家', e: '🏠', img: IMG + '9b416f9c-a635-11ea-b011-b42e99c756f3.jpg' },
        { w: 'bed', cn: '床', e: '🛏️', img: IMG + '752402ca-f4e9-11eb-94d6-00163e135ac6.jpg' },
        { w: 'table', cn: '桌子', e: '🪑', img: IMG + 'f3793e4a-8473-11ea-8a0d-b42e9969d22a.jpg' },
        { w: 'sofa', cn: '沙发', e: '🛋️', img: IMG + '03ecfc0a-8474-11ea-a9ae-b42e9969d22a.jpg' },
        { w: 'room', cn: '房间', e: '🏠', img: IMG + '9a2756d8-a630-11ea-99e6-b42e99c756f3.jpg' },
        { w: 'sit down', cn: '坐下', img: IMG + '8c44d648-e061-11ea-a379-b42e99c756f3.jpg' },
      ],
    },
    {
      id: 'u6', title: 'Unit 6 House 房子', words: [
        { w: 'next', cn: '下一个', img: IMG + '557b869e-f03c-11eb-9a20-b42e99c756f3.jpg' },
        { w: 'day', cn: '一天', e: '📅', img: IMG + 'a32b8e82-fa7e-11eb-91e7-00163e135ac6.jpg' },
        { w: 'clean', cn: '干净的', e: '✨', img: IMG + 'd042f5b6-846e-11ea-8753-b42e9969d22a.jpg' },
        { w: 'tidy', cn: '整洁的', img: IMG + '95eebc68-f03c-11eb-92ea-b42e99c756f3.jpg' },
        { w: 'OK', cn: '好的', img: IMG + '7bc5d594-8461-11ea-a5f8-b42e9969d22a.jpg' },
        { w: 'amazing', cn: '令人惊叹的', e: '🤩', img: IMG + '3fb87112-f4d4-11eb-8bc9-00163e135ac6.jpg' },
        { w: 'snow', cn: '雪', e: '❄️', img: IMG + 'e7166d7a-852e-11ea-81ab-b42e9969d22a.jpg' },
        { w: 'house', cn: '房子', e: '🏡', img: IMG + '0cd9493a-8526-11ea-8887-b42e9969d22a.jpg' },
        { w: 'tall', cn: '高的', img: IMG + 'fee086d2-8469-11ea-939e-b42e9969d22a.jpg' },
      ],
    },
  ],
};

const BOOK_2A = {
  id: 'wyjxjj-2a',
  name: '外研版·新交际英语',
  volume: '二年级上册',
  grade: '二年级',
  sample: false,
  units: [
    {
      id: 'u1', title: 'Unit 1 Feelings 情感', words: [
        { w: 'sad', cn: '伤心的', e: '😢', img: IMG + 'e4d13214-8541-11ea-9aca-b42e9969d22a.jpg' },
        { w: 'angry', cn: '生气的', e: '😠', img: IMG + 'b6c9cf8a-8541-11ea-b645-b42e9969d22a.jpg' },
        { w: 'tired', cn: '疲倦的', e: '😴', img: IMG + '373.jpg' },
        { w: 'hungry', cn: '饥饿的', e: '🍽️', img: IMG + '3e9172ac-f4fc-11eb-b1a1-00163e135ac6.jpg' },
        { w: 'fun', cn: '有趣的', e: '😄', img: IMG + '720b6e74-f03c-11eb-b1da-b42e99c756f3.jpg' },
        { w: 'show', cn: '演出', e: '🎭', img: IMG + 'c5f57034-852e-11ea-9484-b42e9969d22a.jpg' },
        { w: 'turn', cn: '轮到', img: IMG + '822873f6-e923-11eb-be7e-00163e135ac6.jpg' },
        { w: 'apple', cn: '苹果', e: '🍎', img: IMG + '05295712-846c-11ea-a4ec-b42e9969d22a.jpg' },
        { w: "o'clock", cn: '点钟', e: '🕐', img: IMG + '4c5469e8-f03c-11eb-a4a6-b42e99c756f3.jpg' },
        { w: 'want', cn: '想要', img: IMG + '5628bf26-f03c-11eb-a16b-b42e99c756f3.jpg' },
      ],
    },
    {
      id: 'u2', title: 'Unit 2 Food 食物', words: [
        { w: 'for', cn: '为了', img: IMG + '6ff70c82-f03c-11eb-a412-b42e99c756f3.jpg' },
        { w: 'dinner', cn: '正餐', e: '��️', img: IMG + '0de39d10-ccb5-11ea-b72c-b42e99c756f3.jpg' },
        { w: 'eat', cn: '吃', e: '😋', img: IMG + '3695222c-847e-11ea-b0cb-b42e9969d22a.jpg' },
        { w: 'banana', cn: '香蕉', e: '🍌', img: IMG + '3d7ef228-846c-11ea-84d5-b42e9969d22a.jpg' },
        { w: 'yummy', cn: '好吃的', e: '😋', img: IMG + 'bc63cd02-f03c-11eb-a65d-b42e99c756f3.jpg' },
        { w: 'rice', cn: '米饭', e: '🍚', img: IMG + '349c499c-f0de-11eb-8024-00163e135ac6.jpg' },
        { w: 'noodle', cn: '面条', e: '🍜', img: IMG + '2801.jpg' },
        { w: 'milk', cn: '牛奶', e: '🥛', img: IMG + '070c6b6a-f0de-11eb-b59e-00163e135ac6.jpg' },
        { w: 'bread', cn: '面包', e: '🍞', img: IMG + '3dc33c9c-e5e4-11eb-b461-00163e135ac6.jpg' },
        { w: 'like', cn: '喜欢', e: '❤️', img: IMG + '652835d8-f03c-11eb-b46e-b42e99c756f3.jpg' },
      ],
    },
    {
      id: 'u3', title: 'Unit 3 Sweets & Weather 甜食与天气', words: [
        { w: 'but', cn: '但是', img: IMG + '4abd1a7a-f03c-11eb-a840-b42e99c756f3.jpg' },
        { w: 'food', cn: '食物', e: '🍱', img: IMG + '92208692-f4fc-11eb-b10d-00163e135ac6.png' },
        { w: 'us', cn: '我们', img: IMG + '5175fa80-f03c-11eb-8219-b42e99c756f3.jpg' },
        { w: 'cake', cn: '蛋糕', e: '🎂', img: IMG + '30770e24-f0de-11eb-acc1-00163e135ac6.jpg' },
        { w: 'sweet', cn: '糖果', e: '🍬', img: IMG + '7e3a303e-8513-11ea-a4fd-b42e9969d22a.jpg' },
        { w: 'ice cream', cn: '冰激凌', e: '🍦', img: IMG + '114fd624-9b3b-11ea-88ca-b42e99c756f3.jpg' },
        { w: 'weather', cn: '天气', e: '🌤️', img: IMG + 'f7fc5624-847b-11ea-9fac-b42e9969d22a.jpg' },
        { w: 'windy', cn: '多风的', e: '💨', img: IMG + '9a3e2218-847b-11ea-89b8-b42e9969d22a.jpg' },
        { w: 'snowy', cn: '下雪的', e: '🌨️', img: IMG + 'befa4be6-847b-11ea-9435-b42e9969d22a.jpg' },
        { w: 'rainy', cn: '下雨的', e: '🌧️', img: IMG + 'cdd8ee6c-847b-11ea-b567-b42e9969d22a.jpg' },
      ],
    },
    {
      id: 'u4', title: 'Unit 4 Seasons 季节', words: [
        { w: 'sunny', cn: '晴朗的', e: '☀️', img: IMG + '89c6ac52-847b-11ea-89fc-b42e9969d22a.jpg' },
        { w: 'worry', cn: '担心', img: IMG + 'ae8cbaaa-e929-11eb-8d49-00163e135ac6.jpg' },
        { w: 'wait', cn: '等候', img: IMG + '4f8b839c-f03c-11eb-8d89-b42e99c756f3.jpg' },
        { w: 'later', cn: '之后', img: IMG + 'a909c358-f03c-11eb-afbb-b42e99c756f3.jpg' },
        { w: 'egg', cn: '蛋', e: '🥚', img: IMG + '78108a7a-8464-11ea-9b83-b42e9969d22a.jpg' },
        { w: 'other', cn: '另外的', img: IMG + '64d3c0e6-f03c-11eb-b48b-b42e99c756f3.jpg' },
        { w: 'in', cn: '在…里', img: IMG + '4563d498-f03c-11eb-9d47-b42e99c756f3.jpg' },
        { w: 'spring', cn: '春天', e: '🌸', img: IMG + '1adf5a08-852e-11ea-8ef4-b42e9969d22a.jpg' },
        { w: 'summer', cn: '夏天', e: '☀️', img: IMG + '26bb8b1c-852e-11ea-a8e7-b42e9969d22a.jpg' },
        { w: 'autumn', cn: '秋天', e: '🍂', img: IMG + '36d2ca3e-852e-11ea-af67-b42e9969d22a.jpg' },
      ],
    },
    {
      id: 'u5', title: 'Unit 5 Clothes 服装', words: [
        { w: 'winter', cn: '冬天', e: '❄️', img: IMG + '45b3d278-852e-11ea-ab94-b42e9969d22a.jpg' },
        { w: 'season', cn: '季节', e: '🌈', img: IMG + '53876736-852e-11ea-9465-b42e9969d22a.jpg' },
        { w: 'year', cn: '年', e: '📅', img: IMG + '612edf46-f03c-11eb-95da-b42e99c756f3.jpg' },
        { w: 'lot', cn: '大量', img: IMG + '1dffc1ca-8526-11ea-8b53-b42e9969d22a.jpg' },
        { w: 'make', cn: '制作', img: IMG + '9a0326f8-f03c-11eb-81f8-b42e99c756f3.jpg' },
        { w: 'some', cn: '一些', img: IMG + '8f9716ee-f03c-11eb-9f90-b42e99c756f3.jpg' },
        { w: 'hat', cn: '帽子', e: '🎩', img: IMG + '905290aa-f3fb-11eb-9334-00163e135ac6.jpg' },
        { w: 'shirt', cn: '衬衫', e: '👔', img: IMG + '28b37b90-847f-11ea-8265-b42e9969d22a.jpg' },
        { w: 'skirt', cn: '裙子', e: '👗', img: IMG + '79faee0a-f3fc-11eb-a3d8-00163e135ac6.jpg' },
        { w: 'coat', cn: '外套', e: '🧥', img: IMG + 'cc0169f6-847e-11ea-be14-b42e9969d22a.jpg' },
      ],
    },
    {
      id: 'u6', title: 'Unit 6 Fun 快乐', words: [
        { w: 'shoe', cn: '鞋', e: '👟', img: IMG + '7c14e552-8472-11ea-9382-b42e9969d22a.jpg' },
        { w: 'put', cn: '放', img: IMG + 'a14f0840-f03c-11eb-b8c3-b42e99c756f3.jpg' },
        { w: 'them', cn: '它们', img: IMG + '4956c742-f03c-11eb-9b83-b42e99c756f3.jpg' },
        { w: 'sun', cn: '阳光', e: '☀️', img: IMG + 'A11_sun.jpg' },
        { w: 'jump', cn: '跳', e: '🏃', img: IMG + '98659434-f03c-11eb-a684-b42e99c756f3.jpg' },
        { w: 'up', cn: '向上', e: '⬆️', img: IMG + '19d7ddc2-f4e6-11eb-8c70-00163e135ac6.jpg' },
        { w: 'lucky', cn: '幸运的', e: '🍀', img: IMG + 'c1691cf2-ea8e-11eb-a28c-00163e135ac6.jpg' },
        { w: 'kite', cn: '风筝', e: '🪁', img: IMG + '6b301880-846d-11ea-8172-b42e9969d22a.jpg' },
        { w: 'card', cn: '贺卡', e: '💌', img: IMG + 'dbec0bfe-a628-11ea-8b7b-b42e99c756f3.jpg' },
      ],
    },
  ],
};

const BOOK_2B = {
  id: 'wyjxjj-2b',
  name: '外研版·新交际英语',
  volume: '二年级下册',
  grade: '二年级',
  sample: false,
  units: [
    {
      id: 'u1', title: 'Unit 1 Transport 交通', words: [
        { w: 'by', cn: '乘坐', img: IMG + '622f5610-f03c-11eb-b2bf-b42e99c756f3.jpg' },
        { w: 'bus', cn: '公交车', e: '🚌', img: IMG + '9ef956b4-8539-11ea-99f4-b42e9969d22a.jpg' },
        { w: 'car', cn: '汽车', e: '🚗', img: IMG + '8e30445e-846b-11ea-8178-b42e9969d22a.jpg' },
        { w: 'train', cn: '火车', e: '🚂', img: IMG + 'f75ebc8a-8539-11ea-b70c-b42e9969d22a.jpg' },
        { w: 'plane', cn: '飞机', e: '✈️', img: IMG + 'ab6e8e08-8539-11ea-9ee9-b42e9969d22a.jpg' },
        { w: 'farm', cn: '农场', e: '🌾', img: IMG + '16117fc2-847e-11ea-b2b8-b42e9969d22a.jpg' },
        { w: 'Chinese', cn: '中国的', e: '🇨🇳', img: IMG + 'c54b3e46-a62e-11ea-b592-b42e99c756f3.jpg' },
        { w: 'new', cn: '新的', e: '🆕', img: IMG + 'f597f0ea-f0e0-11eb-ba9a-00163e135ac6.png' },
        { w: 'see', cn: '看望', e: '👀', img: IMG + '8f573ac0-f03c-11eb-8562-b42e99c756f3.jpg' },
        { w: 'job', cn: '职业', e: '💼', img: IMG + '3389fdb4-8477-11ea-806f-b42e9969d22a.jpg' },
        { w: 'driver', cn: '司机', e: '🚕', img: IMG + '9b3b203a-8476-11ea-979e-b42e9969d22a.jpg' },
      ],
    },
    {
      id: 'u2', title: 'Unit 2 Jobs 职业', words: [
        { w: 'farmer', cn: '农民', e: '👨\u200d🌾', img: IMG + 'b19b65c6-8476-11ea-9d27-b42e9969d22a.jpg' },
        { w: 'worker', cn: '工人', e: '👷', img: IMG + '5b7c11fa-8540-11ea-aefc-b42e9969d22a.jpg' },
        { w: 'doctor', cn: '医生', e: '👨\u200d⚕️', img: IMG + '78f77fac-8476-11ea-8736-b42e9969d22a.jpg' },
        { w: 'nurse', cn: '护士', e: '👩\u200d⚕️', img: IMG + 'ca3ea2e8-8476-11ea-9eaa-b42e9969d22a.jpg' },
        { w: 'our', cn: '我们的', img: IMG + '5227289a-f03c-11eb-bdb7-b42e99c756f3.jpg' },
        { w: 'pen', cn: '钢笔', e: '🖊️', img: IMG + '78896596-e5e3-11eb-8c1d-00163e135ac6.jpg' },
        { w: 'queen', cn: '女王', e: '👸', img: IMG + 'afe93adc-ea8b-11eb-9255-00163e135ac6.jpg' },
        { w: 'cow', cn: '奶牛', e: '🐄', img: IMG + '75d75a34-847d-11ea-83e7-b42e9969d22a.jpg' },
        { w: 'chicken', cn: '鸡', e: '🐓', img: IMG + '6e106ea2-8474-11ea-9964-b42e9969d22a.jpg' },
        { w: 'sheep', cn: '绵羊', e: '🐑', img: IMG + '866bd8dc-847d-11ea-99c8-b42e9969d22a.jpg' },
        { w: 'flower', cn: '花朵', e: '🌸', img: IMG + 'ce5945f0-8526-11ea-943d-b42e9969d22a.jpg' },
      ],
    },
    {
      id: 'u3', title: 'Unit 3 Farm Life 农场', words: [
        { w: 'grass', cn: '青草', e: '🌿', img: IMG + '4936a19c-853a-11ea-8c0e-b42e9969d22a.jpg' },
        { w: 'child', cn: '儿童', e: '🧒', img: IMG + '8da090ca-f03c-11eb-bd27-b42e99c756f3.jpg' },
        { w: 'feed', cn: '喂养', e: '🌾', img: IMG + '9aa1daf0-f03c-11eb-9c7e-b42e99c756f3.jpg' },
        { w: 'help', cn: '帮助', e: '🙋', img: IMG + '4726c9fa-f03c-11eb-9550-b42e99c756f3.jpg' },
        { w: 'look at', cn: '看', e: '👀', img: IMG + '49198a24-f4e9-11eb-a6d2-00163e135ac6.jpg' },
        { w: 'painting', cn: '绘画', e: '🎨', img: IMG + 'b6b1428c-f58b-11eb-9ae8-00163e135ac6.jpg' },
        { w: 'yes', cn: '是的', e: '✅', img: IMG + 'cf03c00a-a625-11ea-bada-b42e99c756f3.jpg' },
        { w: 'class', cn: '一节课', e: '📚', img: IMG + '16b8b934-f501-11eb-af62-00163e135ac6.jpg' },
        { w: 'in class', cn: '上课时', img: IMG + '2911.jpg' },
        { w: 'English', cn: '英语', e: '🇬🇧', img: IMG + 'da6417ee-a62e-11ea-8a97-b42e99c756f3.jpg' },
        { w: 'maths', cn: '数学', e: '➕', img: IMG + '188def1c-a62f-11ea-b86a-b42e99c756f3.jpg' },
      ],
    },
    {
      id: 'u4', title: 'Unit 4 School Subjects 学科', words: [
        { w: 'all', cn: '全部', img: IMG + '2b05b664-852f-11ea-89a3-b42e9969d22a.jpg' },
        { w: 'music', cn: '音乐', e: '🎵', img: IMG + '0526d86c-a62f-11ea-aed2-b42e99c756f3.jpg' },
        { w: 'PE', cn: '体育课', e: '⚽', img: IMG + 'image/20220805180514_d70acaef.png' },
        { w: 'art', cn: '美术', e: '🎨', img: IMG + '2b0facae-a62f-11ea-a9db-b42e99c756f3.jpg' },
        { w: 'great', cn: '很好的', e: '👍', img: IMG + '756ae638-f03c-11eb-9080-b42e99c756f3.jpg' },
        { w: 'can', cn: '能，会', img: IMG + '4c821c80-a626-11ea-9874-b42e99c756f3.jpg' },
        { w: 'umbrella', cn: '雨伞', e: '☂️', img: IMG + 'f0c34ffe-847f-11ea-81f4-b42e9969d22a.jpg' },
        { w: 'van', cn: '小货车', e: '🚐', img: IMG + '2810.jpg' },
        { w: 'student', cn: '学生', e: '🧑\u200d🎓', img: IMG + '9f21522e-8466-11ea-bacb-b42e9969d22a.jpg' },
        { w: 'box', cn: '盒子', e: '📦', img: IMG + 'e1d3b068-846b-11ea-b753-b42e9969d22a.jpg' },
        { w: 'paper', cn: '纸', e: '📄', img: IMG + '2a319626-b460-11ea-b8b0-b42e99c756f3.jpg' },
      ],
    },
    {
      id: 'u5', title: 'Unit 5 Talents 才艺', words: [
        { w: 'sing', cn: '唱歌', e: '🎤', img: IMG + 'c09e1202-8514-11ea-9df2-b42e9969d22a.jpg' },
        { w: 'dance', cn: '跳舞', e: '💃', img: IMG + '58db4a1a-8515-11ea-8889-b42e9969d22a.jpg' },
        { w: 'draw', cn: '画画', e: '✏️', img: IMG + '789fad46-8515-11ea-9da2-b42e9969d22a.jpg' },
        { w: 'football', cn: '足球', e: '⚽', img: IMG + '63a867de-f4c6-11eb-8e35-00163e135ac6.jpg' },
        { w: 'play football', cn: '踢足球', e: '🏃', img: IMG + 'dac5bba2-850f-11ea-b8fb-b42e9969d22a.jpg' },
        { w: 'kick', cn: '踢', img: IMG + '38a5e8ee-a62c-11ea-8238-b42e99c756f3.jpg' },
        { w: 'week', cn: '星期', e: '📅', img: IMG + 'f83d6680-a62d-11ea-8f1c-b42e99c756f3.jpg' },
        { w: 'Monday', cn: '星期一', e: '1️⃣', img: IMG + '2cbd9392-850b-11ea-bf38-b42e9969d22a.jpg' },
        { w: 'Tuesday', cn: '星期二', e: '2️⃣', img: IMG + '8972ff36-850b-11ea-bfaa-b42e9969d22a.jpg' },
        { w: 'Wednesday', cn: '星期三', e: '3️⃣', img: IMG + 'b866ce40-850b-11ea-bcf1-b42e9969d22a.jpg' },
        { w: 'Thursday', cn: '星期四', e: '4️⃣', img: IMG + 'b97f6aa6-f500-11eb-8da1-00163e135ac6.jpg' },
      ],
    },
    {
      id: 'u6', title: 'Unit 6 Week Days 星期', words: [
        { w: 'Friday', cn: '星期五', e: '5️⃣', img: IMG + 'f01ff9b8-850b-11ea-a7fa-b42e9969d22a.jpg' },
        { w: 'every day', cn: '每天', img: IMG + '6f75f1fa-f03c-11eb-ae05-b42e99c756f3.jpg' },
        { w: 'Saturday', cn: '星期六', e: '6️⃣', img: IMG + '01025986-850c-11ea-ae0f-b42e9969d22a.jpg' },
        { w: 'Sunday', cn: '星期日', e: '7️⃣', img: IMG + '1580e7d8-850c-11ea-8b0d-b42e9969d22a.jpg' },
        { w: 'sorry', cn: '对不起', e: '😔', img: IMG + '63ecd5a2-a626-11ea-8964-b42e99c756f3.jpg' },
      ],
    },
  ],
};

export const TEXTBOOKS = [BOOK_1A, BOOK_1B, BOOK_2A, BOOK_2B];

export function getTextbook(id) {
  return TEXTBOOKS.find((b) => b.id === id) || BOOK_1A;
}

/* 向后兼容：保留 TEXTBOOK 指向第一册 */
export const TEXTBOOK = BOOK_1A;

export function textbookUnit(bookIdOrUnitId, unitId) {
  if (unitId === undefined) {
    return BOOK_1A.units.find((u) => u.id === bookIdOrUnitId) || null;
  }
  const book = getTextbook(bookIdOrUnitId);
  return book.units.find((u) => u.id === unitId) || null;
}

export function textbookWords(bookIdOrUnitId, unitId) {
  let book, u;
  if (unitId === undefined) {
    book = BOOK_1A;
    u = book.units.find((x) => x.id === bookIdOrUnitId);
  } else {
    book = getTextbook(bookIdOrUnitId);
    u = book.units.find((x) => x.id === unitId);
  }
  if (!u) return [];
  return u.words.map((x) => ({ w: x.w, e: x.e || '', s: '', cn: x.cn || '', level: book.volume, img: x.img || '' }));
}
