import React, { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"
import heroImage from "@/assets/hero-image.jpg"
import { useNavigate } from "react-router-dom"
import { ScrollParallax } from "react-just-parallax"


import { ScrollProgress } from "@/components/ui/ScrollProgress"
 

interface MousePosition {
  x: number
  y: number
}

const AnimatedBackground: React.FC = () => {
  const controls = useAnimation()
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    controls.start({
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    })
  }, [controls])

  return (
    <svg className="absolute inset-0 w-full h-full text-gray-800 dark:text-gray-200">
      <defs>
        <pattern id="backgroundGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#backgroundGrid)" />
      <defs>
        <pattern id="sGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            strokeWidth="0.5"
            stroke="currentColor"
            strokeOpacity="0.05"
            transform={`translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`} 
          />
        </pattern>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#sGrid)" />
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <motion.circle
        cx="50%"
        cy="29%"
        r="19%"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1"
        animate={controls}
      />
      <motion.path
        d={`M0,${100 + mousePosition.y * 50} Q250,${mousePosition.y * 100} 500,100 T1000,${100 + mousePosition.y * 50}`}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  )
}

interface TextAnimationProps {
  text: string
}

const TextAnimation: React.FC<TextAnimationProps> = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false)

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const charVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      variants={containerVariants}
      className="font-serif"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={charVariants}
          whileHover={{
            scale: isHovered ? 1.1 : 1,
            color: isHovered ? "#6b7280" : "#3b82f6",
            transition: { duration: 0.2 },
          }}
          className="inline-block text-black dark:text-white"
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  )
}

const Home: React.FC = () => {
  const navigate = useNavigate()

  const handleStartDebate = () => {
    navigate("/start-debate")
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 overflow-hidden font-body">
      <ScrollProgress />
      <AnimatedBackground />

      <div className="flex flex-col items-center justify-center flex-grow z-10 w-full mt-60">
        <motion.div
          initial={{ opacity: 0, y: "-50%" }}
          animate={{ opacity: 1, y: "0" }}
          transition={{ duration: 0.5 }}
          className="text-center w-full flex flex-col items-center justify-center"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-widest">
              Welcome to the Future of Debate
            </span>
          </motion.div>

          <h1 className="text-7xl font-bold mb-1 font-serif text-center">
            <TextAnimation text="Debate AI" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl mb-5 max-w-md mx-auto text-gray-600 dark:text-gray-400 font-light leading-relaxed text-center"
          >
            Challenge your ideas and sharpen your arguments with our AI-powered debate platform
          </motion.p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-1"
        >
          <Button
            size="lg"
            className="text-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all duration-300 relative group overflow-hidden px-8 py-6 rounded-lg font-serif"
            onClick={handleStartDebate}
          >
            <motion.span className="relative z-10">
              Start a Debate
            </motion.span>
            <motion.div
              className="absolute inset-0 bg-gray-800 dark:bg-gray-200 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
            />
          </Button>
        </motion.div>
      </div>

      <div className="relative max-w-[30rem] mx-auto md:max-w-5xl mt-60 z-20">
        <div className="relative z-10 px-0.1 rounded-1xl">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-3">
              <div className="aspect-video bg-red-200 rounded-lg flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 overflow-hidden">
                <img
                  src={heroImage}
                  alt="Hero"
                  className="w-full h-auto rounded-lg object-cover"
                />

                <ScrollParallax isAbsolutelyPositioned strength={0.3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-10 left-10 px-4 py-4 bg-neutral-600/60 dark:bg-neutral-900/60 backdrop-blur-lg rounded-2xl"
                  >
                    <h3 className="text-xl text-white">AI Debates</h3>
                    <p className="text-sm text-white/80">
                      Ready to start your next debate?
                    </p>
                  </motion.div>
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned strength={0.2}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute top-10 left-1/3 px-6 py-3 bg-neutral-900/50 dark:bg-neutral-700/50 backdrop-blur-lg rounded-2xl"
                  >
                    <h3 className="text-xl text-white">Engage with AI</h3>
                    <p className="text-sm text-white/70">
                      Engage with our AI and enhance your debating skills.
                    </p>
                  </motion.div>
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned strength={0.4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="absolute bottom-10 right-10 px-4 py-4 bg-neutral-600/60 dark:bg-neutral-400/60 backdrop-blur-lg rounded-2xl"
                  >
                    <h3 className="text-xl text-white">Debate Now</h3>
                    <p className="text-sm text-white/80">
                      It's time to put your thoughts to the test.
                    </p>
                  </motion.div>
                </ScrollParallax>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      

  
      
    </div>
  )
}

export default Home;
