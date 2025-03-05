import { Button } from '@/components/ui/button'

/**
 * A functional component that renders game controls for Plinko game.
 * It displays a start button or a game over message with the final score and a play again button.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.gameActive - Indicates whether the game is currently active.
 * @param {boolean} props.gameOver - Indicates whether the game is over.
 * @param {number} props.score - The current score of the game.
 * @param {function} props.startGame - A function to start a new game.
 *
 * @returns {JSX.Element} - The rendered game controls.
 */

const GameControls = ({ gameActive, gameOver, score, startGame }) => {
  if (gameActive) return null
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
      {gameOver ? (
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-white mb-4">Game Over!</div>
          <div className="text-2xl text-white mb-6">Final Score: ${score}</div>
          <Button onClick={startGame} className="px-6 py-3 text-xl bg-purple-600 hover:bg-purple-700">
            Play Again
          </Button>
        </div>
      ) : (
        <Button onClick={startGame} className="px-6 py-3 text-xl bg-purple-600 hover:bg-purple-700">
          Start Game
        </Button>
      )}
    </div>
  )
}

export default GameControls

