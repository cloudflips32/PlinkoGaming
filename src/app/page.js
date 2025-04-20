import PlinkoGame from "@/components/PlinkoGame"

export default function Home() {
  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute overflow-hidden mt-auto ml-auto mr-autoleft-0 w-full h-full max-w-[360px] max-h-[700px] top-16 left-6 object-cover rounded-lg"
        src="/gaming.mp4"
      />
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-black-950 via-purple-900 to-purple-900">
        <PlinkoGame />
      </main>
    </>
  )
}

