import { useState } from "react";
import { Box, Grid, GridItem, Text, RadioGroup, Radio, FormControl, FormLabel, Button } from "@chakra-ui/react";

const BOARD_SIZE = 8;

const Index = () => {
  const [color, setColor] = useState("black");
  const [opponentType, setOpponentType] = useState("human");
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  function startGame() {
    setBoard(initializeBoard());
    setCurrentPlayer(color === "black" ? 1 : 2);
    setGameOver(false);
    setGameStarted(true);
  }

  function initializeBoard() {
    const board = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(0));
    board[3][3] = board[4][4] = 1;
    board[3][4] = board[4][3] = 2;
    return board;
  }

  function isValidMove(row, col, player, board) {
    if (board[row][col] !== 0) return false;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let dir of directions) {
      let r = row + dir[0],
        c = col + dir[1];
      let flipped = false;

      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (board[r][c] === 0) break;
        if (board[r][c] === player) {
          if (flipped) return true;
          break;
        }
        flipped = true;
        r += dir[0];
        c += dir[1];
      }
    }
    return false;
  }

  function flipDiscs(row, col, player, board) {
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = player;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let dir of directions) {
      let r = row + dir[0],
        c = col + dir[1];
      const flipped = [];

      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        if (newBoard[r][c] === 0) break;
        if (newBoard[r][c] === player) {
          for (let [fr, fc] of flipped) {
            newBoard[fr][fc] = player;
          }
          break;
        }
        flipped.push([r, c]);
        r += dir[0];
        c += dir[1];
      }
    }

    return newBoard;
  }

  function hasValidMoves(player, board) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (isValidMove(r, c, player, board)) {
          return true;
        }
      }
    }
    return false;
  }

  function handleClick(row, col) {
    if (gameOver || !isValidMove(row, col, currentPlayer, board)) return;

    const newBoard = flipDiscs(row, col, currentPlayer, board);
    setBoard(newBoard);

    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    if (!hasValidMoves(nextPlayer, newBoard)) {
      if (!hasValidMoves(currentPlayer, newBoard)) {
        setGameOver(true);
      }
    } else {
      setCurrentPlayer(nextPlayer);
    }
  }

  function getWinner() {
    let count = [0, 0, 0];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        count[board[r][c]]++;
      }
    }
    if (count[1] > count[2]) return 1;
    if (count[2] > count[1]) return 2;
    return 0;
  }

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        Othello
      </Text>
      {!gameStarted && (
        <>
          <FormControl mb={4}>
            <FormLabel>Choose your color</FormLabel>
            <RadioGroup value={color} onChange={setColor}>
              <Radio value="black" mr={4}>
                Black
              </Radio>
              <Radio value="white">White</Radio>
            </RadioGroup>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Opponent</FormLabel>
            <RadioGroup value={opponentType} onChange={setOpponentType}>
              <Radio value="human" mr={4}>
                Human
              </Radio>
              <Radio value="ai">AI</Radio>
            </RadioGroup>
          </FormControl>
          <Button colorScheme="blue" onClick={startGame}>
            Start Game
          </Button>
        </>
      )}
      {gameStarted && (
        <>
          <Grid templateColumns="repeat(8, 1fr)" gap={1} mb={4}>
            {board.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <GridItem
                  key={`${rowIdx}-${colIdx}`}
                  w="12"
                  h="12"
                  bg="green.500"
                  borderWidth={1}
                  borderColor="gray.400"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  cursor={isValidMove(rowIdx, colIdx, currentPlayer, board) ? "pointer" : "default"}
                  onClick={() => handleClick(rowIdx, colIdx)}
                  _hover={{
                    bg: isValidMove(rowIdx, colIdx, currentPlayer, board) ? "green.400" : "green.500",
                  }}
                >
                  <Box w="80%" h="80%" rounded="full" bg={cell === 1 ? "black" : cell === 2 ? "white" : "transparent"} />
                </GridItem>
              )),
            )}
          </Grid>
          <Text fontSize="xl">{gameOver ? (getWinner() > 0 ? `Player ${getWinner()} wins!` : "It's a tie!") : `Player ${currentPlayer}'s turn`}</Text>
        </>
      )}
    </Box>
  );
};

export default Index;
