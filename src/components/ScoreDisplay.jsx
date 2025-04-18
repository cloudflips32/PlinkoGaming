export default function ScoreDisplay({ score, disksRemaining }) {
  return (
    <div className="mb-4 flex justify-between w-full max-w-[600px]">
      <div className="text-white ml-2 text-xl">Score: ${score}</div>
      <div className="text-white mr-2 text-xl">Disks: {disksRemaining}</div>
    </div>
  )
}
