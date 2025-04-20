"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import RatingDialog from "./RatingDialog"
import { db } from "@/config/FirebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function Header({ onOpenLeaderboard }) {
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenLeaderboard = () => {
    setIsLeaderboardOpen(true);
    fetchScores();
  };

  const handleCloseLeaderboard = () => {
    setIsLeaderboardOpen(false);
  };

  const fetchScores = async () => {
    try {
      setLoading(true);
      const scoresRef = collection(db, "high_scores");
      const q = query(scoresRef, orderBy("score", "desc"), limit(25));
      const querySnapshot = await getDocs(q);

      const fetchedScores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setScores(fetchedScores);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
      setError("Failed to load leaderboard. Please try again later.");
      setLoading(false);
    }
  };

  const handleRateMeClick = () => {
    setIsRatingOpen(true)
  }

  const handleClose = () => {
    setIsRatingOpen(false)
  }

  const handleSubmit = (data) => {
    console.log("Rating submitted:", data)
    setIsRatingOpen(false)
  }

  return (
    <>
      <header className="w-full max-w-[95vw] mb-4 px-4 py-2 rounded-lg bg-gradient-to-b from-blue-900 to-purple-900 ">
        <nav className="flex flex-col items-center w-full">
          <div className="flex justify-evenly items-center w-full">
            <Button
              className="bg-purple-700 hover:bg-purple-800 text-yellow-300 border-none transition duration-300 ease-in-out"
              onClick={handleOpenLeaderboard}
            >
              <Trophy size={18} className="text-yellow-300" />
              Leaderboard
            </Button>
            <div className="mx-12 ml-8">
              <Image src="/Plinko_Thumbnail.jpg" width={40} height={40} alt="logo" />
            </div>
            <Button onClick={handleRateMeClick}>
              Rate Me
            </Button>
          </div>
        </nav>
      </header>

      {/* Rating Dialog */}
      <RatingDialog isOpen={isRatingOpen} onClose={handleClose} onSubmit={handleSubmit} />

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="p-6 bg-gradient-to-b from-purple-900 to-purple-950 rounded-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-yellow-300 text-center mb-4">
              Leaderboard
            </h2>

            {loading ? (
              <p className="text-center text-white">Loading leaderboard...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <table className="w-full text-white">
                <thead>
                  <tr>
                    <th className="text-left py-2">Rank</th>
                    <th className="text-left py-2">Player</th>
                    <th className="text-right py-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr
                      key={score.id}
                      className={
                        index % 2 === 0 ? "bg-purple-800" : "bg-purple-700"
                      }
                    >
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{score["player-initials"]}</td>
                      <td className="py-2 px-4 text-right">{score.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Close Button */}
            <div className="flex justify-center mt-4">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-yellow-300"
                onClick={handleCloseLeaderboard}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
