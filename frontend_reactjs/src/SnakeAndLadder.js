import React, { useState } from "react";
import "./App.css";

/**
 * Simple constants for a classic Snake and Ladder game.
 */
const BOARD_SIZE = 100;
const PLAYERS = [
  { name: "Player 1", color: "#1976d2" }, // Primary blue
  { name: "Player 2", color: "#ff9800" }, // Accent orange
];

/**
 * A static map of ladder and snake starts to their respective ends.
 * (Small demo set for placeholder; can be enhanced)
 */
const SNAKES = {
  16: 6,
  48: 30,
  64: 60,
  79: 19,
  93: 68,
  95: 24,
  97: 76,
  98: 78,
};
const LADDERS = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
};

// PUBLIC_INTERFACE
function SnakeAndLadder() {
  // Game state
  const [positions, setPositions] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dice, setDice] = useState(null);
  const [status, setStatus] = useState("Game start!");
  const [winner, setWinner] = useState(null);

  // PUBLIC_INTERFACE
  const rollDice = () => {
    if (winner) return;
    const value = Math.floor(Math.random() * 6) + 1;
    setDice(value);

    let newPositions = [...positions];
    let pos = newPositions[currentPlayer] + value;
    if (pos > BOARD_SIZE) pos = newPositions[currentPlayer]; // No move if overshoot
    // Check for ladders or snakes
    if (LADDERS[pos]) pos = LADDERS[pos];
    else if (SNAKES[pos]) pos = SNAKES[pos];
    newPositions[currentPlayer] = pos;

    if (pos === BOARD_SIZE) {
      setPositions(newPositions);
      setWinner(currentPlayer);
      setStatus(`${PLAYERS[currentPlayer].name} wins!`);
      return;
    } else {
      setPositions(newPositions);
      setStatus(
        `${PLAYERS[currentPlayer].name} rolled a ${value}.${LADDERS[pos] || SNAKES[pos] ? " Special tile!" : ""}`
      );
      setCurrentPlayer((currentPlayer + 1) % 2);
    }
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setPositions([0, 0]);
    setCurrentPlayer(0);
    setDice(null);
    setStatus("Game start!");
    setWinner(null);
  };

  // PUBLIC_INTERFACE
  function renderBoard() {
    // Generate cell array 100 down to 1 for board layout (10x10)
    let rows = [];
    for (let r = 9; r >= 0; r--) {
      let row = [];
      for (let c = 0; c < 10; c++) {
        // Even rows left-to-right, odd rows right-to-left (classic S&L)
        let idx = r % 2 === 0 ? r * 10 + c + 1 : r * 10 + (9 - c) + 1;
        let playerTokens = [];
        positions.forEach((pos, i) => {
          if (pos === idx)
            playerTokens.push(
              <span
                key={i}
                className="sal-player"
                style={{
                  background: PLAYERS[i].color,
                  color: "#fff",
                  left: i === 0 ? "3px" : "unset",
                  right: i === 1 ? "3px" : "unset",
                }}
              >
                {i + 1}
              </span>
            );
        });
        row.push(
          <div
            className={`sal-cell${
              idx === BOARD_SIZE ? " sal-cell-goal" : ""
            }${LADDERS[idx] ? " ladder" : ""}${SNAKES[idx] ? " snake" : ""}`}
            key={idx}
          >
            <span className="sal-cell-num">{idx}</span>
            {LADDERS[idx] && (
              <span className="sal-ladder-symbol" title={`Ladder to ${LADDERS[idx]}`}>
                ⇧
              </span>
            )}
            {SNAKES[idx] && (
              <span className="sal-snake-symbol" title={`Snake to ${SNAKES[idx]}`}>
                ⇩
              </span>
            )}
            <span className="sal-players">{playerTokens}</span>
          </div>
        );
      }
      rows.push(
        <div className="sal-board-row" key={r}>
          {row}
        </div>
      );
    }
    return <div className="sal-board">{rows}</div>;
  }

  return (
    <div className="sal-container">
      <h1 className="sal-title">Snake and Ladder</h1>
      <div className="sal-controls">
        <button className="btn-sal" onClick={rollDice} disabled={!!winner}>
          Roll Dice
        </button>
        <button className="btn-sal" onClick={resetGame}>
          Restart
        </button>
        <span className="sal-dice">
          {dice !== null ? `Dice: ${dice}` : "\u00A0"}
        </span>
      </div>
      <div className="sal-status">
        {winner !== null
          ? `${PLAYERS[winner].name} wins!`
          : `Turn: ${PLAYERS[currentPlayer].name}`}
      </div>
      {renderBoard()}
      <div className="sal-instructions">
        <p>
          Roll the dice and climb to 100! Ladders boost progress (<span className="sal-ladder-symbol">⇧</span>), snakes send you back (<span className="sal-snake-symbol">⇩</span>).
        </p>
      </div>
    </div>
  );
}

export default SnakeAndLadder;
