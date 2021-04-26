import { GetStaticPaths, GetStaticProps } from 'next'
// import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import DefaultErrorPage from 'next/error'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { usePlayer } from '../../contexts/PlayerContext'
import { Image } from '../../components/Image'
import {
	iTunesFindAll,
	iTunesFindByName,
	iTunesFindFeedByUrl,
} from '../../services/itunes/find'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import { slugify } from '../../utils/slugify'

import styles from './podcast.module.scss'

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

type HomeProps = {
	allEpisodes: Episode[]
	latestEpisodes: Episode[]
}

export default function Podcast({ allEpisodes, latestEpisodes }: HomeProps) {
	const { playList } = usePlayer()

	const episodeList = [...latestEpisodes, ...allEpisodes]

	// This includes setting the noindex header because static files always
	// return a status 200 but the rendered not found page page should obviously not be indexed
	if (episodeList?.length <= 0)
		return (
			<>
				<Head>
					<meta name='robots' content='noindex' />
				</Head>
				<DefaultErrorPage statusCode={404} />
			</>
		)

	return (
		<div className={styles.homepage}>
			<Head>
				<title>Home | Podcastr</title>
			</Head>

			<section className={styles.latestEpisodes}>
				<h2>Últimos lançamentos</h2>

				<ul>
					{latestEpisodes &&
						latestEpisodes.map((episode, index) => {
							return (
								<li key={episode.id}>
									{episode.thumbnail && (
										<Image
											width={192}
											height={192}
											url={episode.thumbnail}
											alt={episode.title}
											objectFit='cover'
										/>
									)}

									<div className={styles.episodesDetails}>
										<Link
											href={`/episodes/${episode.podcast.id}/${episode.id}`}>
											<a>{episode.title}</a>
										</Link>
										{/* <p>{episode.members}</p> */}
										<span>{episode.publishedAt}</span>
										<span>{episode.durationAsString}</span>
									</div>

									<button
										type='button'
										onClick={() => playList(episodeList, index)}>
										<img src='/play-green.svg' alt='Tocar episódio' />
									</button>
								</li>
							)
						})}
				</ul>
			</section>
			<section className={styles.allEpisodes}>
				<h2>Todos os episódios</h2>

				<table cellSpacing={0}>
					<thead>
						<tr>
							<th></th>
							<th>Podcast</th>
							{/* <th>Integrantes</th> */}
							<th>Data</th>
							<th>Duração</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{allEpisodes &&
							allEpisodes.map((episode, index) => {
								return (
									<tr key={episode.id}>
										<td style={{ width: 72 }}>
											{episode.thumbnail && (
												<Image
													width={120}
													height={120}
													url={episode.thumbnail}
													alt={episode.title}
													objectFit='cover'
												/>
											)}
										</td>
										<td>
											<Link
												href={`/episodes/${episode.podcast.id}/${episode.id}`}>
												<a>{episode.title}</a>
											</Link>
										</td>
										{/* <td>{episode.members}</td> */}
										<td style={{ width: 100 }}>{episode.publishedAt}</td>
										<td>{episode.durationAsString}</td>
										<td>
											<button
												type='button'
												onClick={() =>
													playList(episodeList, index + latestEpisodes.length)
												}>
												<img src='/play-green.svg' alt='Tocar episódio' />
											</button>
										</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			</section>
		</div>
	)
}
export const getStaticPaths: GetStaticPaths = async () => {
	// const podcasts = await iTunesFindAll(10)
	// const paths = podcasts.map((podcast) => ({
	// 	params: {
	// 		name: slugify(podcast.artistName),
	// 	},
	// }))

	return {
		paths: [],
		fallback: 'blocking',
	}
}
//SSG
export const getStaticProps: GetStaticProps = async (context) => {
	try {
		const { name } = context.params

		const podcast = await iTunesFindByName(name as string)
		const data = await iTunesFindFeedByUrl(podcast[0].feedUrl)

		const episodes = data.map((episode) => ({
			id: episode.id,
			title: episode.title,
			thumbnail: episode.thumbnail,
			members: episode.members,
			publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
				locale: ptBR,
			}),
			duration: Number(episode.file.duration),
			durationAsString: convertDurationToTimeString(
				Number(episode.file.duration)
			),
			description: episode.description,
			url: episode.file.url,
			podcast: {
				id: podcast[0].trackId,
				name: podcast[0].trackName,
			},
		}))

		const latestEpisodes = episodes.slice(0, 2)
		const allEpisodes = episodes.slice(2, episodes.length)
		return {
			props: {
				latestEpisodes,
				allEpisodes,
			},
			revalidate: 60 * 60 * 8, // 8 hours
		}
	} catch (e) {
		console.error(e.message)
		return {
			props: {
				latestEpisodes: [],
				allEpisodes: [],
			},
			revalidate: 60 * 60 * 8, // 8 hours
		}
	}
}
