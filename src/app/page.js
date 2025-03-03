import PlinkoGame from "@/components/PlinkoGame"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 to-purple-900">
      <h1 className="text-4xl font-bold text-white mb-6">Plinko Game</h1>
      <PlinkoGame />
    </main>
  )
}