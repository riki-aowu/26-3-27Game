// ChatGPT 重构版 data.js
const GameData = {

    statsTemplate: {
        stats: {
            hp: 30,
            int: 30,
            charm: 30,
            moral: 30,
            kindness: 30,
            mana: 0,
            power: 0,
            fame: 0
        },
        state: {
            fatigue: 0,
            favor: 0,
            intimacy: 0
        }
    },

    schedules: {
        '绘画课': {
            cost: 100,
            gain: { "stats.moral": 2, "stats.charm": 3, "stats.kindness": -1 },
            fatigue: 15
        },
        '数学课': {
            cost: 80,
            gain: { "stats.int": 3, "stats.moral": 2, "stats.charm": -1 },
            fatigue: 15
        },
        '家务': {
            income: 50,
            gain: { "stats.kindness": 5, "state.favor": 5, "stats.int": -2 },
            fatigue: 10
        },
        '拳击手': {
            income: 150,
            gain: { "stats.power": 5, "stats.kindness": -2, "stats.moral": -5 },
            fatigue: 20
        },
        '在家休息': {
            gain: {},
            fatigue: -20
        }
    }
};
