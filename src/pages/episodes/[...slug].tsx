import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
// import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import DefaultErrorPage from 'next/error'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { usePlayer } from '../../contexts/PlayerContext'
import { Image } from '../../components/Image'
import { iTunesFindById, iTunesFindFeedByUrl } from '../../services/itunes/find'

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import { slugify } from '../../utils/slugify'

import styles from './episode.module.scss'

type Episode = {
	id: string
	title: string
	thumbnail: string
	members: string
	publishedAt: string
	duration: number
	durationAsString: string
	description: string
	url: string
	podcast: {
		id: string
		name: string
	}
}

type EpisodeProps = {
	episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
	const { play } = usePlayer()

	// This includes setting the noindex header because static files always
	// return a status 200 but the rendered not found page page should obviously not be indexed
	if (!episode) {
		return (
			<>
				<Head>
					<meta name='robots' content='noindex' />
				</Head>
				<DefaultErrorPage statusCode={404} />
			</>
		)
	}

	return (
		<div className={styles.episode}>
			<Head>
				<title>{episode.title} | Podcastr</title>
			</Head>

			<div className={styles.thumbnailContainer}>
				<Link href={`/podcasts/${episode.podcast.id}`}>
					<button>
						<img src='/arrow-left.svg' alt='Voltar' />
					</button>
				</Link>

				{episode.thumbnail && (
					<Image
						width={700}
						height={160}
						url={episode.thumbnail}
						objectFit='cover'
					/>
				)}

				<button type='button' onClick={() => play(episode)}>
					<img src='/play.svg' alt='Tocar episódio' />
				</button>
			</div>

			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationAsString}</span>
			</header>

			<div
				className={styles.description}
				dangerouslySetInnerHTML={{
					__html: episode.description || 'Sem descrição',
				}}
			/>
		</div>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	// const podcasts = await iTunesFindAll(10)
	// const promises = []
	// podcasts.map((podcast) => {
	// 	promises.push(iTunesFindFeedByPodcastId(String(podcast?.id)))
	// })

	// const results = await Promise.all(promises)
	// const paths = []

	// podcasts.map((podcast, podcastIndex) => {
	// 	for (const episodeIndex in results) {
	// 		if (Number(episodeIndex) >= 2) break

	// 		const episode = results[Number(podcastIndex)][Number(episodeIndex)]

	// 		paths.push({
	// 			params: {
	// 				slug: [podcast.id, episode.id],
	// 			},
	// 		})
	// 	}
	// })

	return {
		paths: [],
		fallback: 'blocking',
	}
}

export const getStaticProps: GetStaticProps = async (context) => {
	try {
		const { slug } = context.params
		const [podcastId, episodeId] = slug as string[]

		const podcast = await iTunesFindById(podcastId)
		const feed = await iTunesFindFeedByUrl(podcast[0]?.feedUrl)

		const [data] = feed.filter((item) => item.id === episodeId)

		const episode = {
			id: data.id,
			title: data.title,
			thumbnail: data.thumbnail,
			members: data.members,
			publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
				locale: ptBR,
			}),
			duration: Number(data.file.duration),
			durationAsString: convertDurationToTimeString(Number(data.file.duration)),
			description: data.description,
			url: data.file.url,
			podcast: {
				id: slugify(podcast[0].artistName),
				name: data.podcast.name,
			},
		}
		return {
			props: {
				episode,
			},
			revalidate: 60 * 60 * 24, // 24 hours
		}
	} catch (e) {
		console.error(e.message)
		return {
			props: {
				latestEpisodes: [],
				allEpisodes: [],
			},
			revalidate: 60 * 60 * 24, // 24 hours
		}
	}
}
