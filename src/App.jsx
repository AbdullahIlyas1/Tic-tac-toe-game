// import { useState } from "react";

// import Player from "./components/Player.jsx";
// import Gameboard from "./components/Gameboard.jsx";
// import Log from "./components/Log.jsx";

// function deriveActivePlayer(gameTurns) {
//   let currentPlayer = "X";

//   if (gameTurns.length > 0 && gameTurns[0].Player === "X") {
//     currentPlayer = "O";

//     return currentPlayer;
//   }
// }

// function App() {
//   const [gameTurns, setGameTurns] = useState([]);
//   //const [activePlayer, setActivePlayer] = useState("X");

//   const activePlayer = deriveActivePlayer(gameTurns);

//   function handleSelectSquare(rowIndex, colIndex) {
//     // setActivePlayer((curActivePlayer) => (curActivePlayer === "X" ? "O" : "X"));
//     setGameTurns((prevTurns) => {
//       const activePlayer = deriveActivePlayer(prevTurns);

//       const updateTurns = [
//         { square: { row: rowIndex, col: colIndex }, Player: activePlayer },
//         ...prevTurns,
//       ];

//       return updateTurns;
//     });
//   }

//   return (
//     <main>
//       <div id="game-container">
//         <ol id="players" className="highlight-player">
//           <Player
//             initialName="Player 1"
//             symbol="X"
//             isActive={activePlayer === "X"}
//           />
//           <Player
//             initialName="Player 2"
//             symbol="O"
//             isActive={activePlayer === "O"}
//           />
//         </ol>
//         <Gameboard onSelectSquare={handleSelectSquare} turns={gameTurns} />
//       </div>
//       <Log turns={gameTurns} />
//     </main>
//   );
// }

// export default App;
import { useState } from "react";

import Player from "./components/Player.jsx";
import Gameboard from "./components/Gameboard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";

import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  if (gameTurns.length === 0) {
    return "X";
  } // Default starting player

  // Count the number of turns for each player
  const countX = gameTurns.filter((turn) => turn.Player === "X").length;
  const countO = gameTurns.filter((turn) => turn.Player === "O").length;

  // If the counts are the same, it's X's turn; if X has one more turn, it's O's turn
  return countX > countO ? "O" : "X";
}

function App() {
  const [players, setPlayers] = useState({
    X: "Player 1",
    O: "Player 2",
  });
  const [gameTurns, setGameTurns] = useState([]);
  //const [hasWinner, setHasWinner] = useState(false);

  const activePlayer = deriveActivePlayer(gameTurns);

  const gameBoard = initialGameBoard.map((row) => [...row]);

  // Apply the turns to the game board
  for (const turn of gameTurns) {
    const { square, Player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = Player;
  }

  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const activePlayer = deriveActivePlayer(prevTurns);

      const updateTurns = [
        { square: { row: rowIndex, col: colIndex }, Player: activePlayer },
        ...prevTurns,
      ];

      return updateTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <Gameboard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
