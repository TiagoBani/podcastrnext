import { NextApiRequest, NextApiResponse } from 'next'

import { toJson } from 'xml2json'

import { api } from '../../../services/api'

type PodcastEpisode = {
	description: string
	'itunes:summary': string
	'itunes:duration': string
	'itunes:episode': string
	'itunes:image': {
		href: string
	}
	title: string
	pubDate: string
	enclosure: {
		length: string
		type: string
		url: string
	}
}
type PodcastChannel = {
	author: string
	description: string
	image: {
		url: string
	}
	'itunes:image': string
	item: PodcastEpisode[]
}
type PodcastFeed = {
	rss: {
		channel: PodcastChannel
	}
}
type ITunesPodcast = {
	trackId: number
	trackName: string
	artistName: string
	collectionId: number
	collectionName: string
	feedUrl: string
	trackViewUrl: string
	artworkUrl600: string
	primaryGenreName: string
}
type ITunesResult = {
	resultCount: number
	results: ITunesPodcast[]
}

async function getFeedUrl(id: number): Promise<ITunesResult> {
	const result = await fetch(`https://itunes.apple.com/lookup?id=${id}`)
	const data = await result.json()

	// const { data } = await api.get<ITunesResult>(
	// 	`https://itunes.apple.com/lookup`,
	// 	{
	// 		params: { id },
	// 	}
	// )
	return data
}

async function getEpisodes(url: string): Promise<string> {
	const result = await fetch(url)
	const data = await result.text()

	// const { data } = await api.get(url)
	return data
}

function formatJson(xml: string): PodcastFeed {
	const stringJson = toJson(xml)
	const objJson: PodcastFeed = JSON.parse(stringJson)
	return objJson
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query

	const data = await getFeedUrl(Number(id))
	const xml = await getEpisodes(data.results[0].feedUrl)
	const episodes = formatJson(xml)

	res.status(200).json({ ...episodes.rss.channel })

	// getFeedUrl(Number(id))
	// 	.then((data) => getEpisodes(data.results[0].feedUrl))
	// 	.then(formatJson)
	// 	.then((obj) => res.status(200).json({ ...obj.rss.channel }))
	// 	.catch((e) => res.status(500).json({ error: e }))

	// const { data } = await api.get<ITunesResult>(`lookup`, {
	// 	baseURL: 'https://itunes.apple.com',
	// 	params: { id },
	// })

	// const { data: xml } = await api.get(data.results[0].feedUrl)
	// const stringJson = toJson(xml)
	// const objJson = JSON.parse(stringJson)

	// res.status(200).json({ ...objJson })
}
