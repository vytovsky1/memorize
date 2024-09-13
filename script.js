let currentLevel = 1;
let textArray = [];
let missingIndices = [];
let audio = new Audio();
let miscLevel = false;
const totalLevels = 10; // Set the number of total levels

// When 'Start Memorising' button is clicked
document.getElementById('startButton').addEventListener('click', () => {
  const text = document.getElementById('textInput').value;
  if (text.trim() !== '') {
    textArray = text.split(' ');
    document.getElementById('firstScreen').classList.add('hidden');
    document.getElementById('memorizationScreen').classList.remove('hidden');
    loadLevel();
  }
});

// Load the current level
function loadLevel() {
  if (currentLevel > totalLevels) {
    showCongratulations();
    return;
  }

  // Randomly decide if it's a miscellaneous level or normal level
  if (miscLevel) {
    loadMiscLevel();
    return;
  }

  document.getElementById('miscLevelScreen').classList.add('hidden');
  document.getElementById('memorizationScreen').classList.remove('hidden');

  document.getElementById('sentenceDisplay').innerHTML = '';
  document.getElementById('levelCounter').textContent = currentLevel;

  missingIndices = [];
  for (let i = 0; i < currentLevel; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * textArray.length);
    } while (missingIndices.includes(index));
    missingIndices.push(index);
  }

  textArray.forEach((word, idx) => {
    if (missingIndices.includes(idx)) {
      document.getElementById('sentenceDisplay').innerHTML += `<span class="missing-word" data-index="${idx}">[ ]</span> `;
    } else {
      document.getElementById('sentenceDisplay').innerHTML += word + ' ';
    }
  });

  makeWordsClickable();
}

// Make the missing words clickable to reveal the text
function makeWordsClickable() {
  const missingWords = document.querySelectorAll('.missing-word');
  missingWords.forEach(word => {
    word.addEventListener('click', function () {
      const wordIndex = this.getAttribute('data-index');
      this.textContent = textArray[wordIndex];
      this.classList.add('revealed-word');
    });
  });
}

// Progress to the next level or Miscellaneous level
document.getElementById('harderButton').addEventListener('click', () => {
  miscLevel = Math.random() < 0.3; // Randomly trigger Misc level 30% of the time
  currentLevel++;
  if (currentLevel <= totalLevels) {
    loadLevel();
  } else {
    showCongratulations();
  }
});

// Music functionality
document.getElementById('musicToggle').addEventListener('click', () => {
  const option = document.getElementById('musicOption').value;
  playMusic(option);
});

function playMusic(option) {
  if (!audio.paused) {
    audio.pause();
  }
  if (option === 'binaural') {
    audio.src = './audio/binaural.mp3'; // Use your local file path
  } else {
    audio.src = './audio/advanced.mp3'; // Use your local file path
  }
  audio.play();
}

// Load Miscellaneous Level
function loadMiscLevel() {
  document.getElementById('memorizationScreen').classList.add('hidden');
  document.getElementById('miscLevelScreen').classList.remove('hidden');
  document.getElementById('wordArrangementArea').innerHTML = '';

  // Shuffle the textArray for arranging
  let shuffledArray = [...textArray].sort(() => 0.5 - Math.random());

  shuffledArray.forEach((word, idx) => {
    const wordElement = document.createElement('div');
    wordElement.classList.add('word-arrangement');
    wordElement.textContent = word;
    wordElement.setAttribute('data-index', idx);
    wordElement.setAttribute('draggable', true);
    wordElement.addEventListener('dragstart', dragStart);
    wordElement.addEventListener('dragover', dragOver);
    wordElement.addEventListener('drop', drop);
    document.getElementById('wordArrangementArea').appendChild(wordElement);
  });
}

// Drag & Drop functionality for word arrangement
let draggedItem = null;

function dragStart(event) {
  draggedItem = this;
  event.dataTransfer.setData('text/plain', this.dataset.index);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const target = event.target;
  if (target.classList.contains('word-arrangement')) {
    const draggedIndex = parseInt(draggedItem.getAttribute('data-index'));
    const targetIndex = parseInt(target.getAttribute('data-index'));

    // Swap the dragged and target word elements
    const parent = target.parentNode;
    parent.insertBefore(draggedItem, targetIndex > draggedIndex ? target.nextSibling : target);
  }
}

// Check if the word arrangement is correct
document.getElementById('checkSequenceButton').addEventListener('click', () => {
  const arrangedWords = Array.from(document.getElementById('wordArrangementArea').children).map(element => element.textContent);
  
  if (arrangedWords.join(' ') === textArray.join(' ')) {
    alert('Correct sequence!');
    document.getElementById('miscLevelScreen').classList.add('hidden');
    miscLevel = false; // Reset the miscellaneous level state
    loadLevel();
  } else {
    document.getElementById('retryButton').classList.remove('hidden');
  }
});

// Retry the Miscellaneous level
document.getElementById('retryButton').addEventListener('click', () => {
  document.getElementById('retryButton').classList.add('hidden');
  loadMiscLevel();
});

// Show congratulations screen after the last level
function showCongratulations() {
  document.getElementById('memorizationScreen').classList.add('hidden');
  document.getElementById('miscLevelScreen').classList.add('hidden');
  document.getElementById('congratulationScreen').classList.remove('hidden');
}
