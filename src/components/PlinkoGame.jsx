"use client"

import { useEffect, useRef } from "react"
import Matter from "matter-js"
import GameBoard from "./GameBoard"
import ScoreDisplay from "./ScoreDisplay"
import BucketValues from "./BucketValues"
import GameControls from "./GameControls"
import useGameLogic from "../hooks/useGameLogic"

/**
 * The main component for the Plinko game.
 * This component sets up the game board, handles user interactions, and manages game state.
 *
 * @returns {JSX.Element} - The Plinko game component.
 */

export default function PlinkoGame() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  const {
    score,
    disksRemaining,
    gameActive,
    gameOver,
    bucketValues,
    handleCollision,
    startGame,
    dropDisk,
  } = useGameLogic(engineRef);

  /**
   * Initializes the game board, physics engine, and event listeners.
   * Cleans up resources when the component unmounts.
   */

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.5 } });
    engineRef.current = engine;
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 600,
        height: 700,
        wireframes: false,
        background: "#1a103c",
      },
    });
    const runner = Matter.Runner.create();

    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    GameBoard.create(engine);

    Matter.Events.on(engine, "collisionStart", handleCollision);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Events.off(engine, "collisionStart", handleCollision);
    };
  }, [handleCollision]);

  /**
   * Handles canvas click events. Drops a disk in the clicked column if the game is active and there are disks remaining.
   *
   * @param {React.MouseEvent<HTMLCanvasElement>} event - The click event.
   */
  
  const handleCanvasClick = (event) => {
    if (!gameActive || disksRemaining <= 0) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const clickX = event.clientX - canvasRect.left;
    const columnWidth = 600 / 9;
    const columnIndex = Math.floor(clickX / columnWidth);

    dropDisk(columnIndex);
  };

  return (
    <div className="flex flex-col items-center">
      <ScoreDisplay score={score} disksRemaining={disksRemaining} />

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={700}
          className="border-2 border-purple-700 rounded-lg cursor-pointer"
          onClick={handleCanvasClick}
        />

        <BucketValues bucketValues={bucketValues} />

        <GameControls gameActive={gameActive} gameOver={gameOver} score={score} startGame={startGame} />
      </div>

      {gameActive && <div className="mt-4 text-white text-center">Click on the game board to drop a disk</div>}
    </div>
  );
}


