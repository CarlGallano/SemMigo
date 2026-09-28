import { Sun, Moon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  delay: number
  duration: number
}

// Matches Tailwind's `sm` breakpoint
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 639px)").matches,
  )
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return mobile
}

export default function ThemeSwitcher({
  dark,
  onToggle,
  scale = 1,
  mobileScale,
}: {
  dark: boolean
  onToggle: () => void
  scale?: number
  mobileScale?: number
}) {
  const isMobile = useIsMobile()
  const effectiveScale = isMobile ? (mobileScale ?? scale) : scale
  // State Management
  const [particles, setParticles] = useState<Particle[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Ref to track toggle button DOM element
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Generate particles with different timing
  const generateParticles = () => {
    const newParticles: Particle[] = []
    const particleCount = 3 // Multiple layers

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        delay: i * 0.1, // Stagger timing
        duration: 0.6 + i * 0.1, // Different durations for depth
      })
    }
    setParticles(newParticles)
    setIsAnimating(true)

    // Clear particles after animation
    setTimeout(() => {
      setIsAnimating(false)
      setParticles([])
    }, 1000)
  }

  // Toggle handler - switches theme and triggers particles
  const handleToggle = () => {
    generateParticles()
    onToggle()
  }

  return (
    <div
      className="relative inline-block"
      style={{ width: 104 * effectiveScale, height: 64 * effectiveScale }}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          transform: `scale(${effectiveScale})`,
          transformOrigin: "top left",
        }}
      >
        {/* SVG Filter for Film Grain Texture */}
        <svg className="absolute w-0 h-0">
          <defs>
            {/* Light mode grain - subtle */}
            <filter id="grain-light">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="4"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="saturate"
                values="0"
                result="desaturatedNoise"
              />
              <feComponentTransfer in="desaturatedNoise" result="lightGrain">
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="lightGrain" mode="overlay" />
            </filter>

            {/* Dark mode grain - more visible */}
            <filter id="grain-dark">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="4"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="saturate"
                values="0"
                result="desaturatedNoise"
              />
              <feComponentTransfer in="desaturatedNoise" result="darkGrain">
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="darkGrain" mode="overlay" />
            </filter>
          </defs>
        </svg>

        {/* Pill-shaped track container */}
        <motion.button
          ref={toggleRef}
          onClick={handleToggle}
          className="relative flex h-[64px] w-[104px] items-center rounded-full p-[6px] transition-all duration-300 focus:outline-none"
          style={{
            background: dark
              ? "radial-gradient(ellipse at top left, #1e293b 0%, #0f172a 40%, #020617 100%)"
              : "radial-gradient(ellipse at top left, #ffffff 0%, #f1f5f9 40%, #cbd5e1 100%)",
            boxShadow: dark
              ? `
              inset 5px 5px 12px rgba(0, 0, 0, 0.9),
              inset -5px -5px 12px rgba(71, 85, 105, 0.4),
              inset 8px 8px 16px rgba(0, 0, 0, 0.7),
              inset -8px -8px 16px rgba(100, 116, 139, 0.2),
              inset 0 2px 4px rgba(0, 0, 0, 1),
              inset 0 -2px 4px rgba(71, 85, 105, 0.4),
              inset 0 0 20px rgba(0, 0, 0, 0.6)
            `
              : `
              inset 5px 5px 12px rgba(148, 163, 184, 0.5),
              inset -5px -5px 12px rgba(255, 255, 255, 1),
              inset 8px 8px 16px rgba(100, 116, 139, 0.3),
              inset -8px -8px 16px rgba(255, 255, 255, 0.9),
              inset 0 2px 4px rgba(148, 163, 184, 0.4),
              inset 0 -2px 4px rgba(255, 255, 255, 1),
              inset 0 0 20px rgba(203, 213, 225, 0.3)
            `,
            border: dark
              ? "2px solid rgba(51, 65, 85, 0.6)"
              : "2px solid rgba(203, 213, 225, 0.6)",
            position: "relative",
          }}
          aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
          role="switch"
          aria-checked={dark}
          whileTap={{ scale: 0.98 }}
        >
          {/* Deep inner groove/rim effect */}
          <div
            className="absolute inset-[3px] rounded-full pointer-events-none"
            style={{
              boxShadow: dark
                ? "inset 0 2px 6px rgba(0, 0, 0, 0.9), inset 0 -1px 3px rgba(71, 85, 105, 0.3)"
                : "inset 0 2px 6px rgba(100, 116, 139, 0.4), inset 0 -1px 3px rgba(255, 255, 255, 0.8)",
            }}
          />

          {/* Multi-layer glossy overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: dark
                ? `
                radial-gradient(ellipse at top, rgba(71, 85, 105, 0.15) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(71, 85, 105, 0.2) 0%, transparent 30%, transparent 70%, rgba(0, 0, 0, 0.3) 100%)
              `
                : `
                radial-gradient(ellipse at top, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, transparent 30%, transparent 70%, rgba(148, 163, 184, 0.15) 100%)
              `,
              mixBlendMode: "overlay",
            }}
          />

          {/* Ambient occlusion effect */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: dark
                ? "inset 0 0 15px rgba(0, 0, 0, 0.5)"
                : "inset 0 0 15px rgba(148, 163, 184, 0.2)",
            }}
          />

          {/* Background Icons */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Sun
              size={20}
              className={dark ? "text-yellow-100" : "text-amber-600"}
            />
            <Moon
              size={20}
              className={dark ? "text-yellow-100" : "text-slate-700"}
            />
          </div>

          {/* Circular Thumb with Bouncy Spring Physics */}
          <motion.div
            className="relative z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full overflow-hidden"
            style={{
              background: dark
                ? "linear-gradient(145deg, #64748b 0%, #475569 50%, #334155 100%)"
                : "linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #f8fafc 100%)",
              boxShadow: dark
                ? `
                inset 2px 2px 4px rgba(100, 116, 139, 0.4),
                inset -2px -2px 4px rgba(0, 0, 0, 0.8),
                inset 0 1px 1px rgba(255, 255, 255, 0.15)
              `
                : `
                inset 2px 2px 4px rgba(203, 213, 225, 0.3),
                inset -2px -2px 4px rgba(255, 255, 255, 1),
                inset 0 1px 2px rgba(255, 255, 255, 1)
              `,
              border: dark
                ? "2px solid rgba(148, 163, 184, 0.3)"
                : "2px solid rgba(255, 255, 255, 0.9)",
            }}
            animate={{
              // Track is 104px wide with a 2px border and 6px padding, so the
              // 44px thumb travels 104 - (2 + 6) * 2 - 44 = 44px and sits the
              // same 8px in from the right edge as it does from the left.
              x: dark ? 44 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300, // Fast, responsive movement
              damping: 20, // Bouncy feel with slight overshoot
            }}
          >
            {/* Glossy shine overlay on thumb */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, transparent 40%, rgba(0, 0, 0, 0.1) 100%)",
                mixBlendMode: "overlay",
              }}
            />

            {/* Particle Layer - expanding circles from center with grainy texture */}
            {isAnimating &&
              particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <motion.div
                    className="absolute rounded-full"
                    style={{
                      width: "10px",
                      height: "10px",
                      background: dark
                        ? "radial-gradient(circle, rgba(147, 197, 253, 0.5) 0%, rgba(147, 197, 253, 0) 70%)"
                        : "radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(251, 191, 36, 0) 70%)",
                      mixBlendMode: "normal",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: dark ? 6 : 8, opacity: [0, 1, 0] }}
                    transition={{
                      duration: dark ? 0.5 : particle.duration,
                      delay: particle.delay,
                      ease: "easeOut",
                    }}
                  >
                    {/* Grainy texture overlay */}
                    <div
                      className="absolute inset-0 rounded-full opacity-40"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        mixBlendMode: "overlay",
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}

            {/* Icon */}
            <div className="relative z-10">
              {dark ? (
                <Moon size={20} className="text-yellow-200" />
              ) : (
                <Sun size={20} className="text-amber-500" />
              )}
            </div>
          </motion.div>
        </motion.button>
      </div>
    </div>
  )
}
