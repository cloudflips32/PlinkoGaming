"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

export default function NameEntry({ score, onSave, onSkip }) {
  const [name, setName] = useState(["", "", ""])
  const [activeIndex, setActiveIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const [audioError, setAudioError] = useState(null)
  const inputRefs = [useRef(), useRef(), useRef()]
  const audioRef = useRef(null)

  // Initialize audio when component mounts
  useEffect(() => {
    try {
      // Create audio element
      audioRef.current = new Audio("/PriceIsRightMain.mp3")
      audioRef.current.loop = true
      audioRef.current.volume = 0.7

      // Set up event listeners
      audioRef.current.addEventListener("error", (e) => {
        console.error("Audio error:", e)
        setAudioError("Failed to load audio file")
      })

      // Try to play the audio
      const playAudio = () => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.warn("Autoplay prevented by browser, will try on user interaction")
            // This is expected on many browsers, so we don't set an error state
          })
        }
      }

      // Try to play after a short delay
      const timer = setTimeout(playAudio, 500)

      return () => {
        clearTimeout(timer)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.removeEventListener("error", () => {})
          audioRef.current = null
        }
      }
    } catch (err) {
      console.error("Audio initialization error:", err)
      setAudioError("Failed to initialize audio")
    }
  }, [])

  // Try to play audio on first user interaction
  useEffect(() => {
    const attemptPlayOnUserInteraction = () => {
      try {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch((e) => {
            console.warn("Play on interaction failed:", e)
          })
        }
      } catch (err) {
        console.error("Play attempt error:", err)
      }
    }

    // Add event listeners for common user interactions
    document.addEventListener("click", attemptPlayOnUserInteraction)
    document.addEventListener("keydown", attemptPlayOnUserInteraction)

    return () => {
      document.removeEventListener("click", attemptPlayOnUserInteraction)
      document.removeEventListener("keydown", attemptPlayOnUserInteraction)
    }
  }, [])

  // Handle mute toggle
  const toggleMute = () => {
    try {
      if (!audioRef.current) return

      if (muted) {
        audioRef.current.volume = 0.7
        setMuted(false)
        // Try to play if it was paused
        if (audioRef.current.paused) {
          audioRef.current.play().catch(() => {
            // Ignore errors here, as this is a user-initiated action
          })
        }
      } else {
        audioRef.current.volume = 0
        setMuted(true)
      }
    } catch (err) {
      console.error("Mute toggle error:", err)
    }
  }

  useEffect(() => {
    if (inputRefs[activeIndex]?.current) {
      inputRefs[activeIndex].current.focus()
    }
  }, [activeIndex])

  const handleChange = (index, value) => {
    // Only allow letters (A-Z, a-z)
    const letterOnly = value.replace(/[^A-Za-z]/g, "")

    if (letterOnly.length > 1) {
      value = letterOnly.charAt(0)
    } else {
      value = letterOnly
    }

    if (value) {
      const newName = [...name]
      newName[index] = value.toUpperCase()
      setName(newName)

      if (index < 2) {
        setActiveIndex(index + 1)
      }
    }

    // Try to play music if it's paused (user interaction)
    try {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {
          // Ignore errors here, as this is a user-initiated action
        })
      }
    } catch (err) {
      console.error("Play on input error:", err)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !name[index] && index > 0) {
      setActiveIndex(index - 1)
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1)
    } else if (e.key === "ArrowRight" && index < 2) {
      setActiveIndex(index + 1)
    } else if (e.key === "Enter" && name.join("").length === 3) {
      handleSave()
    }
  }

  const handleSave = () => {
    const fullName = name.join("")
    if (fullName.length === 3) {
      // Stop the audio before saving
      try {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      } catch (err) {
        console.error("Audio stop error:", err)
      }
      onSave(fullName)
    }
  }

  const handleSkip = () => {
    // Stop the audio before skipping
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    } catch (err) {
      console.error("Audio stop error:", err)
    }
    onSkip()
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-300 text-center">New High Score!</h2>
          <Button variant="ghost" size="icon" className="text-yellow-300 hover:bg-purple-800" onClick={toggleMute}>
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>

        <p className="text-xl text-white mb-6 text-center">${score}</p>

        <p className="text-white mb-4 text-center">Enter your initials (letters only):</p>

        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={name[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onClick={() => {
                setActiveIndex(index)
              }}
              className={`w-12 h-12 text-center text-2xl font-bold rounded-md ${
                activeIndex === index ? "bg-purple-200 border-2 border-purple-500" : "bg-white border border-gray-300"
              }`}
              pattern="[A-Za-z]"
            />
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-yellow-300"
            onClick={handleSave}
            disabled={name.join("").length !== 3}
          >
            Save Score
          </Button>
          <Button variant="outline" className="border-purple-500 text-black hover:bg-purple-800" onClick={handleSkip}>
            Skip
          </Button>
        </div>

        {audioError && (
          <p className="text-red-400 text-xs mt-4 text-center">{audioError}. Try clicking the volume button.</p>
        )}
      </div>
    </div>
  )
}

