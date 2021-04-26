import { format } from 'date-fns'
import { convertDurationToTimeNumber } from '../../utils/convertDurationToTimeNumber'
import { slugify } from '../../utils/slugify'

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
	podcast: {
		id: string
		name: string
	}
}

type PodcastEpisode = {
	description: string
	'googleplay:description': string
	'itunes:summary': string
	'itunes:duration': string
	'itunes:episode': string
	'itunes:season': string
	'itunes:image':
		| {
				href: string
		  }
		| string
	'googleplay:image':
		| {
				href: string
		  }
		| string
	'dc:creator': string
	'itunes:author': string
	'googleplay:author': string
	title: string
	pubDate: string
	enclosure: {
		length: string
		type: string
		url: string
	}
}

function thumbnailImage(
	image:
		| string
		| {
				href: string
		  }
): string {
	return typeof image === 'string' ? image : image?.href
}

export function build(episode: PodcastEpisode): Episode {
	const durationFormat = String(episode['itunes:duration']).match(':')
	const duration = durationFormat
		? convertDurationToTimeNumber(String(episode['itunes:duration']))
		: Number(episode['itunes:duration'])

	const thumbnail =
		thumbnailImage(episode['itunes:image']) ??
		thumbnailImage(episode['googleplay:image']) ??
		null

	return {
		id: slugify(episode.title),
		title: episode.title,
		members: null,
		published_at: format(new Date(episode.pubDate), 'yyyy-MM-dd hh:mm:ss'),
		thumbnail,
		description:
			episode?.description ?? episode['googleplay:description'] ?? null,
		file: {
			url: episode.enclosure?.url ?? null,
			type: episode.enclosure?.type ?? null,
			duration: duration || 0,
		},
		podcast: {
			id: null,
			name:
				episode['dc:creator'] ??
				episode['itunes:author'] ??
				episode['googleplay:author'] ??
				null,
		},
	}
}
