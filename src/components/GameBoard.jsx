import Matter from "matter-js"
import { createSpringWall } from "../utils/physics"

const GameBoard = {
  create: (engine) => {
    const world = engine.world
    const width = 380
    const height = 700
    const pegRadius = 6
    const wallThickness = 20

    // Create walls
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

    // Create pegs
    const pegs = createPegs(width, height, pegRadius)

    // Create buckets and dividers
    const { buckets, dividers } = createBucketsAndDividers(width, height)

    // Add all objects to the world
    Matter.Composite.add(world, [...pegs, ...buckets, ...dividers])
  },
}

function createPegs(width, height, pegRadius) {
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

  return pegs
}

function createBucketsAndDividers(width, height) {
  const buckets = []
  const dividers = []
  const bucketCount = 9
  const bucketWidth = width / bucketCount
  const bucketHeight = 40
  const bucketY = height - bucketHeight / 2

  for (let i = 0; i <= bucketCount; i++) {
    const divider = Matter.Bodies.rectangle(i * bucketWidth, height - bucketHeight - 20, 5, 40, {
      isStatic: true,
      render: { fillStyle: "#6b21a8" },
    })
    dividers.push(divider)

    if (i < bucketCount) {
      const isGoldBucket = [1, 4, 7].includes(i)
      const bucket = Matter.Bodies.rectangle(i * bucketWidth + bucketWidth / 2, bucketY, bucketWidth, bucketHeight, {
        isStatic: true,
        label: `bucket-${i}`,
        render: {
          fillStyle: isGoldBucket ? "#fbbf24" : "#4c1d95",
          lineWidth: 1,
          strokeStyle: "#a855f7",
        },
      })
      buckets.push(bucket)
    }
  }

  return { buckets, dividers }
}

export default GameBoard

