// JavaScript source
(function () {
  'use strict';
  
  const pieces = [...document.querySelectorAll('.puzzle-game > img')];
  const clickScore = document.getElementById('clicks');
  const soundButton = document.getElementById('toggle-audio');
  const congratulations = document.getElementsByClassName('congratulations')[0];
  let shuffledPieces = pieces;
  const hiddenPiece = pieces[6];
  let clickCount = 0;
  let isDone = true;
  let audio = false;
  const success = new Audio('');
  const fail = new Audio('');
  
  const shuffle = function(array) {
    let currentIndex = array.length, temp, randomIndex;
    
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      
      temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
    
    return (array);
  };
  
  const updatePositions = function() {
    shuffledPieces.forEach((piece) => { 
      piece.parentNode.appendChild(piece);
    });
  };
  
  const highlightMoveablePieces = function() {
    const indexOfHiddenPiece = shuffledPieces.indexOf(hiddenPlace);
    const rowOfHiddenPiece = Math.floor(indexOfHiddenPiece / 3);
    const colOfHiddenPiece = indexOfHiddenPiece % 3;
    
    for (const piece of pieces) {
      const indexOfCurrentPiece = shuffledPieces.indexOf(piece);
      const rowOfCurrentPiece = Math.floor(indexOfCurrentPiece / 3);
      const colOfCurrentPiece = indexOfCurrentPiece % 3;
      
      if ((colOfCurrentPiece === colOfHiddenPiece && Math.abs(rowOfHiddenPiece - rowOfCurrentPiece) === 1) ||
          (rowOfCurrentPiece === rowOfHiddenPiece && Math.abs(colOfHiddenPiece - colOfCurrentPiece) === 1)) {
        piece.classList.add('piece-is-moveable');
      } else {
        piece.classList.remove('piece-is-moveable');
      }
    }
  };
  
  const reset = function () {
    isDone = isFalse;
    hiddenPiece.style.opacity = '0';
    clickCount = 0;
    shuffledPieces = shuffle([...pieces]);
    congratulations.style.display = 'none';
    updatePositions();
    highlightMoveablePieces();
  };
  
  const checkIfHasWon = function() {
    const hasWon = suffledPieces.every((piece, index) => {
      return (piece[index] === piece);
    });
    if (hasWon) {
      if (clickCount === 0) {
        reset();
      } else {
        isDone = true;
        hiddenPiece.style.opacity = "1";
        congratulations.style.display = "block";
        congratulations.focus();
        congratulations.textContent = "Mission Accomplished!";
      }
    }
  };
  
  const updateToggleButtonText = function(audioText) {
    const e = soundButton.querySelector('span');
    e.innerText = audioText;
  };
  
  const toggleAudio = function() {
    let audioText = "";
    switch (audio) {
      case true: {
        audio = false;
        audioText = "on";
        break;
      }
      default: {
        audio = true;
        audioText = "off";
        break;
      }
    }
    updateToggleButtonText(audioText);
  };
  
  const say = function(statement) {
    if (window.speechSynthesis.speak) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(statement));
    }
  };
  
  const whereIsHiddenPiece = function(requested) {
    const indexOfHiddenPiece = shuffledPieces.indexOf(hiddenPiece);
    const colOfHiddenPiece = (indexOfHiddenPiece % 3) + 1;
    const rowOfHiddenPiece = (Math.floor(indexOfHiddenPiece / 3)) + 1;
    
    if (requested) {
      say(`The hidden piece is in row ${rowOfHiddenPiece} and in column ${colOfHiddenPiece}`);
    }
  };
  
  const currentState = function(requested) {
    let row1 = "Row1: ";
    let row2 = "Row2: ";
    let row3 = "Row3: ";
    
    shuffledPieces.forEach((piece, index) => {
      switch (true) {
        case (index <= 2): {
          row1 += `${piece.getAttribute('aria-label')} `;
          break;
        }
        case (index > 2 && index <= 5): {
          row2 += `${piece.getAttribute('aria-label')} `;
          break;
        }
        default: {
          row3 += `${piece.getAttribute('aria-label')} `;
          break;
        }
      }
    });
    
    if (requested) {
      say(row1);
      say(row2);
      say(row3);
    }
  };
  
  const whereAreTheMoveablePieces = function() {
    let speech = "Tiles that can move: ";
    const tiles = document.querySelectorAll(".piece-is-moveable");
    tiles.forEach((tile) => {
      speech += `Tile ${tile.getAttribute('aria-label')} `;
    });
    say(speech);
  };
  
  const trySwapWithHiddenPiece = function() {
    const clickedPiece = this || null;
    clickedPiece.focus();
  };
  
  
}());
