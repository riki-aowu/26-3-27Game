const Game = {

    state: {
        token: 1000,
        age: 18,
        month: 1,

        stats: {
            strength: 50,
            intel: 50,
            charm: 50,
            morality: 50,
            kindness: 50,   // ✅ 统一用 kindness
            fame: 0,
            fatigue: 0
        },

initBGM() {
    this.bgm = {
        daily: document.getElementById("bgm-daily"),
        map: document.getElementById("bgm-map"),
        current: null
    };

    // 用户点击后才能播放（iOS限制）
    document.addEventListener("click", () => {
        this.playBGM("daily");
    }, { once: true });
}
        social: {
            favor: 20,
            intimacy: 0
        },

        flags: {
            loveFlag: false
        },

        history: []
    },

    init() {
        this.loadGame();
        this.initBGM();
        this.renderStats();
    },

    // =====================
    // 疲劳修正
    // =====================
    getGainModifier() {
        const f = this.state.stats.fatigue;

        if (f > 100) return 0;
        if (f > 80) return 0.5;
        if (f > 50) return 0.8;

        return 1.0;
    },

    // =====================
    // 月行动
    // =====================
    runMonth(selectedTasks) {

        const mod = this.getGainModifier();

        selectedTasks.forEach(taskName => {

            const cfg = GameData.schedules[taskName];
            if (!cfg) return;

            // 扣钱 / 收入
            if (cfg.cost) this.state.token -= cfg.cost;
            if (cfg.income) this.state.token += cfg.income;

            // 属性增长
            for (let s in cfg.gain) {
                if (this.state.stats[s] !== undefined) {
                    this.state.stats[s] += Math.floor(cfg.gain[s] * mod);
                }
            }

            // 疲劳上限
            this.state.stats.fatigue = Math.min(
                150,
                this.state.stats.fatigue + cfg.fatigue
            );
        });

        this.checkRandomEvent();

        this.state.month++;

        if (this.state.month > 12) {
            this.checkEnding();
        }

        this.renderStats();
    },

    // =====================
    // 随机事件
    // =====================
    checkRandomEvent() {
        if (Math.random() > 0.7) {

            const ev = GameData.randomEvents[
                Math.floor(Math.random() * GameData.randomEvents.length)
            ];

            alert(`【${ev.title}】\n${ev.text}`);

            if (!ev.effect) return;

            for (let s in ev.effect) {
                if (this.state.stats[s] !== undefined) {
                    this.state.stats[s] += ev.effect[s];
                }
            }
        }
    },

    // =====================
    // 结局（核心升级版）
    // =====================
    checkEnding() {

        const result = GameData.getFinalEnding(this.state, this.state.flags);

        if (result.career) {
            alert(`职业结局：${result.career}`);
        }

        if (result.marriage) {
            alert(`婚嫁结局：${result.marriage}`);
        }
    },

    // =====================
    // 存档
    // =====================
    saveGame() {
        localStorage.setItem('claude_save', JSON.stringify(this.state));
        alert("已保存。");
    },

    loadGame() {
        const saved = localStorage.getItem('claude_save');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    },

    // =====================
    // UI
    // =====================
    renderStats() {

        const panel = document.getElementById('stats-ui');

        panel.innerHTML = Object.keys(this.state.stats).map(k => {
            return `<div>${k}: ${this.state.stats[k]}</div>`;
        }).join('');

        document.getElementById('token').innerText = this.state.token;
    }
};

window.onload = () => Game.init();