
const data = window.PICTO_DATA || [];
const menuScreen = document.getElementById('menu-screen');
const studyScreen = document.getElementById('study-screen');
const endScreen = document.getElementById('end-screen');
const orderedBtn = document.getElementById('ordered-btn');
const randomBtn = document.getElementById('random-btn');
const startBtn = document.getElementById('start-btn');
const backMenuBtn = document.getElementById('back-menu-btn');
const restartBtn = document.getElementById('restart-btn');
const startNumInput = document.getElementById('start-num');
const endNumInput = document.getElementById('end-num');
const counter = document.getElementById('counter');
const sceneImage = document.getElementById('scene-image');
const jpText = document.getElementById('jp-text');
const hintBox = document.getElementById('hint-box');
const answerBox = document.getElementById('answer-box');
const hintBtn = document.getElementById('hint-btn');
const answerBtn = document.getElementById('answer-btn');
const nextBtn = document.getElementById('next-btn');

let mode = 'ordered';
let queue = [];
let currentIndex = 0;

function showScreen(target){
  [menuScreen, studyScreen, endScreen].forEach(screen => screen.classList.remove('active'));
  target.classList.add('active');
}
function shuffle(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildQueue(){
  const minId = Math.min(...data.map(x => x.id));
  const maxId = Math.max(...data.map(x => x.id));
  let startNum = parseInt(startNumInput.value, 10);
  let endNum = parseInt(endNumInput.value, 10);
  if(Number.isNaN(startNum)) startNum = minId;
  if(Number.isNaN(endNum)) endNum = maxId;
  if(startNum > endNum){ [startNum, endNum] = [endNum, startNum]; }
  startNum = Math.max(minId, startNum);
  endNum = Math.min(maxId, endNum);
  const filtered = data.filter(item => item.id >= startNum && item.id <= endNum);
  if(filtered.length === 0){
    alert('出題範囲にデータがありません。');
    return null;
  }
  return mode === 'random' ? shuffle(filtered) : filtered;
}
function renderCurrent(){
  const item = queue[currentIndex];
  if(!item){
    showScreen(endScreen);
    return;
  }
  counter.textContent = `${currentIndex + 1} / ${queue.length}`;
  sceneImage.src = item.image;
  sceneImage.alt = `img${String(item.id).padStart(3, '0')}`;
  jpText.textContent = item.japanese;
  hintBox.textContent = item.hint;
  answerBox.textContent = item.english;
  hintBox.classList.add('hidden');
  answerBox.classList.add('hidden');
}
orderedBtn.addEventListener('click', () => {
  mode = 'ordered';
  orderedBtn.classList.add('selected');
  randomBtn.classList.remove('selected');
});
randomBtn.addEventListener('click', () => {
  mode = 'random';
  randomBtn.classList.add('selected');
  orderedBtn.classList.remove('selected');
});
startBtn.addEventListener('click', () => {
  const built = buildQueue();
  if(!built) return;
  queue = built;
  currentIndex = 0;
  renderCurrent();
  showScreen(studyScreen);
});
hintBtn.addEventListener('click', () => {
  hintBox.classList.remove('hidden');
});
answerBtn.addEventListener('click', () => {
  hintBox.classList.remove('hidden');
  answerBox.classList.remove('hidden');
});
nextBtn.addEventListener('click', () => {
  currentIndex += 1;
  if(currentIndex >= queue.length){
    showScreen(endScreen);
    return;
  }
  renderCurrent();
});
backMenuBtn.addEventListener('click', () => {
  showScreen(menuScreen);
});
restartBtn.addEventListener('click', () => {
  showScreen(menuScreen);
});
