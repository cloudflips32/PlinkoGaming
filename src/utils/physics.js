import Matter from "matter-js"

export function createSpringWall(x, y, width, height, options, world) {
  const wall = Matter.Bodies.rectangle(x, y, width, height, options)
  const springStiffness = 0.1
  const springDamping = 0.1

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

export function handlePegCollision(disk, peg, pair) {
  const collisionPoint = pair.collision.supports[0]
  const pegCenter = peg.position
  const distanceFromCenter = Matter.Vector.magnitude(Matter.Vector.sub(collisionPoint, pegCenter))

  const isTopMiddlePeg = peg.position.y === 150 && Math.abs(peg.position.x - 300) < 5

  if (isTopMiddlePeg && distanceFromCenter < 2) {
    const direction = Math.random() < 0.5 ? -1 : 1
    const forceMagnitude = 0.002
    const force = { x: direction * forceMagnitude, y: 0 }
    Matter.Body.applyForce(disk, disk.position, force)
  } else if (distanceFromCenter < 2) {
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

export function handleDiskCollision(diskA, diskB) {
  const yDifference = diskA.position.y - diskB.position.y
  const xDifference = Math.abs(diskA.position.x - diskB.position.x)

  if (Math.abs(yDifference) > 10 && xDifference < 5) {
    const upperDisk = yDifference < 0 ? diskA : diskB
    const lowerDisk = yDifference < 0 ? diskB : diskA

    const forceMagnitude = 0.001
    Matter.Body.applyForce(upperDisk, upperDisk.position, { x: 0, y: forceMagnitude })
    Matter.Body.applyForce(lowerDisk, lowerDisk.position, { x: 0, y: -forceMagnitude * 0.5 })
  }
}