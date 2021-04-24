import { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../../../services/api'

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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { name: term } = req.query
	const { data } = await api.get<ITunesResult>(`search`, {
		baseURL: 'https://itunes.apple.com',
		params: { term, entity: 'podcast' },
	})
	if (data?.results) res.status(200).json({ ...data?.results })
	else res.status(204).send('')
}
