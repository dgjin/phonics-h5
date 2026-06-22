# -*- coding: utf-8 -*-
"""乌鸦喝水：以 crow-2.png 为母版，固定壶口区域逐页改画水位+石子，保证壶/乌鸦/背景一模一样。"""
import math, random
from PIL import Image, ImageDraw, ImageFilter

import os
MASTER = os.path.join(os.path.dirname(__file__), 'crow_master.png')   # crow-2 原图备份，避免被输出覆盖
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'stories')
EXT = {'crow-2': 'png', 'crow-3': 'png', 'crow-4': 'png', 'crow-5': 'jpg', 'crow-6': 'png'}  # 沿用 stories.js 现有引用扩展名
# 壶口椭圆（原图 1024² 坐标）
MOUTH = dict(cx=470, cy=520, rx=90, ry=33, tilt=-8)

def epoly(cx, cy, rx, ry, tilt=0, n=80):
    t = math.radians(tilt); ct, st = math.cos(t), math.sin(t)
    return [(cx + rx*math.cos(2*math.pi*i/n)*ct - ry*math.sin(2*math.pi*i/n)*st,
             cy + rx*math.cos(2*math.pi*i/n)*st + ry*math.sin(2*math.pi*i/n)*ct) for i in range(n)]

def paint(level, n_stones):
    base = Image.open(MASTER).convert('RGBA')
    ov = Image.new('RGBA', base.size, (0,0,0,0))
    d = ImageDraw.Draw(ov)
    m = MOUTH
    # 1) 整个壶口先压成深色 = 壶内深度（空的部分保持暗）
    d.polygon(epoly(m['cx'], m['cy'], m['rx'], m['ry'], m['tilt']), fill=(38,28,20,205))
    # 2) 石子先于水面绘制，沉在壶底（水会半透盖上去）
    rnd = random.Random(7)
    stones = []
    for i in range(n_stones):
        ang = rnd.uniform(0.12*math.pi, 0.88*math.pi)
        rr = rnd.uniform(0.1, 0.78)
        sx = m['cx'] + math.cos(ang)*m['rx']*rr
        sy = m['cy'] + math.sin(ang)*m['ry']*0.62 + m['ry']*0.18
        s = rnd.uniform(8, 13)
        stones.append((sx, sy, s))
        d.ellipse([sx-s, sy-s*0.8, sx+s, sy+s*0.8], fill=(110,108,114,235))
        d.ellipse([sx-s*0.55, sy-s*0.62, sx+s*0.1, sy], fill=(168,168,175,210))
    # 3) 水面：竖直填充比例随 level 大幅变化（低=底部一小汪，高=几乎填满壶口）
    ryw = m['ry']*(0.30 + 0.68*level)
    rxw = m['rx']*(0.55 + 0.43*level)
    cyw = m['cy'] + m['ry'] - ryw          # 水面贴着壶底往上长
    lighten = int(level*55)
    water = (62+lighten, 128+lighten//2, 150+lighten//3)
    main_a = int(150 + 65*level)           # 高水位更实
    for df, da in [(1.0, main_a), (0.82, 80)]:
        d.polygon(epoly(m['cx'], cyw, rxw*df, ryw*df, m['tilt']), fill=water + (da,))
    # 水面高光条（高水位更亮更宽）
    d.polygon(epoly(m['cx']-rxw*0.16, cyw-ryw*0.34, rxw*(0.45+0.15*level), ryw*0.28, m['tilt']),
              fill=(205, 228, 234, int(110+70*level)))
    ov = ov.filter(ImageFilter.GaussianBlur(1.2))
    return Image.alpha_composite(base, ov).convert('RGB')

# 页 -> (水位, 石子数)  对应 crow-2..6
PAGES = {
    'crow-2': (0.26, 0),   # 发现一壶水（水浅）
    'crow-3': (0.14, 0),   # 水太浅了（很低、大片深色）
    'crow-4': (0.30, 4),   # 丢进小石头
    'crow-5': (0.62, 8),   # 水慢慢升上来
    'crow-6': (0.94, 12),  # 喝到水啦（几乎满）
}

if __name__ == '__main__':
    import sys
    test = '--test' in sys.argv
    for name, (lv, ns) in PAGES.items():
        img = paint(lv, ns)
        path = (f'/tmp/{name}_new.jpg' if test else f'{OUT}/{name}.{EXT[name]}')
        img.save(path, quality=92)
        print('saved', path)
