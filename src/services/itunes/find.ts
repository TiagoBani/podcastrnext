import { toJson } from 'xml2json'
// import { xmlToJson } from '../../utils/xmlToJson'
import { api } from '../api'
import {
	ITunesFeedPodcast,
	Episode,
	ITunesFeed,
	ITunesPodcast,
	ITunesResult,
	PodcastFeed,
} from './find.d'
import { build } from './itunesBuild'

export async function iTunesFindAll(top: number): Promise<ITunesFeedPodcast[]> {
	const { data } = await api.get<ITunesFeed>(
		`api/v1/br/podcasts/top-podcasts/all/${top}/explicit.json`,
		{
			baseURL: 'https://rss.itunes.apple.com',
		}
	)

	return data?.feed?.results
}

export async function iTunesFindById(id: string): Promise<ITunesPodcast[]> {
	const { data } = await api.get<ITunesResult>(`lookup`, {
		params: { id },
	})
	return { ...data?.results }
}

export async function iTunesFindByName(term: string): Promise<ITunesPodcast[]> {
	const { data } = await api.get<ITunesResult>(`search`, {
		params: { term, entity: 'podcast' },
	})
	return data?.results
}

export async function iTunesFindFeedByPodcastId(
	id: string
): Promise<Episode[] | null> {
	try {
		const podcast = await getPodcastById(Number(id))
		if (podcast?.results.length <= 0) return

		const xml = await getEpisodes(podcast?.results[0]?.feedUrl)
		if (!xml) return

		const episodes = formatJson(xml)

		return episodes?.rss?.channel?.item?.map(build)
	} catch (e) {
		console.error(e)
		return
	}
}

export async function iTunesFindFeedByUrl(
	feedUrl: string
): Promise<Episode[] | null> {
	try {
		const xml = await getEpisodes(feedUrl)
		if (!xml) return

		const episodes = formatJson(xml)
		return episodes?.rss?.channel?.item?.map(build)
	} catch (e) {
		console.error(e)
		return
	}
}

async function getPodcastById(id: number): Promise<ITunesResult> {
	const { data } = await api.get<ITunesResult>(`lookup`, {
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
