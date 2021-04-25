import { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../../../../../services/api'

type ITunesPodcast = {
	artistName: string
	id: number
	name: string
	artistId: number
	artistUrl: string
	artworkUrl100: string
	url: string
}
type ITunesFeed = {
	feed: {
		results: ITunesPodcast[]
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { top } = req.query
	const { data } = await api.get<ITunesFeed>(
		`api/v1/br/podcasts/top-podcasts/all/${top}/explicit.json`,
		{
			baseURL: 'https://rss.itunes.apple.com',
		}
	)

	if (data?.feed?.results?.length > 0) res.status(200).json(data?.feed?.results)
	else res.status(204).send('')
}
