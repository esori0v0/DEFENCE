const stages = [
  {
    title: "1 STAGE. 마을 입구",
    desc: "마을 입구로 몰려오는 늑대를 막으세요.",
    enemy: "🐺",
    drops: ["늑대 털", "찢어진 울타리", "작은 발자국"]
  },
  {
    title: "2 STAGE. 숲속 추적",
    desc: "숲 안쪽에서 수상한 흔적을 찾고 박쥐 무리를 막으세요.",
    enemy: "🦇",
    drops: ["검은 깃털", "마법 가루", "부러진 화살"]
  },
  {
    title: "3 STAGE. 늑대 소굴",
    desc: "양 실종 사건의 진짜 원인을 밝히고 보스를 처치하세요.",
    enemy: "🧙",
    drops: ["검은 마법석", "조종 목걸이", "왕국 문장"]
  }
];

let currentStage = 0;
let collectedItems = [];
let lastReward = [];

const titleScreen = document.getElementById("titleScreen");
const dialogScreen = document.getElementById("dialogScreen");
const battleScreen = document.getElementById("battleScreen");
const clearScreen = document.getElementById("clearScreen");
const endingScreen = document.getElementById("endingScreen");

const startGameBtn = document.getElementById("startGameBtn");
const clearStageBtn = document.getElementById("clearStageBtn");
const nextStageBtn = document.getElementById("nextStageBtn");
const restartBtn = document.getElementById("restartBtn");

const stageTitle = document.getElementById("stageTitle");
const stageDesc = document.getElementById("stageDesc");
const stageCount = document.getElementById("stageCount");
const enemyGroup = document.getElementById("enemyGroup");

const clearTitle = document.getElementById("clearTitle");
const rewardItems = document.getElementById("rewardItems");

const dexModal = document.getElementById("dexModal");
const openDexBtn = document.getElementById("openDexBtn");
const closeDexBtn = document.getElementById("closeDexBtn");
const dexList = document.getElementById("dexList");
const statBonus = document.getElementById("statBonus");

function showScreen(screen) {
  [titleScreen, dialogScreen, battleScreen, clearScreen, endingScreen].forEach(s => {
    s.classList.remove("active");
  });
  screen.classList.add("active");
}

function startDialog() {
  showScreen(dialogScreen);
}

function startBattle() {
  renderStage();
  showScreen(battleScreen);
}

function renderStage() {
  const stage = stages[currentStage];

  stageTitle.textContent = stage.title;
  stageDesc.textContent = stage.desc;
  stageCount.textContent = `${currentStage + 1} / ${stages.length}`;

  enemyGroup.innerHTML = `
    <div class="enemy-unit">${stage.enemy}</div>
    <div class="enemy-unit">${stage.enemy}</div>
    <div class="enemy-unit">${stage.enemy}</div>
  `;
}

function clearStage() {
  const stage = stages[currentStage];

  lastReward = [...stage.drops];

  lastReward.forEach(item => {
    if (!collectedItems.includes(item)) {
      collectedItems.push(item);
    }
  });

  clearTitle.textContent = `${currentStage + 1} STAGE CLEAR!`;
  rewardItems.innerHTML = lastReward
    .map(item => `<div class="reward-item">📌 ${item}</div>`)
    .join("");

  renderDex();
  showScreen(clearScreen);
}

function goNextStage() {
  currentStage++;

  if (currentStage >= stages.length) {
    showScreen(endingScreen);
    return;
  }

  startBattle();
}

function renderDex() {
  dexList.innerHTML = stages.map((stage, index) => {
    const items = stage.drops.map(item => {
      const got = collectedItems.includes(item);
      return `
        <div class="dex-item ${got ? "got" : ""}">
          ${got ? "✅" : "⬜"} ${item}
        </div>
      `;
    }).join("");

    return `
      <div class="dex-stage">
        <h3>${index + 1} STAGE에서 얻을 수 있는 아이템</h3>
        <div class="dex-items">${items}</div>
      </div>
    `;
  }).join("");

  const hpBonus = collectedItems.length;
  const atkBonus = Math.floor(collectedItems.length / 3);
  statBonus.textContent = `HP +${hpBonus} / 공격력 +${atkBonus}`;
}

function resetGame() {
  currentStage = 0;
  collectedItems = [];
  lastReward = [];
  renderDex();
  showScreen(titleScreen);
}

startGameBtn.addEventListener("click", startDialog);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && dialogScreen.classList.contains("active")) {
    startBattle();
  }
});

clearStageBtn.addEventListener("click", clearStage);
nextStageBtn.addEventListener("click", goNextStage);
restartBtn.addEventListener("click", resetGame);

openDexBtn.addEventListener("click", () => {
  renderDex();
  dexModal.classList.remove("hidden");
});

closeDexBtn.addEventListener("click", () => {
  dexModal.classList.add("hidden");
});

renderDex();
