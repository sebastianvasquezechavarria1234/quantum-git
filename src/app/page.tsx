'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import Header from '@/components/ui/Header'
import TelemetryPanel from '@/components/ui/TelemetryPanel'
import TimelinePlayer from '@/components/ui/TimelinePlayer'
import GitGalaxyCanvas from '@/components/galaxy/GitGalaxyCanvas'
import { GalaxyData, getMockGalaxyData } from '@/lib/github'

export default function Home() {
  const [data, setData] = useState<GalaxyData>(() => getMockGalaxyData())
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSha, setSelectedSha] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playProgress, setPlayProgress] = useState(1)
  const animFrameRef = useRef<number | null>(null)
  const playStartRef = useRef<number>(0)
  const progressAtStartRef = useRef<number>(0)

  const selectedCommit = useMemo(() => {
    if (!selectedSha || !data) return null
    return data.commits.find(c => c.sha === selectedSha) ?? null
  }, [selectedSha, data])

  const handleSearch = useCallback(async (url: string) => {
    setIsLoading(true)
    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\/|$)/)
      if (match) {
        const owner = match[1]
        const repo = match[2]
        const { fetchRepoData } = await import('@/lib/github')
        const result = await fetchRepoData(owner, repo)
        setData(result)
      } else {
        setData(getMockGalaxyData())
      }
    } catch {
      setData(getMockGalaxyData())
    }
    setIsLoading(false)
  }, [])

  const handleSelectCommit = useCallback((sha: string) => {
    setSelectedSha(prev => prev === sha ? null : sha)
  }, [])

  const handleCloseTelemetry = useCallback(() => {
    setSelectedSha(null)
  }, [])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    playStartRef.current = Date.now()
    progressAtStartRef.current = playProgress
  }, [playProgress])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handleSeek = useCallback((progress: number) => {
    setPlayProgress(progress)
    if (isPlaying) {
      playStartRef.current = Date.now()
      progressAtStartRef.current = progress
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      return
    }

    const totalDuration = (data?.commits.length ?? 1) * 250

    const animate = () => {
      const elapsed = Date.now() - playStartRef.current
      const progress = progressAtStartRef.current + elapsed / totalDuration
      if (progress >= 1) {
        setPlayProgress(1)
        setIsPlaying(false)
        return
      }
      setPlayProgress(progress)
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying, data?.commits.length])

  const currentTimelineCommit = useMemo(() => {
    const idx = Math.floor(playProgress * data.commits.length)
    return data.commits[Math.min(idx, data.commits.length - 1)] ?? null
  }, [data, playProgress])

  return (
    <>
      <Header onSearch={handleSearch} isLoading={isLoading} />

      <GitGalaxyCanvas
        data={data}
        selectedSha={selectedSha}
        onSelectCommit={handleSelectCommit}
        isPlaying={isPlaying}
      />

      <TelemetryPanel
        commit={selectedCommit}
        onClose={handleCloseTelemetry}
      />

      <TimelinePlayer
        commits={data.commits}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        isPlaying={isPlaying}
        currentProgress={playProgress}
        currentCommit={currentTimelineCommit}
      />
    </>
  )
}
