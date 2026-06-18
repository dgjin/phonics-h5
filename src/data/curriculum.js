/*
 * 自然拼读课程数据（基于 KizPhonics Preschool–G2 教材整理）
 * 每个 item: { l: 焦点字母/字母组合, s: 发音(IPA风格), w: 例词, e: emoji, p?: 拼词分块 }
 * p 不填时，拼词游戏按单词字母拆分。
 * 每个 unit 的 acts 决定生成哪些题型: flashcard / listen / match / spell
 */
export const CURRICULUM = [
  {
    id: 'preschool', title: 'Preschool', cn: '字母 A–Z 认知', color: 'purple', icon: 'ti-abc',
    desc: '认识 26 个字母的名称、发音和例词',
    units: [
      { id: 'a-f', title: 'Letters A–F', cn: '字母 A–F', acts: ['flashcard', 'trace', 'listen', 'match'], items: [
        { l: 'Aa', s: '/æ/', w: 'ant', e: '🐜' },
        { l: 'Bb', s: '/b/', w: 'ball', e: '⚽' },
        { l: 'Cc', s: '/k/', w: 'cat', e: '🐱' },
        { l: 'Dd', s: '/d/', w: 'dog', e: '🐶' },
        { l: 'Ee', s: '/e/', w: 'egg', e: '🥚' },
        { l: 'Ff', s: '/f/', w: 'fish', e: '🐟' },
      ]},
      { id: 'g-l', title: 'Letters G–L', cn: '字母 G–L', acts: ['flashcard', 'trace', 'listen', 'match'], items: [
        { l: 'Gg', s: '/g/', w: 'goat', e: '🐐' },
        { l: 'Hh', s: '/h/', w: 'hen', e: '🐔' },
        { l: 'Ii', s: '/ɪ/', w: 'igloo', e: '🛖' },
        { l: 'Jj', s: '/dʒ/', w: 'jet', e: '✈️' },
        { l: 'Kk', s: '/k/', w: 'kite', e: '🪁' },
        { l: 'Ll', s: '/l/', w: 'lion', e: '🦁' },
      ]},
      { id: 'm-r', title: 'Letters M–R', cn: '字母 M–R', acts: ['flashcard', 'trace', 'listen', 'match'], items: [
        { l: 'Mm', s: '/m/', w: 'map', e: '🗺️' },
        { l: 'Nn', s: '/n/', w: 'nut', e: '🥜' },
        { l: 'Oo', s: '/ɒ/', w: 'octopus', e: '🐙' },
        { l: 'Pp', s: '/p/', w: 'pig', e: '🐷' },
        { l: 'Qq', s: '/kw/', w: 'queen', e: '👑' },
        { l: 'Rr', s: '/r/', w: 'rabbit', e: '🐰' },
      ]},
      { id: 's-z', title: 'Letters S–Z', cn: '字母 S–Z', acts: ['flashcard', 'trace', 'listen', 'match'], items: [
        { l: 'Ss', s: '/s/', w: 'sun', e: '☀️' },
        { l: 'Tt', s: '/t/', w: 'tiger', e: '🐅' },
        { l: 'Uu', s: '/ʌ/', w: 'umbrella', e: '☂️' },
        { l: 'Vv', s: '/v/', w: 'van', e: '🚐' },
        { l: 'Ww', s: '/w/', w: 'web', e: '🕸️' },
        { l: 'Xx', s: '/ks/', w: 'box', e: '📦' },
        { l: 'Yy', s: '/j/', w: 'yo-yo', e: '🪀' },
        { l: 'Zz', s: '/z/', w: 'zebra', e: '🦓' },
      ]},
    ],
  },
  {
    id: 'k1', title: 'K1', cn: '短元音 & 起始辅音', color: 'teal', icon: 'ti-volume',
    desc: '短元音 a / e 与字母词族、拼读 CVC 单词',
    units: [
      { id: 'short-a', title: 'Short Vowel a', cn: '短元音 a /æ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'a', s: '/æ/', w: 'cat', e: '🐱' },
        { l: 'a', s: '/æ/', w: 'bat', e: '🦇' },
        { l: 'a', s: '/æ/', w: 'hat', e: '🎩' },
        { l: 'a', s: '/æ/', w: 'map', e: '🗺️' },
        { l: 'a', s: '/æ/', w: 'fan', e: '🪭' },
        { l: 'a', s: '/æ/', w: 'bag', e: '🎒' },
      ]},
      { id: 'short-e', title: 'Short Vowel e', cn: '短元音 e /e/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'e', s: '/e/', w: 'hen', e: '🐔' },
        { l: 'e', s: '/e/', w: 'bed', e: '🛏️' },
        { l: 'e', s: '/e/', w: 'jet', e: '✈️' },
        { l: 'e', s: '/e/', w: 'pen', e: '🖊️' },
        { l: 'e', s: '/e/', w: 'net', e: '🥅' },
        { l: 'e', s: '/e/', w: 'web', e: '🕸️' },
      ]},
      { id: 'fam-at', title: 'Word Family -at', cn: '-at 词族', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'at', s: '/æt/', w: 'cat', e: '🐱' },
        { l: 'at', s: '/æt/', w: 'bat', e: '🦇' },
        { l: 'at', s: '/æt/', w: 'hat', e: '🎩' },
        { l: 'at', s: '/æt/', w: 'rat', e: '🐀' },
        { l: 'at', s: '/æt/', w: 'mat', e: '🧶' },
      ]},
      { id: 'fam-an', title: 'Word Family -an', cn: '-an 词族', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'an', s: '/æn/', w: 'man', e: '👨' },
        { l: 'an', s: '/æn/', w: 'van', e: '🚐' },
        { l: 'an', s: '/æn/', w: 'can', e: '🥫' },
        { l: 'an', s: '/æn/', w: 'fan', e: '🪭' },
        { l: 'an', s: '/æn/', w: 'pan', e: '🍳' },
      ]},
      { id: 'cvc-a', title: 'Blend CVC (a)', cn: '拼读 a 类 CVC', acts: ['flashcard', 'listen', 'spell'], items: [
        { l: 'c-a-t', s: '/kæt/', w: 'cat', e: '🐱', p: ['c', 'a', 't'] },
        { l: 'f-a-n', s: '/fæn/', w: 'fan', e: '🪭', p: ['f', 'a', 'n'] },
        { l: 'b-a-g', s: '/bæg/', w: 'bag', e: '🎒', p: ['b', 'a', 'g'] },
        { l: 'm-a-p', s: '/mæp/', w: 'map', e: '🗺️', p: ['m', 'a', 'p'] },
        { l: 'h-a-m', s: '/hæm/', w: 'ham', e: '🍖', p: ['h', 'a', 'm'] },
      ]},
    ],
  },
  {
    id: 'k2', title: 'K2', cn: '词尾辅音 & 短元音 i/o/u', color: 'coral', icon: 'ti-letter-case',
    desc: '短元音 i / o / u、词族与词尾辅音、ck / ng 结尾',
    units: [
      { id: 'short-i', title: 'Short Vowel i', cn: '短元音 i /ɪ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'i', s: '/ɪ/', w: 'pig', e: '🐷' },
        { l: 'i', s: '/ɪ/', w: 'six', e: '6️⃣' },
        { l: 'i', s: '/ɪ/', w: 'lip', e: '👄' },
        { l: 'i', s: '/ɪ/', w: 'bin', e: '🗑️' },
        { l: 'i', s: '/ɪ/', w: 'fin', e: '🐠' },
        { l: 'i', s: '/ɪ/', w: 'pin', e: '📌' },
      ]},
      { id: 'short-o', title: 'Short Vowel o', cn: '短元音 o /ɒ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'o', s: '/ɒ/', w: 'dog', e: '🐶' },
        { l: 'o', s: '/ɒ/', w: 'fox', e: '🦊' },
        { l: 'o', s: '/ɒ/', w: 'box', e: '📦' },
        { l: 'o', s: '/ɒ/', w: 'log', e: '🪵' },
        { l: 'o', s: '/ɒ/', w: 'mop', e: '🧹' },
        { l: 'o', s: '/ɒ/', w: 'pot', e: '🍲' },
      ]},
      { id: 'short-u', title: 'Short Vowel u', cn: '短元音 u /ʌ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'u', s: '/ʌ/', w: 'bug', e: '🐛' },
        { l: 'u', s: '/ʌ/', w: 'sun', e: '☀️' },
        { l: 'u', s: '/ʌ/', w: 'cup', e: '☕' },
        { l: 'u', s: '/ʌ/', w: 'bus', e: '🚌' },
        { l: 'u', s: '/ʌ/', w: 'rug', e: '🧶' },
        { l: 'u', s: '/ʌ/', w: 'nut', e: '🥜' },
      ]},
      { id: 'fam-ig-in', title: 'Family -ig / -in', cn: '-ig / -in 词族', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ig', s: '/ɪg/', w: 'pig', e: '🐷' },
        { l: 'ig', s: '/ɪg/', w: 'wig', e: '💇' },
        { l: 'ig', s: '/ɪg/', w: 'dig', e: '⛏️' },
        { l: 'in', s: '/ɪn/', w: 'pin', e: '📌' },
        { l: 'in', s: '/ɪn/', w: 'win', e: '🏆' },
        { l: 'in', s: '/ɪn/', w: 'bin', e: '🗑️' },
      ]},
      { id: 'ending-cons', title: 'Ending Consonants', cn: '词尾辅音', acts: ['flashcard', 'listen', 'spell'], items: [
        { l: '-t', s: '/t/', w: 'cat', e: '🐱', p: ['ca', 't'] },
        { l: '-g', s: '/g/', w: 'dog', e: '🐶', p: ['do', 'g'] },
        { l: '-b', s: '/b/', w: 'web', e: '🕸️', p: ['we', 'b'] },
        { l: '-m', s: '/m/', w: 'ham', e: '🍖', p: ['ha', 'm'] },
        { l: '-d', s: '/d/', w: 'bed', e: '🛏️', p: ['be', 'd'] },
        { l: '-n', s: '/n/', w: 'sun', e: '☀️', p: ['su', 'n'] },
      ]},
      { id: 'end-ck-ng', title: 'Endings ck / ng', cn: 'ck / ng 结尾', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ck', s: '/k/', w: 'duck', e: '🦆', p: ['du', 'ck'] },
        { l: 'ck', s: '/k/', w: 'sock', e: '🧦', p: ['so', 'ck'] },
        { l: 'ck', s: '/k/', w: 'rock', e: '🪨', p: ['ro', 'ck'] },
        { l: 'ng', s: '/ŋ/', w: 'ring', e: '💍', p: ['ri', 'ng'] },
        { l: 'ng', s: '/ŋ/', w: 'king', e: '🤴', p: ['ki', 'ng'] },
        { l: 'ng', s: '/ŋ/', w: 'wing', e: '🪽', p: ['wi', 'ng'] },
      ]},
    ],
  },
  {
    id: 'g1', title: 'G1', cn: '辅音 · S连缀 · 双字母 · 硬软音', color: 'green', icon: 'ti-book',
    desc: '辅音回顾、s 连缀、ch/sh/th/wh/ph 双字母音，以及 c/g 的硬软音和三字母连缀',
    units: [
      { id: 's-blends', title: 'S Blends', cn: 's 连缀', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'sn', s: '/sn/', w: 'snail', e: '🐌', p: ['sn', 'ail'] },
        { l: 'st', s: '/st/', w: 'star', e: '⭐', p: ['st', 'ar'] },
        { l: 'sp', s: '/sp/', w: 'spoon', e: '🥄', p: ['sp', 'oon'] },
        { l: 'sw', s: '/sw/', w: 'swim', e: '🏊', p: ['sw', 'im'] },
        { l: 'sk', s: '/sk/', w: 'skate', e: '⛸️', p: ['sk', 'ate'] },
        { l: 'sl', s: '/sl/', w: 'slide', e: '🛝', p: ['sl', 'ide'] },
      ]},
      { id: 'dig-ch', title: 'Digraph ch', cn: 'ch 音 /tʃ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ch', s: '/tʃ/', w: 'chair', e: '🪑', p: ['ch', 'air'] },
        { l: 'ch', s: '/tʃ/', w: 'cheese', e: '🧀', p: ['ch', 'eese'] },
        { l: 'ch', s: '/tʃ/', w: 'chick', e: '🐤', p: ['ch', 'ick'] },
        { l: 'ch', s: '/tʃ/', w: 'cherry', e: '🍒', p: ['ch', 'erry'] },
      ]},
      { id: 'dig-sh', title: 'Digraph sh', cn: 'sh 音 /ʃ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'sh', s: '/ʃ/', w: 'ship', e: '🚢', p: ['sh', 'ip'] },
        { l: 'sh', s: '/ʃ/', w: 'shoe', e: '👟', p: ['sh', 'oe'] },
        { l: 'sh', s: '/ʃ/', w: 'shell', e: '🐚', p: ['sh', 'ell'] },
        { l: 'sh', s: '/ʃ/', w: 'sheep', e: '🐑', p: ['sh', 'eep'] },
      ]},
      { id: 'dig-th', title: 'Digraph th', cn: 'th 音 /θ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'th', s: '/θ/', w: 'thumb', e: '👍', p: ['th', 'umb'] },
        { l: 'th', s: '/θ/', w: 'three', e: '3️⃣', p: ['th', 'ree'] },
        { l: 'th', s: '/θ/', w: 'bath', e: '🛁', p: ['ba', 'th'] },
        { l: 'th', s: '/θ/', w: 'teeth', e: '🦷', p: ['tee', 'th'] },
      ]},
      { id: 'dig-wh-ph', title: 'Digraph wh / ph', cn: 'wh / ph 音', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'wh', s: '/hw/', w: 'whale', e: '🐋', p: ['wh', 'ale'] },
        { l: 'wh', s: '/hw/', w: 'wheel', e: '☸️', p: ['wh', 'eel'] },
        { l: 'ph', s: '/f/', w: 'phone', e: '📱', p: ['ph', 'one'] },
        { l: 'ph', s: '/f/', w: 'photo', e: '📷', p: ['ph', 'oto'] },
      ]},
      { id: 'hard-soft-c', title: 'Hard & Soft c', cn: '硬音 /k/ 与软音 /s/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'c', s: '/k/', w: 'cat', e: '🐱' },
        { l: 'c', s: '/k/', w: 'cup', e: '☕' },
        { l: 'c', s: '/k/', w: 'coat', e: '🧥' },
        { l: 'c', s: '/s/', w: 'city', e: '🏙️' },
        { l: 'c', s: '/s/', w: 'cell', e: '🔬' },
        { l: 'c', s: '/s/', w: 'cinema', e: '🎬' },
      ]},
      { id: 'hard-soft-g', title: 'Hard & Soft g', cn: '硬音 /g/ 与软音 /dʒ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'g', s: '/g/', w: 'goat', e: '🐐' },
        { l: 'g', s: '/g/', w: 'gum', e: '🍬' },
        { l: 'g', s: '/g/', w: 'guitar', e: '🎸' },
        { l: 'g', s: '/dʒ/', w: 'giraffe', e: '🦒', p: ['g', 'ir', 'affe'] },
        { l: 'g', s: '/dʒ/', w: 'ginger', e: '🫚' },
        { l: 'g', s: '/dʒ/', w: 'gym', e: '🏋️' },
      ]},
      { id: 'trigraphs', title: 'Trigraphs', cn: '三字母连缀 shr/spl/str/thr', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'shr', s: '/ʃr/', w: 'shrimp', e: '🦐', p: ['sh', 'rimp'] },
        { l: 'shr', s: '/ʃr/', w: 'shred', e: '📄', p: ['sh', 'red'] },
        { l: 'spl', s: '/spl/', w: 'splash', e: '💦', p: ['spl', 'ash'] },
        { l: 'spl', s: '/spl/', w: 'split', e: '✂️', p: ['spl', 'it'] },
        { l: 'str', s: '/str/', w: 'string', e: '🧵', p: ['str', 'ing'] },
        { l: 'str', s: '/str/', w: 'street', e: '🛣️', p: ['str', 'eet'] },
        { l: 'thr', s: '/θr/', w: 'thread', e: '🧵', p: ['th', 'read'] },
        { l: 'thr', s: '/θr/', w: 'throne', e: '👑', p: ['th', 'rone'] },
      ]},
    ],
  },
  {
    id: 'g1-2', title: 'G1–2', cn: 'L/R 连缀 · 长元音 · 词尾', color: 'pink', icon: 'ti-puzzle',
    desc: 'L/R 连缀、长元音 a/e/i，以及词尾 -le 和 y 发长 e 音',
    units: [
      { id: 'l-blends', title: 'L Blends', cn: 'L 连缀', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'bl', s: '/bl/', w: 'blue', e: '🟦', p: ['bl', 'ue'] },
        { l: 'cl', s: '/kl/', w: 'clock', e: '🕐', p: ['cl', 'ock'] },
        { l: 'fl', s: '/fl/', w: 'flag', e: '🚩', p: ['fl', 'ag'] },
        { l: 'gl', s: '/gl/', w: 'glass', e: '🥛', p: ['gl', 'ass'] },
        { l: 'pl', s: '/pl/', w: 'plane', e: '✈️', p: ['pl', 'ane'] },
      ]},
      { id: 'r-blends', title: 'R Blends', cn: 'R 连缀', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'br', s: '/br/', w: 'brush', e: '🪥', p: ['br', 'ush'] },
        { l: 'cr', s: '/kr/', w: 'crab', e: '🦀', p: ['cr', 'ab'] },
        { l: 'dr', s: '/dr/', w: 'dragon', e: '🐉', p: ['dr', 'agon'] },
        { l: 'fr', s: '/fr/', w: 'frog', e: '🐸', p: ['fr', 'og'] },
        { l: 'gr', s: '/gr/', w: 'grapes', e: '🍇', p: ['gr', 'apes'] },
        { l: 'tr', s: '/tr/', w: 'tree', e: '🌳', p: ['tr', 'ee'] },
      ]},
      { id: 'long-a-e', title: 'Long a (a_e)', cn: '长元音 a — a_e', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'a_e', s: '/eɪ/', w: 'cake', e: '🍰', p: ['c', 'a', 'k', 'e'] },
        { l: 'a_e', s: '/eɪ/', w: 'gate', e: '🚪', p: ['g', 'a', 't', 'e'] },
        { l: 'a_e', s: '/eɪ/', w: 'snake', e: '🐍', p: ['sn', 'a', 'k', 'e'] },
        { l: 'a_e', s: '/eɪ/', w: 'plane', e: '✈️', p: ['pl', 'a', 'n', 'e'] },
      ]},
      { id: 'long-a-ai-ay', title: 'Long a (ai / ay)', cn: '长元音 a — ai / ay', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ai', s: '/eɪ/', w: 'rain', e: '🌧️', p: ['r', 'ai', 'n'] },
        { l: 'ai', s: '/eɪ/', w: 'train', e: '🚂', p: ['tr', 'ai', 'n'] },
        { l: 'ai', s: '/eɪ/', w: 'sail', e: '⛵', p: ['s', 'ai', 'l'] },
        { l: 'ay', s: '/eɪ/', w: 'day', e: '🌞', p: ['d', 'ay'] },
        { l: 'ay', s: '/eɪ/', w: 'play', e: '🎮', p: ['pl', 'ay'] },
        { l: 'ay', s: '/eɪ/', w: 'hay', e: '🌾', p: ['h', 'ay'] },
      ]},
      { id: 'long-e', title: 'Long e (ee / ea)', cn: '长元音 e — ee / ea', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ee', s: '/iː/', w: 'bee', e: '🐝', p: ['b', 'ee'] },
        { l: 'ee', s: '/iː/', w: 'tree', e: '🌳', p: ['tr', 'ee'] },
        { l: 'ee', s: '/iː/', w: 'feet', e: '🦶', p: ['f', 'ee', 't'] },
        { l: 'ea', s: '/iː/', w: 'leaf', e: '🍃', p: ['l', 'ea', 'f'] },
        { l: 'ea', s: '/iː/', w: 'sea', e: '🌊', p: ['s', 'ea'] },
        { l: 'ea', s: '/iː/', w: 'seal', e: '🦭', p: ['s', 'ea', 'l'] },
      ]},
      { id: 'long-i-e', title: 'Long i (i_e)', cn: '长元音 i — i_e', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'i_e', s: '/aɪ/', w: 'bike', e: '🚲', p: ['b', 'i', 'k', 'e'] },
        { l: 'i_e', s: '/aɪ/', w: 'kite', e: '🪁', p: ['k', 'i', 't', 'e'] },
        { l: 'i_e', s: '/aɪ/', w: 'five', e: '5️⃣', p: ['f', 'i', 'v', 'e'] },
        { l: 'i_e', s: '/aɪ/', w: 'nine', e: '9️⃣', p: ['n', 'i', 'n', 'e'] },
      ]},
      { id: 'ending-le', title: 'Ending -le', cn: '词尾 -le 音', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ble', s: '/bəl/', w: 'table', e: '🪑', p: ['ta', 'ble'] },
        { l: 'ble', s: '/bəl/', w: 'cable', e: '🔌', p: ['ca', 'ble'] },
        { l: 'cle', s: '/kəl/', w: 'circle', e: '⭕', p: ['cir', 'cle'] },
        { l: 'dle', s: '/dəl/', w: 'candle', e: '🕯️', p: ['can', 'dle'] },
        { l: 'gle', s: '/gəl/', w: 'eagle', e: '🦅', p: ['ea', 'gle'] },
        { l: 'ple', s: '/pəl/', w: 'apple', e: '🍎', p: ['ap', 'ple'] },
      ]},
      { id: 'ending-y-long-e', title: 'Ending y (长 e)', cn: '词尾 y 发长 e 音', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'y', s: '/iː/', w: 'happy', e: '😊', p: ['hap', 'py'] },
        { l: 'y', s: '/iː/', w: 'baby', e: '👶', p: ['ba', 'by'] },
        { l: 'y', s: '/iː/', w: 'candy', e: '🍬', p: ['can', 'dy'] },
        { l: 'y', s: '/iː/', w: 'sunny', e: '☀️', p: ['sun', 'ny'] },
        { l: 'y', s: '/iː/', w: 'funny', e: '😄', p: ['fun', 'ny'] },
        { l: 'y', s: '/iː/', w: 'puppy', e: '🐶', p: ['pup', 'py'] },
      ]},
    ],
  },
  {
    id: 'g2', title: 'G2', cn: '长元音进阶 · R控制 · 双元音', color: 'amber', icon: 'ti-star',
    desc: 'y/igh、长 o/u、oo、r 控制元音、ou/ow/oi/oy、aw/ew',
    units: [
      { id: 'long-i-y-igh', title: 'Long i (y / igh)', cn: '长 i — y / igh', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'y', s: '/aɪ/', w: 'fly', e: '🪰', p: ['fl', 'y'] },
        { l: 'y', s: '/aɪ/', w: 'cry', e: '😢', p: ['cr', 'y'] },
        { l: 'y', s: '/aɪ/', w: 'sky', e: '🌌', p: ['sk', 'y'] },
        { l: 'igh', s: '/aɪ/', w: 'light', e: '💡', p: ['l', 'igh', 't'] },
        { l: 'igh', s: '/aɪ/', w: 'night', e: '🌙', p: ['n', 'igh', 't'] },
      ]},
      { id: 'long-o', title: 'Long o (o_e / oa / ow)', cn: '长 o — o_e / oa / ow', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'o_e', s: '/oʊ/', w: 'rose', e: '🌹', p: ['r', 'o', 's', 'e'] },
        { l: 'o_e', s: '/oʊ/', w: 'bone', e: '🦴', p: ['b', 'o', 'n', 'e'] },
        { l: 'oa', s: '/oʊ/', w: 'boat', e: '⛵', p: ['b', 'oa', 't'] },
        { l: 'oa', s: '/oʊ/', w: 'coat', e: '🧥', p: ['c', 'oa', 't'] },
        { l: 'ow', s: '/oʊ/', w: 'snow', e: '❄️', p: ['sn', 'ow'] },
        { l: 'ow', s: '/oʊ/', w: 'bow', e: '🎀', p: ['b', 'ow'] },
      ]},
      { id: 'short-oo', title: 'Short oo', cn: '短 oo /ʊ/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'oo', s: '/ʊ/', w: 'book', e: '📖', p: ['b', 'oo', 'k'] },
        { l: 'oo', s: '/ʊ/', w: 'cook', e: '👨‍🍳', p: ['c', 'oo', 'k'] },
        { l: 'oo', s: '/ʊ/', w: 'foot', e: '🦶', p: ['f', 'oo', 't'] },
        { l: 'oo', s: '/ʊ/', w: 'look', e: '👀', p: ['l', 'oo', 'k'] },
        { l: 'oo', s: '/ʊ/', w: 'good', e: '👍', p: ['g', 'oo', 'd'] },
        { l: 'oo', s: '/ʊ/', w: 'wood', e: '🪵', p: ['w', 'oo', 'd'] },
      ]},
      { id: 'long-u-oo', title: 'Long u / oo', cn: '长 u — u_e / oo', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'u_e', s: '/juː/', w: 'cube', e: '🧊', p: ['c', 'u', 'b', 'e'] },
        { l: 'u_e', s: '/juː/', w: 'tube', e: '🧪', p: ['t', 'u', 'b', 'e'] },
        { l: 'oo', s: '/uː/', w: 'moon', e: '🌙', p: ['m', 'oo', 'n'] },
        { l: 'oo', s: '/uː/', w: 'boot', e: '🥾', p: ['b', 'oo', 't'] },
        { l: 'oo', s: '/uː/', w: 'food', e: '🍔', p: ['f', 'oo', 'd'] },
      ]},
      { id: 'r-controlled-ar', title: 'R-Controlled ar', cn: 'R 控制元音 ar', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ar', s: '/ɑːr/', w: 'car', e: '🚗', p: ['c', 'ar'] },
        { l: 'ar', s: '/ɑːr/', w: 'star', e: '⭐', p: ['st', 'ar'] },
        { l: 'ar', s: '/ɑːr/', w: 'arm', e: '💪', p: ['ar', 'm'] },
        { l: 'ar', s: '/ɑːr/', w: 'farm', e: '🌾', p: ['f', 'ar', 'm'] },
      ]},
      { id: 'r-controlled-or', title: 'R-Controlled or', cn: 'R 控制元音 or', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'or', s: '/ɔːr/', w: 'corn', e: '🌽', p: ['c', 'or', 'n'] },
        { l: 'or', s: '/ɔːr/', w: 'fork', e: '🍴', p: ['f', 'or', 'k'] },
        { l: 'or', s: '/ɔːr/', w: 'horse', e: '🐴', p: ['h', 'or', 'se'] },
        { l: 'or', s: '/ɔːr/', w: 'born', e: '👶', p: ['b', 'or', 'n'] },
      ]},
      { id: 'r-controlled-er', title: 'R-Controlled er', cn: 'R 控制元音 er', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'er', s: '/ɜːr/', w: 'sister', e: '👧', p: ['sis', 'ter'] },
        { l: 'er', s: '/ɜːr/', w: 'mother', e: '👩', p: ['mo', 'ther'] },
        { l: 'er', s: '/ɜːr/', w: 'flower', e: '🌸', p: ['flow', 'er'] },
        { l: 'er', s: '/ɜːr/', w: 'water', e: '💧', p: ['wa', 'ter'] },
      ]},
      { id: 'r-controlled-ir-ur', title: 'R-Controlled ir/ur', cn: 'R 控制元音 ir/ur /ɜːr/', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ir', s: '/ɜːr/', w: 'bird', e: '🐦', p: ['b', 'ir', 'd'] },
        { l: 'ir', s: '/ɜːr/', w: 'girl', e: '👧', p: ['g', 'ir', 'l'] },
        { l: 'ir', s: '/ɜːr/', w: 'shirt', e: '👕', p: ['sh', 'ir', 't'] },
        { l: 'ir', s: '/ɜːr/', w: 'skirt', e: '👗', p: ['sk', 'ir', 't'] },
        { l: 'ur', s: '/ɜːr/', w: 'fur', e: '🧶', p: ['f', 'ur'] },
        { l: 'ur', s: '/ɜːr/', w: 'turtle', e: '🐢', p: ['t', 'ur', 'tle'] },
        { l: 'ur', s: '/ɜːr/', w: 'turn', e: '🔄', p: ['t', 'ur', 'n'] },
        { l: 'ur', s: '/ɜːr/', w: 'nurse', e: '👩‍⚕️', p: ['n', 'ur', 'se'] },
      ]},
      { id: 'diphthongs', title: 'Diphthongs', cn: '双元音 ou / ow / oi / oy', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'ow', s: '/aʊ/', w: 'cow', e: '🐄', p: ['c', 'ow'] },
        { l: 'ow', s: '/aʊ/', w: 'owl', e: '🦉', p: ['ow', 'l'] },
        { l: 'oi', s: '/ɔɪ/', w: 'coin', e: '🪙', p: ['c', 'oi', 'n'] },
        { l: 'oy', s: '/ɔɪ/', w: 'toy', e: '🧸', p: ['t', 'oy'] },
        { l: 'oy', s: '/ɔɪ/', w: 'boy', e: '👦', p: ['b', 'oy'] },
      ]},
      { id: 'aw-ew', title: 'aw / ew', cn: 'aw / ew 音', acts: ['flashcard', 'listen', 'match', 'spell'], items: [
        { l: 'aw', s: '/ɔː/', w: 'saw', e: '🪚', p: ['s', 'aw'] },
        { l: 'aw', s: '/ɔː/', w: 'draw', e: '✏️', p: ['dr', 'aw'] },
        { l: 'aw', s: '/ɔː/', w: 'paw', e: '🐾', p: ['p', 'aw'] },
        { l: 'ew', s: '/uː/', w: 'screw', e: '🔩', p: ['scr', 'ew'] },
        { l: 'ew', s: '/uː/', w: 'dew', e: '💧', p: ['d', 'ew'] },
      ]},
    ],
  },
];

export const ACTIVITY_LABELS = {
  flashcard: '学习卡', listen: '听音选择', match: '连线匹配', spell: '拼单词', trace: '描红写字'
};

export const ACTIVITY_ICONS = {
  flashcard: 'ti-cards', listen: 'ti-ear', match: 'ti-link', spell: 'ti-pencil', trace: 'ti-writing'
};

export function findLevel(levelId) {
  return CURRICULUM.find(l => l.id === levelId);
}

export function findUnit(levelId, unitId) {
  const level = findLevel(levelId);
  return level ? level.units.find(u => u.id === unitId) : null;
}
