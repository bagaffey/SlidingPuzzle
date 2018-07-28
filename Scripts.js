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
  
}());
