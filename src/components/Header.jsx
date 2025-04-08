"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

import Image from "next/image"

export default function Header({ onOpenLeaderboard }) {
  return (
    <header className="w-full max-w-[95vw] flex mb-4 bg-transparent px-4 py-2 rounded-lg">
      <div className="flex space-x-4">
        <Image src="/Plinko_Thumbnail.jpg" width={80} height={80} alt="logo" />
      </div>
      <div className="flex space-x-2 items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-yellow-300">        </h1>
        <Button
          className="gap-2 bg-purple-700 hover:bg-purple-800 text-yellow-300 border-none transition duration-300 ease-in-out"
          onClick={onOpenLeaderboard}
        >
          <Trophy size={18} className="text-yellow-300" />
          Leaderboard
        </Button>
      </div>
    </header>
  )
}