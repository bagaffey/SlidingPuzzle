// JavaScript source
(function () {
  "use strict";
  
  const pieces = [...document.querySelectorAll(".puzzle-game > img")];
  const soundButton = document.getElementById("toggle-audio");
  const congratulations = document.getElementsByClassName("comhghairdeas")[0];
  const clickScore = document.getElementById("clicks");
  let shuffledPieces = pieces;
  const hiddenPiece = pieces[6];
  let clickCount = 0;
  let isDone = true;
  let audio = false;
  const success = new Audio("./sound/success.m4a");
  const fail = new Audio("./sound/fail.m4a");
  
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
    const indexOfHiddenPiece = shuffledPieces.indexOf(hiddenPiece);
    const rowOfHiddenPiece = Math.floor(indexOfHiddenPiece / 3);
    const colOfHiddenPiece = indexOfHiddenPiece % 3;
    
    for (const piece of pieces) {
      const indexOfCurrentPiece = shuffledPieces.indexOf(piece);
      const rowOfCurrentPiece = Math.floor(indexOfCurrentPiece / 3);
      const colOfCurrentPiece = indexOfCurrentPiece % 3;
      
      if ((colOfCurrentPiece === colOfHiddenPiece && Math.abs(rowOfHiddenPiece - rowOfCurrentPiece) === 1) ||
          (rowOfCurrentPiece === rowOfHiddenPiece && Math.abs(colOfHiddenPiece - colOfCurrentPiece) === 1)) {
        piece.classList.add("piece-is-moveable");
      } else {
        piece.classList.remove("piece-is-moveable");
      }
    }
  };
  
  const reset = function () {
    isDone = false;
    hiddenPiece.style.opacity = "0";
    clickCount = 0;
    shuffledPieces = shuffle([...pieces]);
    congratulations.style.display = "none";
    updatePositions();
    highlightMoveablePieces();
  };
  
  const checkIfHasWon = function() {
    const hasWon = shuffledPieces.every((piece, index) => {
      return (pieces[index] === piece);
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
    const e = soundButton.parentElement.querySelector("span");
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
          row1 += `${piece.getAttribute("aria-label")} `;
          break;
        }
        case (index > 2 && index <= 5): {
          row2 += `${piece.getAttribute("aria-label")} `;
          break;
        }
        default: {
          row3 += `${piece.getAttribute("aria-label")} `;
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
      speech += `Tile ${tile.getAttribute("aria-label")} `;
    });
    say(speech);
  };
  
  const trySwapWithHiddenPiece = function() {
    const clickedPiece = this || null;
    clickedPiece.focus();
    const indexOfHiddenPiece = shuffledPieces.indexOf(hiddenPiece);
    const indexOfClickedPiece = shuffledPieces.indexOf(clickedPiece);
    const rowOfHiddenPiece = Math.floor(indexOfHiddenPiece / 3);
    const colOfHiddenPiece = indexOfHiddenPiece % 3;
    const rowOfClickedPiece = Math.floor(indexOfClickedPiece / 3);
    const colOfClickedPiece = indexOfClickedPiece % 3;
    
    const IsMoveValid = (
      false || 
      (colOfClickedPiece === colOfHiddenPiece && Math.abs(rowOfHiddenPiece - rowOfClickedPiece) === 1) ||
      (rowOfClickedPiece === rowOfHiddenPiece && Math.abs(colOfHiddenPiece - colOfClickedPiece) === 1)
    );
    
    if (IsMoveValid && !isDone) {
      clickCount++;
      clickScore.textContent = clickCount;
      shuffledPieces[indexOfHiddenPiece] = clickedPiece;
      shuffledPieces[indexOfClickedPiece] = hiddenPiece;
      
      if (audio) {
        success.play();
      }
      
      updatePositions();
      highlightMoveablePieces();
      checkIfHasWon();
    } else if (audio) {
      fail.play();
    }
  };
  
  const handleKeyDown = function(event) {
    const indexOfHiddenPiece = shuffledPieces.indexOf(hiddenPiece);
    const rowOfHiddenPiece = Math.floor(indexOfHiddenPiece / 3);
    const colOfHiddenPiece = indexOfHiddenPiece % 3;
    let indexOfClickedPiece;
    
    switch (event.key) {
      case "w": {
        const rowOfClickedPiece = rowOfHiddenPiece + 1;
        const colOfClickedPiece = colOfHiddenPiece;
        indexOfClickedPiece = (rowOfClickedPiece * 3) + colOfClickedPiece;
        break;
      }
      case "a": {
        const rowOfClickedPiece = rowOfHiddenPiece;
        const colOfClickedPiece = colOfHiddenPiece + 1;
        indexOfClickedPiece = (rowOfClickedPiece * 3) + colOfClickedPiece;
        break;
      }
      case "s": {
        const rowOfClickedPiece = rowOfHiddenPiece - 1;
        const colOfClickedPiece = colOfHiddenPiece;
        indexOfClickedPiece = (rowOfClickedPiece * 3) + colOfClickedPiece;
        break;
      }
      case "d": {
        const rowOfClickedPiece = rowOfHiddenPiece;
        const colOfClickedPiece = colOfHiddenPiece - 1;
        indexOfClickedPiece = (rowOfClickedPiece * 3) + colOfClickedPiece;
        break;
      }
      case "c": {
        currentState(true);
        break;
      }
      case "h": {
        whereIsHiddenPiece(true);
        break;
      }
      case "m": {
        whereAreTheMoveablePieces(true);
        break;
      }
      case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9": {
        const clickedPiece = document.getElementById(`piece-${parseInt(event.key)}`);
        indexOfClickedPiece = shuffledPieces.indexOf(clickedPiece);
        break;
      }
      default: {
        break;
      }
    }
    
    const clickedPiece = shuffledPieces[indexOfClickedPiece];
    if (clickedPiece) {
      trySwapWithHiddenPiece.call(clickedPiece, event);
    }
  };
  
  const playAudio = function(audioVar) {
    if (window.currentlyPlaying) {
      window.currentlyPlaying.pause();
    }
    window.currentlyPlaying = audioVar.target;
  };

  addEventListener("keydown", handleKeyDown);
  addEventListener("play", playAudio, true);
  soundButton.addEventListener("click", toggleAudio);
  
  for (const piece of pieces) {
    piece.addEventListener("click", trySwapWithHiddenPiece);
    piece.addEventListener("keypress", trySwapWithHiddenPiece);
  }
  
  reset(); 
  updatePositions();
}());
console.log("Game scripts loaded.");
