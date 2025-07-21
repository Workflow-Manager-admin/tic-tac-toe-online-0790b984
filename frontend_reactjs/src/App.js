import React, { useState, useEffect } from "react";
import "./App.css";

/** Color variables (as per the palette):
 *  primary: #1976d2
 *  accent: #ff9800
 *  secondary: #424242
 */

/**
 * Game constants
 */
const PLAYER_X = "X";
const PLAYER_O = "O";
const GAME_MODE = {
  LOCAL: "local",
  COMPUTER: "computer",
};

/**
 * Square Component
 * Minimal stateless button for each cell.
 */
function Square({ value, onClick, disabled, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell ${value}` : "Empty Cell"}
    >
      {value}
    </button>
  );
}

/**
 * Board Component
 * Renders the 3x3 tic-tac-toe grid.
 */
function Board({ squares, onSquareClick, disabled }) {
  return (
    <div className="ttt-board">
      {squares.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          disabled={!!value || disabled}
        />
      ))}
    </div>
  );
}

/**
 * Controls Component
 * Game setup: select mode, X/O, start and restart game.
 * PUBLIC_INTERFACE
 */
function Controls({
  gameMode,
  setGameMode,
  playerChar,
  setPlayerChar,
  gameStarted,
  onStart,
  onRestart,
}) {
  return (
    <div className="ttt-controls">
      <div className="ttt-controls-group">
        <label>
          <span>Game mode:</span>
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            disabled={gameStarted}
            aria-label="Select game mode"
            style={{ marginLeft: 8 }}
          >
            <option value={GAME_MODE.LOCAL}>Local 2 Player</option>
            <option value={GAME_MODE.COMPUTER}>Vs Computer</option>
          </select>
        </label>
      </div>
      <div className="ttt-controls-group">
        <span>Play as:</span>
        <button
          className={`btn-ttt${playerChar === PLAYER_X ? " selected" : ""}`}
          style={{ marginLeft: 8 }}
          disabled={gameStarted}
          onClick={() => setPlayerChar(PLAYER_X)}
        >
          X
        </button>
        <button
          className={`btn-ttt${playerChar === PLAYER_O ? " selected" : ""}`}
          style={{ marginLeft: 4 }}
          disabled={gameStarted}
          onClick={() => setPlayerChar(PLAYER_O)}
        >
          O
        </button>
      </div>
      {!gameStarted ? (
        <button className="btn-ttt primary" onClick={onStart}>
          Start Game
        </button>
      ) : (
        <button className="btn-ttt" onClick={onRestart}>
          Restart
        </button>
      )}
    </div>
  );
}

/**
 * StatusBar Component
 * Show current game status: turn, winner, or draw.
 * PUBLIC_INTERFACE
 */
function StatusBar({ status, winner, nextPlayer, draw }) {
  let text = "";
  if (draw) text = "It's a draw!";
  else if (winner) text = `Winner: ${winner}`;
  else text = `Next turn: ${nextPlayer}`;

  return <div className="ttt-status">{text}</div>;
}

/**
 * Determine winner of tic tac toe board or draw
 * PUBLIC_INTERFACE
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}
function calculateDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

/**
 * Compute the computer's move (naïve random for MVP)
 * PUBLIC_INTERFACE
 */
function computeComputerMove(squares) {
  const empty = squares
    .map((v, idx) => (v ? null : idx))
    .filter((v) => v !== null);
  if (empty.length === 0) return null;
  const pick = empty[Math.floor(Math.random() * empty.length)];
  return pick;
}

// PUBLIC_INTERFACE
function App() {
  // Game setup state
  const [gameMode, setGameMode] = useState(GAME_MODE.LOCAL);
  const [playerChar, setPlayerChar] = useState(PLAYER_X);

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [squares, setSquares] = useState(Array(9).fill(null)); // board
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // Effect: restart board on start or restart
  useEffect(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(playerChar === PLAYER_X);
    setWinner(null);
    setDraw(false);
    // eslint-disable-next-line
  }, [gameStarted, playerChar]);

  // Effect: check win/draw
  useEffect(() => {
    const w = calculateWinner(squares);
    if (w) setWinner(w);
    else if (calculateDraw(squares)) setDraw(true);
  }, [squares]);

  // Effect: let computer play if needed
  useEffect(() => {
    if (
      gameStarted &&
      gameMode === GAME_MODE.COMPUTER &&
      !winner &&
      !draw
    ) {
      // Whose turn is it? If computer, play.
      const currentChar = xIsNext ? PLAYER_X : PLAYER_O;
      const computerChar = playerChar === PLAYER_X ? PLAYER_O : PLAYER_X;
      if (currentChar === computerChar) {
        const timeout = setTimeout(() => {
          const move = computeComputerMove(squares);
          if (move !== null) {
            handleSquareClick(move);
          }
        }, 500); // small pause for "thinking"
        return () => clearTimeout(timeout);
      }
    }
    // eslint-disable-next-line
  }, [xIsNext, gameStarted, gameMode, playerChar, winner, draw, squares]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (!gameStarted || squares[idx] || winner || draw) return;
    const newSquares = [...squares];
    newSquares[idx] = xIsNext ? PLAYER_X : PLAYER_O;
    setSquares(newSquares);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleStart = () => {
    setGameStarted(true);
  };
  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setGameStarted(false);
    setTimeout(() => {
      setGameStarted(true);
    }, 10);
  };

  return (
    <div className="App">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <Controls
          gameMode={gameMode}
          setGameMode={setGameMode}
          playerChar={playerChar}
          setPlayerChar={setPlayerChar}
          gameStarted={gameStarted}
          onStart={handleStart}
          onRestart={handleRestart}
        />
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          disabled={!gameStarted || !!winner || !!draw}
        />
        <StatusBar
          status={winner ? "win" : draw ? "draw" : "ongoing"}
          winner={winner}
          nextPlayer={
            winner || draw
              ? null
              : xIsNext
              ? PLAYER_X
              : PLAYER_O
          }
          draw={draw}
        />
      </div>
    </div>
  );
}

export default App;
