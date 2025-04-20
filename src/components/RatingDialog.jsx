"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { db } from "@/config/FirebaseConfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

function RatingDialog({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [initials, setInitials] = useState("")
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    console.log("Rating updated to:", rating)
  }, [rating])

  if (!isOpen) return null

  const handleCommentChange = (e) => {
    const value = e.target.value
    if (/[:;{}]/.test(value)) {
      setError("Comment cannot contain colons, semicolons, or curly braces.")
    } else if (value.length > 50) {
      setError("Comment cannot exceed 50 characters.")
    } else {
      setError("")
      setComment(value)
    }
  }

  const handleStarClick = (star) => {
    setRating(star)
  }

  const handleSubmit = async () => {
    if (error) return
    setLoading(true)
    setSubmitError("")
    try {
      await addDoc(collection(db, "reviews"), {
        rating: rating,
        "review-text": comment,
        reviewer: initials,
        "created-at": serverTimestamp()
      })
      onSubmit({ rating, initials, comment })
      onClose()
    } catch (e) {
      setSubmitError("Failed to submit review. Please try again.")
      console.error("Error adding document: ", e)
    } finally {
      setLoading(false)
      setComment("")
      setInitials("")
      setRating(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary text-primary-foreground rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Rate the Game</h2>
        <div className="mb-4">
          <label className="block mb-1">Rating (1-5 stars):</label>
          <div className="flex space-x-1">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className={`text-yellow-400 text-2xl ${star <= rating ? "opacity-100" : "opacity-40"}`}
                aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="initials" className="block mb-1">Your Initials:</label>
          <input
            id="initials"
            type="text"
            maxLength={3}
            value={initials}
            onChange={(e) => setInitials(e.target.value.toUpperCase())}
            className="w-full rounded border border-gray-300 px-2 py-1 text-white"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block mb-1">Comment (max 50 chars):</label>
          <textarea
            id="comment"
            value={comment}
            onChange={handleCommentChange}
            maxLength={50}
            className="w-full rounded border border-gray-300 px-2 py-1 text-white resize-none"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        {submitError && <p className="text-red-600 mb-2">{submitError}</p>}
        <div className="flex justify-end space-x-2">
          <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600" disabled={!!error || loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button variant="outline" className="text-black hover:bg-gray-200" onClick={onClose} disabled={loading}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}

export default RatingDialog
