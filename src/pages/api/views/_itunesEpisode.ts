import { format } from 'date-fns'
import { slugify } from '../utils/slugify'

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
export function build(episode: PodcastEpisode): Episode {
	return {
		id: slugify(episode.title),
		title: episode.title,
		members: null,
		published_at: format(new Date(episode.pubDate), 'yyyy-MM-dd hh:mm:ss'),
		thumbnail: episode['itunes:image']?.href,
		description: episode.description,
		file: {
			url: episode.enclosure?.url,
			type: episode.enclosure?.type,
			duration: Number(episode['itunes:duration']),
		},
	}
}
