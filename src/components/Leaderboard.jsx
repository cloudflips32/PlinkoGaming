"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function Leaderboard({ isOpen, onClose, leaderboardEntries }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 p-6 rounded-lg w-full max-w-md relative">
        <Button variant="ghost" className="absolute right-2 top-2 text-white hover:bg-purple-800" onClick={onClose}>
          <X size={20} />
        </Button>

        <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Leaderboard</h2>

        {leaderboardEntries.length === 0 ? (
          <p className="text-white text-center py-4">No scores yet. Be the first!</p>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-yellow-300 font-bold border-b border-purple-700 pb-2">
              <div>Rank</div>
              <div>Name</div>
              <div className="text-right">Score</div>
            </div>

            {leaderboardEntries
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((entry, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-white">
                  <div className="font-bold">{index + 1}</div>
                  <div>{entry.name}</div>
                  <div className="text-right">${entry.score}</div>
                </div>
              ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700 text-yellow-300" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
