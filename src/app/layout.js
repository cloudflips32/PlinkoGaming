import "./globals.css"

export const metadata = {
  title: "Plinko Game",
  description: "A fun Plinko game with physics",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add preload for the Price is Right music */}
        <link rel="preload" href="../../public/PriceIsRightMain.mp3" as="audio" />
      </head>
      <body>{children}</body>
    </html>
  )
}

