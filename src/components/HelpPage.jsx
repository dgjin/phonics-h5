import { Header } from './common.jsx';

const GUIDE = [
  { icon: 'ti-school', title: '闯关学习', desc: '6 个级别、32 个单元，5 种题型：学习卡、描红写字、听音选择、连线匹配、拼单词。每关最多得 3 颗星。' },
  { icon: 'ti-cards', title: '背单词', desc: '「翻卡复习」看中文意思与图片；「听写练习」听发音写出单词。可选美式 / 英式真人发音。' },
  { icon: 'ti-alert-triangle', title: '错题库', desc: '做题或听写答错的单词会自动收集，进入「我的 → 错题库」可专项练习，答对后自动移出。' },
  { icon: 'ti-flame', title: '每日打卡', desc: '每天学习任意一关就自动打卡，记录连续天数，养成学习习惯。' },
  { icon: 'ti-cloud', title: '账号与同步', desc: '登录后学习进度、错题、头像与昵称都会云端保存，换手机或电脑都能同步。' },
];

const FAQ = [
  { q: '没有声音 / 不发音怎么办？', a: '移动端浏览器要求先轻触屏幕任意位置一次来「解锁」声音。真人发音需要联网，离线时会自动改用设备内置语音。' },
  { q: '怎么切换美式 / 英式发音？', a: '在背单词页顶部的「美式 / 英式」开关切换，或到「我的 → 默认发音口音」里设置，全站通用并记忆。' },
  { q: '怎么修改头像和昵称？', a: '进入「我的」，点头像（带相机角标）上传一张图片即可；在「个人信息」里输入昵称后点「保存」。' },
  { q: '学习进度会丢失吗？', a: '登录账号后会自动云端保存并跨设备同步；未登录时进度存在当前设备，清理浏览器数据可能丢失。' },
  { q: '电脑 / 网页上怎么查看个人信息？', a: '网页端点击左上角的头像 / 昵称，即可进入「我的」查看和管理个人信息。' },
];

export default function HelpPage() {
  return (
    <div className="c-teal">
      <Header title="帮助" sub="使用指南 · 常见问题" color="teal" backTo="/me" />

      <div className="help-section">
        <div className="help-h">玩法介绍</div>
        {GUIDE.map((g) => (
          <div key={g.title} className="help-card">
            <div className="help-ic"><i className={'ti ' + g.icon}></i></div>
            <div className="help-ct">
              <div className="help-ct-title">{g.title}</div>
              <div className="help-ct-desc">{g.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="help-section">
        <div className="help-h">常见问题</div>
        {FAQ.map((f, i) => (
          <details key={i} className="faq">
            <summary><span>{f.q}</span><i className="ti ti-chevron-down faq-chev"></i></summary>
            <div className="faq-a">{f.a}</div>
          </details>
        ))}
      </div>

      <p className="foot">Phonics Fun · 自然拼读 H5 · 内容改编自 KizPhonics 分级教材</p>
    </div>
  );
}
