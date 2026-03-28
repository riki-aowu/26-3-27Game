const Game = {
    state: {
        token: 1000, age: 18, month: 1, 
        stats: { strength: 50, intel: 50, charm: 50, morality: 50, kind: 50, fame: 0, fatigue: 0, favor: 20 },
        history: []
    },

    init() {
        this.loadGame();
        this.renderStats();
    },

    [span_2](start_span)// 疲劳影响逻辑[span_2](end_span)
    getGainModifier() {
        const f = this.state.stats.fatigue;
        if (f > 100) return 0;       // 过劳：颗粒无收
        if (f > 80) return 0.5;      // 疲惫：收益减半
        return 1.0;
    },

    // 执行日程逻辑
    runMonth(selectedTasks) {
        const mod = this.getGainModifier();
        let log = "本月总结：";
        
        selectedTasks.forEach(taskName => {
            const cfg = GameData.schedules[taskName];
            [span_3](start_span)// 扣钱/发工资[span_3](end_span)
            if(cfg.cost) this.state.token -= cfg.cost;
            if(cfg.income) this.state.token += cfg.income;
            
            // 增加属性 (受疲劳修正)
            for(let s in cfg.gain) {
                this.state.stats[s] += Math.floor(cfg.gain[s] * mod);
            }
            this.state.stats.fatigue += cfg.fatigue;
        });

        this.checkRandomEvent();
        this.state.month++;
        if(this.state.month > 12) this.checkEnding();
        this.renderStats();
    },

    // 随机事件触发
    checkRandomEvent() {
        if (Math.random() > 0.7) {
            const ev = GameData.randomEvents[Math.floor(Math.random() * GameData.randomEvents.length)];
            alert(`【${ev.title}】\n${ev.text}`);
            for(let s in ev.effect) this.state.stats[s] += ev.effect[s];
        }
    },

    [span_4](start_span)// 结局判定[span_4](end_span)
    checkEnding() {
        for (let key in GameData.endings) {
            if (GameData.endings[key].cond(this.state.stats)) {
                alert(`最终结局：${GameData.endings[key].name}`);
                break;
            }
        }
    },

    // 存档读档 (localStorage)
    saveGame() {
        localStorage.setItem('claude_save', JSON.stringify(this.state));
        alert("进度已保存到本地。");
    },

    loadGame() {
        const saved = localStorage.getItem('claude_save');
        if (saved) this.state = JSON.parse(saved);
    },

    renderStats() {
        const panel = document.getElementById('stats-ui');
        panel.innerHTML = Object.keys(this.state.stats).map(k => `
            <div class="stat-item">${k}: <span class="stat-val">${this.state.stats[k]}</span></div>
        `).join('');
        document.getElementById('token').innerText = this.state.token;
    }
};

window.onload = () => Game.init();
