"use client"

import { useState, useEffect } from "react"

export default function useLeaderboard() {
  const [leaderboardEntries, setLeaderboardEntries] = useState([])
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)

  // Load leaderboard from localStorage on initial render
  useEffect(() => {
    const storedLeaderboard = localStorage.getItem("plinkoLeaderboard")
    if (storedLeaderboard) {
      try {
        setLeaderboardEntries(JSON.parse(storedLeaderboard))
      } catch (error) {
        console.error("Failed to parse leaderboard data:", error)
      }
    }
  }, [])

  // Save leaderboard to localStorage whenever it changes
  useEffect(() => {
    if (leaderboardEntries.length > 0) {
      localStorage.setItem("plinkoLeaderboard", JSON.stringify(leaderboardEntries))
    }
  }, [leaderboardEntries])

  const addLeaderboardEntry = (name, score) => {
    const newEntry = { name, score, date: new Date().toISOString() }
    setLeaderboardEntries((prev) => [...prev, newEntry])
  }

  const openLeaderboard = () => {
    console.log("Opening leaderboard")
    setIsLeaderboardOpen(true)
  }

  const closeLeaderboard = () => {
    console.log("Closing leaderboard")
    setIsLeaderboardOpen(false)
  }

  return {
    leaderboardEntries,
    isLeaderboardOpen,
    openLeaderboard,
    closeLeaderboard,
    addLeaderboardEntry,
  }
}

