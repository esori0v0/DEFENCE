const stages = [
  {
    title: "STAGE 1. 마을 입구 조사",
    desc: "마을 입구를 방어하며 첫 번째 단서를 수집하세요.",
    enemy: "🐺",
    drops: ["늑대 털", "찢어진 울타리", "작은 발자국"]
  },
  {
    title: "STAGE 2. 숲속 추적",
    desc: "숲 안쪽에서 수상한 흔적을 찾고 몰려오는 몬스터를 막으세요.",
    enemy: "🦇",
    drops: ["검은 깃털", "마법 가루", "부러진 화살"]
  },
  {
    title: "STAGE 3. 늑대 소굴",
    desc: "실종 사건의 진짜 원인을 밝히고 보스를 처치하세요.",
    enemy: "🧙",
    drops: ["검은 마법석", "조종 목걸이", "왕국 문장"]
  }
];

let currentStage = 0;
let clearedStage = 0;
let collectedItems = [];

const stageTitle = document.getElementById("stageTitle");
const stageDesc = document.getElementById("stageDesc");
const enemy = document.getElementById("enemy");
const clearBtn = document.getElementById("clearBtn");
const dropList = document.getElementById("dropList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const dexList = document.getElementById("dexList");
const statBonus = document.getElementById("statBonus");
const dexModal = document.getElementById("dexModal");
const openDexBtn = document.getElementById("openDexBtn");
const closeDexBtn = document.getElementById("closeDexBtn");

function renderStage() {
  const stage = stages[currentStage];
  stageTitle.textContent = stage.title;
  stageDesc.textContent = stage.desc;
  enemy.textContent = stage.enemy;
}

function clearStage() {
  if (currentStage >= stages.length) return;

  const stage = stages[currentStage];
  const randomDrops = [...stage.drops].sort(() => Math.random() - 0.5).slice(0, 3);

  randomDrops.forEach(item => {
    if (!collectedItems.includes(item)) {
      collectedItems.push(item);
    }
  });

  dropList.innerHTML = randomDrops
    .map(item => `<div class="item got">📌 ${item}</div>`)
    .join("");

  clearedStage++;
  currentStage++;

  updateProgress();
  renderDex();

  if (currentStage >= stages.length) {
    stageTitle.textContent = "사건 해결 완료!";
    stageDesc.textContent = "양 실종 사건의 범인은 늑대를 조종하던 흑마법사였습니다.";
    enemy.textContent = "🎉";
    clearBtn.textContent = "사건 완료";
    clearBtn.disabled = true;
    return;
  }

  renderStage();
}

function updateProgress() {
  const percent = (clearedStage / stages.length) * 100;
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${clearedStage} / ${stages.length} STAGE`;
}

function renderDex() {
  const allItems = stages.flatMap(stage => stage.drops);

  dexList.innerHTML = allItems.map(item => {
    const isGot = collectedItems.includes(item);
    return `
      <div class="item ${isGot ? "got" : ""}">
        ${isGot ? "✅" : "⬜"} ${item}
      </div>
    `;
  }).join("");

  const completeCount = collectedItems.length;
  const hpBonus = completeCount;
  const atkBonus = Math.floor(completeCount / 3);

  statBonus.textContent = `HP +${hpBonus} / 공격력 +${atkBonus}`;
}

clearBtn.addEventListener("click", clearStage);
openDexBtn.addEventListener("click", () => {
  renderDex();
  dexModal.classList.remove("hidden");
});
closeDexBtn.addEventListener("click", () => {
  dexModal.classList.add("hidden");
});

renderStage();
renderDex();
updateProgress();
