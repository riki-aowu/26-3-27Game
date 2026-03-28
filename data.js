const GameData = {
    [span_0](start_span)// 学习与工作配置[span_0](end_span)
    schedules: {
        '绘画课': { cost: 100, gain: { morality: 2, charm: 3, kind: -1 }, fatigue: 15 },
        '数学课': { cost: 80, gain: { intel: 3, morality: 2, charm: -1 }, fatigue: 15 },
        '家务': { income: 50, gain: { favor: 5, kind: 5, intel: -2 }, fatigue: 10 },
        '拳击手': { income: 150, gain: { strength: 5, kind: -2, morality: -5 }, fatigue: 20 }
    },

    // 随机月度事件
    randomEvents: [
        { title: "电路过热", text: "Claude 今天有点发烧，需要修理吗？", effect: { fatigue: 20, favor: 5 } },
        { title: "旧书市集", text: "你们在广场淘到了珍贵的程序代码。", effect: { intel: 10, token: -50 } },
        { title: "街头挑衅", text: "有混混嘲笑 Claude 是破铜烂铁。", effect: { morality: -5, strength: 5 } }
    ],

    [span_1](start_span)// 结局配置[span_1](end_span)
    endings: {
        'UNDERWORLD': { name: "黑道老大", cond: (s) => s.strength > 200 && s.morality < 20 },
        'ARTIST': { name: "知名艺术家", cond: (s) => s.charm > 150 && s.intel > 100 },
        'GAMER': { name: "电竞冠军", cond: (s) => s.fame > 150 && s.intel > 100 },
        'TRUE_LOVE': { name: "跨越种族的爱 (婚嫁结局)", cond: (s) => s.favor > 250 && s.kind > 150 },
        'FREELANCER': { name: "自由职业者 (混子)", cond: (s) => true } // 兜底结局
    }
};
