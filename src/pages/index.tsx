import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { usePlayer } from '../contexts/PlayerContext'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

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
}

type HomeProps = {
	allEpisodes: Episode[]
	latestEpisodes: Episode[]
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
	const { playList } = usePlayer()

	async function teste() {
		const res = await fetch(`/api/findByName/faladev`)
		const podcast = await res.json()

		console.log(podcast[0].feedUrl)

		const result = await fetch(`/api/findFeed/`, {
			method: 'POST',
			body: JSON.stringify({ feedUrl: podcast[0].feedUrl }),
		})
		const episodes = await result.json()
		console.log({ ...episodes })

		// fetch(`/api/findFeedById/${podcast}`)
		// 	.then((res) => res.json())
		// 	.then((res) => console.log(res))
		// 	.catch((e) => console.log(e))
	}
	teste()

	const episodeList = [...latestEpisodes, ...allEpisodes]

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
									<Image
										width={192}
										height={192}
										src={episode.thumbnail}
										alt={episode.title}
										objectFit='cover'
									/>

									<div className={styles.episodesDetails}>
										<Link href={`/episodes/${episode.id}`}>
											<a>{episode.title}</a>
										</Link>
										<p>{episode.members}</p>
										<span>{episode.publishedAt}</span>
										<span>{episode.durationAsString}</span>
									</div>

									<button
										type='button'
										onClick={() => playList(episodeList, index)}
									>
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
							<th>Integrantes</th>
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
											<Image
												width={120}
												height={120}
												src={episode.thumbnail}
												alt={episode.title}
												objectFit='cover'
											/>
										</td>
										<td>
											<Link href={`/episodes/${episode.id}`}>
												<a>{episode.title}</a>
											</Link>
										</td>
										<td>{episode.members}</td>
										<td style={{ width: 100 }}>{episode.publishedAt}</td>
										<td>{episode.durationAsString}</td>
										<td>
											<button
												type='button'
												onClick={() =>
													playList(episodeList, index + latestEpisodes.length)
												}
											>
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
//SSG
export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes', {
		params: {
			_limit: 12,
			_sort: 'published_at',
			_order: 'desc',
		},
	})

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
}
