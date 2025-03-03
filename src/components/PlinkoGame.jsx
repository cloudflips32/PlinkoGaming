"use client"

import { useEffect, useRef, useState } from "react"
import Matter from "matter-js"
import { Button } from "@/components/ui/button"

export default function PlinkoGame() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const runnerRef = useRef(null)
  const [score, setScore] = useState(0)
  const [disksRemaining, setDisksRemaining] = useState(10)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bucketValues, setBucketValues] = useState([])

  // Initialize the physics engine and renderer
  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.5 },
    })
    engineRef.current = engine

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 600,
        height: 700,
        wireframes: false,
        background: "#1a103c",
      },
    })
    renderRef.current = render

    // Create runner
    const runner = Matter.Runner.create()
    runnerRef.current = runner

    // Start the renderer
    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)

    // Create the game board
    createGameBoard(engine)

    // Event listener for when disks hit the bottom
    Matter.Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair

        // Check if a disk hit a scoring bucket
        if (bodyA.label === "disk" && bodyB.label.startsWith("bucket-")) {
          const bucketIndex = parseInt(bodyB.label.split("-")[1])
          const points = bucketValues[bucketIndex]
          setScore((prevScore) => prevScore + points)

          // Remove the disk after scoring
          setTimeout(() => {
            Matter.World.remove(engine.world, bodyA)
          }, 500)
        } else if (bodyB.label === "disk" && bodyA.label.startsWith("bucket-")) {
          const bucketIndex = parseInt(bodyA.label.split("-")[1])
          const points = bucketValues[bucketIndex]
          setScore((prevScore) => prevScore + points)

          // Remove the disk after scoring
          setTimeout(() => {
            Matter.World.remove(engine.world, bodyB)
          }, 500)
        }
      })
    })

    return () => {
      // Clean up
      if (renderRef.current) Matter.Render.stop(renderRef.current)
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current)
      if (engineRef.current) Matter.World.clear(engineRef.current.world, false)
      Matter.Events.off(engineRef.current)
    }
  }, [bucketValues])

  // Generate random bucket values
  const generateBucketValues = () => {
    const values = new Array(9).fill(0);
    const positiveIndices = [];
    
    // Select 3 random indices for positive values
    while (positiveIndices.length < 3) {
      const index = Math.floor(Math.random() * 9);
      if (!positiveIndices.includes(index)) {
        positiveIndices.push(index);
      }
    }
    
    // Assign positive values to the selected indices
    positiveIndices.forEach(index => {
      values[index] = Math.floor(Math.random() * 10001); // 0 to 10000
    });
    
    setBucketValues(values);
  };

  // Create the game board with pegs, walls, and scoring buckets
  const createGameBoard = (engine) => {
    const world = engine.world
    const width = 600
    const height = 700
    const pegRadius = 6
    const wallThickness = 20

    // Create walls with spring physics
    const leftWall = createSpringWall(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true, render: { fillStyle: "#6b21a8" } },
      world,
    )

    const rightWall = createSpringWall(
      width + wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true, render: { fillStyle: "#6b21a8" } },
      world,
    )

    // Create pegs in a grid pattern
    const pegs = []
    const rows = 9
    const cols = 11
    const pegSpacingX = width / cols
    const pegSpacingY = 50
    const startY = 150

    for (let row = 0; row < rows; row++) {
      const offsetX = row % 2 === 0 ? 0 : pegSpacingX / 2
      const colsInRow = row % 2 === 0 ? cols : cols - 1

      for (let col = 0; col < colsInRow; col++) {
        const peg = Matter.Bodies.circle(
          offsetX + col * pegSpacingX + pegSpacingX / 2,
          startY + row * pegSpacingY,
          pegRadius,
          {
            isStatic: true,
            restitution: 0.5,
            friction: 0.05,
            render: { fillStyle: "#f8fafc" },
          },
        )
        pegs.push(peg)
      }
    }

    // Create scoring buckets at the bottom
    const buckets = []
    const bucketCount = 9
    const bucketWidth = width / bucketCount
    const bucketHeight = 40
    const bucketY = height - bucketHeight / 2

    // Create dividers between buckets
    const dividers = []
    for (let i = 0; i <= bucketCount; i++) {
      const divider = Matter.Bodies.rectangle(i * bucketWidth, height - bucketHeight - 20, 5, 40, {
        isStatic: true,
        render: { fillStyle: "#6b21a8" },
      })
      dividers.push(divider)
    }

    // Create the actual buckets with score values
    for (let i = 0; i < bucketCount; i++) {
      const bucket = Matter.Bodies.rectangle(
        i * bucketWidth + bucketWidth / 2,
        bucketY,
        bucketWidth,
        bucketHeight,
        { 
          isStatic: true, 
          label: `bucket-${i}`,
          render: { 
            fillStyle: bucketValues[i] > 0 ? '#fbbf24' : '#4c1d95', // Gold for positive values, purple for zero
            lineWidth: 1,
            strokeStyle: '#a855f7'
          }
        }
      );
      buckets.push(bucket);
    }

    // Add all objects to the world
    Matter.Composite.add(world, [...pegs, ...buckets, ...dividers])
  }

  // Create a wall with spring physics
  const createSpringWall = (x, y, width, height, options, world) => {
    const wall = Matter.Bodies.rectangle(x, y, width, height, options)
    const springStiffness = 0.1
    const springDamping = 0.1

    // Create spring constraints
    const topSpring = Matter.Constraint.create({
      pointA: { x: x, y: 0 },
      bodyB: wall,
      pointB: { x: 0, y: -height / 2 },
      stiffness: springStiffness,
      damping: springDamping,
      render: { visible: false },
    })

    const bottomSpring = Matter.Constraint.create({
      pointA: { x: x, y: height },
      bodyB: wall,
      pointB: { x: 0, y: height / 2 },
      stiffness: springStiffness,
      damping: springDamping,
      render: { visible: false },
    })

    Matter.World.add(world, [wall, topSpring, bottomSpring])
    return wall
  }

  // Drop a disk at a specific column
  const dropDisk = (columnIndex) => {
    if (!engineRef.current || disksRemaining <= 0) return

    const width = 600
    const diskRadius = 15
    const columnWidth = width / 9
    const dropX = columnWidth * columnIndex + columnWidth / 2

    const disk = Matter.Bodies.circle(dropX, 50, diskRadius, {
      label: "disk",
      restitution: 0.5, // Bounciness
      friction: 0.05,
      frictionAir: 0.01,
      density: 0.002,
      render: {
        fillStyle: "#f59e0b",
        strokeStyle: "#fbbf24",
        lineWidth: 2,
      },
    })

    Matter.World.add(engineRef.current.world, disk)
    setDisksRemaining((prev) => prev - 1)

    if (disksRemaining === 1) {
      setTimeout(() => {
        setGameOver(true)
        setGameActive(false)
      }, 5000)
    }
  }

  // Handle canvas click
  const handleCanvasClick = (event) => {
    if (!gameActive || disksRemaining <= 0) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const clickX = event.clientX - canvasRect.left
    const columnWidth = 600 / 9
    const columnIndex = Math.floor(clickX / columnWidth)

    dropDisk(columnIndex)
  }

  // Start a new game
  const startGame = () => {
    setScore(0)
    setDisksRemaining(10)
    setGameActive(true)
    setGameOver(false)
    generateBucketValues()

    // Clear any existing disks
    if (engineRef.current) {
      const bodies = Matter.Composite.allBodies(engineRef.current.world)
      bodies.forEach((body) => {
        if (body.label === "disk") {
          Matter.World.remove(engineRef.current.world, body)
        }
      })
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-[600px]">
        <div className="text-white text-xl">Score: ${score}</div>
        <div className="text-white text-xl">Disks: {disksRemaining}</div>
      </div>

      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={700} 
          className="border-2 border-purple-700 rounded-lg cursor-pointer"
          onClick={handleCanvasClick}
        />

        {/* Display bucket values */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around">
          {bucketValues.map((value, index) => (
            <div
              key={index}
              className={`text-xs font-bold ${value > 0 ? 'text-yellow-300' : 'text-white'}`}
              style={{width: '66px', textAlign: 'center'}}
            >
              {value > 0 ? `$${value}` : <span className="font-bold">ZERO</span>}
            </div>
          ))}
        </div>

        {!gameActive && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <Button onClick={startGame} className="px-6 py-3 text-xl bg-purple-600 hover:bg-purple-700">
              Start Game
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <div className="text-3xl font-bold text-white mb-4">Game Over!</div>
            <div className="text-2xl text-white mb-6">Final Score: ${score}</div>
            <Button onClick={startGame} className="px-6 py-3 text-xl bg-purple-600 hover:bg-purple-700">
              Play Again
            </Button>
          </div>
        )}
      </div>

      {gameActive && (
        <div className="mt-4 text-white text-center">
          Click on the game board to drop a disk
        </div>
      )}
    </div>
  )
}
