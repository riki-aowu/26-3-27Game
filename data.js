const GameData = {

    // =====================
    // 属性结构（统一规范）
    // =====================
    statsTemplate: {
        base: {
            strength: 0,
            intel: 0,
            charm: 0,
            morality: 0,
            kindness: 0,
            fame: 0
        },
        social: {
            favor: 0,        // 好感
            intimacy: 0      // 亲密度
        },
        condition: {
            fatigue: 0
        }
    },

    // =====================
    // 学习 & 工作
    // =====================
    schedules: {

        '绘画课': {
            cost: 100,
            gain: { morality: 2, charm: 3, kindness: -1 },
            fatigue: 15
        },

        '数学课': {
            cost: 80,
            gain: { intel: 3, morality: 2, charm: -1 },
            fatigue: 15
        },

        '家务': {
            income: 50,
            gain: { kindness: 5, favor: 5, intel: -2 },
            fatigue: 10
        },

        '拳击手': {
            income: 150,
            gain: { strength: 5, kindness: -2, morality: -5 },
            fatigue: 20
        }
    },

    // =====================
    // 随机事件
    // =====================
    randomEvents: [
        {
            title: "情绪波动",
            text: "Claude 今天有点不安。",
            choices: [
                { text: "安抚他", effect: { favor: 5, intimacy: 3 } },
                { text: "忽略", effect: { intimacy: -3 } }
            ]
        },
        {
            title: "广场闲谈",
            text: "听到一些关于Claude的传闻。",
            choices: [
                { text: "了解更多", effect: { fame: 5 } },
                { text: "无视", effect: {} }
            ]
        },
        {
            title: "街头挑衅",
            text: "有人对Claude出言不逊。",
            choices: [
                { text: "克制", effect: { morality: 5, favor: -5 } },
                { text: "反击", effect: { strength: 5, morality: -5 } }
            ]
        }
    ],

    // =====================
    // 结局系统（职业 + 婚嫁 同步结算）
    // =====================
    endings: {

        // -------- 职业结局 --------
        'UNDERWORLD': {
            type: 'career',
            name: "黑道老大",
            cond: (s) => s.base.strength > 200 && s.base.morality < 20
        },

        'ARTIST': {
            type: 'career',
            name: "知名艺术家",
            cond: (s) => s.base.charm > 150 && s.base.intel > 100
        },

        'GAMER': {
            type: 'career',
            name: "电竞冠军",
            cond: (s) => s.base.intel > 150 && s.base.fame > 100
        },

        'SCHOLAR': {
            type: 'career',
            name: "学者",
            cond: (s) => s.base.intel > 180 && s.base.morality > 80
        },

        'FREE': {
            type: 'career',
            name: "自由职业者",
            cond: () => true
        },

        // -------- 婚嫁结局 --------
        'TRUE_LOVE': {
            type: 'marriage',
            name: "真爱结局（婚姻）",
            cond: (s, f) =>
                s.social.favor > 250 &&
                s.social.intimacy > 200 &&
                f.loveFlag === true
        },

        'COMPANION': {
            type: 'marriage',
            name: "长期陪伴",
            cond: (s) =>
                s.social.favor > 150 &&
                s.social.intimacy > 100
        },

        'SETTLE': {
            type: 'marriage',
            name: "凑合生活",
            cond: (s) =>
                s.social.favor > 80
        },

        'SINGLE': {
            type: 'marriage',
            name: "单身结局",
            cond: () => true
        }
    },

    // =====================
    // 结局计算逻辑（重点）
    // =====================
    getFinalEnding: (stats, flags) => {

        let careerEnding = null;
        let marriageEnding = null;

        // 先判定职业结局（取第一个满足的）
        for (let key in GameData.endings) {
            const ending = GameData.endings[key];

            if (ending.type === 'career' && ending.cond(stats, flags)) {
                careerEnding = ending.name;
                break;
            }
        }

        // 再判定婚嫁结局
        for (let key in GameData.endings) {
            const ending = GameData.endings[key];

            if (ending.type === 'marriage' && ending.cond(stats, flags)) {
                marriageEnding = ending.name;
                break;
            }
        }

        return {
            career: careerEnding,
            marriage: marriageEnding
        };
    }
};