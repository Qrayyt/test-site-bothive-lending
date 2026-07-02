const body = document.body;
const panel = document.getElementById('botPanel');
const addBtn = document.getElementById('addBotBtn');
const form = document.getElementById('setupForm');
const visual = document.getElementById('mainVisual');
const botTitle = document.querySelector('.bot-title');

const assets = {
  laptop: 'assets/laptop.gif',
  clip: 'assets/paperclip.gif',
};

let visualTimer;
let creatingTimer;

function setState(state) {
  panel.className = `bot-panel state-${state}`;
  body.classList.remove('is-empty', 'is-form', 'is-creating', 'is-ready');
  body.classList.add(`is-${state}`);
}

function swapVisual(src) {
  window.clearTimeout(visualTimer);
  visual.classList.add('switching');

  visualTimer = window.setTimeout(() => {
    visual.src = src;
    requestAnimationFrame(() => visual.classList.remove('switching'));
  }, 220);
}

addBtn.addEventListener('click', () => {
  swapVisual(assets.clip);
  setState('form');
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  window.clearTimeout(creatingTimer);

  const name = document.getElementById('botName').value.trim();
  botTitle.textContent = (name || 'GALENITE BOTHIVE').toUpperCase();

  setState('creating');

  creatingTimer = window.setTimeout(() => {
    swapVisual(assets.laptop);
    setState('ready');
  }, 1150);
});

setState('empty');
