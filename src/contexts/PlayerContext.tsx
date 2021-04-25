import { createContext, ReactNode, useContext, useState } from 'react'

type Episode = {
	title: string
	thumbnail: string
	members: string
	duration: number
	url: string
	podcast: {
		id: string
		name: string
	}
}

type PlayerContextData = {
	episodeList: Episode[]
	currentEpisodeIndex: number
	isPlaying: boolean
	isLooping: boolean
	isShuffling: boolean
	hasPrevious: boolean
	hasNext: boolean
	hasLoop: boolean
	hasShuffle: boolean
	togglePlay: () => void
	toggleLoop: () => void
	toggleShuffle: () => void
	setPlayingState: (state: boolean) => void
	play: (episode: Episode) => void
	playList: (episodes: Episode[], index: number) => void
	playNext: () => void
	playPrevious: () => void
	clearPlayState: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
	children: ReactNode
}

export function PlayerContextProvider({
	children,
}: PlayerContextProviderProps) {
	const [episodeList, setEpisodeList] = useState([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isLooping, setIsLooping] = useState(false)
	const [isShuffling, setIsShuffling] = useState(false)

	function play(episode: Episode) {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

	function playList(episodes: Episode[], index: number) {
		setEpisodeList(episodes)
		setCurrentEpisodeIndex(index)
		setIsPlaying(true)
	}

	function togglePlay() {
		setIsPlaying(!isPlaying)
	}

	const hasLoop = episodeList.length >= 0

	function toggleLoop() {
		setIsLooping(!isLooping)
	}

	const hasShuffle = episodeList.length >= 1

	function toggleShuffle() {
		setIsShuffling(!isShuffling)
	}

	function clearPlayState() {
		setEpisodeList([])
		setCurrentEpisodeIndex(0)
		setIsPlaying(false)
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state)
	}

	const hasPrevious = currentEpisodeIndex > 0
	const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

	function randomNumberIndex() {
		return Math.floor(Math.random() * episodeList.length)
	}

	function playNext() {
		if (isShuffling) {
			let nextRandomEpisodeIndex = randomNumberIndex()
			while (nextRandomEpisodeIndex === currentEpisodeIndex) {
				nextRandomEpisodeIndex = randomNumberIndex()
			}
			setCurrentEpisodeIndex(nextRandomEpisodeIndex)
		} else if (hasNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1)
	}

	function playPrevious() {
		if (hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1)
	}

	return (
		<PlayerContext.Provider
			value={{
				currentEpisodeIndex,
				episodeList,
				play,
				playList,
				playNext,
				playPrevious,
				clearPlayState,
				isPlaying,
				isLooping,
				isShuffling,
				hasPrevious,
				hasNext,
				hasLoop,
				hasShuffle,
				togglePlay,
				toggleLoop,
				toggleShuffle,
				setPlayingState,
			}}>
			{children}
		</PlayerContext.Provider>
	)
}

export const usePlayer = () => {
	return useContext(PlayerContext)
}
