export const COUPLE = {
  groomZh: "周健声",
  brideZh: "陈晓琪",
  groomEn: "ZHOU",
  brideEn: "CHEN",
};

export const WEDDING_DATE = new Date("2026-07-18T15:00:00+08:00");
export const WEDDING_DATE_LABEL = "2026 · 07 · 18 · 周六 · 15:00";
export const WEDDING_DATE_FULL = "2026 年 7 月 18 日";
export const WEDDING_DATE_FOOTER = "盛夏 · 七月十八 · 期待与您相见";

export const VENUE = {
  name: "深礼堂 · 后海店",
  address: "深圳市南山区南海大道 1090 号招商花园城 L5 层",
  shortAddress: "南海大道1090号 招商花园城L5",
};

export const MAP_QUERY = encodeURIComponent(`${VENUE.name} ${VENUE.address}`);

export const SCHEDULE = [
  { time: "14:30", title: "宾客签到", desc: "签到留念 · 入席候场" },
  { time: "15:00", title: "婚礼仪式", desc: "证婚 · 交换戒指 · 互许诺言" },
  { time: "16:00", title: "合影留念", desc: "亲友合影 · 茶歇时光" },
  { time: "17:30", title: "晚宴开席", desc: "举杯共贺 · 共享盛宴" },
  { time: "20:00", title: "甜蜜礼成", desc: "余韵悠长 · 感谢相伴" },
];

export const BGM_SRC = "/bgm.mp3";
