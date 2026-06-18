/* 课程单词中文释义（用于背单词卡片背面 / 听写提示）。
 * 取与课程 emoji 对应的常见义项。 */
export const WORD_CN = {
  ant: '蚂蚁', ball: '球', cat: '猫', dog: '狗', egg: '鸡蛋', fish: '鱼',
  goat: '山羊', hen: '母鸡', igloo: '冰屋', jet: '喷气式飞机', kite: '风筝', lion: '狮子',
  map: '地图', nut: '坚果', octopus: '章鱼', pig: '猪', queen: '女王', rabbit: '兔子',
  sun: '太阳', tiger: '老虎', umbrella: '雨伞', van: '厢式货车', web: '蜘蛛网', box: '盒子',
  'yo-yo': '溜溜球', zebra: '斑马',
  bat: '蝙蝠', hat: '帽子', fan: '扇子', bag: '书包', bed: '床', pen: '钢笔', net: '网',
  rat: '老鼠', mat: '垫子', man: '男人', can: '罐头', pan: '平底锅', ham: '火腿',
  six: '六', lip: '嘴唇', bin: '垃圾桶', fin: '鱼鳍', pin: '大头针', fox: '狐狸', log: '原木',
  mop: '拖把', pot: '锅', bug: '虫子', cup: '杯子', bus: '公交车', rug: '小地毯', wig: '假发',
  dig: '挖', win: '赢', duck: '鸭子', sock: '袜子', rock: '岩石', ring: '戒指', king: '国王', wing: '翅膀',
  snail: '蜗牛', star: '星星', spoon: '勺子', swim: '游泳', skate: '滑冰', slide: '滑梯',
  chair: '椅子', cheese: '奶酪', chick: '小鸡', cherry: '樱桃', ship: '轮船', shoe: '鞋子',
  shell: '贝壳', sheep: '绵羊', thumb: '拇指', three: '三', bath: '洗澡', teeth: '牙齿',
  whale: '鲸鱼', wheel: '轮子', phone: '电话', photo: '照片',
  blue: '蓝色', clock: '时钟', flag: '旗帜', glass: '玻璃杯', plane: '飞机', brush: '刷子',
  crab: '螃蟹', dragon: '龙', frog: '青蛙', grapes: '葡萄', tree: '树', cake: '蛋糕', gate: '大门',
  snake: '蛇', rain: '雨', train: '火车', sail: '帆', day: '白天', play: '玩', hay: '干草',
  bee: '蜜蜂', feet: '脚', leaf: '叶子', sea: '大海', seal: '海豹', bike: '自行车', five: '五', nine: '九',
  fly: '苍蝇', cry: '哭', sky: '天空', light: '灯', night: '夜晚', rose: '玫瑰', bone: '骨头',
  boat: '小船', coat: '外套', snow: '雪', bow: '蝴蝶结', cube: '方块', tube: '试管', moon: '月亮',
  boot: '靴子', food: '食物', car: '汽车', corn: '玉米', fork: '叉子', flower: '花', cow: '奶牛',
  owl: '猫头鹰', coin: '硬币', toy: '玩具', boy: '男孩', saw: '锯子', draw: '画画', paw: '爪子',
  screw: '螺丝', dew: '露珠',
};

export function cnOf(word) {
  return WORD_CN[String(word).toLowerCase()] || '';
}
