"use client"

import { useState, useCallback } from "react"
import Matter from "matter-js"
import { handlePegCollision, handleDiskCollision } from "../utils/physics"

/**
 * A custom React hook that manages the game logic for a Plinko game using the Matter.js physics engine.
 *
 * @param {React.MutableRefObject<Matter.Engine>} engineRef - A reference to the Matter.js engine instance.
 * @returns {Object} An object containing various game state and logic functions.
 */

export default function useGameLogic(engineRef) {
  const [score, setScore] = useState(0)
  const [disksRemaining, setDisksRemaining] = useState(10)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [bucketValues, setBucketValues] = useState([])

  /**
   * Handles the collision between a disk and a bucket.
   *
   * @param {Matter.Body} disk - The disk body.
   * @param {Matter.Body} bucket - The bucket body.
   */

  const handleBucketCollision = useCallback(
    (disk, bucket) => {
      const bucketIndex = Number.parseInt(bucket.label.split("-")[1])
      const points = bucketValues[bucketIndex] || 0
      setScore((prevScore) => prevScore + points)

      setTimeout(() => {
        if (engineRef.current) {
          Matter.Composite.remove(engineRef.current.world, disk)
        }
      }, 500)
    },
    [bucketValues, engineRef],
  )

  /**
   * Handles all collisions in the game.
   *
   * @param {Matter.Events.Event} event - The collision event.
   */

  const handleCollision = useCallback(
    (event) => {
      const pairs = event.pairs

      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i]

        if (bodyA.label === "disk" && bodyB.label.startsWith("bucket-")) {
          handleBucketCollision(bodyA, bodyB)
        } else if (bodyB.label === "disk" && bodyA.label.startsWith("bucket-")) {
          handleBucketCollision(bodyB, bodyA)
        } else if (
          (bodyA.label === "disk" && bodyB.label === "peg") ||
          (bodyB.label === "disk" && bodyA.label === "peg")
        ) {
          handlePegCollision(bodyA.label === "disk" ? bodyA : bodyB, bodyA.label === "peg" ? bodyA : bodyB, pairs[i])
        } else if (bodyA.label === "disk" && bodyB.label === "disk") {
          handleDiskCollision(bodyA, bodyB)
        }
      }
    },
    [handleBucketCollision],
  )

  /**
   * Generates random values for the golden buckets.
   */

  const generateBucketValues = useCallback(() => {
    const values = new Array(9).fill(0)
    const goldBuckets = [1, 4, 7]
    goldBuckets.forEach((index) => {
      values[index] = Math.floor(Math.random() * 9001) + 1000
    })
    setBucketValues(values)
  }, [])

  /**
   * Starts a new game by resetting the game state and generating new bucket values.
   */

  const startGame = useCallback(() => {
    setScore(0)
    setDisksRemaining(10)
    setGameActive(true)
    setGameOver(false)
    generateBucketValues()

    if (engineRef.current) {
      const bodies = Matter.Composite.allBodies(engineRef.current.world)
      bodies.forEach((body) => {
        if (body.label === "disk") {
          Matter.Composite.remove(engineRef.current.world, body)
        }
      })
    }
  }, [generateBucketValues, engineRef])

  /**
   * Drops a disk from a specific column.
   *
   * @param {number} columnIndex - The index of the column where the disk should be dropped.
   */
  
  const dropDisk = useCallback(
    (columnIndex) => {
      if (disksRemaining <= 0 || !engineRef.current) return

      const width = 600
      const diskRadius = 15
      const columnWidth = width / 9
      const dropX = columnWidth * columnIndex + columnWidth / 2

      const disk = Matter.Bodies.circle(dropX, 50, diskRadius, {
        label: "disk",
        restitution: 0.5,
        friction: 0.05,
        frictionAir: 0.01,
        density: 0.002,
        collisionFilter: { group: 0, category: 0x0002, mask: 0xffffffff },
        render: { fillStyle: "#f59e0b", strokeStyle: "#fbbf24", lineWidth: 2 },
      })

      Matter.Composite.add(engineRef.current.world, disk)
      setDisksRemaining((prev) => prev - 1)

      if (disksRemaining === 1) {
        setTimeout(() => {
          setGameOver(true)
          setGameActive(false)
        }, 5000)
      }
    },
    [disksRemaining, engineRef],
  )

  return {
    score,
    disksRemaining,
    gameActive,
    gameOver,
    bucketValues,
    handleCollision,
    startGame,
    dropDisk,
  }
}


