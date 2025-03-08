"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export default function Header({ onOpenLeaderboard }) {
  return (
    <header className="w-full max-w-[600px] flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold text-white">Plinko!</h1>
      <Button
        className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-yellow-300 border-none"
        onClick={onOpenLeaderboard}
      >
        <Trophy size={18} className="text-yellow-300" />
        Leaderboard
      </Button>
    </header>
  )
}
