import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { usePlayer } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {
	const audioRef = useRef<HTMLAudioElement>(null)
	const [progress, setProgress] = useState(0)

	const {
		episodeList,
		currentEpisodeIndex,
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
		playNext,
		playPrevious,
	} = usePlayer()

	useEffect(() => {
		if (!audioRef.current) return
		if (isPlaying) {
			audioRef.current.play()
		} else {
			audioRef.current.pause()
		}
	}, [isPlaying])

	function setupProgressListener() {
		audioRef.current.currentTime = 0

		audioRef.current.addEventListener('timeupdate', () => {
			setProgress(Math.floor(audioRef.current.currentTime))
		})
	}

	function handleSeek(amount: number) {
		audioRef.current.currentTime = amount
		setProgress(amount)
	}

	function handleEpisodeEnded() {
		if (hasNext) playNext()
		else clearPlayState()
	}

	function convertProgress() {
		return (episode?.duration ?? 0) - progress
	}

	function handleMaxProgress() {
		return convertProgress() > 0 ? convertProgress() : 0
	}

	function handleProgress() {
		return handleMaxProgress() > 0 ? progress : 0
	}

	const episode = episodeList[currentEpisodeIndex]

	return (
		<div className={styles.playerContainer}>
			<header>
				<img src='/playing.svg' alt='Tocando agora' />
				<strong>Tocando agora {episode?.podcast?.name}</strong>
			</header>

			{episode ? (
				<div className={styles.currentEpisode}>
					<Image
						width={592}
						height={592}
						src={episode.thumbnail}
						objectFit='cover'
					/>
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			)}

			<footer className={!episode ? styles.empty : ''}>
				<div className={styles.progress}>
					<span>{convertDurationToTimeString(handleProgress())}</span>
					<div className={styles.slider}>
						{episode ? (
							<Slider
								trackStyle={{ backgroundColor: '#04d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
								max={episode?.duration ?? 0}
								value={progress}
								onChange={handleSeek}
							/>
						) : (
							<div className={styles.emptySlider} />
						)}
					</div>
					<span>{convertDurationToTimeString(handleMaxProgress())}</span>
				</div>

				{episode && (
					<audio
						src={episode.url}
						ref={audioRef}
						loop={isLooping}
						autoPlay
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
						onEnded={handleEpisodeEnded}
						onLoadedMetadata={setupProgressListener}
					/>
				)}

				<div className={styles.buttons}>
					<button
						type='button'
						className={isShuffling ? styles.isActive : ''}
						onClick={toggleShuffle}
						disabled={!episode || !hasShuffle}>
						<img src='/shuffle.svg' alt='Embaralhar' />
					</button>

					<button
						type='button'
						disabled={!episode || !hasPrevious}
						onClick={playPrevious}>
						<img src='/play-previous.svg' alt='Tocar anterior' />
					</button>

					<button
						type='button'
						className={styles.playButton}
						disabled={!episode}
						onClick={() => (episode ? togglePlay() : '')}>
						{isPlaying ? (
							<img src='/pause.svg' alt='Pausar' />
						) : (
							<img src='/play.svg' alt='Tocar' />
						)}
					</button>

					<button
						type='button'
						disabled={!episode || !hasNext}
						onClick={playNext}>
						<img src='/play-next.svg' alt='Tocar próxima' />
					</button>

					<button
						type='button'
						className={isLooping ? styles.isActive : ''}
						onClick={toggleLoop}
						disabled={!episode || !hasLoop}>
						<img src='/repeat.svg' alt='Repetir' />
					</button>
				</div>
			</footer>
		</div>
	)
}
