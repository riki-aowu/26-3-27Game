const Game = {

    state: {
        token: 1000,
        age: 18,
        month: 1,
        time: 0, // 0早 1午 2晚
        actionsLeft: 3,
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
        }
    },

    init() {
        this.initBGM();
        this.renderStats();
        this.updateTimeUI();
    },

    // 🎵 音乐（保留）
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
    // ⏰ 时间系统
    // =====================
    nextTime() {
        this.state.time++;

        if (this.state.time > 2) {
            this.state.time = 0;
            this.state.month++;
            this.state.actionsLeft = 3;
            alert("进入下个月");
        }

        this.updateTimeUI();
    },

    updateTimeUI() {
        const arr = ["早", "午", "晚"];
        document.getElementById("date-display").innerText =
            `2026年 ${this.state.month}月 / ${arr[this.state.time]}`;
    },

    useAction() {
        if (this.state.actionsLeft <= 0) {
            alert("本月行动次数已用完！");
            return false;
        }

        this.state.actionsLeft--;
        this.nextTime();
        return true;
    },

    // =====================
    // 🎬 场景
    // =====================
   changeScene(scene) {
    this.state.currentScene = scene;

    const layer = document.getElementById("scene-layer");
    const log = document.getElementById("event-log");

    if (scene === "home") {
        layer.style.background = "#252a34";
        this.playBGM("daily");

        log.innerHTML = "“User，准备好开始今天的计划了吗？”";
    }

    if (scene === "map") {
        layer.style.background = "url('assets/map.jpg') center/cover";
        this.playBGM("map");
    }

    if (scene === "restaurant") {
        layer.style.background = "url('assets/bg_restaurant.jpg') center/cover";
    }
}，

    // =====================
    // 💬 对话（每月一次）
    // =====================
    doTalk() {
        if (!this.useAction()) return;

        this.openModal(`
        <h3>对话</h3>
        <button onclick="Game.talkEffect(2)">闲聊 +2</button>
        <button onclick="Game.talkEffect(5)">鼓励 +5</button>
        <button onclick="Game.talkEffect(-5)">责备 -5</button>
        `);
    },

    talkEffect(val) {
        this.state.social.favor += val;
        this.renderStats();
        this.closeModal();
    },

    // =====================
    // 🗺️ 出行
    // =====================
    openMap() {
    if (!this.useAction()) return;

    this.changeScene("map");

    const log = document.getElementById("event-log");

    log.innerHTML = `
    【地图】
    <br>
    🍴 <button onclick="Game.enterPlace('restaurant')">餐厅</button>
    🍺 <button onclick="Game.enterPlace('bar')">酒吧</button>
    🎁 <button onclick="Game.enterPlace('shop')">礼品店</button>
    🌑 <button onclick="Game.enterPlace('alley')">暗巷</button>
    🌕 <button onclick="Game.enterPlace('square')">广场</button>
    <br><br>
    <button onclick="Game.changeScene('home')">回家</button>
    `;
}，

    enterPlace(place) {
        this.changeScene(place);

        document.getElementById("event-log").innerHTML = `
        【餐厅】
        <br>
        拉面 -20疲劳 <button onclick="Game.eat(20)">吃</button>
        <br>
        牛排 -30疲劳 <button onclick="Game.eat(30)">吃</button>
        <br><br>
        <button onclick="Game.changeScene('home')">回家</button>
        `;
    },

    eat(val) {
        this.state.stats.fatigue = Math.max(0, this.state.stats.fatigue - val);
        this.renderStats();
    },

    // =====================
    // 📅 日程 or 休息
    // =====================
    openSchedule() {

        let html = "<h3>安排 / 休息（二选一）</h3>";

        html += `<button onclick="Game.rest()">在家休息</button><br><br>`;

        Object.keys(GameData.schedules)
         .filter(n => n !== "在家休息")
         .forEach(n => {
        html += `<button onclick="Game.addTask('${n}')">${n}</button>`;
    });

        html += `<p id="task-list"></p>`;
        html += `<button onclick="Game.confirmSchedule()">确定</button>`;

        this.selectedTasks = [];
        this.openModal(html);
    },

    addTask(name) {
        if (this.selectedTasks.length >= 6) return;

        this.selectedTasks.push(name);

        document.getElementById("task-list").innerText =
            "已选：" + this.selectedTasks.join(",");
    },

    confirmSchedule() {
        this.runMonth(this.selectedTasks);
        this.closeModal();
    },

    rest() {
        this.state.stats.fatigue = Math.max(0, this.state.stats.fatigue - 20);
        this.nextTime();
        this.closeModal();
    },

    runMonth(tasks) {
        tasks.forEach(name => {
            const cfg = GameData.schedules[name];
            if (!cfg) return;

            if (cfg.cost) this.state.token -= cfg.cost;
            if (cfg.income) this.state.token += cfg.income;

            for (let k in cfg.gain) {
                this.state.stats[k] += cfg.gain[k];
            }

            this.state.stats.fatigue += cfg.fatigue;
        });

        this.nextTime();
        this.renderStats();
    },

    // =====================
    // 💾 存档（弹出4格）
    // =====================
    saveGame() {
        let html = "<h3>选择存档</h3>";

        for (let i = 0; i < 4; i++) {
            html += `<button onclick="Game.doSave(${i})">存档${i + 1}</button><br>`;
        }

        this.openModal(html);
    },

    doSave(i) {
        localStorage.setItem("save_" + i, JSON.stringify(this.state));
        alert("已保存！");
        this.closeModal();
    },

    openLoadPanel() {
        let html = "<h3>读取存档</h3>";

        for (let i = 0; i < 4; i++) {
            html += `<button onclick="Game.loadAndClose(${i})">存档${i + 1}</button><br>`;
        }

        this.openModal(html);
    },

    loadAndClose(i) {
        const data = localStorage.getItem("save_" + i);
        if (data) this.state = JSON.parse(data);

        this.renderStats();
        this.closeModal();
    },

    // =====================
    // UI
    // =====================
    openModal(html) {
        document.getElementById("modal-content").innerHTML = html;
        document.getElementById("modal-overlay").classList.remove("hidden");
    },

    closeModal() {
        document.getElementById("modal-overlay").classList.add("hidden");
    },

    renderStats() {
        const panel = document.getElementById("stats-ui");

        let html = "";

        for (let k in this.state.stats) {
            html += `<div>${k}: ${this.state.stats[k]}</div>`;
        }

        html += `<div>好感: ${this.state.social.favor}</div>`;
        html += `<div>亲密: ${this.state.social.intimacy}</div>`;
        html += `<div>行动: ${this.state.actionsLeft}</div>`;

        panel.innerHTML = html;
        document.getElementById("token").innerText = this.state.token;
    }
};

window.onload = () => Game.init();
