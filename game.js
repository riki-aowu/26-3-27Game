const Game = {

    state: {
        token: 1000,
        age: 18,
        month: 1,
currentScene: "home",
        stats: {
            strength: 50,
            intel: 50,
            charm: 50,
            morality: 50,
            kindness: 50,
            fame: 0,
            fatigue: 0
        },

        social: {
            favor: 20,
            intimacy: 0
        },

        flags: {
            loveFlag: false
        }
    },

    init() {
        this.loadGame(0);
        this.initBGM();
        this.renderStats();
    },

    // =====================
    // 🎵 音乐（完全保留）
    // =====================
    initBGM() {
        this.bgm = {
            daily: document.getElementById("bgm-daily"),
            map: document.getElementById("bgm-map"),
            current: null
        };

        document.addEventListener("click", () => {
            this.playBGM("daily");
        }, { once: true });
    },

    playBGM(type) {
        const target = this.bgm[type];
        if (!target) return;

        if (this.bgm.current && this.bgm.current !== target) {
            this.bgm.current.pause();
            this.bgm.current.currentTime = 0;
        }

        target.volume = 0.5;
        target.play();
        this.bgm.current = target;
    },

    // =====================
    // UI工具
    // =====================
    openModal(html) {
        const overlay = document.getElementById("modal-overlay");
        const content = document.getElementById("modal-content");

        content.innerHTML = html;
        overlay.classList.remove("hidden");
    },

    closeModal() {
        document.getElementById("modal-overlay").classList.add("hidden");
    },

    // =====================
    // 💬 对话系统
    // =====================
    doTalk() {
        this.openModal(`
            <h2>对话</h2>
            <button onclick="Game.chooseTalk('chat')">闲聊 +2</button>
            <button onclick="Game.chooseTalk('encourage')">鼓励 +5</button>
            <button onclick="Game.chooseTalk('scold')">责备 -5</button>
            <button onclick="Game.chooseTalk('intimate')">亲密（需50好感）</button>
            <br><br>
            <button onclick="Game.closeModal()">关闭</button>
        `);
    },

    chooseTalk(type) {
        if (type === "chat") this.state.social.favor += 2;
        if (type === "encourage") this.state.social.favor += 5;
        if (type === "scold") this.state.social.favor -= 5;

        if (type === "intimate") {
            if (this.state.social.favor >= 50) {
                this.state.social.intimacy += 5;
            } else {
                alert("好感不够！");
            }
        }

        this.renderStats();
        this.closeModal();
    },

    // =====================
    // 🗺️ 出行系统
    // =====================
    openMap() {
        this.playBGM("map");

        this.openModal(`
            <h2>地图</h2>
            <button onclick="Game.goPlace('restaurant')">🍴餐厅</button>
            <button onclick="Game.goPlace('bar')">🍺酒吧</button>
            <button onclick="Game.goPlace('shop')">🎁礼品店</button>
            <button onclick="Game.goPlace('alley')">🌑暗巷</button>
            <button onclick="Game.goPlace('square')">🌕广场</button>
            <br><br>
            <button onclick="Game.backHome();Game.closeModal()">返回</button>
        `);
    },

    goPlace(place) {
        if (place === "restaurant") {
            this.state.stats.fatigue = Math.max(0, this.state.stats.fatigue - 20);
        }

        if (place === "square") {
            this.state.stats.fame += 5;
        }

        alert("你去了：" + place);
        this.renderStats();
    },

    backHome() {
        this.playBGM("daily");
    },

    // =====================
    // 📅 日程系统
    // =====================
    openSchedule() {
        const list = Object.keys(GameData.schedules);

        let html = "<h2>选择6个日程</h2>";

        list.forEach(name => {
            html += `<button onclick="Game.addTask('${name}')">${name}</button>`;
        });

        html += `
            <p>已选：<span id="task-count">0</span>/6</p>
            <button onclick="Game.confirmSchedule()">确定</button>
            <button onclick="Game.closeModal()">取消</button>
        `;

        this.selectedTasks = [];
        this.openModal(html);
    },

    addTask(name) {
        if (this.selectedTasks.length >= 6) return;

        this.selectedTasks.push(name);
        document.getElementById("task-count").innerText = this.selectedTasks.length;
    },

    confirmSchedule() {
        this.runMonth(this.selectedTasks);
        this.closeModal();
    },

    runMonth(tasks) {
        tasks.forEach(name => {
            const cfg = GameData.schedules[name];
            if (!cfg) return;

            if (cfg.cost) this.state.token -= cfg.cost;
            if (cfg.income) this.state.token += cfg.income;

            for (let k in cfg.gain) {
                if (this.state.stats[k] !== undefined) {
                    this.state.stats[k] += cfg.gain[k];
                }
            }

            this.state.stats.fatigue += cfg.fatigue;
        });

        this.state.month++;
        this.renderStats();
    },

    // =====================
    // 💾 存档系统（4槽位）
    // =====================
    saveGame(slot = 0) {
        localStorage.setItem("save_" + slot, JSON.stringify(this.state));
        alert("已存档到槽位 " + (slot + 1));
    },

    loadGame(slot = 0) {
        const data = localStorage.getItem("save_" + slot);
        if (data) this.state = JSON.parse(data);
    },

    openLoadPanel() {
        let html = "<h2>读档</h2>";

        for (let i = 0; i < 4; i++) {
            html += `<button onclick="Game.loadAndClose(${i})">存档${i + 1}</button><br>`;
        }

        html += `<button onclick="Game.closeModal()">关闭</button>`;

        this.openModal(html);
    },

    loadAndClose(i) {
        this.loadGame(i);
        this.renderStats();
        this.closeModal();
    },

    // =====================
    // UI刷新
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
