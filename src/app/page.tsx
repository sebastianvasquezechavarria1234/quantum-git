'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import Header from '@/components/ui/Header'
import TelemetryPanel from '@/components/ui/TelemetryPanel'
import TimelinePlayer from '@/components/ui/TimelinePlayer'
import GitGalaxyCanvas from '@/components/galaxy/GitGalaxyCanvas'
import HeroOverlay from '@/components/ui/HeroOverlay'
import BranchLegend from '@/components/ui/BranchLegend'
import { GalaxyData, getMockGalaxyData, fetchRepoData } from '@/lib/github'

export default function Home() {
  const [data, setData] = useState<GalaxyData>(() => getMockGalaxyData())
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSha, setSelectedSha] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playProgress, setPlayProgress] = useState(1)
  const [heroDismissed, setHeroDismissed] = useState(false)
  const animFrameRef = useRef<number | null>(null)
  const playStartRef = useRef<number>(0)
  const progressAtStartRef = useRef<number>(0)

  const selectedCommit = useMemo(() => {
    if (!selectedSha) return null
    return data.commits.find(c => c.sha === selectedSha) ?? null
  }, [selectedSha, data])

  const showHero = !selectedSha && !isPlaying && !heroDismissed

  const [searchError, setSearchError] = useState<string | null>(null)

  const handleSearch = useCallback(async (input: string) => {
    setIsLoading(true)
    setSearchError(null)
    setHeroDismissed(false)
    try {
      let owner: string, repo: string
      const urlMatch = input.match(/github\.com\/([^/]+)\/([^/]+?)(?:\/|$)/)
      const shortMatch = input.match(/^([\w.-]+)\/([\w.-]+)$/)
      if (urlMatch) {
        owner = urlMatch[1]
        repo = urlMatch[2]
      } else if (shortMatch) {
        owner = shortMatch[1]
        repo = shortMatch[2]
      } else {
        setData(getMockGalaxyData())
        setIsLoading(false)
        return
      }
      const result = await fetchRepoData(owner, repo)
      setData(result)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed to load repository')
      setData(getMockGalaxyData())
    }
    setIsLoading(false)
  }, [])

  const handleSelectCommit = useCallback((sha: string) => {
    setSelectedSha(prev => prev === sha ? null : sha)
    setHeroDismissed(true)
  }, [])

  const handleCloseTelemetry = useCallback(() => {
    setSelectedSha(null)
  }, [])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    setHeroDismissed(true)
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

    const totalDuration = data.commits.length * 250

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
  }, [isPlaying, data.commits.length])

  const currentTimelineCommit = useMemo(() => {
    const idx = Math.floor(playProgress * data.commits.length)
    return data.commits[Math.min(idx, data.commits.length - 1)] ?? null
  }, [data, playProgress])

  return (
    <>
      <Header onSearch={handleSearch} isLoading={isLoading} error={searchError} />

      <GitGalaxyCanvas
        data={data}
        selectedSha={selectedSha}
        onSelectCommit={handleSelectCommit}
        isPlaying={isPlaying}
      />

      <HeroOverlay
        data={data}
        visible={showHero}
        onExplore={() => setHeroDismissed(true)}
      />

      <BranchLegend
        branches={data.branches}
        visible={!showHero}
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
