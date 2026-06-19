export const COUPLE = {
  groomZh: "周健声",
  brideZh: "陈晓琪",
  groomEn: "ZHOU",
  brideEn: "CHEN",
};

export const WEDDING_DATE = new Date("2026-07-18T15:30:00+08:00");
export const WEDDING_DATE_LABEL = "2026 · 07 · 18 · 周六 · 15:30";
export const WEDDING_DATE_FULL = "2026 年 7 月 18 日";
export const WEDDING_DATE_FOOTER = "盛夏 · 七月十八 · 期待与您相见";

export const VENUE = {
  name: "深礼堂 · 后海店",
  address: "深圳市南山区南海大道 1090 号招商花园城 L5 层",
  shortAddress: "南海大道1090号 招商花园城L5",
};

export const MAP_QUERY = encodeURIComponent(`${VENUE.name} ${VENUE.address}`);

export const SCHEDULE = [
  { time: "15:10", title: "签到入场", desc: "签到留念 · 迎宾合影" },
  { time: "15:20", title: "游园活动", desc: "自由活动 · 漫步花园" },
  { time: "16:30", title: "婚礼仪式", desc: "证婚致意 · 交换戒指 · 互许诺言" },
  { time: "17:20", title: "自由合影", desc: "亲友留影 · 定格欢聚时光" },
  { time: "18:30", title: "晚宴开席", desc: "举杯共贺 · 共享盛宴" },
  { time: "20:00", title: "甜蜜礼成", desc: "余韵悠长 · 感谢相伴" },
];

export const BGM_SRC = "/bgm.mp3";
