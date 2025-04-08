"use client"

import { useEffect, useRef } from "react"
import Matter from "matter-js"
import GameBoard from "./GameBoard"
import ScoreDisplay from "./ScoreDisplay"
import BucketValues from "./BucketValues"
import GameControls from "./GameControls"
import Header from "./Header"
import Leaderboard from "./Leaderboard"
import useGameLogic from "../hooks/useGameLogic"
import useLeaderboard from "../hooks/useLeaderboard"

export default function PlinkoGame() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  const { score, disksRemaining, gameActive, gameOver, bucketValues, handleCollision, startGame, dropDisk } =
    useGameLogic(engineRef)

  const { leaderboardEntries, isLeaderboardOpen, openLeaderboard, closeLeaderboard, addLeaderboardEntry } =
    useLeaderboard()

  useEffect(() => {
    if (!canvasRef.current) return

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.5 } })
    engineRef.current = engine
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 375,
        height: 700,
        wireframes: false,
        background: "#1a103c",
      },
    })
    const runner = Matter.Runner.create()

    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)

    GameBoard.create(engine)

    Matter.Events.on(engine, "collisionStart", handleCollision)

    return () => {
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
      Matter.World.clear(engine.world, false)
      Matter.Events.off(engine, "collisionStart", handleCollision)
    }
  }, [handleCollision])

  const handleCanvasClick = (event) => {
    if (!gameActive || disksRemaining <= 0) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const clickX = event.clientX - canvasRect.left
    const columnWidth = 600 / 9
    const columnIndex = Math.floor(clickX / columnWidth)

    dropDisk(columnIndex)
  }

  const handleSaveScore = (name, score) => {
    addLeaderboardEntry(name, score)
  }

  return (
    <div className="flex flex-col items-center">
      <Header onOpenLeaderboard={openLeaderboard} />

      <ScoreDisplay score={score} disksRemaining={disksRemaining} />

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={360}
          height={700}
          className="border-2 border-purple-700 rounded-lg cursor-pointer"
          onClick={handleCanvasClick}
        />

        <BucketValues bucketValues={bucketValues} />

        <GameControls
          gameActive={gameActive}
          gameOver={gameOver}
          score={score}
          startGame={startGame}
          onSaveScore={handleSaveScore}
        />
      </div>

      {gameActive && <div className="mt-4 text-white text-center">Click on the game board to drop a disk</div>}

      <Leaderboard isOpen={isLeaderboardOpen} onClose={closeLeaderboard} leaderboardEntries={leaderboardEntries} />
    </div>
  )
}
