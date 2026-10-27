"""定義新增的領域主題（2026-10-27：政治、健康、教育、科技、娛樂演藝、體育、國際、生活旅遊）。
只寫 theme.json（色票、關鍵字、圖樣設定、風險提醒）；設計素材由 make_theme_assets.py 用 Codex 一次生成，內建在技能裡，
這樣同事的電腦日後不必為了主題素材動用 Codex。
用法：python -X utf8 define_themes_v2.py [--only politics,health]"""
import argparse, colorsys, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
THEMES = os.path.abspath(os.path.join(HERE, "..", "themes"))


def hx(c): return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))
def to_hex(rgb): return "#%02x%02x%02x" % tuple(max(0, min(255, round(v))) for v in rgb)
def mix(c, t, k):
    return to_hex([a + (b - a) * k for a, b in zip(hx(c), t)])


def palette(primary, accent, cyan, ink):
    r, g, b = hx(primary)
    return {"coral": primary, "coral_rgb": f"{r},{g},{b}", "hot": mix(primary, (255, 255, 255), .28), "soft": mix(primary, (255, 255, 255), .6),
            "on": mix(primary, (0, 0, 0), .88), "indigo": accent, "cyan": cyan, "green": "#3ddc97", "red": "#ff4d5e", "gold": "#ffd36b", "ink": ink}


# id, 名稱, 說明, 主色, 輔色（indigo 欄）, cyan 欄, 深底色, bpm, art, 關鍵字, 風險提醒
SPECS = [
    ("politics", "政治", "政治時事主題：鋼藍銀灰主色、香檳金輔色；刻意避開任何政黨的代表色與旗幟，保持中性",
     "#7d98c4", "#c9a24a", "#9fd0e8", "#0a1220", 96,
     dict(primary="brushed steel-blue silver", secondary="champagne gold",
          badge_motif="a classical balance scale with a small parliament dome behind it, in steel silver and champagne gold, no flags, no party colors",
          nameplate_icon="a small white parliament-dome icon",
          panel_motif="very dark navy civic background: faint marble columns and a softly lit parliament dome silhouette, out-of-focus bokeh, no flags, no people"),
     ["總統", "立委", "立法院", "國會", "選舉", "候選人", "投票", "政黨", "市長", "縣市長", "行政院", "內閣", "施政", "民調", "競選", "造勢", "罷免", "公投", "部會首長", "國防", "競選總部", "競總", "支持者", "當選", "連任", "陣營", "拜票", "政見", "候選", "立法委員"],
     "政治人物與選舉內容：請由主管把關、確認可對外，避免傾向性用語；本主題刻意不用任何政黨代表色"),
    ("health", "健康醫療", "健康醫療主題：薄荷青綠主色、冰藍輔色；心電圖與十字圖示，乾淨明亮的醫療感",
     "#2ec4a6", "#7be7ff", "#7be7ff", "#071a1a", 90,
     dict(key="magenta", primary="mint green", secondary="ice cyan",
          badge_motif="a stylized heart with a heartbeat ECG line and a small medical cross, in mint green and white",
          nameplate_icon="a small white heart-with-pulse icon",
          panel_motif="very dark deep-teal medical background: faint DNA helix and a soft glowing ECG line, out-of-focus clean clinic bokeh, no people"),
     ["健康", "醫院", "醫師", "病患", "疾病", "癌症", "疫苗", "流感", "門診", "健保", "藥物", "症狀", "保健", "血壓", "血糖", "膽固醇", "心臟", "睡眠", "飲食", "運動"],
     "醫療健康資訊：請由醫師或專業人員審核，不可當成診斷或治療建議"),
    ("education", "教育校園", "教育校園主題：天空藍主色、陽光黃輔色；書本與學士帽圖示",
     "#4f9dff", "#ffd23f", "#6fd3ff", "#08142a", 98,
     dict(primary="sky blue", secondary="sunny yellow",
          badge_motif="an open book with a graduation cap, in sky blue and sunny yellow",
          nameplate_icon="a small white open-book icon",
          panel_motif="very dark navy-blue campus background: faint chalk diagrams and soft out-of-focus library shelves, no people"),
     ["學校", "教育部", "學生", "老師", "考試", "大學", "升學", "課綱", "學測", "補習", "校園", "教授", "研究生", "獎學金", "幼兒園", "畢業", "招生", "學費"],
     ""),
    ("tech", "科技", "科技主題：電光青主色、洋紅輔色；晶片與電路圖示",
     "#22d3ee", "#e879f9", "#e879f9", "#070b1a", 112,
     dict(primary="electric cyan", secondary="magenta",
          badge_motif="a glowing microchip with circuit traces, in cyan and magenta",
          nameplate_icon="a small white microchip icon",
          panel_motif="very dark blue-black futuristic background: faint circuit traces and a soft data-stream glow, out-of-focus neon bokeh, no people"),
     ["AI", "人工智慧", "晶片", "科技", "手機", "軟體", "演算法", "資安", "機器人", "雲端", "5G", "電動車", "新創", "程式", "大型語言模型", "資料中心", "駭客", "App"],
     ""),
    ("entertainment", "娛樂演藝", "娛樂演藝主題：洋紅粉主色、金色輔色；聚光燈與星星圖示",
     "#ff5fb0", "#ffd36b", "#ffb86b", "#16081a", 118,
     dict(primary="vivid magenta-pink", secondary="gold",
          badge_motif="a spotlight star with stage light beams, in magenta and gold",
          nameplate_icon="a small white star icon",
          panel_motif="very dark plum-black stage background: faint spotlight cones and out-of-focus concert lights bokeh, no people"),
     ["演唱會", "藝人", "歌手", "演員", "電影", "影集", "票房", "綜藝", "金曲獎", "金馬獎", "經紀公司", "粉絲", "新歌", "專輯", "演出", "舞台", "戲劇", "導演"],
     ""),
    ("sports", "體育", "體育主題：萊姆綠主色、橘色輔色；體育場與桂冠圖示",
     "#9be15d", "#ff9f43", "#ffd166", "#0b1608", 124,
     dict(key="magenta", primary="lime green", secondary="orange",
          badge_motif="a stylized stadium arc with a ball and a laurel wreath, in lime green and orange",
          nameplate_icon="a small white laurel-wreath icon",
          panel_motif="very dark green-black stadium background: faint track lanes and out-of-focus stadium floodlights bokeh, no people"),
     ["比賽", "球賽", "棒球", "籃球", "冠軍", "奧運", "球員", "教練", "世界盃", "中職", "羽球", "金牌", "亞運", "聯賽", "季後賽", "對手", "選手", "排球"],
     ""),
    ("international", "國際", "國際主題：銀灰白主色、珊瑚紅輔色；地球與經緯線圖示",
     "#b6c2d9", "#ff6b6b", "#8ec5ff", "#0a1018", 92,
     dict(primary="cool silver-white", secondary="coral red",
          badge_motif="a wireframe globe with latitude and longitude lines, in silver-white and coral red",
          nameplate_icon="a small white globe icon",
          panel_motif="very dark slate-navy background: faint world-map grid lines and a softly glowing globe edge, out-of-focus city-light bokeh, no people, no flags"),
     ["美國", "中國", "日本", "歐盟", "烏克蘭", "聯合國", "峰會", "關稅", "制裁", "外交", "國際", "以色列", "北約", "G20", "兩岸", "俄羅斯", "韓國", "南海"],
     "國際與兩岸議題：請由主管把關用語與地圖、旗幟的呈現是否合適"),
    ("lifestyle", "生活旅遊", "生活旅遊主題：蜜桃橘主色、天空藍輔色；背包與路線圖示，輕鬆明亮",
     "#ff9e6d", "#6cc3ff", "#6cc3ff", "#1a0f0a", 104,
     dict(primary="warm peach orange", secondary="sky blue",
          badge_motif="a backpack with a winding route line and a small map pin, in peach orange and sky blue",
          nameplate_icon="a small white map-pin icon",
          panel_motif="very dark warm-brown-navy background: faint winding route lines and soft out-of-focus street-lantern bokeh, no people"),
     ["旅遊", "美食", "餐廳", "景點", "觀光", "住宿", "夜市", "咖啡", "連假", "機票", "飯店", "露營", "伴手禮", "小吃", "民宿", "行程", "打卡"],
     ""),
]

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--only", default="")
    a = ap.parse_args(); only = {x for x in a.only.split(",") if x}
    for id_, name, desc, pri, acc, cy, ink, bpm, art, kws, risk in SPECS:
        if only and id_ not in only:
            continue
        d = os.path.join(THEMES, id_); os.makedirs(os.path.join(d, "assets"), exist_ok=True)
        th = {"id": id_, "name": name, "version": 1, "desc": desc, "palette": palette(pri, acc, cy, ink), "bgm": {"bpm": bpm},
              "match_keywords": kws, "assets_file": "assets/assets.json", "scenes": [], "art": art}
        if risk:
            th["risk_note"] = risk
        json.dump(th, open(os.path.join(d, "theme.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        print("寫入", id_, name, pri)
