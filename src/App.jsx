"use client"

import { useState, useRef, useEffect } from "react"
import { useAnimation } from "framer-motion"
import ImageGrid from "./components/ImageGrid"
import "@fontsource/archivo-black"
import Navbar from "./components/Navbar"
import LoadingScreen from "./components/Loadingscreen"

const text = ["IMAGINING", "UNIQUE", "CONCEPTS", "AND DIGITAL", "EXPERIENCES"]

export default function App() {
  const [loading, setLoading] = useState(true)
  const [textLoading, setTextLoading] = useState(true)
  const [hoveredImage, setHoveredImage] = useState(null)
  const [hoveredLine, setHoveredLine] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)
  const [fontSize, setFontSize] = useState("6vw")
  const cursorAnimation = useAnimation()
  const imageRefs = useRef([])
  const textContainerRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      checkImageHover(e.clientX, e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", adjustFontSize)
    adjustFontSize()
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", adjustFontSize)
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      cursorAnimation.start({
        x: mousePosition.x - 25,
        y: mousePosition.y - 25,
        transition: { type: "spring", stiffness: 500, damping: 50 },
      })
    }
  }, [mousePosition, cursorAnimation, isClient])

  useEffect(() => {
    if (!loading) {
      console.log("Loading finished, showing homepage") // Debugging
      setTextLoading(false)
    }
  }, [loading])

  const checkImageHover = (x, y) => {
    let hoveredIndex = null
    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect()
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          hoveredIndex = index
        }
      }
    })
    setHoveredImage(hoveredIndex)
  }

  const adjustFontSize = () => {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const smallestDimension = Math.min(windowWidth, windowHeight)
    const newFontSize = Math.max(20, smallestDimension * (150 / 945))
    setFontSize(`${newFontSize}px`)
  }

  if (!isClient) {
    return null
  }

  return (
    <>
      {loading ? (
        <LoadingScreen  onLoadingComplete={() => {
          setTimeout(() => setLoading(false), 0) // Forces immediate state update
        }} />
      ) : (
        <>
          <Navbar />
          <div className="relative min-h-screen w-screen bg-[#212121] overflow-hidden flex flex-col justify-center items-center mt-10">
            <div className="absolute inset-0 flex justify-center items-center">
              <ImageGrid
                hoveredImage={hoveredImage}
                setHoveredImage={setHoveredImage}
                mousePosition={mousePosition}
                setMousePosition={setMousePosition}
              />
            </div>
            <div
              ref={textContainerRef}
              className="container flex flex-col justify-center items-center relative z-20 py-10"
            >
              {text.map((line, index) => (
                <h1
                  key={index}
                  className={`text relative inline-block cursor-pointer leading-[0.85] m-0 font-bold text-center ${!textLoading ? "text-emerged" : ""}`}
                  style={{
                    fontFamily: "Archivo Black, sans-serif",
                    fontSize: fontSize,
                    color: hoveredImage !== null ? "#212121" : "#ffffff",
                    letterSpacing: ".01em",
                    transition: "color 0.005s ease",
                    overflow: "hidden",
                    textShadow:
                      hoveredImage !== null
                        ? "-1px -1px 0 #424242, 1px -1px 0 #424242, -1px 1px 0 #424242, 1px 1px 0 #424242"
                        : "none",
                  }}
                  onMouseEnter={() => hoveredImage === null && setHoveredLine(index)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  <div className="split-parent">
                    <div className="split-child">
                      <span className="relative z-10 px-1 py-0.5">{line}</span>
                    </div>
                  </div>
                </h1>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}