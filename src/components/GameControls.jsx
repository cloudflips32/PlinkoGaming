"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NameEntry from "./NameEntry"

export default function GameControls({ gameActive, gameOver, score, startGame, onSaveScore }) {
  const [showNameEntry, setShowNameEntry] = useState(false)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)

  // Show name entry when game is over
  useEffect(() => {
    if (gameOver && !showNameEntry && !scoreSubmitted) {
      setShowNameEntry(true)
    }
  }, [gameOver, showNameEntry, scoreSubmitted])

  const handleSaveScore = (name) => {
    onSaveScore(name, score)
    setShowNameEntry(false)
    setScoreSubmitted(true)
  }

  const handleSkip = () => {
    setShowNameEntry(false)
    setScoreSubmitted(true)
  }

  const handlePlayAgain = () => {
    setScoreSubmitted(false)
    startGame()
  }

  if (gameActive) return null

  if (showNameEntry) {
    return <NameEntry score={score} onSave={handleSaveScore} onSkip={handleSkip} />
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
      {gameOver ? (
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-white mb-4">Game Over!</div>
          <div className="text-2xl text-white mb-6">Final Score: ${score}</div>
        <Button

          onClick={handlePlayAgain}

            className="px-6 py-3 text-xl bg-purple-600 hover:bg-purple-700 text-yellow-300"
          >
            Play Again
          </Button>
        </div>
      ) : (
        <Button onClick={startGame} className="px-6 py-3 text-xl bg-purple-600 hover:bg-purple-700 text-yellow-300">
          Start Game
        </Button>
      )}
    </div>
  )
}
