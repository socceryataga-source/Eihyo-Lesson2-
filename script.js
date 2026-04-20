let mode = "sequential";
let queue = [];
let current = null;
let currentIndex = -1;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildQueue(selectedMode) {
  if (selectedMode === "random") {
    return shuffle(data);
  }
  return [...data];
}

function showScreen(screenId) {
  document.getElementById("menuScreen").classList.add("hidden");
  document.getElementById("practiceScreen").classList.add("hidden");
  document.getElementById("finishScreen").classList.add("hidden");
  document.getElementById(screenId).classList.remove("hidden");
}

function startPractice() {
  const checked = document.querySelector('input[name="mode"]:checked');
  mode = checked ? checked.value : "sequential";
  queue = buildQueue(mode);
  currentIndex = 0;

  if (queue.length === 0) {
    showScreen("finishScreen");
    return;
  }

  showScreen("practiceScreen");
  renderCurrent();
}

function renderCurrent() {
  current = queue[currentIndex];
  document.getElementById("img").src = "img/" + current.img;
  document.getElementById("img").alt = current.en;
  document.getElementById("jp").textContent = current.jp;
  document.getElementById("hint").innerHTML = "";
  document.getElementById("status").textContent = `${currentIndex + 1} / ${queue.length}`;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderStructuredHint(showAnswer) {
  if (!current) return;

  const words = current.en.split(" ");
  const html = words.map((word, index) => {
    const safeWord = escapeHtml(word);
    const shouldHide = index % 2 === 0;

    if (shouldHide) {
      const width = Math.max(word.length + 1, 4);
      const content = showAnswer ? safeWord : "&nbsp;";
      return `<span class="hint-slot blank-slot" style="min-width:${width}ch;">${content}</span>`;
    } else {
      return `<span class="hint-slot filled-slot">${safeWord}</span>`;
    }
  }).join(" ");

  document.getElementById("hint").innerHTML = html;
}

function showHint() {
  if (!current) return;
  renderStructuredHint(false);
}

function showAnswer() {
  if (!current) return;
  renderStructuredHint(true);
}

function nextItem() {
  if (!current) return;
  currentIndex += 1;
  if (currentIndex >= queue.length) {
    current = null;
    showScreen("finishScreen");
    return;
  }
  renderCurrent();
}

function returnToMenu() {
  current = null;
  queue = [];
  currentIndex = -1;
  document.getElementById("hint").innerHTML = "";
  document.getElementById("status").textContent = "";
  showScreen("menuScreen");
}

showScreen("menuScreen");
