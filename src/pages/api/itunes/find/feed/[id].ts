import { NextApiRequest, NextApiResponse } from 'next'

import { toJson } from 'xml2json'
import { api } from '../../../../../services/api'
import { build } from '../../../views/_itunesEpisode'

type Episode = {
	id: string
	title: string
	members: string
	published_at: string
	thumbnail: string
	description: string
	file: {
		url: string
		type: string
		duration: number
	}
}

type PodcastEpisode = {
	description: string
	'itunes:summary': string
	'itunes:duration': string
	'itunes:episode': string
	'itunes:season': string
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
async function getPodcastById(id: number): Promise<ITunesResult> {
	const { data } = await api.get<ITunesResult>(`lookup`, {
		baseURL: 'https://itunes.apple.com',
		params: { id },
	})
	return data
}
async function getEpisodes(url: string): Promise<string> {
	const { data } = await api.get(url)
	return data
}

function formatJson(xml: string): PodcastFeed {
	const stringJson = toJson(xml)
	const objJson: PodcastFeed = JSON.parse(stringJson)
	return objJson
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Episode[] | { error: string }>
) {
	try {
		const { id } = req.query
		const podcast = await getPodcastById(Number(id))
		if (podcast?.results.length <= 0)
			return res.status(204).json({ error: 'Not found' })

		const xml = await getEpisodes(podcast?.results[0]?.feedUrl)
		if (!xml) return res.status(204).json({ error: 'Not found' })

		const episodes = formatJson(xml)

		res.status(200).json(episodes.rss.channel.item?.map(build))
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: e.message })
	}
}
