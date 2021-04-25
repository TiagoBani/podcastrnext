export type ITunesFeedPodcast = {
	artistName: string
	id: number
	name: string
	artistId: number
	artistUrl: string
	artworkUrl100: string
	url: string
}
export type ITunesFeed = {
	feed: {
		results: ITunesFeedPodcast[]
	}
}

export type ITunesPodcast = {
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
export type ITunesResult = {
	resultCount: number
	results: ITunesPodcast[]
}

export type Episode = {
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

export type PodcastEpisode = {
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
export type PodcastChannel = {
	author: string
	description: string
	image: {
		url: string
	}
	'itunes:image': string
	item: PodcastEpisode[]
}
export type PodcastFeed = {
	rss: {
		channel: PodcastChannel
	}
}
