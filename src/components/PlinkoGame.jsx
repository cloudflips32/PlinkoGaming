"use client"

import { useEffect, useRef, useState, useCallback } from "react"
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

  const handleBucketCollision = useCallback(
    (disk, bucket) => {
      const bucketIndex = Number.parseInt(bucket.label.split("-")[1])
      const points = bucketValues[bucketIndex] || 0
      setScore((prevScore) => {
        console.log(`Adding ${points} to previous score ${prevScore}`)
        return prevScore + points
      })

      // Remove the disk after scoring
      setTimeout(() => {
        Matter.Composite.remove(engineRef.current.world, disk)
      }, 500)
    },
    [bucketValues],
  )

  const handleCollision = useCallback(
    (event) => {
      const pairs = event.pairs

      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i]

        // Check if a disk hit a scoring bucket
        if (bodyA.label === "disk" && bodyB.label.startsWith("bucket-")) {
          handleBucketCollision(bodyA, bodyB)
        } else if (bodyB.label === "disk" && bodyA.label.startsWith("bucket-")) {
          handleBucketCollision(bodyB, bodyA)
        }

        // Check if a disk hit a peg
        if ((bodyA.label === "disk" && bodyB.label === "peg") || (bodyB.label === "disk" && bodyA.label === "peg")) {
          handlePegCollision(bodyA.label === "disk" ? bodyA : bodyB, bodyA.label === "peg" ? bodyA : bodyB, pairs[i])
        }

        // Check if two disks collided
        if (bodyA.label === "disk" && bodyB.label === "disk") {
          handleDiskCollision(bodyA, bodyB)
        }
      }
    },
    [handleBucketCollision],
  )

  const handleDiskCollision = (diskA, diskB) => {
    const yDifference = diskA.position.y - diskB.position.y
    const xDifference = Math.abs(diskA.position.x - diskB.position.x)

    // Check if one disk is directly above the other (with some tolerance)
    if (Math.abs(yDifference) > 10 && xDifference < 5) {
      const upperDisk = yDifference < 0 ? diskA : diskB
      const lowerDisk = yDifference < 0 ? diskB : diskA

      // Apply a downward force to the upper disk
      const forceMagnitude = 0.001
      Matter.Body.applyForce(upperDisk, upperDisk.position, { x: 0, y: forceMagnitude })

      // Apply an upward force to the lower disk (smaller magnitude)
      Matter.Body.applyForce(lowerDisk, lowerDisk.position, { x: 0, y: -forceMagnitude * 0.5 })
    }
  }

  const handlePegCollision = (disk, peg, pair) => {
    const collisionPoint = pair.collision.supports[0]
    const pegCenter = peg.position
    const distanceFromCenter = Matter.Vector.magnitude(Matter.Vector.sub(collisionPoint, pegCenter))

    // Check if this is the top-middle peg
    const isTopMiddlePeg = peg.position.y === 150 && Math.abs(peg.position.x - 300) < 5

    if (isTopMiddlePeg && distanceFromCenter < 2) {
      // For the top-middle peg, spring left or right randomly
      const direction = Math.random() < 0.5 ? -1 : 1
      const forceMagnitude = 0.002 // Increased force for more noticeable effect
      const force = { x: direction * forceMagnitude, y: 0 }
      Matter.Body.applyForce(disk, disk.position, force)
    } else if (distanceFromCenter < 2) {
      // For other pegs, use the previous logic
      const direction = Matter.Vector.normalise(Matter.Vector.sub(disk.position, pegCenter))
      const forceMagnitude = 0.0005
      const force = Matter.Vector.mult(direction, forceMagnitude)

      const randomForce = {
        x: (Math.random() - 0.5) * 0.0001,
        y: (Math.random() - 0.5) * 0.0001,
      }
      const totalForce = Matter.Vector.add(force, randomForce)

      Matter.Body.applyForce(disk, disk.position, totalForce)
    }
  }

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

    // Event listener for collisions
    Matter.Events.on(engine, "collisionStart", handleCollision)

    return () => {
      // Clean up
      if (renderRef.current) Matter.Render.stop(renderRef.current)
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current)
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false)
        Matter.Events.off(engineRef.current, "collisionStart", handleCollision)
      }
    }
  }, [handleCollision])

  // Generate random bucket values
  const generateBucketValues = useCallback(() => {
    const values = new Array(9).fill(0)
    const goldBuckets = [1, 4, 7] // 2nd, 5th, and 8th buckets (0-indexed)

    // Assign random positive values to the gold buckets
    goldBuckets.forEach((index) => {
      values[index] = Math.floor(Math.random() * 9001) + 1000 // 1000 to 10000
    })

    setBucketValues(values)
  }, [])

  // Create the game board with pegs, walls, and scoring buckets
  const createGameBoard = (engine) => {
    const world = engine.world
    const width = 600
    const height = 700
    const pegRadius = 6
    const wallThickness = 20

    // Create walls with spring physics
    createSpringWall(
      -wallThickness / 2,
      height / 2,
      wallThickness,
      height,
      { isStatic: true, render: { fillStyle: "#6b21a8" } },
      world,
    )

    createSpringWall(
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
            label: "peg",
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
      const isGoldBucket = [1, 4, 7].includes(i) // 2nd, 5th, and 8th buckets (0-indexed)
      const bucket = Matter.Bodies.rectangle(i * bucketWidth + bucketWidth / 2, bucketY, bucketWidth, bucketHeight, {
        isStatic: true,
        label: `bucket-${i}`,
        render: {
          fillStyle: isGoldBucket ? "#fbbf24" : "#4c1d95", // Gold for 2nd, 5th, and 8th buckets, purple for others
          lineWidth: 1,
          strokeStyle: "#a855f7",
        },
      })
      buckets.push(bucket)
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

    Matter.Composite.add(world, [wall, topSpring, bottomSpring])
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
      collisionFilter: {
        group: 0,
        category: 0x0002,
        mask: 0xffffffff,
      },
      render: {
        fillStyle: "#f59e0b",
        strokeStyle: "#fbbf24",
        lineWidth: 2,
      },
    })

    Matter.Composite.add(engineRef.current.world, disk)
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
          Matter.Composite.remove(engineRef.current.world, body)
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
              className={`text-xs font-bold ${[1, 4, 7].includes(index) ? "text-yellow-300" : "text-white"}`}
              style={{ width: "66px", textAlign: "center" }}
            >
              {[1, 4, 7].includes(index) ? `$${value}` : <span className="font-bold">ZERO</span>}
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

      {gameActive && <div className="mt-4 text-white text-center">Click on the game board to drop a disk</div>}
    </div>
  )
}

