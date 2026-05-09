"use client"

import { useState, useEffect } from "react"
import { Instagram, Twitter } from "lucide-react"

interface ProfileCardProps {
  name?: string
  title?: string
  avatarUrl?: string
  backgroundUrl?: string
  likes?: number
  posts?: number
  views?: number
  instagramUrl?: string
  twitterUrl?: string
  threadsUrl?: string
}

export function ProfileCard({
  name = "John Doe",
  title = "Creative & Client",
  avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80",
  backgroundUrl = "https://images.unsplash.com/photo-1508138221679-760a23a2285b?w=1600&q=80",
  likes = 0,
  posts = 0,
  views = 0,
  instagramUrl = "https://instagram.com",
  twitterUrl = "https://twitter.com",
  threadsUrl = "https://threads.net",
}: ProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [expProgress, setExpProgress] = useState(0)
  const [animatedLikes, setAnimatedLikes] = useState(0)
  const [animatedPosts, setAnimatedPosts] = useState(0)
  const [animatedViews, setAnimatedViews] = useState(0)

  // Animate experience bar based on posts (mock logic)
  useEffect(() => {
    const targetProgress = Math.min(100, posts * 10 + 10);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setExpProgress((prev) => {
          if (prev >= targetProgress) {
            clearInterval(interval)
            return targetProgress
          }
          return prev + 1
        })
      }, 10)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(timer)
  }, [posts])

  // Animate counters
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps

    const likesIncrement = likes / steps
    const postsIncrement = posts / steps
    const viewsIncrement = views / steps

    let currentStep = 0

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        currentStep++
        setAnimatedLikes(Math.min(Math.floor(likesIncrement * currentStep), likes))
        setAnimatedPosts(Math.min(Math.floor(postsIncrement * currentStep), posts))
        setAnimatedViews(Math.min(Math.floor(viewsIncrement * currentStep), views))

        if (currentStep >= steps) {
          setAnimatedLikes(likes);
          setAnimatedPosts(posts);
          setAnimatedViews(views);
          clearInterval(interval)
        }
      }, stepDuration)
      return () => clearInterval(interval)
    }, 100)

    return () => clearTimeout(timer)
  }, [likes, posts, views])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Side: Avatar & Basic Info */}
        <div className="md:w-1/3 flex flex-col items-center text-center p-5 sm:p-8 border-b md:border-b-0 md:border-r border-slate-100 relative z-10 bg-white/95 backdrop-blur-md">
          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-5 sm:mb-6">
            <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-xl">
              <img src={avatarUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight break-words">{name}</h2>
          <p className="text-slate-500 font-medium tracking-wide text-sm uppercase mb-6">{title}</p>
          
          {/* Social icons */}
          <div className="flex justify-center gap-6 mb-6 sm:mb-8">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`w-full rounded-full py-3 text-sm font-bold transition-all duration-300 ${
              isFollowing
                ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-xl"
            }`}
          >
            {isFollowing ? "Following" : "Follow Profile"}
          </button>
        </div>

        {/* Right Side: Cover Photo & Stats */}
        <div className="md:w-2/3 flex flex-col relative">
          {/* Background Cover */}
          <div className="absolute inset-0 bg-slate-900 z-0">
            <img
              src={backgroundUrl || "/placeholder.svg"}
              alt="Background"
              className="w-full h-full object-cover opacity-50 mix-blend-overlay"
            />
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col justify-end p-5 sm:p-8 mt-36 sm:mt-48 md:mt-0 bg-gradient-to-t from-slate-900/90 to-transparent">
            {/* Experience bar */}
            <div className="mb-6 sm:mb-8 max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">Level {Math.floor(posts / 5) + 1}</span>
                <span className="text-xs text-slate-400">{expProgress}% to next</span>
              </div>
              <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white transition-all duration-1000 ease-out"
                  style={{ width: `${expProgress}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 border border-white/20">
              <div className="text-left">
                <div className="text-xl sm:text-3xl font-black text-white mb-1">{formatNumber(animatedLikes)}</div>
                <div className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wide sm:tracking-widest font-semibold">Total Likes</div>
              </div>
              <div className="text-left border-l border-white/20 pl-2 sm:pl-4 md:pl-8">
                <div className="text-xl sm:text-3xl font-black text-white mb-1">{animatedPosts}</div>
                <div className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wide sm:tracking-widest font-semibold">Published</div>
              </div>
              <div className="text-left border-l border-white/20 pl-2 sm:pl-4 md:pl-8">
                <div className="text-xl sm:text-3xl font-black text-white mb-1">{formatNumber(animatedViews)}</div>
                <div className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wide sm:tracking-widest font-semibold">Profile Views</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
