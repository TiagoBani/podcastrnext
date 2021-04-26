export interface ITunesFeedPodcast {
	artistName: string
	id: number
	name: string
	artistId: number
	artistUrl: string
	artworkUrl100: string
	url: string
}
export interface ITunesFeed {
	feed: {
		results: ITunesFeedPodcast[]
	}
}

export interface ITunesPodcast {
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
export interface ITunesResult {
	resultCount: number
	results: ITunesPodcast[]
}

export interface Episode {
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

export interface PodcastEpisode {
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
export interface PodcastChannel {
	author: string
	description: string
	image: {
		url: string
	}
	'itunes:image': string
	item: PodcastEpisode[]
}
export interface PodcastFeed {
	rss: {
		channel: PodcastChannel
	}
}
