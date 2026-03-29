// ChatGPT 重构版 game.js（关键改动版）

// ⭐ 新增函数
function changeStat(state, path, value) {
    const keys = path.split(".");
    let obj = state;

    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }

    const key = keys[keys.length - 1];

    if (typeof obj[key] !== "number") obj[key] = 0;

    obj[key] += value;

    if (path.includes("state")) {
        obj[key] = Math.max(0, Math.min(100, obj[key]));
    } else {
        obj[key] = Math.min(999, obj[key]);
    }
}

// ⭐ 替换 runMonth 逻辑示例
function applySchedule(state, cfg) {
    if (cfg.cost) state.token -= cfg.cost;
    if (cfg.income) state.token += cfg.income;

    for (let path in cfg.gain) {
        changeStat(state, path, cfg.gain[path]);
    }

    state.state.fatigue += cfg.fatigue;
}
